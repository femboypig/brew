# Development Guide

## Project Overview

Brew is a modern Minecraft launcher built with Tauri, combining Rust (backend) and React/TypeScript (frontend).

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

## Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd brew
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Development run:
   ```bash
   npm run tauri dev
   ```

## Project Structure

- `/src` - Frontend React/TypeScript code
  - `/assets` - Images and SVGs
  - `/components` - React components
- `/src-tauri` - Rust backend code
  - `/src` - Main Rust application code
  - `/capabilities` - Tauri capabilities configuration

## Building for Production

```bash
npm run tauri build
```

This will create platform-specific packages in `/src-tauri/target/release`.

## Common Issues

- If you encounter permission issues on Linux, make sure you have the required dependencies installed. See [Tauri prerequisites](https://tauri.app/v2/guides/getting-started/prerequisites/).
- For build errors related to Rust, try running `cargo clean` and then rebuild. 