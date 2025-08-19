{
  description = "Nextjs + Ollama app that runs on OpenxAI!";

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
      # A helper that helps us define the attributes below for
      # all systems we care about.
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
            pkgs.writeShellScriptBin "run-nextjs-ollama-template" ''
              MODEL=$(cat ./ollama-model.txt)

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
