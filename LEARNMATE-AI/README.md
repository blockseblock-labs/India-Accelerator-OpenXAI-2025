# 🚀 LEARNMATE.AI - Neural Network Learning System

A cutting-edge Next.js application featuring a retro cyberpunk interface for AI-powered educational tools! This template provides three powerful learning systems: Flashcard Generator, Quiz Creator, and AI Study Assistant.

## 🎮 Features

### 🃏 Flashcard Generator
- **Neural Memory Cards**: Paste your study material and AI creates interactive flashcards
- **3D Flip Animation**: Smooth card flipping with retro styling
- **Bulk Generation**: Create multiple flashcards from large text blocks
- **Progress Tracking**: Navigate through your flashcard deck

### 📝 Quiz Creator  
- **AI-Powered Quiz Generation**: Paste text and get a complete knowledge test
- **Multiple Choice Interface**: AI generates questions with multiple choice answers
- **Real-time Feedback**: Get immediate results with detailed explanations
- **Score Analytics**: Track your performance with accuracy percentages

### 🤖 AI Study Assistant
- **Neural Network Partner**: Ask any question and get advanced AI explanations
- **Interactive Learning**: Follow-up questions and clarifications
- **Subject Agnostic**: Works for any topic or subject matter
- **Chat History**: Maintain conversation context for better learning

## 🎨 Design Features

- **Retro Cyberpunk Interface**: Black, red, and grey color scheme
- **Orbitron & Rajdhani Fonts**: Futuristic typography for enhanced UX
- **Animated Elements**: Glitch effects, scanlines, and smooth transitions
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark Theme**: Easy on the eyes for extended study sessions

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

4. Open [http://localhost:3000](http://localhost:3000) with your browser to experience the neural network learning system.

## 📁 Project Structure

```
nextjs-app/
├── app/
│   ├── api/
│   │   ├── flashcards/
│   │   │   └── route.ts          # Flashcard generation endpoint
│   │   ├── quiz/
│   │   │   └── route.ts          # Quiz generation endpoint
│   │   └── study-buddy/
│   │       └── route.ts          # AI study assistant endpoint
│   ├── globals.css               # Retro cyberpunk styles
│   ├── layout.tsx                # Root layout with Rajdhani font
│   └── page.tsx                  # Main interface with all features
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🎯 How to Use

### Flashcard Generator
1. Click on the "FLASHCARDS" tab
2. Paste your study material in the text area
3. Click "GENERATE FLASHCARDS" 
4. Review and flip through your generated memory cards

### Quiz Creator
1. Select the "QUIZ" tab
2. Paste the text you want to be tested on
3. Click "CREATE QUIZ"
4. Answer the multiple choice questions and get instant feedback

### AI Study Assistant
1. Go to the "AI CHAT" tab
2. Type any question you have about your subject
3. Get detailed explanations and ask follow-up questions

## 🤖 AI Model

This template uses Ollama with the `llama3.2:1b` model for all AI operations. Make sure you have Ollama installed and the model downloaded:

```bash
ollama pull llama3.2:1b
```

## 🎨 Customization

- Modify the retro interface in `app/page.tsx`
- Adjust AI prompts in the API routes
- Customize cyberpunk styling in `app/globals.css`
- Add more features by creating new API endpoints
- Change color schemes by modifying CSS variables

## 🛠 Dependencies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Ollama**: Local AI model integration
- **Google Fonts**: Orbitron & Rajdhani for retro typography

## 📖 Educational Use Cases

- **Students**: Create study materials from lecture notes with neural network assistance
- **Teachers**: Generate quizzes and learning aids with AI-powered analysis
- **Self-learners**: Get advanced AI tutoring on any topic
- **Exam Prep**: Practice with generated questions and interactive flashcards
- **Research**: Use AI assistant for complex topic explanations

## 🌟 Unique Features

- **Retro Aesthetic**: Cyberpunk-inspired design for a unique learning experience
- **Advanced Animations**: Smooth transitions and interactive elements
- **Neural Network Branding**: Futuristic interface that matches AI capabilities
- **Responsive Grid**: Background grid effect for enhanced visual appeal
- **Loading States**: Custom retro loading animations