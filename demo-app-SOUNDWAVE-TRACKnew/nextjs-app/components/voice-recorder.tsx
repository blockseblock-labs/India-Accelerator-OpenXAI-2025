"use client"
import { useState, useRef } from "react"

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorderRef.current = new MediaRecorder(stream)
    chunks.current = []

    // Audio visualization setup
    audioCtxRef.current = new AudioContext()
    const source = audioCtxRef.current.createMediaStreamSource(stream)
    analyserRef.current = audioCtxRef.current.createAnalyser()
    source.connect(analyserRef.current)
    visualize()

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data)
    }
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" })
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
      addToLibrary(url)
    }

    mediaRecorderRef.current.start()
    setRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const addToLibrary = (url: string) => {
    const list = document.getElementById("recordings-list")
    if (list) {
      const li = document.createElement("li")
      li.className =
        "flex justify-between items-center bg-white/10 p-3 rounded-lg"
      li.innerHTML = `
        <audio controls src="${url}" class="mr-2"></audio>
        <a href="${url}" download="recording.webm" class="text-blue-300 underline">Download</a>
      `
      list.appendChild(li)
    }
  }

  const visualize = () => {
    if (!analyserRef.current || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      requestAnimationFrame(draw)
      analyserRef.current?.getByteTimeDomainData(dataArray)

      ctx.fillStyle = "rgba(0,0,0,0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = 2
      ctx.strokeStyle = "#4ade80" // green
      ctx.beginPath()

      let sliceWidth = (canvas.width * 1.0) / bufferLength
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0
        let y = (v * canvas.height) / 2
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        x += sliceWidth
      }
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()
    }
    draw()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} width={400} height={100} className="w-full rounded bg-black"></canvas>

      <div className="space-x-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-green-500 rounded-lg text-white font-bold shadow-lg hover:bg-green-600 transition"
          >
            🎤 Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-500 rounded-lg text-white font-bold shadow-lg hover:bg-red-600 transition"
          >
            ⏹ Stop Recording
          </button>
        )}
      </div>

      {audioUrl && (
        <div className="flex flex-col items-center space-y-2">
          <audio controls src={audioUrl}></audio>
          <a
            href={audioUrl}
            download="recording.webm"
            className="text-blue-300 underline"
          >
            📥 Download Recording
          </a>
        </div>
      )}
    </div>
  )
}
