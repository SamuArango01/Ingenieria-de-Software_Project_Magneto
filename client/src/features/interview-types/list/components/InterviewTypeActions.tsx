'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import type { InterviewType } from '../../models/interview-type.model';

interface InterviewTypeActionsProps {
  interviewType: InterviewType;
  onToggleActive: (id: number) => void;
  isToggleLoading: boolean;
}

export function InterviewTypeActions({ 
  interviewType, 
  onToggleActive, 
  isToggleLoading 
}: InterviewTypeActionsProps) {
  const router = useRouter();

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => router.push(`/dashboard/interview-types/edit/${interviewType.id}`)}
      >
        Editar
      </Button>
      <Switch
        checked={interviewType.isActive}
        onCheckedChange={() => onToggleActive(interviewType.id)}
        disabled={isToggleLoading}
        aria-label="Activar o desactivar"
      />
    </div>
  );
}
