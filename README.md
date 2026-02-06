# Sindhi Namkeen & Dry Fruits (HTML Version)

## 📌 Project Overview
This is the **HTML/CSS/JavaScript** version of the Sindhi Namkeen & Dry Fruits e-commerce website. It is designed to be a lightweight, fast, and visually premium digital storefront for a traditional namkeen brand. The site features a verified product catalog, a shopping cart system, and a direct-to-WhatsApp checkout flow.

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5
- **Styling**: Vanilla CSS3 (Custom Variables, Flexbox/Grid, Responsive Design)
- **Logic**: Vanilla JavaScript (ES6+)
- **Icons**: SVG Icons (Feather/Custom)
- **Fonts**: 'Playfair Display' (Headings) & 'Poppins' (Body)

## ✨ Key Features
1.  **Premium Aesthetics**:
    - Transparent "frosted glass" header with scroll-aware navigation.
    - Custom "Maroon Pill" active states.
    - Gold-tinted badges and high-quality imagery.
2.  **Dynamic Product Collection**:
    - "Premium Products" grid with price integration.
    - Verified layout matching modern design standards (No stars, clean typography).
3.  **Functional Cart System**:
    - Add/Remove items.
    - Quantity adjustment.
    - Real-time total calculation.
4.  **WhatsApp Checkout**:
    - Custom checkout form (Name, Address, Delivery Slots).
    - Generates a pre-filled WhatsApp message with order details for the merchant.

## 📂 Folder Structure
```
Sindhi_Website/
├── assets/             # Images and raw resources
│   ├── raw_samples/    # Original sample images
├── css/
│   └── style.css       # Main stylesheet (Design Tokens, Components, Utilities)
├── js/
│   ├── services/       # Business logic (Cart, Product Data, Storage)
│   ├── utils/          # Helper functions
│   └── main.js         # Application entry point & DOM manipulation
├── docs/               # Project documentation (Proposals, Contracts)
├── index.html          # Main application file
└── README.md           # This file
```

## 🚀 How to Run
1.  **Prerequisites**: A modern web browser (Chrome, Edge, Firefox).
2.  **Setup**:
    - No `npm install` required. This is a static site.
    - Simply open `index.html` in your browser.
    - **Recommended**: Use "Live Server" extension in VS Code for the best development experience (hot reloading).

## 🎨 Design Philosophy
The design reflects the "Royal & Authentic" nature of the brand.
- **Primary Color**: Deep Maroon (`#8b1538`) representing tradition.
- **Secondary Color**: Warm Gold (`#d4a84b`) representing premium quality.
- **Typography**: Serif headings for elegance, Sans-serif body for readability.

## 📝 Recent Updates
- Backported React visual refinements to HTML.
- Standardized product card layout (removed star ratings, centered pricing).
- Implemented transparent header with static pill navigation.
