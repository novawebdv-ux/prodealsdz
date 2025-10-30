# ProDealsDZ

## Overview
ProDealsDZ is an Algerian digital products marketplace - a clean, minimal single-page application built with vanilla HTML, CSS, and JavaScript. The site is in Arabic (RTL layout) and features a simulated e-commerce experience for digital products like templates, courses, ebooks, and tools.

## Project Architecture
- **Type**: Static frontend-only web application
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **No build system**: Pure vanilla code, no frameworks or bundlers
- **No backend**: All functionality is client-side simulation
- **No dependencies**: Self-contained project

## File Structure
```
.
├── index.html          # Main HTML structure
├── styles.css          # Complete styling (RTL, responsive)
├── script.js           # All client-side logic
├── assets/
│   └── logo.svg        # ProDealsDZ logo
├── server.py           # Simple Python HTTP server for development
└── replit.md           # This file
```

## Features
- Product catalog display
- Shopping cart functionality
- Search/filter products
- Simulated checkout flow (Golden Card payment - Algeria-specific)
- Modal dialogs for cart and checkout
- Toast notifications
- Fully responsive design
- RTL (Right-to-Left) layout for Arabic

## Development
The project uses a simple Python HTTP server to serve static files on port 5000 with cache-control headers disabled for proper development experience.

## Recent Changes
- 2025-10-30: Initial Replit environment setup
  - Added Python HTTP server for serving static files
  - Configured workflow for port 5000
  - Added cache-control headers for development
  - Created .gitignore for Python files
