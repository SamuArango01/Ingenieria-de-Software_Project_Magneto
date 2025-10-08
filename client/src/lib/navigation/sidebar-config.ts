

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
  // es un ejemplo la idea es mudar 
  // el sidebar info a un lugar externo al componente
  // {
  //   title: "Dashboard",
  //   href: "/dashboard",
  //   icon: LayoutDashboard,
  // },
  // {
  //   title: "Usuarios",
  //   icon: Users,
  //   children: [
  //     { 
  //       title: "Lista de Usuarios", 
  //       href: "/usuarios",
  //       icon: List
  //     },
  //     { 
  //       title: "Crear Usuario", 
  //       href: "/usuarios/crear",
  //       icon: UserPlus
  //     },
  //     { 
  //       title: "Roles y Permisos", 
  //       href: "/usuarios/roles",
  //       icon: Shield
  //     },
  //   ]
  // },
];