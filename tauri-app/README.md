<div align="center">
  <img src="renderer/public/tronix-icon.png" alt="APIONIX Logo" width="120" />
</div>

<h1 align="center">APIONIX</h1>
<h4 align="center">An ultra-performant, next-generation API Testing framework built for the modern developer.</h4>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Tauri-2.3-FFC131?logo=tauri&logoColor=fff" alt="Tauri" />
  <img src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=fff" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=fff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Rust-Stable-000000?logo=rust&logoColor=fff" alt="Rust" />
  <img src="https://img.shields.io/badge/Sileo-Toasts-0ea5e9?logo=react&logoColor=fff" alt="Sileo" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey" alt="Platform" />
</div>

<br />

APIONIX is an advanced desktop application designed for developers who need maximum power without the bloat. Originally built on Electron, this project has been fully re-engineered with **Tauri**, combining the blistering compilation speed of a Rust backend with a stunning, fluid Next.js (React) front end. 

Say goodbye to massive memory footprints and electron-based limitations. **Just pure API testing.**

---

## 📑 Table of Contents
1. [Core Features](#-core-features)
2. [Tech Stack & Architecture Details](#-tech-stack--architecture-details)
3. [System Prerequisites](#-system-prerequisites)
4. [Getting Started](#-getting-started)
5. [Building for Production](#-building-for-production)
6. [Troubleshooting](#%EF%B8%8F-troubleshooting)
7. [Upcoming Roadmap](#-upcoming-roadmap)

---

## ✨ Core Features

🚀 **Native & Lightweight** 
Powered completely by a Rust backend, ensuring minimal CPU usage and a memory footprint that is a fraction of legacy node-based clients like Electron.

⚡ **REST APIs Support** 
Standard API endpoint methodology support out-of-the-box: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`.

🔥 **Advanced Load Testing** 
Built natively alongside the request panel: Stress test your endpoints by simulating hundreds of concurrent requests and analyze real-time benchmarks (Avg, Min, Max, and p95 Completion Time Metrics) utilizing live recharts plotting.

✨ **Premium UI/UX** 
Beautiful dark-mode aesthetic built on Tailwind CSS, complete with fluid, custom micro-animations, customizable panes via React Resizable Panels, and native OS window framings.

🗂️ **Tabbed Interface Management** 
Work on multiple requests and environments concurrently without ever losing unsaved data.

🧠 **Intelligent JSON Body Parsing** 
Integrated syntax highlighting, active auto-formatting, and intelligent error bounding with inline suggestions.

🔐 **Robust Auth Controls** 
Natively handles all modern authentication types out of the box including **Bearer Tokens**, **Basic Auth**, and custom **API Keys**.

⚙️ **Extensive Parameters** 
Visually build out URL query parameters, complex custom headers, URL-encoded data streams, and raw Form-Data endpoints (including secure file uploads).

🌐 **Offline-First Persistence** 
All of your workspaces, configs, saved secrets, and endpoints are securely stored locally via the `@tauri-apps/plugin-store` and rendered instantaneously on launch.

🛡️ **Security Sentinel (Automated Audit)**
Go beyond basic testing with integrated security auditing. APIONIX automatically analyzes every response for missing security headers (HSTS, CSP, X-Frame-Options, etc.), sensitive info leaks, and protocol misconfigurations, providing instant fix recommendations.

📈 **Integrated Performance Insights**
Track API health over time with real-time latency history. Analyze performance trends using visual sparklines and aggregate statistics (Average Latency, Success Rate) built into your response workflow.

🖥️ **Advanced Server Monitoring**
Built-in dashboard for real-time tracking of remote server health. Add your server credentials to monitor CPU, RAM, and Disk utilization using stunning amCharts visualizations.

---

## 🛠️ Tech Stack & Architecture Details

APIONIX uses a multi-layered architecture separating OS-level logic and high-performance threading from complex UI rendering.

### 1. **Core Backbone: Tauri & Rust**
- **[Tauri v2](https://v2.tauri.app/)**: Used as our application runtime manager. Tauri replaces Electron, providing the native OS webview container, drastically reducing install sizes and runtime memory overhead.
- **Rust**: Handles system-level operations, secure file system access, and OS window management natively.

### 2. **Frontend Architecture: Next.js & React**
- **[Next.js 15 (App Router)](https://nextjs.org/)**: Configured as a Statically Exported Client (`output: "export"`). It powers the entire layout, efficient routing, and strict React compilation. Next.js components are fully hydrated into the Tauri Webview.
- **[React 18](https://react.dev/)**: Handles complex state management, including heavily synchronized inputs, load-testing worker tracking, and highly nested JSON states for API configurations.
- **[TypeScript](https://www.typescriptlang.org/)**: Enforces strict typing across all request payloads, component props, and API state responses to eliminate runtime errors.

### 3. **Design System & UI Tooling**
- **[Tailwind CSS (v3.4)](https://tailwindcss.com/)**: Serves as our primary utility-first CSS framework. It constructs the responsive flex layouts, grid systems, custom glassmorphism effects, and highly specific dark-mode (`#191515`) aesthetics.
- **[Lucide React](https://lucide.dev/)**: Provides clean, consistent, customizable vector icons for all buttons, menus, and visual indicators.
- **[React Resizable Panels](https://github.com/bvaughn/react-resizable-panels)**: Empowers the complex draggable layouts. It is used to split the application into draggable quadrants (Request config vs Response view).
- **[Radix UI](https://www.radix-ui.com/)**: Supplies the accessible, unstyled primitives for complex interactive components like dropdowns, dialogues, tabs, and more.

### 4. **Enhanced User Experience Modules**
- **[Sileo](https://sileo.aaryan.design/)**: Provides buttery-smooth, natively animated toast notifications using gooey SVG morphing and spring physics. Implemented for conveying successful API calls, load test completions, validation notices, and system errors seamlessly without bloat.
- **[Recharts](https://recharts.org/)**: A composable charting library built on React components. Used for real-time **Load Testing benchmarks** and **Performance Insights** history plotting.
- **[amCharts](https://www.amcharts.com/)**: High-performance charting engine utilized in our **Server Monitoring** dashboard for real-time system resource visualization.

---

## 💻 System Prerequisites

Because Tauri relies on Rust to securely compile the native desktop environment binaries, you **must** have Rust installed on your development machine before launching.

### 🪟 Windows Setup
1. Download and run the **[Rust Installer (`rustup-init.exe`)](https://rustup.rs/)**.
2. **Important:** When prompted during the Windows installation, **accept** the installation of the Microsoft **C++ Build Tools**. (Tauri uses these libraries to natively compile Windows executable files).
3. Ensure you have the latest LTS of [Node.js](https://nodejs.org/en/download/) installed globally.

### 🍎 Mac / 🐧 Linux Setup
Follow the official prerequisite guides for your platform on the [Tauri V2 Documentation](https://v2.tauri.app/start/prerequisites/).

---

## 🚀 Getting Started

Once your prerequisites are resolved, developing on APIONIX is seamless:

1. **Install Core Dependencies**
   ```bash
   npm install
   ```

2. **Boot the Dev Server**
   ```bash
   npm run dev
   ```
   > _This single macro command launches Next.js on `localhost:3005`, establishes the Rust IPC bridge, opens your Tauri desktop simulator, and natively enables Hot Module Replacement (HMR) for instant UI updates as you type!_

---

## 📦 Building for Production

Need to distribute APIONIX to other developers? It only takes a single command to generate the `.exe` (or `.dmg` / `.AppImage`) setup wizards!

```bash
npm run tauri:build
```

**What this macro executes under the hood:**
1. It runs `next build` inside the `renderer/` directory, outputting a perfectly compressed, completely static React codebase.
2. It runs `tauri build` inside the backend directory, ingesting the static HTML/JS files, safely embedding them into the Webview container, and compiling them natively based on your OS architecture.

### 📍 Where is my App Installer?
If you are compiling on a Windows machine, navigate to:
`tauri-app/src-tauri/target/release/bundle/nsis/`

You will find a professionally packaged, redistributable `apionix_0.1.0_x64-setup.exe` setup wizard file waiting for you!

---

## ⚠️ Troubleshooting

**Common Error:** `failed to run 'cargo metadata' command to get workspace directory`
This occurs if the Rust Toolchain is either missing or not fully initialized on your system.

**Solution for Windows:**
1. Ensure Rust is installed via `rustup`.
2. Open a new Terminal as Administrator and force the stable toolchain download by running:
   ```powershell
   rustup default stable
   ```
3. Ensure Cargo is in your system PATH by running:
   ```powershell
   $env:PATH += ";$env:USERPROFILE\\.cargo\\bin"
   ```
4. Restart your Terminal or VS Code and try `npm run dev` again!

---

## 🚧 Upcoming Roadmap

- [ ] Native GraphQL Query Architecture integration
- [ ] Live WebSocket testing and persistent connection debugging
- [ ] Modular Environment Variables support (Import/Export switching)
- [ ] Real-time Response/Request Interceptor configurations 

---

## 🤝 Contributing

Contributions to scale APIONIX are highly encouraged! 
To contribute: Fork the repository, create a descriptive feature branch, and submit a Pull Request targeting `/main`.
