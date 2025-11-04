"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createSocketConnection } from "@/lib/socket/client";
import { useInterviewTTS } from "../../contexts/InterviewTTSContext";

export function useSocketConnection() {
  const { getToken } = useAuth();
  const router = useRouter();
  const {
    socket,
    setSocket,
    addMessage,
    setProcessingStatus,
    setCurrentAudio,
    startTimer,
    pauseTimer,
  } = useInterviewTTS();

  useEffect(() => {
    let socketInstance: ReturnType<typeof createSocketConnection> | null = null;

    const initSocket = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("No auth token available");
          return;
        }

        socketInstance = createSocketConnection({ token });
        setSocket(socketInstance);

        // Event: interview_started
        socketInstance.on("interview_started", (data) => {
          console.log("Interview started:", data.interviewId);
          addMessage("ai", data.message);
          setCurrentAudio(data.audio);
          startTimer();
        });

        // Event: processing
        socketInstance.on("processing", (data) => {
          setProcessingStatus(data.status);
        });

        // Event: transcription
        socketInstance.on("transcription", (data) => {
          addMessage("user", data.text);
          setProcessingStatus(null);
        });

        // Event: ai_response
        socketInstance.on("ai_response", (data) => {
          addMessage("ai", data.message);
          setCurrentAudio(data.audio);
          setProcessingStatus(null);

          if (data.shouldEnd) {
            // Interview ended by AI
            pauseTimer();
            console.log("Interview ended by AI:", data.reason);
          }
        });

        // Event: interview_ended
        socketInstance.on("interview_ended", (data) => {
          console.log("Interview ended:", data.reason);
          pauseTimer();

          // Redirect to summary page after a short delay
          setTimeout(() => {
            router.push("/entrevistador-tts/summary");
          }, 2000);
        });

        // Event: error
        socketInstance.on("error", (data) => {
          console.error("Socket error:", data.message);
          setProcessingStatus(null);
          alert(`Error: ${data.message}`);
        });

        // Event: connect
        socketInstance.on("connect", () => {
          console.log("Socket connected");
        });

        // Event: disconnect
        socketInstance.on("disconnect", () => {
          console.log("Socket disconnected");
        });

      } catch (error) {
        console.error("Failed to initialize socket:", error);
      }
    };

    initSocket();

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
      }
    };
  }, [getToken, setSocket, addMessage, setProcessingStatus, setCurrentAudio, startTimer, pauseTimer, router]);

  return { socket };
}
