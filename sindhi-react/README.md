# Sindhi Namkeen & Dry Fruits (React Version)

## ⚛️ Project Overview
This is the **React/Vite** version of the Sindhi Namkeen & Dry Fruits application. It modernizes the original static site with a component-based architecture, state management, and easier maintainability while strictly adhering to the established "Royal & Authentic" visual identity.

## 🛠️ Technology Stack
- **Framework**: [React](https://reactjs.org/) (Functional Components, Hooks)
- **Build Tool**: [Vite](https://vitejs.dev/) (Fast Hot Module Replacement)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first styling)
- **Icons**: `lucide-react`
- **Animation**: `framer-motion` (for smooth transitions)

## ✨ Key Features
- **Component Architecture**: Modular `Header`, `ProductCard`, `Cart`, `Checkout` components.
- **State Management**: React `useState` and `useEffect` for cart logic and category filtering.
- **Responsive Design**: Mobile-first approach using Tailwind classes.
- **Performance**: Optimized asset loading and fast hydration.

## 📂 Folder Structure
```
sindhi-react/
├── public/             # Static assets (images, icons)
├── src/
│   ├── components/
│   │   ├── cart/       # CartModal, CheckoutModal
│   │   ├── layout/     # Header, Footer, Hero
│   │   ├── products/   # ProductCard, ProductGrid
│   │   └── ui/         # Reusable UI elements (Buttons, Badges)
│   ├── data/           # Product catalog JSON
│   ├── pages/          # Content pages (HomePage)
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point
├── index.html          # HTML Entry
├── tailwind.config.js  # Design tokens (Colors, Fonts)
└── package.json        # Dependencies
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16+) installed.

### 2. Installation
Navigate to the project directory and install dependencies:
```bash
cd sindhi-react
npm install
```

### 3. Development Server
Start the local development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Production Build
To create a production-ready build:
```bash
npm run build
```

## 🎨 Design System
The project uses a custom Tailwind configuration (`tailwind.config.js`) to enforce brand consistency:
- **`bg-primary`**: Deep Maroon (#8b1538)
- **`bg-secondary`**: Gold (#d4a84b)
- **Font Display**: 'Playfair Display'
- **Font Body**: 'Poppins'

## 🔄 Parity with HTML Version
This React version is visually synchronized with the HTML version found in the root directory. Updates to the visual design (Product Cards, Header style) are mirrored to ensure both versions offer an identical user experience for A/B testing or deployment preference.
