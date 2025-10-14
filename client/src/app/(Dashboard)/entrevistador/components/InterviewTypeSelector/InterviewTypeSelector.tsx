// src/app/(Dashboard)/entrevistador/components/InterviewTypeSelector/InterviewTypeSelector.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { getAvailableInterviewTypes } from '@/features/interview-types/services/interview-type.service';

interface InterviewTypeSelectorProps {
  selectedInterviewTypeId: string | null;
  onInterviewTypeChange: (value: string) => void;
}

export function InterviewTypeSelector({
  selectedInterviewTypeId,
  onInterviewTypeChange
}: InterviewTypeSelectorProps) {
  const { data: interviewTypes, isLoading: isLoadingInterviewTypes } = useQuery({
    queryKey: ['availableInterviewTypes'],
    queryFn: () => getAvailableInterviewTypes(),
  });

  return (
    <div className="w-full max-w-xs">
      <Select onValueChange={onInterviewTypeChange} value={selectedInterviewTypeId || ""}>
        <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
          <SelectValue placeholder="Selecciona un tipo de entrevista" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white border-gray-700">
          {isLoadingInterviewTypes ? (
            <SelectItem value="loading" disabled>Cargando tipos...</SelectItem>
          ) : (
            <>
              <SelectItem value="generic">Sin tipo específico (Genérico)</SelectItem>
              {interviewTypes?.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>{type.name}</SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}