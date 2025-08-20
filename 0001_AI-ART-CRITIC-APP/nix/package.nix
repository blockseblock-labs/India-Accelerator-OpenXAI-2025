{ lib
, stdenv
, nodejs
, nodePackages
, fetchFromGitHub
, writeShellScriptBin
}:

let
  nodejsVersion = "20";
  nodeEnv = nodePackages.nodejs-20_x;
  buildInputs = [
    nodeEnv
    nodePackages.npm
  ];
in stdenv.mkDerivation {
  pname = "ai-art-critic-app";
  version = "1.0.0";

  src = ./.;

  buildInputs = buildInputs;
  buildPhase = ''
    npm ci --production=false
    npm run build
  '';
  installPhase = ''
    mkdir -p $out/bin
    
    cp -r .next $out/
    cp -r public $out/
    cp -r src $out/
    cp package.json $out/
    cp next.config.ts $out/
    cp tsconfig.json $out/
    
    cat > $out/bin/nextjs-app <<EOF
    #!${stdenv.shell}
    cd $out
    export PATH="${lib.makeBinPath buildInputs}:\$PATH"
    exec ${nodeEnv}/bin/node $out/.next/standalone/server.js
    EOF
    
    chmod +x $out/bin/nextjs-app
  '';
  meta = with lib; {
    description = "AI Art Critic App - Next.js + Ollama image analysis";
    homepage = "https://github.com/your-username/ai-art-critic-app";
    license = licenses.mit;
    platforms = platforms.all;
  };
}