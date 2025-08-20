{ config
, lib
, pkgs
, ...
}:

with lib;

let
  cfg = config.services.ai-art-critic-app;
  appPackage = pkgs.callPackage ./package.nix { };
in {
  options.services.ai-art-critic-app = {
    enable = mkEnableOption "AI Art Critic App";
    port = mkOption {
      type = types.port;
      default = 3000;
      description = "Port to run the app on";
    };
    host = mkOption {
      type = types.str;
      default = "127.0.0.1";
      description = "Host to bind the app to";
    };
    user = mkOption {
      type = types.str;
      default = "ai-art-critic-app";
      description = "User to run the app as";
    };
    group = mkOption {
      type = types.str;
      default = "ai-art-critic-app";
      description = "Group to run the app as";
    };
  };
  config = mkIf cfg.enable {
    users.users.${cfg.user} = {
      isSystemUser = true;
      group = cfg.group;
      description = "AI Art Critic app user";
    };
    
    users.groups.${cfg.group} = {};

    systemd.services.ai-art-critic-app = {
      description = "AI Art Critic App";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" ];
      serviceConfig = {
        Type = "simple";
        User = cfg.user;
        Group = cfg.group;
        WorkingDirectory = "${appPackage}";
        ExecStart = "${appPackage}/bin/nextjs-app";
        Restart = "always";
        RestartSec = "10";
        Environment = [
          "PORT=${toString cfg.port}"
          "HOST=${cfg.host}"
          "NODE_ENV=production"
        ];
        NoNewPrivileges = true;
        PrivateTmp = true;
        ProtectSystem = "strict";
        ProtectHome = true;
        ReadWritePaths = "/tmp";
      };
    };
  };
}