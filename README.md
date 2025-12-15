# 🌙 Nudge

**A gentle companion for low-energy days.**

Nudge is a privacy-first, offline-capable Progressive Web App (PWA) designed to help users navigate depression, burnout, or sensory overload. It replaces the pressure of "Productivity" with the compassion of "Functionality," adapting tasks to your current energy level.

## 🌟 The Philosophy: Zero Friction

When you are at your lowest, even opening an app feels impossible. Nudge is built on three core design principles:
1.  **No Login:** You shouldn't have to remember a password to feel better.
2.  **No Loading:** The app works instantly, even in Airplane Mode.
3.  **No Data Tracking:** Your thoughts and history live on your phone, not a server.

## ✨ Key Features

### 🔋 Energy-Adaptive Tasks
Instead of a to-do list, Nudge asks: *"Where is your battery at?"*
*   **Survival (0-10%):** Tasks like "Unclench jaw" or "Drink a sip of water."
*   **Low Power (10-30%):** Tasks like "Sit up" or "Open a window."
*   **Online (60%+):** Actual productivity tasks.

### 🛡️ The Sanctuary Tools
A built-in toolkit to manage panic and stress instantly:
*   **The Void:** Type out negative thoughts and visually "burn" them away.
*   **Breathing Circle:** A haptic-guided 4-4-4 breathing exercise.
*   **Soundscapes:** Seamless, gapless audio loops (Rain & Fire) powered by the Web Audio API.
*   **Lifeline:** One-tap access to trusted contacts via WhatsApp (with optional GPS location).

### 📊 Insight & History
*   **Heatmap Calendar:** Visualizes your energy patterns over the last 30 days.
*   **Wins Counter:** Tracks micro-victories to build momentum.
*   **Data Backup:** Full import/export functionality to keep your data safe without cloud accounts.

## 🛠️ Tech Stack

Built with a focus on performance and modularity.

*   **Core:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Animations:** [Framer Motion](https://www.framer.com/motion/) (Fluid transitions & micro-interactions)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **PWA:** `vite-plugin-pwa` (Service Workers for offline capabilities)
*   **Audio:** Native Web Audio API (No external players)
*   **State:** React Context API + LocalStorage
*   **i18n:** Custom dictionary-based translation engine (English/Italian)

## 📂 Project Structure

The project follows a clean, component-based architecture:

```text
src/
├── components/      # Isolated UI modules (Header, Dock, Settings, etc.)
├── context/         # Global State (Language Context)
├── locales/         # Dictionaries for i18n (en.js, it.js)
├── constants.js     # Static configuration & default data
├── App.jsx          # Main logic controller
└── main.jsx         # Entry point & Provider wrapping