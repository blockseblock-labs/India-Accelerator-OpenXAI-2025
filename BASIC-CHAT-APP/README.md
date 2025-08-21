## Nextjs Ollama Template

Template to make a Nextjs + Ollama app that runs on OpenxAI (and any other NixOS infrastructure).

## Modification Steps

1. Replace all instances of "nextjs-ollama-template" with the name of your project. This should be unique, as no apps with the same name can be run on a single Xnode.
2. Pick your ollama model from https://ollama.com/library and enter it's identifier in [ollama-model.txt](./ollama-model.txt).
3. Build your Nextjs app
4. Once your app is ready for deployment and runs using `nix run`, push to GitHub and copy your GitHub url (e.g. https://github.com/Openmesh-Network/nextjs-ollama-template).

## Commands (in root folder)

```
sudo launchctl unload /Library/LaunchDaemons/org.nixos.nix-daemon.plist
sudo rm -rf /nix/var/nix/daemon-socket/socket
sudo launchctl load /Library/LaunchDaemons/org.nixos.nix-daemon.plist


nix run
```

## Commands (in nextjs-app)

```
npm i
npm run dev
npm run build
npm run start
```
