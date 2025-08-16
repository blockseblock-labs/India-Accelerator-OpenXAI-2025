import React, { useState, useRef, useEffect } from "react";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [timer, setTimer] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [modelResponse, setModelResponse] = useState("");
  const [uploading, setUploading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  };

  const stopTimer = () => clearInterval(timerRef.current);

  // Helper: Convert Float32Array to WAV Blob
  const encodeWAV = (samples, sampleRate = 44100) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    /* RIFF header */
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');

    /* fmt chunk */
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);

    /* data chunk */
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const startRecording = async () => {
    setAudioUrl(null);
    chunksRef.current = [];
    setTranscription("");
    setModelResponse("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      const audioData = [];
      processor.onaudioprocess = (e) => {
        audioData.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);

      mediaRecorderRef.current = { stream, processor, source, audioData };
      setRecording(true);
      startTimer();
      console.log("Recording started");
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Microphone access required.");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    stopTimer();
    setRecording(false);

    const { stream, processor, source, audioData } = mediaRecorderRef.current;

    processor.disconnect();
    source.disconnect();
    stream.getTracks().forEach((track) => track.stop());

    // Flatten Float32Arrays
    const length = audioData.reduce((sum, arr) => sum + arr.length, 0);
    const flat = new Float32Array(length);
    let offset = 0;
    for (const arr of audioData) {
      flat.set(arr, offset);
      offset += arr.length;
    }

    const wavBlob = encodeWAV(flat, audioContextRef.current.sampleRate);
    const url = URL.createObjectURL(wavBlob);
    setAudioUrl(url);

    console.log("WAV Blob type:", wavBlob.type);
    console.log("WAV Blob size:", wavBlob.size);
  };

  const formattedTime = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const sendToBackend = async () => {
    if (!audioUrl) return;

    setUploading(true);
    setTranscription("");
    setModelResponse("");

    try {
      const blob = await fetch(audioUrl).then((r) => r.blob());
      const fd = new FormData();
      fd.append("audio", blob, `recording-${Date.now()}.wav`);

      const res = await fetch("http://localhost:5000/api/upload", { method: "POST", body: fd });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }

      const data = await res.json();
      setTranscription(data.transcription || "");
      setModelResponse(data.modelResponse || "");
    } catch (err) {
      console.error(err);
      alert("Failed to send audio to backend. See console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 min-h-screen bg-gray-900">
      <h1 className="text-white text-2xl font-bold">Audio Recorder</h1>

      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded font-semibold ${
          recording ? "bg-red-500 hover:bg-red-600" : "bg-green-400 hover:bg-green-500"
        }`}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      <div className="text-white mt-2">{formattedTime(timer)}</div>

      {audioUrl && (
        <div className="mt-4 w-full max-w-md flex flex-col gap-2">
          <audio src={audioUrl} controls className="w-full" />
          <button
            onClick={sendToBackend}
            disabled={uploading}
            className="px-4 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          >
            {uploading ? "Sending..." : "Send to Backend"}
          </button>
          <p className="text-white mt-2 text-center">Recorded Audio</p>
        </div>
      )}

      <div className="mt-4 w-full max-w-md p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
        <h2 className="text-white font-semibold">Transcription</h2>
        <p className="text-white/70 mt-2 min-h-[3rem]">
          {transcription || "Transcription will appear here..."}
        </p>
      </div>

      <div className="mt-4 w-full max-w-md p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
        <h2 className="text-white font-semibold">LLM Response</h2>
        <p className="text-white/70 mt-2 min-h-[3rem]">
          {modelResponse || "Ollama response will appear here..."}
        </p>
      </div>
    </div>
  );
}
