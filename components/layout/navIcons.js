/**
 * Icon registry for navigation + data files.
 *
 * Data stays serialisable by referencing icons by *name*; this map is the only
 * place that touches the icon library, and it only imports what the navs use.
 */

import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Building,
  ClipboardList,
  Compass,
  CreditCard,
  Dumbbell,
  FilePlus,
  GraduationCap,
  History,
  Languages,
  LayoutDashboard,
  Library,
  Medal,
  Presentation,
  Radar,
  Route,
  ScanLine,
  ScrollText,
  Send,
  Settings,
  Sigma,
  TrendingUp,
  User,
  Users,
} from "lucide-react";

export const NAV_ICONS = {
  "layout-dashboard": LayoutDashboard,
  radar: Radar,
  "trending-up": TrendingUp,
  "scan-line": ScanLine,
  sigma: Sigma,
  languages: Languages,
  award: Award,
  route: Route,
  compass: Compass,
  dumbbell: Dumbbell,
  "book-open": BookOpen,
  medal: Medal,
  history: History,
  "scroll-text": ScrollText,
  user: User,
  users: Users,
  "bar-chart-3": BarChart3,
  send: Send,
  "file-plus": FilePlus,
  "clipboard-list": ClipboardList,
  library: Library,
  presentation: Presentation,
  building: Building,
  activity: Activity,
  settings: Settings,
  "credit-card": CreditCard,
  "graduation-cap": GraduationCap,
};

export const navIcon = (name) => NAV_ICONS[name] ?? null;
