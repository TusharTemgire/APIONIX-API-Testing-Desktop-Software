# Electron + Next.js Desktop Application

A modern desktop application built with Electron.js and Next.js, featuring a Tailwind CSS design system for consistent styling across both desktop and web platforms.

## Features

- 🖥️ **Desktop Application**: Built with Electron.js for native desktop experience
- 🌐 **Web Interface**: Powered by Next.js 14 with App Router
- 🎨 **Design System**: Tailwind CSS with shadcn/ui components
- 🔄 **IPC Communication**: Seamless data exchange between Electron and Next.js
- 📱 **Responsive Design**: Works on both desktop and web browsers
- 🌙 **Dark Mode**: Built-in theme switching
- 📁 **File Management**: Desktop file system integration
- ⚙️ **Settings**: Persistent application settings
- 🔧 **System Info**: Runtime environment details

## Project Structure

\`\`\`
├── electron/                 # Electron main process files
│   ├── main.js              # Main Electron process
│   └── preload.js           # Preload script for IPC
├── app/                     # Next.js application
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── desktop/             # Desktop-specific components
├── lib/                     # Utility functions
└── public/                  # Static assets
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd electron-nextjs-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

This will start both the Next.js development server and Electron application.

### Building for Production

1. Build the Next.js application:
\`\`\`bash
npm run build
\`\`\`

2. Build the Electron application:
\`\`\`bash
npm run build:electron
\`\`\`

The built application will be available in the `dist/` directory.

## Development Scripts

- `npm run dev` - Start development environment (Next.js + Electron)
- `npm run dev:next` - Start only Next.js development server
- `npm run dev:electron` - Start only Electron (requires Next.js to be running)
- `npm run build` - Build Next.js for production
- `npm run build:electron` - Build Electron application
- `npm run start` - Start Next.js production server

## Architecture

### Electron Integration

The application uses Electron's main process (`electron/main.js`) to create the desktop window and handle system-level operations. The preload script (`electron/preload.js`) provides a secure bridge between the main process and the renderer (Next.js).

### IPC Communication

Inter-Process Communication (IPC) is handled through the `electronAPI` exposed in the preload script:

\`\`\`javascript
// In renderer process (Next.js)
const result = await window.electronAPI.saveData(data)
\`\`\`

### Next.js Configuration

The Next.js application is configured for static export to work with Electron:

\`\`\`javascript
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
}
\`\`\`

## Features Overview

### Notes Application
- Create and save notes
- Desktop file system integration
- Cross-platform compatibility

### System Information
- Runtime environment details
- Platform-specific information
- Real-time system stats

### File Manager
- Browse local files (desktop)
- File upload/download simulation
- Search functionality

### Settings
- Theme switching (light/dark/system)
- Notification preferences
- Language selection
- Persistent settings storage

## Styling

The application uses Tailwind CSS with a custom design system based on shadcn/ui components. The styling is consistent across both desktop and web platforms.

### Theme System

- CSS custom properties for theming
- Dark/light mode support
- System theme detection
- Smooth transitions

## Browser Compatibility

While optimized for Electron, the application also works in modern web browsers with graceful degradation of desktop-specific features.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in both Electron and web environments
5. Submit a pull request

## License

MIT License - see LICENSE file for details
