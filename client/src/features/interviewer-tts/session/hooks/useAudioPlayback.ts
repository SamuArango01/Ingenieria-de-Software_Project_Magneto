"use client";

import { useEffect, useRef, useCallback } from "react";

export function useAudioPlayback() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playAudioFromBase64 = useCallback(async (base64Audio: string) => {
    if (!audioRef.current) return;

    try {
      // Convert base64 to blob URL
      const byteCharacters = atob(base64Audio);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);

      // Play audio
      audioRef.current.src = url;
      await audioRef.current.play();

      // Clean up URL after playing
      audioRef.current.onended = () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return {
    playAudioFromBase64,
    stopAudio,
  };
}
