"use client";

import { useEffect, useRef } from "react";
import { useInterviewTTS } from "../../contexts/InterviewTTSContext";
import { StreamingIndicator } from "./StreamingIndicator";

export function ConversationTranscript() {
  const { messages, streamingMessage, isStreamingText } = useInterviewTTS();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  return (
    <div className="w-full max-w-3xl mx-auto h-[400px] overflow-y-auto bg-white rounded-lg shadow-lg p-4 space-y-4">
      {messages.length === 0 && !isStreamingText && (
        <div className="text-center text-gray-400 mt-20">
          <p>La conversación aparecerá aquí...</p>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] rounded-lg px-4 py-2 ${
              message.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-start space-x-2">
              <div className="flex-1">
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Streaming message */}
      {isStreamingText && streamingMessage && (
        <div className="flex justify-start">
          <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-100 text-gray-900 border-2 border-blue-300">
            <div className="flex items-start space-x-2">
              <div className="flex-1">
                <p className="text-sm whitespace-pre-wrap">{streamingMessage}</p>
                <StreamingIndicator />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
