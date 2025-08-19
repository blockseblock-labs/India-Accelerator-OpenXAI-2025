#!/bin/bash

echo "🚀 Installing dependencies for all template apps..."
echo ""

# Array of template directories
TEMPLATES=(
    "template-app-GAMEJAM-TRACK/nextjs-app"
    "template-app-SOUNDWAVE-TRACK/nextjs-app"
    "template-app-TEXTSTREAM-TRACK/nextjs-app"
    "template-app-VISION-TRACK/nextjs-app"
)

# Function to install dependencies for a template
install_template() {
    local template_dir=$1
    local template_name=$(echo $template_dir | cut -d'/' -f1 | sed 's/template-app-//')
    
    echo "📦 Installing $template_name template..."
    
    if [ -d "$template_dir" ]; then
        cd "$template_dir"
        
        if [ -f "package.json" ]; then
            npm install
            if [ $? -eq 0 ]; then
                echo "✅ $template_name template installed successfully!"
            else
                echo "❌ Failed to install $template_name template"
            fi
        else
            echo "⚠️  No package.json found in $template_dir"
        fi
        
        cd - > /dev/null
    else
        echo "⚠️  Directory $template_dir not found"
    fi
    
    echo ""
}

# Install dependencies for each template
for template in "${TEMPLATES[@]}"; do
    install_template "$template"
done

echo "🎉 Installation complete!"
echo ""
echo "To run a specific template:"
echo "  cd template-app-[TRACK-NAME]/nextjs-app"
echo "  npm run dev"
echo ""
echo "Available templates:"
echo "  🎮 GAMEJAM-TRACK    - Game development template"
echo "  🎵 SOUNDWAVE-TRACK  - Audio and voice template"
echo "  💬 TEXTSTREAM-TRACK - Chat and text streaming template"
echo "  👁️  VISION-TRACK     - Computer vision template" 