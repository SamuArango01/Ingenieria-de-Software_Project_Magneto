'use client';

import { Inbox } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { InterviewType } from '../../models/interview-type.model';
import { InterviewTypeActions } from './InterviewTypeActions';

interface InterviewTypeListProps {
  interviewTypes: InterviewType[];
  onToggleActive: (id: number) => void;
  isToggleLoading: boolean;
  currentUserId: string | null | undefined;
}

export function InterviewTypeList({
  interviewTypes,
  onToggleActive,
  isToggleLoading,
  currentUserId,
}: InterviewTypeListProps) {  if (interviewTypes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-gray-800">
        <Inbox className="mx-auto h-12 w-12 text-green-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-200">No hay tipos de entrevista</h3>
        <p className="mt-1 text-sm text-gray-400">Crea uno nuevo para empezar.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="text-gray-300">
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Tipo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviewTypes.map((type) => (
            <TableRow key={type.id} className="border-b border-gray-700 bg-gray-900 text-white hover:bg-gray-700">
              <TableCell className="font-medium py-3 px-4 max-w-xs truncate overflow-hidden whitespace-nowrap">{type.name}</TableCell>
              <TableCell className="py-3 px-4 max-w-[150px] truncate overflow-hidden whitespace-nowrap text-gray-300">{type.description}</TableCell>
              <TableCell className="py-3 px-4">
                {type.isPublic ? (
                  <Badge className="bg-blue-500 text-white">Público</Badge>
                ) : (
                  <Badge className="bg-green-500 text-white">Privado</Badge>
                )}
              </TableCell>
              <TableCell className="text-right py-3 px-4">
                <InterviewTypeActions 
                  interviewType={type} 
                  onToggleActive={onToggleActive}
                  isToggleLoading={isToggleLoading}
                  currentUserId={currentUserId}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
