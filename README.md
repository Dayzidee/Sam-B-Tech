<div align="center">
<img width="1200" height="475" alt="SAM-B TECH Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SAM-B TECH | Premium Tech Hub

A high-performance, AI-driven tech ecosystem designed for precision diagnostics, professional repair management, and premium gadget retailing.

## 🌟 Key Features
- **AI-Powered Diagnostics**: Leveraging Google Gemini for automated repair estimations and complexity analysis.
- **Premium UX/UI**: Implemented with Tailwind CSS v4, Framer Motion, and a custom Global Loading strategy for a "Luxury Tech" feel.
- **Enterprise Security**: Robust Role-Based Access Control (RBAC) partitioning endpoints for Technicians (Admins) and Customers.
- **Real-time Infrastructure**: Firestore synchronization with Multi-tab IndexedDB persistence for lightning-fast, offline-ready performance.
- **Media Optimization**: Integrated Cloudinary for high-fidelity product imaging and standardized asset management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Firebase Account (Project ID: `sam-b-db`)
- Cloudinary Account
- Gemini API Key

### Installation
1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Configure `.env` with your Firebase, Cloudinary, and Gemini credentials.
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📂 Project Architecture
- `src/backend`: Firebase configuration and service layers.
- `src/hooks/useAuth.tsx`: Centralized role and auth management.
- `src/pages/Admin`: Technician-facing management modules.
- `src/pages/Dashboard`: Customer-facing order and profile management.
- `src/components/layout/GlobalLoader.tsx`: Premium animated transition system.

---
*Built with precision by the SAM-B TECH Engineering Team.*
