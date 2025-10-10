'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { sidebarConfig, type SidebarItem } from '@/lib/navigation/sidebar-config';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Componente para un solo item del menú (recursivo o simple)
function SidebarMenuItem({ item, isCollapsed }: { item: SidebarItem; isCollapsed: boolean }) {
  const pathname = usePathname();

  const isActive = item.href ? pathname === item.href : false;
  const isChildActive = item.children ? item.children.some(child => child.href === pathname) : false;

  // Si es un item con sub-menú
  if (item.children) {
    return (
      <Collapsible open={isCollapsed ? false : undefined}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger className={cn(
                'flex items-center w-full px-4 py-3 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors',
                isCollapsed ? 'justify-center' : '',
                isChildActive && 'bg-gray-700'
              )}>
                <item.icon className={cn('h-6 w-6', isCollapsed ? 'mr-0' : 'mr-3')} />
                {!isCollapsed && <span className="flex-1 text-left">{item.title}</span>}
              </CollapsibleTrigger>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>

        {!isCollapsed && (
          <CollapsibleContent className="pl-8 space-y-1 py-1">
            {item.children.map(child => {
              const isSubActive = pathname === child.href;
              return (
                <Link
                  key={child.title}
                  href={child.href}
                  className={cn(
                    'flex items-center w-full px-4 py-2 text-sm font-medium rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors',
                    isSubActive && 'text-white bg-gray-600'
                  )}
                >
                  {child.icon && <child.icon className="h-4 w-4 mr-2" />} 
                  {child.title}
                </Link>
              );
            })}
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  }

  // Si es un item simple
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={item.href!}
            className={cn(
              'flex items-center px-4 py-3 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors',
              isCollapsed ? 'justify-center' : '',
              isActive && 'bg-gray-700'
            )}
          >
            <item.icon className={cn('h-6 w-6', isCollapsed ? 'mr-0' : 'mr-3')} />
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}

export default function Sidebar({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <aside
      className={cn(
        'hidden lg:flex lg:flex-col bg-gray-900 text-white border-r border-gray-800 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Sidebar Header */}
      <div
        className={cn(
          'flex items-center h-20 border-b border-gray-800 transition-all duration-300 ease-in-out',
          isCollapsed ? 'justify-center' : 'justify-start px-4'
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="h-10 w-10 bg-emerald-500 rounded-lg mr-3"></div>
            <h1 className="text-xl font-semibold">StarTraining</h1>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {sidebarConfig.map((item) => (
          <SidebarMenuItem key={item.title} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-800 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  'flex items-center px-4 py-3 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors',
                  isCollapsed ? 'justify-center' : ''
                )}
              >
                <LogOut className={cn('h-6 w-6', isCollapsed ? 'mr-0' : 'mr-3')} />
                {!isCollapsed && <span>Salir del Dashboard</span>}
              </Link>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Salir del Dashboard</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
