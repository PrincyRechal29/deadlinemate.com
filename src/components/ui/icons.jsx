import React from 'react';

// Faithful reproductions of the lucide icons used across DeadlineMate, as React
// components, so the site doesn't depend on a CDN package. Stroke 2, round caps.
// Ported from the design-system handoff (ui_kits/website/icons.jsx).
const I = (paths, vb = '0 0 24 24') =>
  function Icon({ size = 20, color = 'currentColor', strokeWidth = 2, style, ...rest }) {
    return React.createElement(
      'svg',
      {
        width: size,
        height: size,
        viewBox: vb,
        fill: 'none',
        stroke: color,
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        style,
        ...rest,
      },
      paths.map((d, i) => {
        if (d.c) {
          const { c, ...attrs } = d;
          return React.createElement('circle', { key: i, ...attrs });
        }
        if (d.r) {
          const { r, ...attrs } = d;
          return React.createElement('rect', { key: i, ...attrs });
        }
        return React.createElement('path', { key: i, d });
      })
    );
  };

export const Icons = {
  ArrowRight: I(['M5 12h14', 'm12 5 7 7-7 7']),
  ArrowUpRight: I(['M7 7h10v10', 'M7 17 17 7']),
  Check: I(['M20 6 9 17l-5-5']),
  CheckCircle: I([{ c: true, cx: 12, cy: 12, r: 10 }, 'm9 12 2 2 4-4']),
  Bell: I([
    'M10.268 21a2 2 0 0 0 3.464 0',
    'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
  ]),
  Calendar: I([{ r: true, width: 18, height: 18, x: 3, y: 4, rx: 2 }, 'M8 2v4', 'M16 2v4', 'M3 10h18']),
  CalendarCheck: I(['M8 2v4', 'M16 2v4', 'M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8', 'M3 10h18', 'm16 20 2 2 4-4']),
  Clock: I([{ c: true, cx: 12, cy: 12, r: 10 }, 'M12 6v6l4 2']),
  Flame: I(['M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z']),
  Sparkles: I([
    'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
    'M20 3v4',
    'M22 5h-4',
    'M4 17v2',
    'M5 18H3',
  ]),
  Brain: I([
    'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z',
    'M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z',
  ]),
  Timer: I(['M10 2h4', 'M12 14v-4', { c: true, cx: 12, cy: 14, r: 8 }]),
  BookOpen: I(['M12 7v14', 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z']),
  BarChart: I(['M3 3v16a2 2 0 0 0 2 2h16', 'M18 17V9', 'M13 17V5', 'M8 17v-3']),
  Layers: I([
    'm12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z',
    'M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12',
    'M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17',
  ]),
  Download: I(['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3']),
  Users: I(['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', { c: true, cx: 9, cy: 7, r: 4 }, 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75']),
  Menu: I(['M4 12h16', 'M4 6h16', 'M4 18h16']),
  X: I(['M18 6 6 18', 'm6 6 12 12']),
  Plus: I(['M5 12h14', 'M12 5v14']),
  Star: I(['M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z']),
  LayoutDashboard: I([
    { r: true, width: 7, height: 9, x: 3, y: 3, rx: 1 },
    { r: true, width: 7, height: 5, x: 14, y: 3, rx: 1 },
    { r: true, width: 7, height: 9, x: 14, y: 12, rx: 1 },
    { r: true, width: 7, height: 5, x: 3, y: 16, rx: 1 },
  ]),
  CalendarClock: I([
    'M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5',
    'M16 2v4',
    'M8 2v4',
    'M3 10h5',
    { c: true, cx: 18, cy: 18, r: 4 },
    'M18 16.5v1.5l.5.5',
  ]),
  Settings: I([
    'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    { c: true, cx: 12, cy: 12, r: 3 },
  ]),
  Mail: I([{ r: true, width: 20, height: 16, x: 2, y: 4, rx: 2 }, 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7']),
  Smartphone: I([{ r: true, width: 14, height: 20, x: 5, y: 2, rx: 2 }, 'M12 18h.01']),
  MessageSquare: I(['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z']),
  Search: I([{ c: true, cx: 11, cy: 11, r: 8 }, 'm21 21-4.3-4.3']),
  Zap: I(['M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z']),
  TrendingUp: I(['M16 7h6v6', 'm22 7-8.5 8.5-5-5L2 17']),
  Filter: I(['M3 6h18', 'M7 12h10', 'M10 18h4']),
  ChevronDown: I(['m6 9 6 6 6-6']),
};

export default Icons;
