import {
  ClipboardType,
  List,
  PlusSquare,
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  Settings,
  User,
} from 'lucide-react';

export interface SidebarSubItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: SidebarSubItem[];
}

export const sidebarConfig: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Entrevistas",
    href: "/entrevistador/init",
    icon: Users,
  },
  {
    title: "Tipos de Entrevista",
    icon: ClipboardType,
    children: [
      {
        title: "Ver Todos",
        href: "/interview-types/list",
        icon: List,
      },
      {
        title: "Crear Nuevo",
        href: "/interview-types/create",
        icon: PlusSquare,
      },
    ],
  },
  {
    title: "Candidatos",
    icon: Users,
    children: [
      {
        title: "Vista General",
        href: "/rrhh/general",
        icon: List,
      },
      {
        title: "Resumen",
        href: "/rrhh/overview",
        icon: BarChart2,
      },
    ],
  },
  {
    title: "Reportes",
    href: "/entrevistador/reportes",
    icon: FileText,
  },
  {
    title: "Análisis",
    href: "/entrevistador/analisis",
    icon: BarChart2,
  },
  {
    title: "Configuración",
    href: "/entrevistador/configuracion",
    icon: Settings,
  },
];