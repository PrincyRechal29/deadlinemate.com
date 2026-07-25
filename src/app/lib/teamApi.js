// ============================================================================
// Team collaboration data layer — members, real-time chat, and the call
// lifecycle (start / schedule / join / leave / end) over supabase-js +
// TanStack Query. RLS + SECURITY DEFINER RPCs enforce membership server-side.
// Realtime (postgres_changes) streams new messages and call-state changes to
// every member's browser.
// ============================================================================
import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, invokeFunction } from './supabase.js';

/* --------------------------------- members --------------------------------- */

export function useTeamMembers(classId) {
  return useQuery({
    queryKey: ['team-members', classId],
    enabled: !!classId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('dm_team_members', { p_class: classId });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** { byId, list } — resolve a user_id to their name/avatar for chat + calls. */
export function useMemberMap(classId) {
  const { data: list = [] } = useTeamMembers(classId);
  return React.useMemo(() => {
    const byId = {};
    for (const m of list) byId[m.user_id] = m;
    return { byId, list };
  }, [list]);
}

/* ---------------------------------- chat ----------------------------------- */

export function useTeamMessages(classId) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['team-messages', classId],
    enabled: !!classId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_messages')
        .select('id, class_id, user_id, body, created_at')
        .eq('class_id', classId)
        .order('created_at', { ascending: true })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Live: append on every new message in this team.
  React.useEffect(() => {
    if (!classId) return undefined;
    const ch = supabase
      .channel(`team-messages-${classId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'team_messages', filter: `class_id=eq.${classId}` },
        (payload) => {
          qc.setQueryData(['team-messages', classId], (prev = []) =>
            prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new],
          );
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [classId, qc]);

  return query;
}

export function useSendMessage(classId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const text = (body ?? '').trim();
      if (!text) return null;
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('team_messages')
        .insert({ class_id: classId, user_id: user.id, body: text })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    // Optimistic append so the sender sees it instantly (realtime dedupes).
    onSuccess: (msg) => {
      if (!msg) return;
      qc.setQueryData(['team-messages', classId], (prev = []) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
      );
    },
  });
}

/* ---------------------------------- calls ---------------------------------- */

export function useCalls(classId) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['team-calls', classId],
    enabled: !!classId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Live: any call created / started / ended refreshes the list for everyone.
  React.useEffect(() => {
    if (!classId) return undefined;
    const ch = supabase
      .channel(`team-calls-${classId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calls', filter: `class_id=eq.${classId}` },
        () => {
          qc.invalidateQueries({ queryKey: ['team-calls', classId] });
          qc.invalidateQueries({ queryKey: ['call-participants'] });
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'call_participants' },
        () => qc.invalidateQueries({ queryKey: ['call-participants'] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [classId, qc]);

  return query;
}

/** Participants for one call — `joined` (distinct people) + `live` (in now). */
export function useCallParticipants(callId) {
  return useQuery({
    queryKey: ['call-participants', callId],
    enabled: !!callId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('call_participants')
        .select('id, call_id, user_id, joined_at, left_at')
        .eq('call_id', callId)
        .order('joined_at', { ascending: true });
      if (error) throw error;
      const rows = data ?? [];
      const joined = new Set(rows.map((r) => r.user_id));
      const live = new Set(rows.filter((r) => !r.left_at).map((r) => r.user_id));
      return { rows, joinedCount: joined.size, liveCount: live.size, liveUserIds: [...live] };
    },
    refetchInterval: 15000,
  });
}

export function useCallActions(classId) {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: ['team-calls', classId] });

  const startCall = useMutation({
    mutationFn: async ({ kind = 'video', title = null } = {}) => {
      const { data, error } = await supabase.rpc('dm_start_call', {
        p_class: classId, p_kind: kind, p_title: title,
      });
      if (error) throw error;
      return Array.isArray(data) ? data[0] : data;
    },
    onSuccess: refresh,
  });

  const scheduleCall = useMutation({
    mutationFn: async ({ when, kind = 'video', title = null }) => {
      const { data, error } = await supabase.rpc('dm_schedule_call', {
        p_class: classId, p_when: when, p_kind: kind, p_title: title,
      });
      if (error) throw error;
      return Array.isArray(data) ? data[0] : data;
    },
    onSuccess: refresh,
  });

  const cancelCall = useMutation({
    mutationFn: async (callId) => {
      const { error } = await supabase.rpc('dm_end_call', { p_call: callId });
      if (error) throw error;
    },
    onSuccess: refresh,
  });

  return { startCall, scheduleCall, cancelCall };
}

/** Log the join server-side, then fetch Daily room access. */
export async function joinCall(callId) {
  const { error } = await supabase.rpc('dm_join_call', { p_call: callId });
  if (error) throw error;
  return invokeFunction('daily-room', { call_id: callId }); // { url, token, kind }
}

export async function leaveCall(callId) {
  const { error } = await supabase.rpc('dm_leave_call', { p_call: callId });
  if (error) throw error;
}
