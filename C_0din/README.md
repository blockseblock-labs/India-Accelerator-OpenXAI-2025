# C_0din ; ur well-coder

A **Next.js 14 + TypeScript** web application that uses **Ollama with LLaMA 3** to generate **well-commented code** and **detailed explanations** for raw code snippets. Features a modern, ChatGPT-inspired interface with **dark/light mode toggle**, **resizable split panels**, and a **developer-friendly UI**.

---

## ✨ Features

- **AI-Powered Code Analysis**: Input raw code and instantly get:
  - **Commented code** with professional inline explanations
  - **Detailed explanations** of what the code does and how it works
- **Split-Screen Interface**:
  - **Left panel** → commented code with syntax highlighting
  - **Right panel** → detailed explanation in markdown format
- **Resizable panels** for better readability and customization
- **Modern UI**: Minimalist design with smooth animations and transitions
- **Theme Support**: Dark/light mode toggle with system preference detection
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Multi-language Support**: Automatic language detection for proper syntax highlighting
- **Smart Fallback**: Intelligent comment generation even when AI response isn't perfect

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router  
- **Language**: [TypeScript](https://www.typescriptlang.org/)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)  
- **Animations**: [Framer Motion](https://www.framer.com/motion/)  
- **Code Highlighting**: [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)  
- **AI Model**: **Ollama** with **`llama3:latest`** (local deployment)
- **Theme Management**: [next-themes](https://github.com/pacocoursey/next-themes)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** installed
- **Ollama** installed and running locally
- **Git** for cloning the repository

### 1. Install Ollama

```bash
# Install Ollama (if not already installed)
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
ollama serve

# Pull the LLaMA 3 model
ollama pull llama3:latest
```

### 2. Clone the repository

```bash
git clone https://github.com/TopNotch3/India-Accelerator-OpenXAI-2025
cd India-Accelerator-OpenXAI-2025/C_0din
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 📁 Project Structure

```
C_0din/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts      # Ollama API integration endpoint
│   ├── globals.css           # Global styles and Tailwind imports
│   ├── layout.tsx            # Root layout with ThemeProvider
│   └── page.tsx              # Main application interface
├── components/
│   ├── code-panels/
│   │   ├── code-panel.tsx    # Renders commented code with syntax highlighting
│   │   └── explanation-panel.tsx  # Renders explanation in markdown
│   ├── input/
│   │   └── input-bar.tsx     # ChatGPT-style input box
│   ├── layout/
│   │   ├── header.tsx        # Top navigation bar
│   │   └── sidebar.tsx       # Chat history sidebar
│   ├── providers/
│   │   └── theme-provider.tsx # Theme context provider
│   ├── ui/                   # shadcn/ui components
│   └── workspace/
│       └── split-pane.tsx    # Resizable split panels
├── hooks/
│   └── use-toast.ts          # Toast notification hook
├── lib/
│   └── utils.ts              # Utility functions
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔧 How It Works

### 1. **Code Input**
- User pastes raw code into the input bar
- Supports multiple programming languages (Java, Python, JavaScript, C++, etc.)

### 2. **AI Processing**
- Request sent to `/api/generate` endpoint
- Backend connects to local Ollama instance
- LLaMA 3 model analyzes the code with structured prompts

### 3. **Response Generation**
The AI generates:
- **Commented Code**: Original code with professional inline comments
- **Detailed Explanation**: Step-by-step breakdown of how the code works

### 4. **Display**
- **Left Panel**: Syntax-highlighted commented code
- **Right Panel**: Markdown-formatted explanation
- **Resizable Interface**: Users can adjust panel sizes for optimal viewing

---

## 🎯 API Integration

The backend route (`app/api/generate/route.ts`) uses Ollama's local API:

```typescript
// Connects to local Ollama instance
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama3:latest',
    prompt: `You are an expert code reviewer and educator...`,
    stream: false
  })
})
```

### System Prompt
The AI is instructed to:
- Generate professional inline comments explaining each code section
- Provide detailed explanations of algorithms and logic
- Maintain code structure for proper syntax highlighting
- Format responses consistently for parsing

---

## 🎨 UI Components

### **Code Panel**
- Syntax highlighting with language detection
- Line numbers and copy functionality
- Language badge indicator
- Responsive design with proper scrolling

### **Explanation Panel**
- Markdown rendering with custom styling
- Proper typography and spacing
- Scrollable content area

### **Split Pane**
- Resizable panels with drag handles
- Smooth animations and transitions
- Responsive layout adjustments

### **Input Bar**
- ChatGPT-style design
- Keyboard shortcuts (Ctrl+Enter)
- Loading states and error handling

---

## 🌟 Key Features

### **Smart Language Detection**
- Automatically detects Java, Python, JavaScript, C++, and more
- Applies appropriate syntax highlighting
- Optimizes AI prompts for specific languages

### **Intelligent Fallback System**
- If AI response isn't perfect, adds basic comments automatically
- Preserves code structure for syntax highlighting
- Ensures users always get commented code

### **Professional Commenting**
- Context-aware comment generation
- Explains functions, variables, and logic
- Highlights best practices and programming concepts

---

## 🔮 Future Enhancements

- **Chat History**: Persistent storage of code analysis sessions
- **Export Options**: Save results as Markdown, PDF, or code files
- **Batch Processing**: Analyze multiple code files simultaneously
- **Custom Models**: Support for different Ollama models
- **Collaboration**: Share and discuss code explanations with teams
- **Learning Paths**: Structured tutorials based on code analysis

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenXAI Global AI Accelerator** for the opportunity
- **Ollama** for providing local AI model deployment
- **Next.js team** for the excellent framework
- **shadcn/ui** for beautiful UI components
- **Framer Motion** for smooth animations
- **Bolt.new** for providing the necessary codes

---

## 📞 Support

If you encounter any issues or have questions:
- Check the [Issues](https://github.com/TopNotch3/India-Accelerator-OpenXAI-2025) page
- Create a new issue with detailed description
- Ensure Ollama is running and `llama3:latest` is available

---

**Built with ❤️ for the OpenXAI Global AI Accelerator 2025**
