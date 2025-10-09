'use client';

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
    return <p className="text-center text-muted-foreground py-8">No se encontraron tipos de entrevista.</p>;
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
            <TableRow key={type.id}>
              <TableCell className="font-medium">{type.name}</TableCell>
              <TableCell>
                {type.isPublic ? (
                  <Badge variant="secondary">Público</Badge>
                ) : (
                  <Badge variant="outline">Privado</Badge>
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
