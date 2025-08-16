import React, { useState, useRef, useEffect } from "react";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [timer, setTimer] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [modelResponse, setModelResponse] = useState("");
  const [modelResponseAudioUrl, setModelResponseAudioUrl] = useState(null); // ✅ new state
  const [uploading, setUploading] = useState(false);

  const mediaRef = useRef(null);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };
  const stopTimer = () => clearInterval(timerRef.current);

  // PCM -> WAV encoder
  const encodeWAV = (samples, sampleRate = 44100) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (v, o, s) => {
      for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);        // PCM
    view.setUint16(22, 1, true);        // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);        // block align
    view.setUint16(34, 16, true);       // bits per sample
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([view], { type: "audio/wav" });
  };

  // Start (WebAudio capture for guaranteed WAV)
  const startRecording = async () => {
    setAudioUrl(null);
    setTranscription("");
    setModelResponse("");
    setModelResponseAudioUrl(null); // reset

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);

      const frames = [];
      processor.onaudioprocess = (e) => {
        frames.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      source.connect(processor);
      processor.connect(ctx.destination);

      mediaRef.current = { stream, source, processor, frames };
      setRecording(true);
      startTimer();
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access required.");
    }
  };

  // Stop + build WAV
  const stopRecording = () => {
    if (!mediaRef.current) return;

    stopTimer();
    setRecording(false);

    const { stream, source, processor, frames } = mediaRef.current;

    try {
      processor.disconnect();
      source.disconnect();
    } catch {
        // Ignore disconnect errors
    }
    try {
      stream.getTracks().forEach((t) => t.stop());
    } catch {
        // Ignore stop errors
    }

    // flatten
    const total = frames.reduce((sum, f) => sum + f.length, 0);
    const flat = new Float32Array(total);
    let off = 0;
    for (const f of frames) {
      flat.set(f, off);
      off += f.length;
    }

    const wav = encodeWAV(flat, audioContextRef.current.sampleRate || 44100);
    const url = URL.createObjectURL(wav);
    setAudioUrl(url);

    console.log("WAV Blob:", wav.type, wav.size);
  };

  const formattedTime = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  // Send to backend -> returns { transcription, modelResponse, modelResponseAudio }
  const sendToBackend = async () => {
    if (!audioUrl) return;
    setUploading(true);
    setTranscription("");
    setModelResponse("");
    setModelResponseAudioUrl(null);

    try {
      const blob = await fetch(audioUrl).then((r) => r.blob());
      const fd = new FormData();
      fd.append("audio", blob, `recording-${Date.now()}.wav`);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }
      const data = await res.json();
      setTranscription(data.transcription || "");
      setModelResponse(data.modelResponse || "");

      // ✅ Build audio URL for response
      if (data.modelResponseAudio) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.modelResponseAudio), (c) => c.charCodeAt(0))],
          { type: "audio/mpeg" }
        );
        setModelResponseAudioUrl(URL.createObjectURL(audioBlob));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send audio to backend. See console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      {/* Glass card */}
      <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">
            Audio Wave
          </h1>

          {/* Recording indicator */}
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex h-3 w-3 rounded-full ${
                recording ? "bg-red-400 animate-ping-once" : "bg-white/40"
              }`}
              aria-hidden
            />
            <div className="text-sm text-white/80">
              {recording ? "Recording…" : "Idle"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`group relative overflow-hidden rounded-full px-5 py-3 font-semibold text-white transition 
              ${recording ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"}
              focus:outline-none focus:ring-2 focus:ring-white/40`}
          >
            <span className="relative z-10">
              {recording ? "Stop Recording" : "Start Recording"}
            </span>
            <span
              className="pointer-events-none absolute inset-0 -z-0 opacity-30 blur-xl"
              aria-hidden
            />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-white/90 text-lg tabular-nums">{formattedTime(timer)}</div>

            {/* equalizer during recording */}
            <div className="flex h-6 items-end gap-[3px]">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-sm bg-white/80 ${
                    recording ? `eq-bar eq-bar-${i + 1}` : "h-1"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Player + send */}
        {audioUrl && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <audio src={audioUrl} controls className="w-full" />
            <div className="mt-3 flex items-center justify-between">
              <p className="text-white/80 text-sm">🎙 Your Recorded Audio (WAV)</p>
              <button
                onClick={sendToBackend}
                disabled={uploading}
                className="rounded-full bg-blue-500 px-4 py-2 text-white font-medium hover:bg-blue-600 disabled:opacity-60"
              >
                {uploading ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        )}

        {/* Transcription */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-white font-semibold">Transcription</h2>
          <p className="mt-2 min-h-[3rem] text-white/80 whitespace-pre-wrap">
            {transcription || "—"}
          </p>
        </div>

        {/* LLM */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-white font-semibold">LLM Response</h2>
          <p className="mt-2 min-h-[3rem] text-white/80 whitespace-pre-wrap">
            {modelResponse || "—"}
          </p>

          {/* ✅ Play the LLM response as audio */}
          {modelResponseAudioUrl && (
            <div className="mt-4">
              <audio src={modelResponseAudioUrl} controls className="w-full" />
              <p className="text-white/70 text-sm mt-1">🤖 LLM Response (TTS)</p>
            </div>
          )}
        </div>
      </div>

      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(1200px 400px at 10% 10%, rgba(255,255,255,.25), transparent)",
        }}
      />
    </div>
  );
}
