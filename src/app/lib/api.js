// Data-access hooks over supabase-js + TanStack Query. RLS scopes every read
// and write to the signed-in user, so these never filter by user_id manually.
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase.js';

/* ----------------------------------- profile ----------------------------------- */
export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('profiles').update(patch).eq('id', user.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
}

/* ----------------------------------- courses ----------------------------------- */
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useCourseMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['courses'] });
  const create = useMutation({
    mutationFn: async (course) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('courses').insert({ ...course, user_id: user.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await supabase.from('courses').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { invalidate(); qc.invalidateQueries({ queryKey: ['assignments'] }); },
  });
  return { create, update, remove };
}

/* --------------------------------- assignments --------------------------------- */
export function useAssignments(filter = {}) {
  return useQuery({
    queryKey: ['assignments', filter],
    queryFn: async () => {
      let q = supabase
        .from('assignments')
        .select('*, course:courses(id,name,color)')
        .order('due_at', { ascending: true });
      if (filter.status) q = q.eq('status', filter.status);
      if (filter.courseId) q = q.eq('course_id', filter.courseId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}

export function useAssignment(id) {
  return useQuery({
    enabled: !!id,
    queryKey: ['assignment', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*, course:courses(id,name,color), reminders(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useAssignmentMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['assignments'] });
    qc.invalidateQueries({ queryKey: ['assignment'] });
  };
  const create = useMutation({
    mutationFn: async (a) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('assignments').insert({ ...a, user_id: user.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: async ({ id, ...patch }) => {
      const { data, error } = await supabase.from('assignments').update(patch).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: invalidate,
  });
  const toggleDone = useMutation({
    mutationFn: async ({ id, done }) => {
      const { error } = await supabase.from('assignments')
        .update({ status: done ? 'done' : 'todo', completed_at: done ? new Date().toISOString() : null })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('assignments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });
  return { create, update, toggleDone, remove };
}

/* ------------------------------ calendar imports ------------------------------- */
export function useImports() {
  return useQuery({
    queryKey: ['imports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_imports').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDeleteImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('calendar_imports').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['imports'] });
      qc.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

/* -------------------------------- shared classes ------------------------------- */
export function useSharedClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shared_classes').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useClassDeadlines(classId) {
  return useQuery({
    enabled: !!classId,
    queryKey: ['class-deadlines', classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_deadlines').select('*').eq('class_id', classId).order('due_at');
      if (error) throw error;
      return data;
    },
  });
}

export function useClassMutations() {
  const qc = useQueryClient();
  const createClass = useMutation({
    mutationFn: async ({ name, term, color }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('shared_classes').insert({ name, term, color, owner_id: user.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }),
  });
  const joinClass = useMutation({
    mutationFn: async (code) => {
      const { data, error } = await supabase.rpc('dm_join_class', { p_code: code });
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }),
  });
  const addDeadline = useMutation({
    mutationFn: async ({ classId, ...d }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('class_deadlines').insert({ class_id: classId, created_by: user.id, ...d }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['class-deadlines', v.classId] }),
  });
  // Pull a shared deadline into my own list (creates a personal, reminder-tracked copy).
  const importDeadline = useMutation({
    mutationFn: async ({ deadline, classId }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('assignments').insert({
        user_id: user.id,
        title: deadline.title,
        notes: deadline.notes,
        due_at: deadline.due_at,
        type: deadline.type,
        source: 'shared',
        shared_class_id: classId,
        external_uid: `class:${deadline.id}`,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assignments'] }),
  });
  return { createClass, joinClass, addDeadline, importDeadline };
}

/* -------------------------------- notifications -------------------------------- */
export function useNotificationLog() {
  return useQuery({
    queryKey: ['notif-log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_log').select('*').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });
}
