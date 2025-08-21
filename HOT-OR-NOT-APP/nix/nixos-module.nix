{ config
, lib
, pkgs
, ...
}:

with lib;

let
  cfg = config.services.template-app-vision-track-hot-or-not;
  
  # Import the package
  appPackage = pkgs.callPackage ./package.nix { };
  
  # Configuration file
  configFile = pkgs.writeText "template-app-vision-track-hot-or-not-config.json" (builtins.toJSON {
    port = cfg.port;
    host = cfg.host;
  });

in {
  options.services.template-app-vision-track-hot-or-not = {
    enable = mkEnableOption "John's HOT or NOT app";
    
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
      default = "template-app-vision-track-hot-or-not";
      description = "User to run the app as";
    };
    
    group = mkOption {
      type = types.str;
      default = "template-app-vision-track-hot-or-not";
      description = "Group to run the app as";
    };
  };

  config = mkIf cfg.enable {
    # Create user and group
    users.users.${cfg.user} = {
      isSystemUser = true;
      group = cfg.group;
      description = "John's HOT or NOT app user";
    };
    
    users.groups.${cfg.group} = {};

    # Systemd service
    systemd.services.template-app-vision-track-hot-or-not = {
      description = "John's HOT or NOT app";
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
        
        # Environment variables
        Environment = [
          "PORT=${toString cfg.port}"
          "HOST=${cfg.host}"
          "NODE_ENV=production"
        ];
        
        # Security settings
        NoNewPrivileges = true;
        PrivateTmp = true;
        ProtectSystem = "strict";
        ProtectHome = true;
        ReadWritePaths = "/tmp";
      };
    };

    # Nginx configuration (optional)
    services.nginx = mkIf config.services.nginx.enable {
      virtualHosts."template-app-vision-track-hot-or-not" = {
        locations."/" = {
          proxyPass = "http://${cfg.host}:${toString cfg.port}";
          proxyWebsockets = true;
          extraConfig = ''
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
          '';
        };
      };
    };
  };
} 