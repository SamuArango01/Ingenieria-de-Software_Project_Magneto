import { useCallback, useEffect, useRef, useState } from "react";

interface AudioChunk {
  id: number;
  data: string; // base64
  blobUrl?: string;
}

/**
 * Hook for streaming audio playback with queue management
 * Handles sequential playback of audio chunks for real-time streaming
 */
export function useStreamingAudioPlayback() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<AudioChunk[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const chunkIdCounter = useRef(0);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    // Handle when current chunk finishes playing
    const handleEnded = () => {
      setCurrentChunkIndex((prev) => prev + 1);
    };

    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
      // Clean up all blob URLs
      queue.forEach((chunk) => {
        if (chunk.blobUrl) {
          URL.revokeObjectURL(chunk.blobUrl);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Convert base64 to blob URL
  const base64ToBlobUrl = useCallback((base64Audio: string): string => {
    const byteCharacters = atob(base64Audio);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/mp3" });
    return URL.createObjectURL(blob);
  }, []);

  // Add audio chunk to queue
  const enqueueAudioChunk = useCallback(
    (base64Audio: string) => {
      const blobUrl = base64ToBlobUrl(base64Audio);
      const chunk: AudioChunk = {
        id: chunkIdCounter.current++,
        data: base64Audio,
        blobUrl,
      };

      setQueue((prev) => [...prev, chunk]);

      // If not currently playing, start playback
      if (currentChunkIndex === -1 && queue.length === 0) {
        setCurrentChunkIndex(0);
        setIsPlaying(true);
      }
    },
    [base64ToBlobUrl, currentChunkIndex, queue.length]
  );

  // Play current chunk
  useEffect(() => {
    if (!audioRef.current || currentChunkIndex < 0 || currentChunkIndex >= queue.length) {
      // No more chunks to play
      if (currentChunkIndex >= queue.length && queue.length > 0) {
        setIsPlaying(false);
      }
      return;
    }

    const chunk = queue[currentChunkIndex];
    if (chunk && chunk.blobUrl) {
      audioRef.current.src = chunk.blobUrl;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio chunk:", error);
          // Try next chunk
          setCurrentChunkIndex((prev) => prev + 1);
        });
    }
  }, [currentChunkIndex, queue]);

  // Clean up old chunks
  useEffect(() => {
    if (currentChunkIndex > 2) {
      setQueue((prev) => {
        // Keep only current and upcoming chunks
        const chunksToRemove = prev.slice(0, currentChunkIndex - 1);
        chunksToRemove.forEach((chunk) => {
          if (chunk.blobUrl) {
            URL.revokeObjectURL(chunk.blobUrl);
          }
        });
        return prev.slice(currentChunkIndex - 1);
      });
      setCurrentChunkIndex(1); // Adjust index after slicing
    }
  }, [currentChunkIndex]);

  // Stop playback and clear queue
  const stopStreamingAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Clean up all blob URLs
    queue.forEach((chunk) => {
      if (chunk.blobUrl) {
        URL.revokeObjectURL(chunk.blobUrl);
      }
    });

    setQueue([]);
    setCurrentChunkIndex(-1);
    setIsPlaying(false);
    chunkIdCounter.current = 0;
  }, [queue]);

  // Clear queue when stream completes
  const completeStream = useCallback(() => {
    // Let current playback finish naturally
    // Queue will auto-clear when all chunks are played
  }, []);

  return {
    enqueueAudioChunk,
    stopStreamingAudio,
    completeStream,
    isPlaying,
    queueLength: queue.length,
    currentChunk: currentChunkIndex,
  };
}
