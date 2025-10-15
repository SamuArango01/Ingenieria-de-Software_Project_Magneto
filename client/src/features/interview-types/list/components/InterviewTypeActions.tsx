'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { Pencil } from 'lucide-react';
import type { InterviewType } from '../../models/interview-type.model';

interface InterviewTypeActionsProps {
  interviewType: InterviewType;
  onToggleActive: (id: number) => void;
  isToggleLoading: boolean;
  currentUserId: string | null | undefined;
}

export function InterviewTypeActions({
  interviewType,
  onToggleActive,
  isToggleLoading,
  currentUserId,
}: InterviewTypeActionsProps) {
  const router = useRouter();

  const canEdit = interviewType.createdBy === currentUserId;

  return (
    <div className="flex items-center justify-end gap-3">
      {canEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/interview-types/edit/${interviewType.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Editar
        </Button>
      )}
      <Switch
        checked={interviewType.isActive}
        onCheckedChange={() => onToggleActive(interviewType.id)}
        disabled={isToggleLoading}
        aria-label="Activar o desactivar"
      />
    </div>
  );
}
