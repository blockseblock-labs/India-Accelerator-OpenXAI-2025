# 💬 Social Network Template

A Next.js template for building social media AI applications! This template provides three powerful social tools: Caption Generator, Mood Checker, and Hashtag Suggestor.

## Features

### 📸 Caption Generator
- **Instagram-Ready Captions**: Upload any image and get creative captions
- **AI-Powered**: Smart captions that match your image content
- **Copy & Share**: One-click copying for easy social sharing

### 😊 Mood Checker  
- **Sentiment Analysis**: Paste any text and get mood analysis
- **Emoji Feedback**: Visual representation of detected emotions
- **Social Insights**: Perfect for monitoring social media content

### #️⃣ Hashtag Suggestor
- **Trending Tags**: Get relevant hashtags for your content
- **Smart Suggestions**: AI recommends the best hashtags for reach
- **Copy Ready**: Formatted hashtags ready to paste

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
│   │   ├── caption-generator/
│   │   │   └── route.ts          # Image caption generation
│   │   ├── mood-checker/
│   │   │   └── route.ts          # Text sentiment analysis
│   │   └── hashtag-suggestor/
│   │       └── route.ts          # Hashtag recommendations
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main interface with all features
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🎯 How to Use

### Caption Generator
1. Click on the "Caption Generator" tab
2. Upload an image or paste an image URL
3. Click "Generate Caption"
4. Copy your AI-generated caption for social media

### Mood Checker
1. Select the "Mood Checker" tab
2. Paste a tweet, comment, or any text
3. Click "Check Mood"
4. See the detected emotion with visual feedback

### Hashtag Suggestor
1. Go to the "Hashtag Suggestor" tab
2. Type keywords about your post content
3. Click "Suggest Hashtags"
4. Copy the recommended hashtags

## 🤖 AI Model

This template uses Ollama with the `llama3.2:1b` model for all AI operations. Make sure you have Ollama installed and the model downloaded:

```bash
ollama pull llama3.2:1b
```

## 🎨 Customization

- Modify the UI in `app/page.tsx`
- Adjust AI prompts in the API routes
- Customize styling in `app/globals.css`
- Add more social features by creating new API endpoints

## 🛠 Dependencies

- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Ollama**: Local AI model integration

## 📱 Social Media Use Cases

- **Content Creators**: Generate captions and hashtags
- **Social Media Managers**: Analyze post sentiment
- **Influencers**: Optimize content for engagement
- **Brands**: Maintain consistent social voice
- **Community Managers**: Monitor mood and sentiment 