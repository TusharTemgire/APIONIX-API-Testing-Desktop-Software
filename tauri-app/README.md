<div align="center">
  <img src="renderer/public/tronix-icon.png" alt="APIONIX Logo" width="120" />
</div>

<h1 align="center">APIONIX</h1>
<h4 align="center">An ultra-performant, next-generation API Testing framework built for the modern developer.</h4>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Tauri-2.0-FFC131?logo=tauri&logoColor=fff" alt="Tauri" />
  <img src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=fff" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=fff" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Rust-1.70+-000000?logo=rust&logoColor=fff" alt="Rust" />
</div>

<br />

APIONIX is an advanced desktop application designed for developers who need maximum power without the bloat. Originally built on Electron, this project has been fully re-engineered with **Tauri**, combining the blistering compilation speed of a Rust backend with a stunning, fluid Next.js (React) front end. 

Say goodbye to massive memory footprints and electron-based limitations. **Just pure API testing.**

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

---

## 🛠️ Tech Stack & Architecture

- **[Tauri v2](https://v2.tauri.app/)**: Next-generation web-viewer OS bindings (Rust)
- **[Next.js 15 (App Router)](https://nextjs.org/)**: Deployed as a statically exported client
- **[Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)**: Beautiful styling architectures and vector graphics
- **[Recharts](https://recharts.org/)**: Dynamic data visualization for Load Testing
- **[Radix UI](https://www.radix-ui.com/)**: Headless accessible component primitives 

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
   > _This single macro command launches Next.js on `localhost`, establishes the Rust IPC bridge, opens your Tauri desktop simulator, and natively enables Hot Module Replacement (HMR) for instant UI updates as you type!_

---

## 📦 Building for Production

Need to distribute APIONIX to other developers? It only takes a single command to generate the `.exe` setup wizards!

```bash
npm run tauri:build
```

**What this macro executes under the hood:**
1. It runs `next build` inside the `renderer/` directory, outputting a perfectly compressed, completely static React codebase.
2. It runs `tauri build` inside the backend directory, ingesting the static HTML/JS files, safely embedding them into the Webview2 container, and compiling them natively based on your OS architecture.

### 📍 Where is my App Installer?
If you are compiling on a Windows machine, navigate to:
`tauri-app/src-tauri/target/release/bundle/nsis/`

You will find a professionally packaged, redistributable `apionix_0.1.0_x64-setup.exe` setup wizard file waiting for you!

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
