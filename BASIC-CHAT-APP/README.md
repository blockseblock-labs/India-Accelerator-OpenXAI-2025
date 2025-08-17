# Llama3 Chat - Minimalistic AI Assistant

A clean, modern, and user-friendly chat interface built with Next.js, TypeScript, and Tailwind CSS. Designed to integrate with Llama3 AI models for intelligent conversations.

## ✨ Features

- **Minimalistic Design**: Clean, dark theme with smooth animations
- **Responsive UI**: Works perfectly on desktop and mobile devices
- **Real-time Chat**: Instant message sending with loading indicators
- **Auto-scroll**: Automatically scrolls to latest messages
- **Keyboard Shortcuts**: Press Enter to send, Shift+Enter for new lines
- **Message History**: Clear chat functionality with persistent conversation
- **TypeScript**: Fully typed for better development experience
- **Tailwind CSS**: Utility-first styling with custom design system

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Om-Bhavsar-6/India-Accelerator-OpenXAI-2025.git
   cd India-Accelerator-OpenXAI-2025/BASIC-CHAT-APP/nextjs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🦙 Llama3 Integration

Currently, the app uses a simulated Llama3 response system. To integrate with actual Llama3, you have several options:

### Option 1: Local Llama3 with Ollama

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Download from https://ollama.ai/download
   ```

2. **Pull Llama3 model**
   ```bash
   ollama pull llama3
   ```

3. **Update the API route** (src/pages/api/chat.ts)
   ```typescript
   async function callLlama3(message: string): Promise<string> {
     const response = await fetch('http://localhost:11434/api/generate', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         model: 'llama3',
         prompt: message,
         stream: false
       })
     })
     
     const data = await response.json()
     return data.response
   }
   ```

 Option 2: Cloud Llama3 API

Replace the simulation function with your preferred cloud provider:

- **Hugging Face Transformers**
- **OpenAI-compatible endpoints**
- **Custom API endpoints**

Option 3: Environment Variables

Create a `.env.local` file:

```env
LLAMA3_API_URL=your-api-endpoint
LLAMA3_API_KEY=your-api-key
LLAMA3_MODEL_NAME=llama3-model-name
```

## 🎨 Design System

The app uses a custom design system built on Tailwind CSS:

Colors
- **Background**: `#0f0f23` (chat-bg)
- **Surface**: `#1a1a3e` (chat-surface)
- **Accent**: `#3b82f6` (chat-accent)
- **Text**: `#e5e7eb` (chat-text)
- **Muted Text**: `#9ca3af` (chat-text-muted)

 Components
- **Chat Messages**: Rounded corners with role-based styling
- **Input Field**: Auto-expanding textarea with send button
- **Loading Indicator**: Animated dots with thinking text
- **Avatars**: Circular badges for user and AI

📱 UI/UX Features

- **Smooth Animations**: Slide-up animations for new messages
- **Auto-expanding Input**: Textarea grows with content
- **Custom Scrollbar**: Thin, styled scrollbar for chat area
- **Loading States**: Visual feedback during AI responses
- **Timestamps**: Message time display
- **Clear Chat**: Reset conversation functionality

🛠️ Development
Project Structure
```
src/
├── components/          # React components
│   ├── ChatInterface.tsx
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   └── LoadingIndicator.tsx
├── pages/              # Next.js pages
│   ├── api/
│   │   └── chat.ts     # API route for chat
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx
├── styles/             # Global styles
│   └── globals.css
└── types/              # TypeScript types
    └── chat.ts
```

Build for Production

```bash
npm run build
npm start
```

Customization

1. **Styling**: Modify `tailwind.config.js` for custom colors and animations
2. **Components**: Update components for different layouts or features
3. **API Integration**: Replace simulation with real Llama3 API calls
4. **Themes**: Add light/dark theme toggle functionality

🔧 Configuration

Tailwind Configuration
The app includes custom Tailwind configuration for:
- Custom color palette
- Animation keyframes
- Component classes
- Responsive breakpoints

TypeScript Configuration
Strict TypeScript setup with:
- Path aliases (`@/*` for `src/*`)
- Next.js plugin integration
- Type checking for all components
📋 Todo

- [ ] Real Llama3 API integration
- [ ] Message persistence
- [ ] User authentication
- [ ] Multiple conversation threads
- [ ] File upload support
- [ ] Voice input/output
- [ ] Markdown rendering
- [ ] Code syntax highlighting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built for the India Accelerator OpenXAI 2025 hackathon
- Inspired by modern chat interfaces like ChatGPT and Claude
- Powered by Next.js, React, TypeScript, and Tailwind CSS
