# Dead-Earth Project 🌍

## OpenxAI Global AI Accelerator - ENVIRO-TRACK Submission

### Project Overview
**Dead-Earth** is an AI-controlled 3D globe simulation that demonstrates the devastating effects of pollution and climate change on our planet. Users give natural language commands to the AI, which calculates realistic environmental impacts and controls the Earth's health in real-time.

### 🌟 Features
- **3D Interactive Globe**: Built with Three.js for immersive visualization
- **AI-Controlled Simulation**: Natural language commands processed by deepseek-r1:8b
- **Realistic Environmental Calculations**: AI calculates CO2, toxicity, temperature, and population impacts
- **Live Environmental Metrics**:
  - CO2 levels (ppm)
  - Air toxicity levels
  - Global temperature changes
  - Population counters (humans, animals, plants)
  - Ocean acidification
  - Ice cap melting rates
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
- **Deployment**: Nix for reproducible builds

### 🚀 Quick Start

#### Prerequisites
- Node.js 18+ 
- Ollama (for AI analysis)
- Git

#### Installation

1. **Install Dependencies**
   ```bash
   cd demo-app-ENVIRO-TRACK
   npm install
   ```

2. **Start Ollama (Optional)**
   ```bash
   # Install Ollama if you haven't already
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the deepseek-r1:8b model
   ollama pull deepseek-r1:8b
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🎮 How to Use

#### Natural Language Commands
Instead of clicking buttons, type natural language commands like:
- **"Add 1 million V8 trucks to the world"**
- **"Build 1000 coal power plants"**
- **"Cut down the Amazon rainforest"**
- **"Release 50 million tons of CO2"**
- **"Start a global nuclear war"**
- **"Build 10,000 factories in China"**

#### AI Analysis Process
1. **Command Input**: Type your environmental action
2. **AI Calculation**: deepseek-r1:8b analyzes the impact
3. **Real-time Effects**: Watch the globe change color and metrics update
4. **Population Changes**: See human, animal, and plant populations affected
5. **Command History**: Track all actions and their consequences

#### Real-time Metrics
Watch as these metrics change in real-time:
- **CO₂ Levels**: Current atmospheric CO2 concentration
- **Air Toxicity**: Pollution levels affecting air quality
- **Global Temperature**: Average Earth temperature
- **Population Counts**: Humans, animals, and plants
- **Ocean pH**: Acidity levels affecting marine life
- **Ice Cap Melting**: Percentage of polar ice melted

### 🤖 AI Integration

The project uses **Ollama** with the **deepseek-r1:8b** model to provide intelligent environmental impact analysis. The AI:

1. **Parses Commands**: Understands natural language environmental actions
2. **Calculates Effects**: Determines realistic impacts on all metrics
3. **Controls Simulation**: Directly affects the 3D globe and metrics
4. **Provides Analysis**: Explains the environmental consequences

The AI considers:
- CO2 emissions and atmospheric effects
- Air pollution and toxicity
- Temperature changes and global warming
- Population impacts (health, mortality, extinction)
- Ocean acidification
- Ice cap melting
- Overall pollution levels

### 🎨 Customization

#### Adding New Command Types
1. Modify the prompt in `app/api/process-command/route.ts`
2. Adjust effect calculations and validation
3. Update the UI to handle new response formats

#### Modifying Visual Effects
- Edit `components/Globe.tsx` for 3D changes
- Modify `components/MetricsPanel.tsx` for UI updates
- Update `app/globals.css` for styling changes

#### AI Analysis Customization
- Modify the prompt in `app/api/process-command/route.ts`
- Change the model in `ollama-model.txt`
- Adjust effect validation and ranges

### 📊 Educational Impact

This project demonstrates:
- **Cause and Effect**: How human actions affect multiple environmental systems
- **Interconnected Systems**: Climate, population, and environment relationships
- **Visual Learning**: Abstract concepts made tangible through 3D visualization
- **Immediate Feedback**: Real-time consequences of environmental actions
- **AI Insights**: Intelligent analysis of complex environmental impacts
- **Natural Language**: Intuitive interaction with environmental simulation

### 🔧 Development

#### Project Structure
```
demo-app-ENVIRO-TRACK/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── process-command/ # AI command processing
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Globe.tsx          # 3D Earth component
│   └── MetricsPanel.tsx   # Metrics display
├── nix/                   # Nix configuration
│   ├── package.nix        # Package definition
│   └── nixos-module.nix   # NixOS module
├── flake.nix             # Nix flake
├── ollama-model.txt      # AI model specification
└── package.json          # Dependencies
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

This project aims to raise awareness about climate change through AI-powered interactive visualization, making complex environmental concepts tangible and impactful through natural language interaction.

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