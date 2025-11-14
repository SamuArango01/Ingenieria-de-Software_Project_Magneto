interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  average?: number;
  target?: number;
}

export function CustomTooltip({ active, payload, label, average, target = 18 }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const currentValue = payload[0].value;
    const differenceFromTarget = currentValue - target;
    const differenceFromAverage = currentValue - (average || 0);
    
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-4 backdrop-blur-sm">
        <div className="border-b border-gray-600 pb-2 mb-2">
          <p className="text-white font-semibold text-sm">{label}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-300 text-sm">Realizadas:</span>
            <span className="text-blue-400 font-bold text-lg">{currentValue}</span>
          </div>
          
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-300 text-sm">Meta:</span>
            <span className="text-green-400 font-semibold">{target}</span>
          </div>
          
          <div className={`text-xs font-medium p-2 rounded ${
            differenceFromTarget >= 0 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {differenceFromTarget >= 0 ? '✓' : '✗'} 
            {differenceFromTarget >= 0 ? ' Supera la meta por ' : ' Por debajo de la meta en '}
            {Math.abs(differenceFromTarget)} entrevistas
          </div>
          
          {average && (
            <div className="text-xs text-gray-400 border-t border-gray-600 pt-2">
              vs. Promedio: 
              <span className={differenceFromAverage >= 0 ? "text-green-400 ml-1" : "text-red-400 ml-1"}>
                {differenceFromAverage >= 0 ? '+' : ''}{differenceFromAverage.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}