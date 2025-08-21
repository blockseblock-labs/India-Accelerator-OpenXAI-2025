{ lib
, stdenv
, nodejs
, nodePackages
, fetchFromGitHub
, writeShellScriptBin
}:

let
  # Node.js version
  nodejsVersion = "20";

  # Create a Node.js environment with the required packages
  nodeEnv = nodePackages.nodejs-20_x;

  # Build the Next.js app
  buildInputs = [
    nodeEnv
    nodePackages.npm
  ];

  # Create a shell script to run the development server
  devScript = writeShellScriptBin "dev" ''
    cd ${toString ./.}
    npm run dev
  '';

  # Create a shell script to build the app
  buildScript = writeShellScriptBin "build" ''
    cd ${toString ./.}
    npm run build
  '';

  # Create a shell script to start the production server
  startScript = writeShellScriptBin "start" ''
    cd ${toString ./.}
    npm run start
  '';

in stdenv.mkDerivation {
  pname = "template-app-vision-track-hot-or-not";
  version = "1.0.0";

  src = ./.;

  buildInputs = buildInputs;

  buildPhase = ''
    # Install dependencies
    npm ci --production=false
    
    # Build the Next.js app
    npm run build
  '';

  installPhase = ''
    # Create bin directory
    mkdir -p $out/bin
    
    # Copy the built app
    cp -r .next $out/
    cp -r public $out/
    cp -r src $out/
    cp package.json $out/
    cp next.config.ts $out/
    cp tsconfig.json $out/
    
    # Create a wrapper script to run the app
    cat > $out/bin/nextjs-app <<EOF
    #!${stdenv.shell}
    cd $out
    export PATH="${lib.makeBinPath buildInputs}:\$PATH"
    exec ${nodeEnv}/bin/node $out/.next/standalone/server.js
    EOF
    
    chmod +x $out/bin/nextjs-app
    
    # Create development script
    ln -s ${devScript}/bin/dev $out/bin/dev
    
    # Create build script
    ln -s ${buildScript}/bin/build $out/bin/build
    
    # Create start script
    ln -s ${startScript}/bin/start $out/bin/start
  '';

  meta = with lib; {
    description = "John's HOT or NOT app - Next.js + Ollama image analysis";
    homepage = "https://github.com/your-username/template-app-vision-track-hot-or-not";
    license = licenses.mit;
    platforms = platforms.all;
  };
} 