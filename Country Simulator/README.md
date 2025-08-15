# Country-Simulator Project 🌏

## OpenxAI Global AI Accelerator - GEO-TRACK Submission

### Project Overview
**Country-Simulator** is an AI-assisted 3D globe simulation that displays real-time country information. Users can explore the globe and hover over countries to instantly see details like country name, currency, and flag emoji. The project focuses on an interactive, visually rich way of learning about world geography — starting with the top 5 featured countries: India, USA, China, Russia, and Japan.

### 🌟 Features
- **3D Interactive Globe**: Built with Three.js for immersive visualization
- **Hover-based Country Info**: Displays key details on mouse hover
- **Highlight Animation**: Country outline glows when hovered
- **Educational Impact**:Makes learning geography visual and engaging
- **Reset View**: Snap globe back to the initial position
- **Command History**: Track all visited countries

### 🛠️ Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **3D Graphics**: Three.js with React Three Fiber
- **AI Integration**: Ollama (llama3.2:1b model)
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
   cd demo-app-GEO-TRACK
   npm install
   ```

2. **Start Ollama (Optional)**
   ```bash
   # Install Ollama if you haven't already
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull the llama3.2:1b model
   ollama pull llama3.2:1b
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🎮 How to Use

#### Hover to Explore
Move your mouse over the 3D globe and hover over one of the featured countries:
- **"India — Currency: Indian Rupee (INR)"**
- **"USA — Currency: United States Dollar (USD)"**
- **"China — Currency: Chinese Yuan (CNY)"**
- **"Japan — Currency: Japanese Yen (JPY)"**
- **"Russia — Currency: Russian Ruble (RUB)"**

#### Real-time Display
When you hover over a country:
1. **Highlight**: The country outline glows
2. **Popup Info**: Shows country name, currency, and flag emoji

### 🎨 Customization

#### Adding New Countries
1. Add coordinates and data in `components/Globe.tsx`
2. Update `components/CountryInfoPanel.tsx` for display

#### Modifying Visual Effects
- Edit `components/Globe.tsx` for 3D changes
- Modify `components/CountryInfoPanel.tsx` for UI updates
- Update `app/globals.css` for styling changes

### 📊 Educational Impact

This project demonstrates:
- **Interactive Geography**: Learn about countries in an engaging way
- **Instant Recognition**: Currency and flag emoji for quick association
- **Visual Learning**: Abstract concepts made tangible through 3D visualization

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
│   └── CountryInfoPanel.tsx  # Country info display
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
This project encourages curiosity about the world, combining geography, visual design, and interactive learning to create a fun way to explore global cultures and currencies.

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### 📄 License

This project is part of the OpenxAI Global AI Accelerator.

---

*"To know the world, start by hovering over it."*

**🌍 Country-Simulator Project - Interactive Country Information Globe** 