# 🎵 SoundWave Template

A **Next.js starter template** for building modern audio experiences! It comes with voice recording, playback, and transcription support—wrapped in a sleek, responsive interface.

## Features

- **Voice Recording**: Real-time audio capture with the MediaRecorder API  
- **Audio Playback**: Built-in player with play/pause controls  
- **Recording Timer**: Live duration tracking while recording  
- **Visual Feedback**: Animated recording indicators and controls  
- **Transcription Ready**: API endpoint for speech-to-text conversion  
- **Modern UI**: Gradient background with glassmorphism styling  

---

## 🚀 Getting Started

### Installation

1. Navigate to the project directory:
```bash
cd nextjs-app


2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
nextjs-app/
├── app/
│   ├── api/
│   │   └── transcribe/
│   │       └── route.ts          # Voice transcription endpoint
│   ├── components/
│   │   └── voice-recorder.tsx    # Voice recording component
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main audio app page
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🎙️ Audio Features

The template includes:

- **Real-time Recording**: Browser-based audio recording
- **Audio Controls**: Play, pause, and recording controls
- **Timer Display**: Shows recording duration
- **Audio Storage**: Blob-based audio storage and playback
- **Transcription API**: Ready-to-use speech-to-text endpoint

### Using the Voice Recorder



The `VoiceRecorder` component provides:

1. **Start Recording**: Click to begin audio capture
2. **Stop Recording**: End recording and save audio
3. **Play Back**: Listen to recorded audio
4. **Visual Feedback**: Animated indicators during recording

## 🤖 Transcription Integration

The template includes a transcription API endpoint at `/api/transcribe` for:

- Converting speech to text
- Voice command processing
- Audio content analysis
- Accessibility features

### Browser Permissions

The app requires microphone permissions. Users will be prompted to allow access on first use.

## 🎨 Customization

- Modify audio settings in `voice-recorder.tsx`
- Adjust recording quality and format
- Add audio visualization effects
- Extend transcription functionality
- Style components with Tailwind classes

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **MediaRecorder API** - Audio recording
- **Web Audio API** - Audio processing
- **Lucide React** - Beautiful icons

## 🔧 Audio Configuration

The recorder uses these default settings:
- Format: WAV
- Quality: Browser default
- Timer: 1-second intervals
- Auto-stop: User controlled

Build amazing audio experiences! 🎵 
