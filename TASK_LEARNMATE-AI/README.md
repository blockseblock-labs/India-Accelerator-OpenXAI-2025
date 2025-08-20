# 📚 LearnAI Template

A Next.js template for building educational AI applications! This template provides three powerful learning tools: Flashcard Maker, Quiz Generator, and Ask-Me Study Buddy.

## Features

### 🃏 Flashcard Maker
- **Smart Flashcards**: Paste your notes and AI creates interactive flashcards
- **Review Mode**: Flip cards to test your knowledge
- **Bulk Creation**: Generate multiple flashcards from large text blocks

### 📝 Quiz Maker  
- **Auto Quiz Generation**: Paste text and get a complete quiz
- **Multiple Choice**: AI generates questions with multiple choice answers
- **Instant Feedback**: Get immediate results and explanations

### 🤖 Ask-Me Study Buddy
- **AI Study Partner**: Ask any question and get helpful explanations
- **Interactive Learning**: Follow-up questions and clarifications
- **Subject Agnostic**: Works for any topic or subject

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
│   │   ├── flashcards/
│   │   │   └── route.ts          # Flashcard generation endpoint
│   │   ├── quiz/
│   │   │   └── route.ts          # Quiz generation endpoint
│   │   └── study-buddy/
│   │       └── route.ts          # Study buddy chat endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main interface with all features
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🎯 How to Use

### Flashcard Maker
1. Click on the "Flashcard Maker" tab
2. Paste your study notes in the text area
3. Click "Generate Flashcards" 
4. Review and flip through your generated flashcards

### Quiz Maker
1. Select the "Quiz Maker" tab
2. Paste the text you want to be quizzed on
3. Click "Create Quiz"
4. Answer the multiple choice questions and get instant feedback

### Study Buddy
1. Go to the "Study Buddy" tab
2. Type any question you have about your subject
3. Get detailed explanations and ask follow-up questions

## 🤖 AI Model

This template uses Ollama with the `llama3.2:1b` model for all AI operations. Make sure you have Ollama installed and the model downloaded:

```bash
ollama pull llama3.2:1b
```

## 🎨 Customization

- Modify the UI in `app/page.tsx`
- Adjust AI prompts in the API routes
- Customize styling in `app/globals.css`
- Add more features by creating new API endpoints

## 🛠 Dependencies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Ollama**: Local AI model integration

## 📖 Educational Use Cases

- **Students**: Create study materials from lecture notes
- **Teachers**: Generate quizzes and learning aids
- **Self-learners**: Get AI tutoring on any topic
- **Exam Prep**: Practice with generated questions and flashcards 