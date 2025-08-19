'use client'

import { useState, useRef } from 'react'
import { Mic, Square, Play, Pause, RefreshCcw } from 'lucide-react'

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasRecording, setHasRecording] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Enhanced audio constraints
  const audioConstraints = {
    audio: {
      sampleRate: 44100,
      channelCount: 2,
      echoCancellation: true,
      noiseSuppression: true,
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(audioConstraints)
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
        setHasRecording(true)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setHasRecording(false)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const resetRecording = () => {
    setAudioURL(null)
    setHasRecording(false)
    setRecordingTime(0)
    setIsPlaying(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Audio visualizer bars
  const renderVisualizer = () => (
    <div className="audio-visualizer mt-4">
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          className="audio-bar"
          style={{
            height: isRecording
              ? `${10 + Math.random() * 20}px`
              : '10px',
            transition: 'height 0.2s',
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 bg-gradient-to-br from-indigo-900/70 to-purple-900/70 rounded-3xl shadow-2xl border border-white/10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <Mic size={32} className="text-indigo-400 animate-pulse" />
          <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Voice Recorder
          </h2>
        </div>
        <p className="text-indigo-200 mt-2 text-base font-medium">
          Record, play, and manage your voice notes with style.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition-all duration-200"
            >
              <Mic size={22} />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition-all duration-200"
            >
              <Square size={22} />
              <span>Stop</span>
            </button>
          )}
          {hasRecording && (
            <button
              onClick={resetRecording}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition-all duration-200"
            >
              <RefreshCcw size={20} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Timer & Visualizer */}
        <div className="flex flex-col items-center mt-4">
          <div className="text-2xl font-mono text-indigo-100 tracking-widest">
            {isRecording ? formatTime(recordingTime) : hasRecording ? formatTime(recordingTime) : '0:00'}
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-200 font-semibold">Recording...</span>
            </div>
          )}
          {renderVisualizer()}
        </div>
      </div>

      {/* Playback */}
      {audioURL && (
        <div className="w-full mt-8 flex flex-col items-center gap-4">
          <audio
            ref={audioRef}
            src={audioURL}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          <div className="flex gap-4">
            {!isPlaying ? (
              <button
                onClick={playAudio}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition-all duration-200"
              >
                <Play size={22} />
                <span>Play</span>
              </button>
            ) : (
              <button
                onClick={pauseAudio}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg transition-all duration-200"
              >
                <Pause size={22} />
                <span>Pause</span>
              </button>
            )}
          </div>
          <div className="bg-black/30 rounded-xl p-4 w-full max-w-md shadow-lg">
            <p className="text-indigo-100 text-center text-sm opacity-90">
              Your recording is ready! Play it back or record a new one.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}