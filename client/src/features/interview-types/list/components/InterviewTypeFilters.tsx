'use client';

import { Button } from '@/components/ui/button';
import type { FilterType } from '../../models/interview-type.model';

interface InterviewTypeFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function InterviewTypeFilters({ activeFilter, onFilterChange }: InterviewTypeFiltersProps) {
  return (
    <div className="flex space-x-2">
      <Button 
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterChange('all')}
      >
        Todos
      </Button>
      <Button 
        variant={activeFilter === 'user' ? 'default' : 'outline'}
        onClick={() => onFilterChange('user')}
      >
        Mis Tipos
      </Button>
      <Button 
        variant={activeFilter === 'public' ? 'default' : 'outline'}
        onClick={() => onFilterChange('public')}
      >
        Públicos
      </Button>
    </div>
  );
}
