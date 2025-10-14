// src/app/(Dashboard)/entrevistador/components/StatusIndicators/StatusIndicators.tsx
interface StatusIndicatorsProps {
  error: string;
  isRecording: boolean;
  isProcessing: boolean;
}

export function StatusIndicators({ error, isRecording, isProcessing }: StatusIndicatorsProps) {
  return (
    <>
      {error && (
        <div className="mt-8 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-300 text-sm">⚠️ {error}</p>
        </div>
      )}

      {isRecording && !error && (
        <div className="mt-8 p-4 bg-red-900/30 border border-red-700 rounded-lg">
          <p className="text-red-300 text-sm">🔴 Entrevista en curso</p>
        </div>
      )}

      
    </>
  );
}