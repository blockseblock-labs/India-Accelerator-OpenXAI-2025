# AI Prompt Playground (Next.js + Ollama Streaming)

“AI Prompt Playground is a simple but powerful streaming-based playground built with Next.js and Ollama (Llama3). It allows users to test different prompt styles—including summarization, translation, and story generation—in real time. Ideal for learning prompt engineering and building LLM-powered applications.”

A real-time AI playground built with **Next.js** and **Ollama 3 (Llama3 model)**.  
The goal of this project is to practice prompt engineering by testing different prompt styles and streaming the responses to the UI.

---

## ✨ Features

- ⚡️ Streaming response (token-by-token)
- 🧠 Four prompt modes:
  - Summarize text
  - Translate to Hindi
  - Explain in simple language
  - Story generation
- 🧹  Clean plain-text output (no markdown)
- 💻 Fully local (uses Ollama running on `localhost:11434`)

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install


### 2. Pull and run the model in Ollama
ollama pull llama3
ollama serve

### 3. Start the Next.js app
npm run dev


➡ Open http://localhost:3000

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