# Tauri App Icons

This directory should contain app icons for different platforms:

- `32x32.png` - Small icon
- `128x128.png` - Medium icon  
- `128x128@2x.png` - Retina medium icon
- `icon.icns` - macOS icon
- `icon.ico` - Windows icon

## Generating Icons

You can use the `@tauri-apps/cli` to generate icons from a source image:

```bash
npm install -g @tauri-apps/cli
tauri icon path/to/source/icon.png
```

This will automatically generate all required icon sizes.

## Placeholder

For development, Tauri will use default icons if custom icons are not provided.
Add your custom icons here before building for production.
