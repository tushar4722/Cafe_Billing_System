# 🍽️ Restaurant Billing Software

![Restaurant Billing Banner](./assets/banner.png)

A comprehensive, professional-grade Point of Sale (POS) and Billing System designed for modern Restaurants and Cafes. This full-stack application provides a seamless experience for managing orders, kitchen displays, inventory, and detailed reporting.

---

## 🚀 Key Features

- **🛍️ Billing & POS**: Rapid-fire billing interface with support for multiple payment methods (Cash, UPI).
- **📟 Kitchen Display System (KDS)**: Real-time order tracking for kitchen staff to manage active orders efficiently.
- **📦 Inventory Management**: Comprehensive tracking of ingredients and stock levels.
- **👨‍🍳 Recipe Management**: Define recipes and automatically deduct inventory items upon order placement.
- **📊 Admin Dashboard**: High-level overview of sales, top-performing items, and staff management.
- **📈 Detailed Reports**: Exportable reports for sales, inventory usage, and financial summaries.
- **🔐 Secure Authentication**: Role-based access control for Admins, Cashiers, and Kitchen Staff.

---

## 🛠️ Tech Stack

- **Frontend**: ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
- **Backend**: ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
- **Database**: ![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white) ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

---

## 📂 Project Structure

```text
├── client/              # Frontend React application (Vite)
├── src/                 # Backend Node.js server (Express)
├── scripts/             # Database management and utility scripts
├── assets/              # Static assets and images for documentation
├── .env.example         # Template for environment variables
└── package.json         # Unified build and start scripts
```

---

## 🏁 Getting Started

### 1️⃣ Prerequisites
- **Node.js**: v14 or higher
- **MySQL**: v8.0 or higher
- **Git**

### 2️⃣ Installation
Clone the repository and install all dependencies (both root and client) with a single command:
```bash
git clone https://github.com/tushar4722/Cafe_Billing_System.git
cd Cafe_Billing_System
npm run install-all
```

### 3️⃣ Configuration
Copy the environment template and fill in your database credentials:
```bash
cp .env.example .env
```
Edit `.env` and set your `DB_HOST`, `DB_USER`, `DB_PASS`, and `DB_NAME`.

### 4️⃣ Database Setup (Optional/Safety)
Run the script to verify or create the database:
```bash
node scripts/check-db.js
```

### 5️⃣ Running the Application
**For Development:** (Starts both Backend and Frontend with Hot-Reload)
```bash
npm run dev
```

**For Production:**
```bash
npm run build
npm start
```

---

## 🛤️ Roadmap & Branching
- `main`: Production-ready stable code.
- `develop`: Ongoing development and feature integration.
- `feature/*`: Specific branches for item management, reporting, etc.

---

## 📄 License
Distributed under the **ISC License**. See `package.json` for more information.

## 📞 Support
For any questions or support, please reach out via GitHub Issues.
