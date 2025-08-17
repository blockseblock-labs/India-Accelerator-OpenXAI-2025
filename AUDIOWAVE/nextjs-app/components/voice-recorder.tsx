'use client'

import { useState, useRef } from 'react'
import { Mic, Square, Play, Pause } from 'lucide-react'

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
<div className="space-y-8">
  {/* Recording Controls */}
  <div className="flex justify-center">
    {!isRecording ? (
      <button
        onClick={startRecording}
        className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-red-600 hover:scale-105 text-white px-8 py-4 rounded-full shadow-lg font-bold transition-all"
      >
        <Mic size={20} />
        <span>Start Recording</span>
      </button>
    ) : (
      <button
        onClick={stopRecording}
        className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-8 py-4 rounded-full shadow-lg font-bold transition-all animate-pulse"
      >
        <Square size={20} />
        <span>Stop Recording</span>
      </button>
    )}
  </div>

  {/* Recording Timer + Visualizer */}
  {isRecording && (
    <div className="text-center">
      <div className="text-3xl font-mono text-white">{formatTime(recordingTime)}</div>
      <div className="audio-visualizer mt-4">
        <div className="audio-bar"></div>
        <div className="audio-bar"></div>
        <div className="audio-bar"></div>
        <div className="audio-bar"></div>
        <div className="audio-bar"></div>
      </div>
    </div>
  )}

  {/* Playback */}
  {audioURL && (
    <div className="space-y-6">
      <audio
        ref={audioRef}
        src={audioURL}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      <div className="flex justify-center">
        {!isPlaying ? (
          <button
            onClick={playAudio}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-105 text-white px-8 py-4 rounded-full shadow-lg font-bold transition-all"
          >
            <Play size={20} />
            <span>Play Recording</span>
          </button>
        ) : (
          <button
            onClick={pauseAudio}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:scale-105 text-white px-8 py-4 rounded-full shadow-lg font-bold transition-all"
          >
            <Pause size={20} />
            <span>Pause</span>
          </button>
        )}
      </div>

      {/* Playback visualizer */}
      {isPlaying && (
        <div className="audio-visualizer">
          <div className="audio-bar"></div>
          <div className="audio-bar"></div>
          <div className="audio-bar"></div>
          <div className="audio-bar"></div>
          <div className="audio-bar"></div>
        </div>
      )}

      <div className="bg-black/30 rounded-xl p-5 shadow-md text-center">
        <p className="text-white/80 text-sm">
          Recording saved! You can play it back or record a new one.
        </p>
      </div>
    </div>
  )}
</div>

  )
} 