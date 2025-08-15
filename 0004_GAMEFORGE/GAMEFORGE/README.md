# 🎮 Game Jam Template

A Next.js template for building amazing games! This template provides a canvas-based game interface with modern styling and ready-to-use components.

## Features

- **Canvas Game Area**: Ready-to-use HTML5 canvas for game development
- **Game Controls**: Start and reset buttons with hover effects
- **Modern UI**: Beautiful gradient background with glassmorphism effects
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full TypeScript support for better development experience

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
│   │   └── character-chat/
│   │       └── route.ts          # AI character chat endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main game page
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🎯 Game Development

The template includes:

- **Game Canvas**: A 400x300 canvas element ready for game graphics
- **AI Character Chat**: Built-in API endpoint for character interactions
- **Game State Management**: Ready to extend with your game logic

### Adding Game Logic

1. Add your game loop in the `page.tsx` component
2. Use the canvas element with id `gameCanvas`
3. Implement your game mechanics using the provided button handlers

## 🤖 AI Integration

The template includes a character chat API endpoint at `/api/character-chat` that you can use for:

- NPC conversations
- Game narration
- Dynamic storytelling
- Player assistance

## 🎨 Customization

- Modify colors and gradients in `globals.css`
- Adjust canvas size in `page.tsx`
- Add new game components as needed
- Extend the AI chat functionality

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Canvas API** - 2D graphics
- **AI Chat API** - Character interactions

Ready to build your next amazing game! 🚀 