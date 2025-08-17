# CYBERCHAT - Neural Interface v2.0

A futuristic, cyberpunk-themed AI chat application powered by Ollama and built with Next.js for OpenXAI.

## ✨ Features

- **Cyberpunk Aesthetic**: Futuristic neon design with glowing effects and dark theme
- **Neural Interface**: Sci-fi inspired UI with cyber terminology and effects
- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Real-time Chat**: Interactive chat interface with message history
- **Loading States**: Visual feedback during AI processing
- **Error Handling**: User-friendly error messages with cyberpunk styling
- **Responsive Design**: Works perfectly on desktop and mobile
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Message Persistence**: Chat history maintained during session
- **Clear Chat**: Option to reset conversation

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Custom CSS with CSS Variables and utility classes
- **Icons**: SVG icons for better performance
- **Fonts**: Orbitron and Rajdhani font families for futuristic typography
- **Animations**: CSS animations, glitch effects, and neon glows
- **Theme**: CSS custom properties for consistent cyberpunk theming

## 🎨 UI Components

- **Chat Interface**: Main chat container with neon borders and cyber backgrounds
- **Message Bubbles**: Distinct styling for user and AI messages with neon effects
- **Theme Toggle**: Floating button to switch between light/dark modes
- **Loading Spinner**: Reusable spinner component with cyberpunk styling
- **Input Area**: Textarea with send button and keyboard shortcuts
- **Error Display**: Styled error messages with cyberpunk aesthetics

## 🎯 Key Features

### Chat Experience
- Send messages with Enter key
- Multi-line support with Shift+Enter
- Auto-scroll to latest messages
- Clear chat functionality
- Cyberpunk-themed welcome message

### Theme System
- Light and dark mode support
- System preference detection
- Persistent theme storage
- Smooth theme transitions with neon effects

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🛠️ Getting Started

1. **Install Dependencies**
   ```bash
   cd nextjs-app
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## 📱 Usage

- **Send Message**: Type and press Enter or click Send
- **New Line**: Press Shift+Enter for multi-line messages
- **Toggle Theme**: Click the sun/moon icon in the top-right
- **Clear Chat**: Click "RESET CONNECTION" to reset conversation
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line

## 🎨 Customization

The app uses CSS custom properties for easy theming:

```css
:root {
  --primary: 180 100% 50%;        /* Cyan */
  --accent: 300 100% 50%;         /* Magenta */
  --background: 220 23% 6%;       /* Dark background */
  --foreground: 0 0% 98%;         /* Light text */
}
```

## 🔧 API Integration

The chat component integrates with the `/api/chat` endpoint:

```typescript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: inputMessage })
});
```

## 📁 Project Structure

```
components/
├── chat.tsx              # Main chat interface
├── theme-toggle.tsx      # Theme switcher
└── ui/
    ├── loading-spinner.tsx
    └── message-bubble.tsx
```

## 🌟 Cyberpunk Features

- **Neon Glows**: Glowing borders and text effects
- **Glitch Animations**: Text glitch effects for futuristic feel
- **Scan Lines**: Animated scanning line effects
- **Cyber Backgrounds**: Transparent, blurred backgrounds
- **Futuristic Typography**: Orbitron and Rajdhani fonts
- **Neon Color Scheme**: Cyan, magenta, and green accents

## 🌟 OpenXAI Integration

This application is designed to run on OpenXAI infrastructure with Ollama backend support. The cyberpunk UI provides an immersive, futuristic user experience while maintaining compatibility with the OpenXAI ecosystem.

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for OpenXAI • Welcome to the future of AI communication
