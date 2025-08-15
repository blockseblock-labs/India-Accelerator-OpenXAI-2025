{
  inputs = {
    xnode-manager.url = "github:Openmesh-Network/xnode-manager/dev";
    nextjs-ollama-template.url = "path:..";
    nixpkgs.follows = "xnode-manager/nixpkgs";
  };

  nixConfig = {
    extra-substituters = [
      "https://openxai.cachix.org"
    ];
    extra-trusted-public-keys = [
      "openxai.cachix.org-1:3evd2khRVc/2NiGwVmypAF4VAklFmOpMuNs1K28bMQE="
    ];
  };

  outputs = inputs: {
    nixosConfigurations.container = inputs.nixpkgs.lib.nixosSystem {
      specialArgs = {
        inherit inputs;
      };
      modules = [
        inputs.xnode-manager.nixosModules.container
        {
          services.xnode-container.xnode-config = {
            host-platform = ./xnode-config/host-platform;
            state-version = ./xnode-config/state-version;
            hostname = ./xnode-config/hostname;
          };
        }
        inputs.nextjs-ollama-template.nixosModules.default
        {
          services.nextjs-ollama-template.enable = true;
        }
      ];
    };
  };
}
