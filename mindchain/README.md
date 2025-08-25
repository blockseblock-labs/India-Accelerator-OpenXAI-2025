# 💬 TextStream Template

A Next.js template for building real-time AI chat applications with streaming responses! This template provides a complete chat interface with streaming text responses and modern UI.

## Features

- **Real-time Chat**: Instant messaging interface with AI responses
- **Streaming Responses**: Text streams in real-time for better UX
- **Message History**: Persistent chat history during session
- **Loading States**: Visual indicators for processing messages
- **Modern UI**: Beautiful gradient background with chat bubbles
- **Keyboard Support**: Enter to send, Shift+Enter for new lines

## 🚀 Getting Started

### Installation

1. Navigate to the nextjs-app directory:
```bash
cd nextjs-app
```

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
│   │   └── chat/
│   │       └── route.ts          # Streaming chat API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main chat interface
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 💬 Chat Features

The template includes:

- **Streaming Text**: Real-time text streaming for AI responses
- **Chat Interface**: User and assistant message bubbles
- **Message State**: Loading indicators and typing animations
- **Auto-scroll**: Automatic scrolling to latest messages
- **Error Handling**: Graceful error states and retry logic

### Chat Interface

The chat component provides:

1. **Message Input**: Multi-line text area with send button
2. **Message Display**: Styled chat bubbles for user/assistant
3. **Streaming Display**: Real-time text appearance
4. **Loading States**: Animated dots during processing

## 🤖 AI Integration

The template includes a chat API endpoint at `/api/chat` for:

- Streaming text responses
- Conversation context management
- Error handling and recovery
- Customizable AI behavior

### Streaming Implementation

The chat uses:
- **ReadableStream**: For real-time text streaming
- **TextDecoder**: For processing streamed chunks
- **State Management**: React state for message handling

## 🎨 Customization

- Modify chat styling in `page.tsx`
- Adjust streaming behavior in API route
- Add message formatting and markdown
- Extend with file uploads or images
- Customize AI response behavior

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **Streaming API** - Real-time text streaming
- **React Hooks** - State management
- **Lucide React** - Beautiful icons

## 🔧 Chat Configuration

The chat interface supports:
- Multi-line input with Shift+Enter
- Auto-expanding text areas
- Keyboard shortcuts (Enter to send)
- Responsive design for mobile/desktop

Build amazing conversational AI experiences! 💬 