# AI Chat Assistant

A modern, feature-rich AI chat application powered by Llama 3.2, built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎨 Modern UI/UX
- **Beautiful Design**: Gradient backgrounds, glass morphism effects, and smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Automatic theme detection with CSS variables
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions

### 💬 Advanced Chat Features
- **Message History**: Persistent conversation with timestamps
- **Real-time Typing Indicators**: Animated dots when AI is responding
- **Auto-scroll**: Automatically scrolls to latest messages
- **Message Bubbles**: Distinct styling for user and AI messages
- **Avatar System**: User and AI avatars with gradient backgrounds

### 🚀 Enhanced Functionality
- **Smart Input**: Auto-resizing textarea with keyboard shortcuts
- **Attachment Support**: Ready for file uploads (UI prepared)
- **Voice Input**: Microphone button for future voice integration
- **Export Chat**: Download conversation as text file
- **Share Chat**: Native sharing or clipboard copy
- **Clear Chat**: One-click conversation reset

### 🔧 Technical Features
- **Online Status**: Real-time connection monitoring
- **Error Handling**: Graceful error display and recovery
- **Loading States**: Beautiful loading animations
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- **Accessibility**: Proper ARIA labels and keyboard navigation

### 🎯 Welcome Experience
- **Onboarding**: Feature showcase with animated cards
- **Suggested Prompts**: Quick-start conversation starters
- **Empty State**: Engaging welcome screen for new users

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, CSS Variables, Custom Animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Backend**: Ollama with Llama 3.2 (1B) model
- **UI Components**: Custom component library with Radix UI primitives

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Ollama installed and running
- Llama 3.2:1b model downloaded

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BASIC-CHAT-APP
   ```

2. **Install dependencies**
   ```bash
   cd nextjs-app
   npm install
   ```

3. **Download the AI model**
   ```bash
   ollama pull llama3.2:1b
   ```

4. **Start the development server**
   ```bash
npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

### Basic Chat
1. Type your message in the input field
2. Press Enter or click the send button
3. Wait for the AI response with typing indicators
4. Continue the conversation naturally

### Advanced Features
- **Export**: Click the "Export" button to download your chat
- **Share**: Use the "Share" button to copy or share your conversation
- **Clear**: Reset the conversation with the "Clear" button
- **Keyboard Shortcuts**: 
  - `Enter`: Send message
  - `Shift + Enter`: New line
  - `Ctrl/Cmd + Enter`: Send message

### Suggested Prompts
The app includes helpful conversation starters:
- "Tell me a joke"
- "Explain quantum computing"
- "Write a short story"
- "Help me plan my day"
- "What's the weather like?"
- "Recommend a book"

## 🎨 Customization

### Colors and Themes
The app uses CSS variables for easy theming. Modify `globals.css` to change:
- Primary colors
- Background gradients
- Chat bubble styles
- Animation timings

### Model Configuration
Change the AI model in:
- `ollama-model.txt`: Model identifier
- `app/api/chat/route.ts`: Model name in the API

### Component Styling
All components use Tailwind CSS classes and can be easily customized in their respective files.

## 🔧 Development

### Project Structure
```
nextjs-app/
├── app/
│   ├── api/chat/route.ts    # AI chat API endpoint
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── chat.tsx             # Main chat component
│   ├── chat-header.tsx      # Header with model info
│   ├── chat-input.tsx       # Message input with features
│   ├── chat-message.tsx     # Individual message component
│   ├── chat-welcome.tsx     # Welcome screen
│   └── loading-spinner.tsx  # Loading animations
├── lib/
│   └── utils.ts             # Utility functions
└── config/
    └── site.ts              # Site configuration
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run typecheck`: TypeScript type checking

## 🌟 Unique Features

### 1. Glass Morphism Design
Modern glass-like effects with backdrop blur and transparency

### 2. Intelligent Message Flow
- Context-aware conversation history
- Smooth message animations
- Auto-scroll to latest messages

### 3. Enhanced User Experience
- Welcome screen with feature showcase
- Suggested prompts for easy start
- Real-time online status indicator

### 4. Professional UI Components
- Custom button variants with gradients
- Responsive design patterns
- Accessibility-first approach

### 5. Advanced Interactions
- Keyboard shortcuts
- Touch-friendly mobile interface
- Smooth loading states

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- Powered by Ollama and Llama 3.2
- Styled with Tailwind CSS
- Animated with Framer Motion
- Icons from Lucide React
