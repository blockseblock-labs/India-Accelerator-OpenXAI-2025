# 🔥 John's HOT or NOT App 🔥

A fun Next.js app that uses Ollama with LLaVA to analyze images and tell you if they're HOT or NOT! Built to be deployable both locally and on NixOS infrastructure.

## Features

- 🖼️ Upload any image file (PNG, JPG, GIF)
- 🤖 AI-powered analysis using LLaVA model
- 🔥 Instant HOT or NOT verdict with descriptions
- 📱 Beautiful red-themed UI
- ⚡ Real-time image preview
- 🚀 Deployable with Nix for production

## Prerequisites

- Node.js 18+ installed
- Ollama installed and running locally
- LLaVA model downloaded in Ollama

## Quick Start (Development)

### Option 1: Traditional npm development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install LLaVA model in Ollama:**
   ```bash
   ollama pull llava:latest
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Option 2: Nix development

1. **From the app directory, run:**
   ```bash
   nix run
   ```

This will automatically:
- Start Ollama server
- Pull the LLaVA model
- Build and run the Next.js app

## How to Use

1. Click the upload area to select an image
2. Preview your image
3. Click "🔥 Analyze Image 🔥" 
4. Get your HOT or NOT verdict with a description!

## API Endpoint

The app uses `/api/analyze` endpoint that:
- Accepts image uploads via FormData
- Converts images to base64
- Sends to LLaVA model via Ollama
- Returns HOT or NOT verdict with description

## Deployment

### Local Production Build

```bash
npm run build
npm run start
```

### NixOS Deployment

1. **Add the NixOS module to your configuration:**
   ```nix
   { config, lib, pkgs, ... }:
   
   {
     imports = [
       ./template-app-VISION-TRACK-hot-or-not/nix/nixos-module.nix
     ];
   
     services.template-app-vision-track-hot-or-not = {
       enable = true;
       port = 3000;
       host = "0.0.0.0";
     };
   }
   ```

2. **Rebuild your NixOS system:**
   ```bash
   sudo nixos-rebuild switch
   ```

## Technologies Used

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **AI:** Ollama with LLaVA model
- **Image Processing:** Base64 encoding
- **Deployment:** Nix, NixOS modules, standalone Next.js

## Project Structure

```
template-app-VISION-TRACK-hot-or-not/
├── src/
│   └── app/
│       ├── api/
│       │   └── analyze/
│       │       └── route.ts    # Image analysis API
│       └── page.tsx            # Main UI
├── nix/
│   ├── package.nix             # Nix package definition
│   └── nixos-module.nix        # NixOS service module
├── flake.nix                   # Nix flake configuration
├── next.config.ts              # Next.js configuration
└── README.md                   # This file
```

## Troubleshooting

### Common Issues

1. **"MODEL not set" error:**
   - Make sure Ollama is running: `ollama serve`
   - Ensure LLaVA model is installed: `ollama list`

2. **Image analysis fails:**
   - Check that LLaVA model is downloaded: `ollama pull llava:latest`
   - Verify image format is supported (PNG, JPG, GIF)

3. **Nix build fails:**
   - Ensure you have Nix installed and flakes enabled
   - Try: `nix flake update`

### Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

**Enjoy analyzing images! 🔥**
