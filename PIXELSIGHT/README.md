# 👁️ Vision Template

A Next.js template for building computer vision applications with AI-powered image analysis! This template provides image upload, analysis, and visualization capabilities with a modern interface.

## Features

- **Image Upload**: Drag-and-drop file upload with preview
- **AI Analysis**: Built-in API endpoint for image analysis
- **Visual Feedback**: Loading states and analysis results
- **File Support**: PNG, JPG, and JPEG formats
- **Modern UI**: Beautiful gradient background with glassmorphism effects
- **Responsive Design**: Works on desktop and mobile devices

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
│   │   └── analyze-image/
│   │       └── route.ts          # Image analysis API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main vision app page
├── package.json                  # Dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## 🖼️ Vision Features

The template includes:

- **File Upload**: Drag-and-drop interface with file validation
- **Image Preview**: Instant preview of uploaded images
- **AI Analysis**: API endpoint for computer vision processing
- **Results Display**: Formatted analysis results presentation
- **Error Handling**: Graceful error states and recovery

### Image Upload Component

The upload interface provides:

1. **Drag & Drop**: Easy file selection with visual feedback
2. **File Validation**: Accepts PNG, JPG, and JPEG formats
3. **Image Preview**: Shows uploaded image before analysis
4. **Analysis Button**: Triggers AI processing

## 🤖 AI Integration

The template includes an image analysis API endpoint at `/api/analyze-image` for:

- Object detection and recognition
- Scene understanding
- Content description
- Visual feature extraction
- Custom vision tasks

### Analysis Workflow

1. **Upload Image**: User selects image file
2. **Preview Display**: Image shown in upload area
3. **Trigger Analysis**: Click "Analyze Image" button
4. **Processing**: Loading state during analysis
5. **Results**: Formatted analysis results display

## 🎨 Customization

- Modify upload styling in `page.tsx`
- Adjust image processing in API route
- Add support for additional file formats
- Extend analysis results formatting
- Integrate with computer vision APIs

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🛠️ Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **File API** - Browser file handling
- **FileReader API** - Image preview
- **Lucide React** - Beautiful icons

## 🔧 Image Configuration

The uploader supports:
- File types: PNG, JPG, JPEG
- Size limits: Browser/server configurable
- Preview: Base64 encoding for display
- Analysis: JSON response format

## 🖥️ Usage Examples

### Basic Image Analysis
```typescript
const response = await fetch('/api/analyze-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: base64Image }),
})
```

### Custom Analysis Results
Extend the analysis results display with:
- Confidence scores
- Bounding boxes
- Category classifications
- Custom visualizations

Build amazing computer vision applications! 👁️ 