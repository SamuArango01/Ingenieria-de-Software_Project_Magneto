'use client';

import { Button } from '@/components/ui/button';
import { Globe, User, Users } from 'lucide-react'; // Import icons

import type { FilterType } from '../../models/interview-type.model';

interface InterviewTypeFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function InterviewTypeFilters({ activeFilter, onFilterChange }: InterviewTypeFiltersProps) {
  return (
    <div className="flex space-x-2">
      <Button
        className={activeFilter === 'all' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}
        onClick={() => onFilterChange('all')}
      >
        <Globe className="h-4 w-4 mr-2" />
        Todos
      </Button>
      <Button
        className={activeFilter === 'user' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}
        onClick={() => onFilterChange('user')}
      >
        <User className="h-4 w-4 mr-2" />
        Mis Tipos
      </Button>
      <Button
        className={activeFilter === 'public' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}
        onClick={() => onFilterChange('public')}
      >
        <Users className="h-4 w-4 mr-2" />
        Públicos
      </Button>
    </div>
  );
}
