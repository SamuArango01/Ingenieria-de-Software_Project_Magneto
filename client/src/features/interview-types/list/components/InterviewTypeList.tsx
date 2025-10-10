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
}

export function InterviewTypeList({ 
  interviewTypes, 
  onToggleActive, 
  isToggleLoading 
}: InterviewTypeListProps) {
  if (interviewTypes.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12 border rounded-lg">
        <Inbox className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium">No hay tipos de entrevista</h3>
        <p className="mt-1 text-sm">Crea uno nuevo para empezar.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviewTypes.map((type) => (
            <TableRow key={type.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{type.name}</TableCell>
              <TableCell>
                {type.isPublic ? (
                  <Badge variant="secondary">Público</Badge>
                ) : (
                  <Badge variant="success">Privado</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <InterviewTypeActions 
                  interviewType={type} 
                  onToggleActive={onToggleActive}
                  isToggleLoading={isToggleLoading}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
