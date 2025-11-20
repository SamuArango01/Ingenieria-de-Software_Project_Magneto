"use client";

export function StreamingIndicator() {
  return (
    <div className="flex items-center space-x-1 mt-1">
      <span className="text-xs text-gray-500">Generando</span>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
