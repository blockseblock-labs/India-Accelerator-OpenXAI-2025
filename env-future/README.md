# ENV Future 🌍

## OpenxAI Global AI Accelerator - ENVIRO-TRACK Submission

### Project Overview
**Dead-Earth** is an AI-powered 3D globe simulation that demonstrates the effects of pollution and climate change. Users submit natural language ideas or commands, and the AI calculates realistic environmental impacts, updating Earth's metrics in real-time.

### 🌟 Features
- **3D Interactive Globe**: Immersive visualization using Three.js and React Three Fiber
- **AI-Controlled Simulation**: Natural language ideas processed by deepseek-r1:8b via Ollama
- **Realistic Environmental Calculations**: AI computes CO₂, toxicity, temperature, and population changes
- **Live Metrics Panel**: Displays CO₂, toxicity, temperature, population, ocean acidity, and ice cap melting
- **PDF Export**: Download analysis and metrics as a PDF report
- **Command History**: Track all environmental actions and their impacts
- **Educational Impact**: Visual demonstration of climate change effects
- **Reset Functionality**: Restore Earth to healthy state

### 🛠️ Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **3D Graphics**: Three.js with React Three Fiber
- **AI Integration**: Ollama (deepseek-r1:8b model)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **PDF Export**: jsPDF
- **Deployment**: Nix for reproducible builds

### 🚀 Quick Start

#### Prerequisites
- Node.js 18+
- Ollama (for AI analysis)
- Git

#### Installation

1. **Install Dependencies**
   ```bash
   cd AI-CLIMATE-SIMULATOR/nextjs-app
   npm install
   ```

2. **Start Ollama**
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ollama pull deepseek-r1:8b
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🎮 How to Use

#### Submit Your Idea
- Enter your energy or pollution solution in the Metrics Panel.
- Click **Submit** to analyze its environmental impact.

#### AI Analysis Process
1. **Idea Input**: Type your solution or environmental action
2. **AI Calculation**: deepseek-r1:8b analyzes the impact
3. **Real-time Effects**: Metrics and globe visualization update instantly
4. **Population Changes**: See human, animal, and plant populations affected
5. **PDF Export**: Download the result and analysis

#### Real-time Metrics
Metrics update live:
- **CO₂ Level** (ppm)
- **Toxicity Level** (%)
- **Temperature** (°C)
- **Human Population**
- **Animal Population**
- **Plant Population**
- **Ocean Acidity** (pH)
- **Ice Cap Melting** (%)

### 🤖 AI Integration

The project uses **Ollama** with the **deepseek-r1:8b** model for environmental impact analysis. The AI:
- Parses natural language ideas and commands
- Calculates realistic effects on all metrics
- Controls simulation and provides detailed analysis

### 🎨 Customization

#### Adding New Command Types
1. Edit the prompt in [`app/api/process-command/route.ts`](nextjs-app/app/api/process-command/route.ts)
2. Adjust effect calculations and validation logic
3. Update the UI in [`components/MetricsPanel.tsx`](nextjs-app/components/MetricsPanel.tsx) for new metrics

#### Modifying Visual Effects
- Edit [`components/Globe.tsx`](nextjs-app/components/Globe.tsx) for 3D changes
- Update [`components/MetricsPanel.tsx`](nextjs-app/components/MetricsPanel.tsx) for UI changes
- Modify [`app/globals.css`](nextjs-app/app/globals.css) for styling

#### AI Analysis Customization
- Change the prompt in [`app/api/process-command/route.ts`](nextjs-app/app/api/process-command/route.ts)
- Update the model in [`ollama-model.txt`](AI-CLIMATE-SIMULATOR/ollama-model.txt)
- Adjust effect validation and ranges

### 📊 Educational Impact

This project demonstrates:
- **Cause and Effect**: How human actions affect environmental systems
- **Interconnected Systems**: Climate, population, and environment relationships
- **Visual Learning**: Abstract concepts made tangible through 3D visualization
- **Immediate Feedback**: Real-time consequences of environmental actions
- **AI Insights**: Intelligent analysis of complex environmental impacts
- **Natural Language**: Intuitive interaction with environmental simulation

### 🔧 Development

#### Project Structure
```
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
```

#### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

#### Nix Commands
- `nix build`: Build the project
- `nix run`: Run the project with Ollama
- `nix develop`: Enter development environment

### 🌍 Environmental Impact

This project raises awareness about climate change through AI-powered interactive visualization, making complex environmental concepts tangible and impactful via natural language interaction.

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### 📄 License

This project is part of the OpenxAI Global AI Accelerator.

---

*"The best time to plant a tree was 20 years ago. The second best time is now."*

**🌍 Dead-Earth Project - AI-Controlled Climate Change Simulation**