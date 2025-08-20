'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause } from 'lucide-react'

export default function VoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
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

  // Draw waveform on canvas when playing
  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return
    const audioCtx = new AudioContext()
    const analyser = audioCtx.createAnalyser()
    const source = audioCtx.createMediaElementSource(audioRef.current)
    source.connect(analyser)
    analyser.connect(audioCtx.destination)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    const draw = () => {
      requestAnimationFrame(draw)
      analyser.getByteFrequencyData(dataArray)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2
        ctx.fillStyle = `rgba(139,92,246,0.7)`
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        x += barWidth + 1
      }
    }
    draw()
  }, [audioURL])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="flex justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 text-white px-6 py-3 rounded-full shadow-md transition-all"
          >
            <Mic size={20} />
            <span>Start Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full shadow-md transition-all"
          >
            <Square size={20} />
            <span>Stop Recording</span>
          </button>
        )}
      </div>

      {/* Recording Timer */}
      {isRecording && (
        <div className="text-center">
          <div className="text-2xl font-mono text-white">
            {formatTime(recordingTime)}
          </div>
          <div className="flex justify-center mt-2">
            <div className="audio-visualizer">
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Playback */}
      {audioURL && (
        <div className="space-y-6">
          <audio
            ref={audioRef}
            src={audioURL}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          {/* Waveform */}
          <canvas ref={canvasRef} width={400} height={100} className="w-full bg-black/20 rounded-md"></canvas>

          <div className="flex justify-center space-x-4">
            {!isPlaying ? (
              <button
                onClick={playAudio}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white px-6 py-3 rounded-full shadow-md transition-all"
              >
                <Play size={20} />
                <span>Play Recording</span>
              </button>
            ) : (
              <button
                onClick={pauseAudio}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white px-6 py-3 rounded-full shadow-md transition-all"
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
