# Agentic Desktop

Electron-based desktop admin application for Agentic Web3 platform.

## Features

- Full admin UI dashboard
- System tray integration
- Auto-update support
- Node 24+ compatible
- Windows executable (`agentic.exe`)
- Sync with Supabase backend

## Development

```bash
cd desktop
npm install
npm run dev
```

## Building

```bash
npm run package  # Package for current platform
npm run make     # Create installer/executable
```

## Windows Build

The build process will create `agentic.exe` in the `out` directory.

## Architecture

- Main process: Electron application window
- Renderer process: Web UI (Next.js app)
- IPC: Communication between processes
- Tray: System tray icon and menu
