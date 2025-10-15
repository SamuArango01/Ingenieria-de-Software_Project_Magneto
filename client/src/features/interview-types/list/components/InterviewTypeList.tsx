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
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700 bg-gray-800 hover:bg-gray-800">
            <TableHead className="text-gray-300 font-semibold">Nombre</TableHead>
            <TableHead className="text-gray-300 font-semibold">Descripción</TableHead>
            <TableHead className="text-gray-300 font-semibold">Tipo</TableHead>
            <TableHead className="text-right text-gray-300 font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviewTypes.map((type) => (
            <TableRow key={type.id} className="border-b border-gray-700/50 bg-gray-900/50 hover:bg-gray-800/80 transition-colors">
              <TableCell className="font-medium py-4 px-4 text-white">{type.name}</TableCell>
              <TableCell className="py-4 px-4 max-w-md text-gray-300">
                <p className="line-clamp-2">{type.description}</p>
              </TableCell>
              <TableCell className="py-4 px-4">
                {type.isPublic ? (
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0">Público</Badge>
                ) : (
                  <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">Privado</Badge>
                )}
              </TableCell>
              <TableCell className="text-right py-4 px-4">
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
