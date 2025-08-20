{
  description = "An AI Art Critic app - Next.js + Ollama image analysis!";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };
  outputs =
    {
      self,
      nixpkgs,
      systems,
    }:
    let
      eachSystem =
        f:
        nixpkgs.lib.genAttrs (import systems) (
          system:
          f {
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
          }
        );
    in
    {
      packages = eachSystem (
        { pkgs, ... }:
        let
          package = pkgs.callPackage ./nix/package.nix { };
        in
        {
          default =
            let
              nextjs = pkgs.lib.getExe package;
              ollama = pkgs.lib.getExe pkgs.ollama;
            in
            pkgs.writeShellScriptBin "run-ai-art-critic" ''
              MODEL="llava:latest"
              ${ollama} serve &
              OLLAMA_PID=$!
              sleep 0.1
              ${ollama} pull $MODEL
              export MODEL
              ${nextjs}
              kill $OLLAMA_PID || true
            '';
          nextjs = package;
          ollama = pkgs.ollama;
        }
      );
      nixosModules.default = ./nix/nixos-module.nix;
    };
}