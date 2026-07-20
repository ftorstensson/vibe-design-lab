"use client";
import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await handleTranscription(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access error:", err);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    const duration = Date.now() - startTimeRef.current;
    if (duration < 2000) { console.warn("Recording too short (< 2s). Ignoring."); return; }
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", blob, "voice.webm");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/agent/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription failed");
      
      const data = await response.json();
      if (data.transcript) {
        onTranscript(data.transcript);
      }
    } catch (err) {
      console.error("Transcription error:", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isTranscribing}
      className={clsx(
        "p-3 rounded-xl transition-all shadow-sm flex items-center justify-center",
        isRecording 
          ? "bg-red-500 text-white animate-pulse" 
          : "bg-slate-100 text-slate-500 hover:bg-slate-200",
        (disabled || isTranscribing) && "opacity-50 cursor-not-allowed"
      )}
    >
      {isTranscribing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isRecording ? (
        <Square className="w-4 h-4 fill-current" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
