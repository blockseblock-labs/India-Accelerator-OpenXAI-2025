{
  config,
  pkgs,
  lib,
  ...
}:
let
  cfg = config.services.dead-earth-project;
  dead-earth-project = pkgs.callPackage ./package.nix { };
in
{
  options = {
    services.dead-earth-project = {
      enable = lib.mkEnableOption "Enable the nextjs app";

      hostname = lib.mkOption {
        type = lib.types.str;
        default = "0.0.0.0";
        example = "127.0.0.1";
        description = ''
          The hostname under which the app should be accessible.
        '';
      };

      port = lib.mkOption {
        type = lib.types.port;
        default = 3000;
        example = 3000;
        description = ''
          The port under which the app should be accessible.
        '';
      };

      openFirewall = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = ''
          Whether to open ports in the firewall for this application.
        '';
      };
    };
  };

  config =
    let
      model = builtins.readFile ./../ollama-model.txt;
    in
    lib.mkIf cfg.enable {
      users.groups.dead-earth-project = { };
      users.users.dead-earth-project = {
        isSystemUser = true;
        group = "dead-earth-project";
      };

      systemd.services.dead-earth-project = {
        wantedBy = [ "multi-user.target" ];
        description = "Nextjs App.";
        after = [ "network.target" ];
        environment = {
          HOSTNAME = cfg.hostname;
          PORT = toString cfg.port;
          MODEL = model;
        };
        serviceConfig = {
          ExecStart = "${lib.getExe dead-earth-project}";
          User = "dead-earth-project";
          Group = "dead-earth-project";
          CacheDirectory = "nextjs-app";
        };
      };

      networking.firewall = lib.mkIf cfg.openFirewall {
        allowedTCPPorts = [ cfg.port ];
      };

      # Enable ollama with requested model loaded. Accessible in your app on http://localhost:11434 (but not exposed to outside environment).
      nixpkgs.config.allowUnfree = true;

      systemd.services.ollama.serviceConfig.DynamicUser = lib.mkForce false;
      systemd.services.ollama.serviceConfig.ProtectHome = lib.mkForce false;
      systemd.services.ollama.serviceConfig.StateDirectory = [ "ollama/models" ];
      services.ollama = {
        enable = true;
        user = "ollama";
        loadModels = [ model ];
      };
      systemd.services.ollama-model-loader.serviceConfig.User = "ollama";
      systemd.services.ollama-model-loader.serviceConfig.Group = "ollama";
      systemd.services.ollama-model-loader.serviceConfig.DynamicUser = lib.mkForce false;
    };
}
