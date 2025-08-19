# Next.js Ollama Template

A starter template to build UI powered by [Ollama](https://ollama.com/) models, running on OpenxAI (or any NixOS-based infra).  
This repo helps you quickly scaffold a conversational AI frontend with a Next.js app connected to an Ollama backend.

---
# 🚀 Features

- Next.js frontend with a ChatGPT-inspired interface
- Backend powered by Ollama (choose any model from the Ollama library)
- Runs on OpenxAI / NixOS infrastructure
- Easy local development with `npm run dev`

---

## 🛠️ Setup & Modification Steps

1. **Rename Project**  
   Replace all instances of `nextjs-ollama-template` with your own project name.  
   _(Project name must be unique per Xnode.)_

2. **Pick Your Model**  
   Open [ollama-model.txt](./ollama-model.txt) and add the model identifier you want to use.  
   👉 Browse available models here: https://ollama.com/library

3. **Build the App**  
   Start customizing your Next.js UI. The default styling is clean and minimal — feel free to adjust to match your needs.

4. **Deploy**  
   Once it runs with `nix run`, push to GitHub.  
   Example repo URL:  

In Next.js app folder (nextjs-app)

npm install
npm run dev     # start dev server
npm run build   # production build
npm run start   # start production server