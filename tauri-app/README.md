# APIONIX (Tauri Edition) 🚀

APIONIX is an advanced, ultra-performant API Testing Desktop Application designed for developers who need power without the bloat. Originally built on Electron, this version is re-engineered with **Tauri**, combining the blistering speed of a Rust backend with a stunning Next.js (React) front end.

> No annoying limits. No heavy memory footprints. Just pure API testing.

---

## ✨ Features

- **Blazing Fast Performance**: Powered by a Rust backend, ensuring minimal CPU and RAM usage compared to Electron.
- **REST APIs Support**: Standard `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` support.
- **Advanced Load Testing**: Stress test your APIs by simulating hundreds of concurrent requests, analyzing real-time charting (avg, min, max, p95).
- **Stunning UI/UX**: Premium dark-mode aesthetic with fluid micro-animations. 
- **Tabbed Interface**: Work on multiple requests concurrently without losing data.
- **Intelligent JSON handling**: Syntax highlighting, auto-formatting, and intelligent error fixing via suggestions.
- **Robust Auth Control**: Full support for Bearer Tokens, Basic Auth, and custom API Keys.
- **Detailed Parameter Configurations**: Build out full query parameters, complex custom headers, URL-encoded data, and Form-Data (including file uploads). 
- **Offline First**: All of your workspaces and configurations are saved locally and load instantaneously on start.

---

## 🛠️ Tech Stack

- **Tauri v2**: Core web-viewer and native OS binding framework (Rust).
- **Next.js 15 (Export Mode)**: Modern React frontend using the App Router.
- **Tailwind CSS & Lucide React**: Beautiful layouts and sharp, scalable icons.
- **Recharts**: For plotting real-time traffic benchmarks in our Load Testing suite.
- **React Resizable Panels**: Fully flexible UI panes.

---

## 💻 Prerequisites

Because Tauri relies on Rust to compile the lightweight desktop window, you **must** have Rust installed on your computer.

### Windows Setup
1. Download and install **[Rust](https://rustup.rs/)**.
2. *Important:* When installing Rust on Windows, follow the prompts to install the **C++ Build Tools**. (Tauri needs this for compiling native Windows `.exe` endpoints).
3. If you haven't already, install [Node.js](https://nodejs.org/en/download/).

### Mac & Linux Setup
Follow the [Tauri official prerequsite guides](https://v2.tauri.app/start/prerequisites/) for your respective operating system.

---

## 🚀 Getting Started

Once your prerequisites are ready, follow these steps:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
   *This single command will boot up Next.js on `localhost:3000`, open the Tauri webview wrapper automatically, and enable Hot Module Replacement (HMR) for instant UI updates!*

---

## 📦 Building for Production

Ready to distribute APIONIX to other developers? You just need a single command. 

```bash
npm run tauri:build
```

**What this does under the hood:**
1. It executes `next build` to cleanly output a completely static React bundle inside the `renderer/out/` folder.
2. It executes `tauri build` to ingest those static files and inject them directly into the compiled native binary.

### Where is my `.exe` / `.dmg`?
If you're on Windows, check `/src-tauri/target/release/bundle/nsis/`.
Here you will find a beautifully packaged `apionix_0.1.0_x64-setup.exe` setup wizard file you can double-click or share!

---

## 🚧 Upcoming Roadmap

- [ ] GraphQL querying support.
- [ ] WebSocket connection debugging.
- [ ] Environment Variables import/export switching.
- [ ] CI/CD pipeline integration commands.

---

## 🤝 Contributing

Contributions are happily welcome! Fork the repository, create a descriptive branch, and submit a pull request!
