ENV Future 🌍
OpenxAI Global AI Accelerator - ENVIRO-TRACK Submission
Project Overview
ENV Future is an interactive, AI-powered climate and energy simulator that brings global environmental actions to life. Users input real household energy needs, green solutions, or climate-impact ideas in natural language. The system’s advanced AI engine analyzes each scenario in real time, performing realistic environmental calculations. It instantly updates both a live, 3D globe and a comprehensive metrics dashboard to visually demonstrate the planetary effects—from CO₂ emissions to population and climate stats. The platform also provides actionable solar energy recommendations, component sizing, flowcharts, payback analysis, and downloadable reports.


🌟 Features
3D Interactive Globe: Explore environmental changes visually with real-time, immersive 3D graphics (Three.js, React Three Fiber).

AI-Driven Simulation: Enter ideas like “My home uses 10kWh per day...” and receive in-depth analysis and actionable recommendations, powered by deepseek-r1:8b via Ollama.

Live Metrics Panel: Dynamic, intuitive dashboard displaying CO₂ level, toxicity, global temperature, population stats, ocean acidity, and ice cap melting.

Solar Solution & Payback Analysis: Instantly receive solar system sizing, components, installation flow, environmental benefits, and payback period.

PDF Export: Download all analysis and recommendations as a formatted PDF report.

Command History: View a timeline of your recent simulations and analyses.

Educational Utility: Helps users understand the chain-reaction consequences of climate actions and solutions through natural language.

Full Reset: Instantly restore Earth’s health for comparative simulations.

🛠️ Tech Stack
Frontend: Next.js 14, TypeScript

3D Graphics: Three.js, React Three Fiber

AI Integration: Ollama (deepseek-r1:8b)

Styling: Tailwind CSS

Icons: Lucide React

Animations: Framer Motion

PDF: jsPDF, jspdf-autotable

DevOps: Nix for stable, reproducible builds

🚀 Quick Start
Prerequisites
Node.js 18+

Ollama (for AI analysis)

Git

Installation
bash
cd AI-CLIMATE-SIMULATOR/nextjs-app
npm install
Start Ollama
bash
# Install Ollama (if not already)
curl -fsSL https://ollama.ai/install.sh | sh

# Pull the model
ollama pull deepseek-r1:8b
Start Development Server
bash
npm run dev
Open Your Browser
Go to http://localhost:3000

🎮 How to Use
1. Enter Your Scenario
Use the input panel to specify energy needs or pollution/solution ideas (example: “My home uses 10kWh per day...”).

Submit your query.

2. AI Analysis
The deepseek-r1:8b model processes and simulates your scenario.

All environmental metrics and the AI’s recommendation are instantly updated and visualized.

3. Explore & Export
Scroll through detailed results and component recommendations in the Metrics Panel.

Download a full PDF summary.

Use Command History to quickly review your recent simulations.

Hit "Reset All" to clear and start a new scenario.

📊 Real-Time Metrics
The following indicators update live with your actions:

CO₂ Level (ppm)

Toxicity Level (%)

Temperature (°C)

Human Population

Animal Population

Plant Population

Ocean Acidity (pH)

Ice Cap Melting (%)

🤖 AI Integration
Uses Ollama and the deepseek-r1:8b model to:

Parse natural-language requests for energy and environmental actions.

Calculate and recommend solar system requirements, battery size, inverter need, CO₂ savings, and payback period.

Update Earth model and metrics with environmental cause and effect.

🎨 Customization
Adding New Actions or Metrics
Prompts & Calculation: Edit the logic in app/api/process-command/route.ts.

UI Display: Add or adjust displays in components/MetricsPanel.tsx.

3D Visualization: Change globe effects in components/Globe.tsx.

Styling: Modify app/globals.css.

Tweaking AI/Models
Adjust initial prompts in app/api/process-command/route.ts.

Change Ollama’s model in ollama-model.txt.

📦 Project Structure
text
AI-CLIMATE-SIMULATOR/
├── nextjs-app/
│   ├── app/
│   │   ├── api/
│   │   │   └── process-command/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Globe.tsx
│   │   └── MetricsPanel.tsx
│   ├── nix/
│   │   ├── package.nix
│   │   └── nixos-module.nix
│   ├── flake.nix
│   ├── ollama-model.txt
│   └── package.json
Scripts
npm run dev  — Start development server

npm run build — Production build

npm run start — Start production server

npm run lint  — Lint code

Nix
nix build    — Build project

nix run      — Run app with Ollama model

nix develop  — Enter reproducible dev environment

📚 Educational Value
Demonstrates interconnected systems: how human activity, energy needs, or environmental solutions impact global health.

Makes cause and effect relationships tangible.

Provides instant, visual feedback for learning and experimentation.

Leverages AI for deep, realistic environmental reasoning.

🤝 Contributing
Fork the repository.

Create a new feature branch.

Make your changes and test thoroughly.

Submit a pull request.

📄 License
This project is part of the OpenxAI Global AI Accelerator.