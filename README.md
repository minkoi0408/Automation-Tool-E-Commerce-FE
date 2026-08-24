# E-Commerce Scraper & AI Analysis Platform - Frontend

---

## TABLE OF CONTENTS / MỤC LỤC

1. [BẢN TIẾNG VIỆT (VIETNAMESE VERSION)](#i-bản-tiếng-việt)
   - [1. Giới thiệu bài toán & Mục tiêu](#1-giới-thiệu-bài-toán--mục-tiêu)
   - [2. Frontend Architecture & Công nghệ](#2-frontend-architecture--công-nghệ)
   - [3. Các tính năng & Đột phá kỹ thuật](#3-các-tính-năng--đột-phá-kỹ-thuật)
   - [4. Hướng dẫn cài đặt & Chạy Frontend](#4-hướng-dẫn-cài-đặt--chạy-frontend)

2. [ENGLISH VERSION](#ii-english-version)
   - [1. Problem Statement & Objectives](#1-problem-statement--objectives)
   - [2. Frontend Architecture & Tech Stack](#2-frontend-architecture--tech-stack)
   - [3. Key Features & Technical Highlights](#3-key-features--technical-highlights)
   - [4. Frontend Setup & Run Guide](#4-frontend-setup--run-guide)

---

# I. BẢN TIẾNG VIỆT

## 1. Giới thiệu bài toán & Mục tiêu

Giao diện người dùng E-Commerce Scraper & AI Analysis Platform (Frontend) được xây dựng nhằm cung cấp trải nghiệm quản trị dữ liệu thương mại điện tử trực quan, hiện đại và tốc độ cao. 

Hệ thống cho phép người dùng:
- Khởi chạy các tác vụ bóc tách dữ liệu từ Shopee và Lazada theo từ khóa hoặc đường dẫn trực tiếp (Direct URL).
- Theo dõi tiến độ cào dữ liệu thời gian thực theo từng phiên làm việc (Session).
- Quản lý kho sản phẩm tập trung với báo cáo phân tích chất lượng và định giá thông minh từ Google Gemini AI.
- Lọc sản phẩm đa chiều (theo sàn, khoảng giá, min rating, danh mục), xóa sản phẩm tức thời và xuất báo cáo 3 định dạng: CSV, Excel (.xlsx), JSON (.json).
- Hỗ trợ chuyển đổi đa ngôn ngữ Tiếng Việt (VI) và Tiếng Anh (EN) mượt mà.

---

## 2. Frontend Architecture & Công nghệ

### 2.1. Công nghệ sử dụng
- Core Framework: React 19, TypeScript 5, Vite 8 (Hot Module Replacement dưới 50ms).
- Styling: Tailwind CSS v4, Dark Navy Glassmorphism Design System.
- Routing: React Router DOM v7 (Single Page Application với Nested Layout).
- HTTP Client: Axios với Base URL cấu hình tập trung và type-safe interfaces.
- Đa ngôn ngữ (i18n): React Context API (LanguageContext) chuyển đổi tức thì giữa Tiếng Việt (VI) và Tiếng Anh (EN), lưu trạng thái qua LocalStorage.
- Typography & Icons: Google Material Symbols Outlined, Google Fonts (Inter và JetBrains Mono).

### 2.2. Cấu trúc thư mục Frontend
```
Automation-Tool-E-Commerce-FE/
├── src/
│   ├── components/
│   │   ├── common/          # Component tái sử dụng (ProgressBar, Card, Modal)
│   │   └── layout/          # Layout, Navbar (Search, Switcher VI/EN), Sidebar
│   ├── context/
│   │   └── LanguageContext.tsx # Context quản lý ngôn ngữ toàn cục
│   ├── pages/
│   │   ├── DashboardPage.tsx   # Tổng quan thống kê KPI & Bảng tác vụ gần đây
│   │   ├── ScrapePage.tsx      # Khởi chạy tác vụ & Bảng theo dõi phiên làm việc
│   │   └── ProductsPage.tsx    # Kho sản phẩm, Card AI, Bộ lọc, Xóa, Xuất file
│   ├── services/
│   │   └── api.ts              # Đóng gói API Client kết nối Backend
│   ├── types/
│   │   └── index.ts            # Khai báo TypeScript Interfaces đồng bộ BE
│   ├── utils/
│   │   └── format.ts           # Định dạng tiền tệ VND, thời gian, số lượng
│   ├── App.tsx                 # Định tuyến ứng dụng
│   └── index.css               # Design System tokens & Tailwind directives
└── package.json
```

---

## 3. Các tính năng & Đột phá kỹ thuật

### 3.1. Vượt cơ chế chặn ảnh Hotlink (403 Forbidden Shield)
- Tích hợp meta referrer no-referrer và thuộc tính referrerPolicy="no-referrer" trên tất cả thẻ hình ảnh, giúp tải ảnh mượt mà từ CDN Shopee và Lazada mà không bị chặn lỗi 403.
- Bổ sung fallback placeholder tự động khi link ảnh bị lỗi mạng.

### 3.2. Chống Double Request & Spam Click
- Sử dụng kết hợp useRef và trạng thái submitting để vô hiệu hóa nút bấm và chống tạo job trùng lặp khi người dùng click nhanh.

### 3.3. Smart Reactive Polling
- Tự động thăm dò tiến độ mỗi 3 giây khi có tác vụ đang chạy (RUNNING / PENDING), và tự động ngắt timer ngay khi hoàn tất để tiết kiệm tài nguyên.

### 3.4. Quản lý tác vụ theo phiên (Session-Only Tracking)
- Lưu trữ danh sách job bằng sessionStorage, giữ cho giao diện luôn sạch sẽ khi mở tab mới và hỗ trợ nút Xóa phiên tức thì.

### 3.5. Form nhập liệu thông minh (Smart Input Detection)
- Tự động nhận diện đường link dán vào (http:// hoặc https://) để chuyển sang chế độ Direct URL, đồng thời ẩn các ô cấu hình không cần thiết và hiển thị badge thông minh.

### 3.6. Trải nghiệm xóa sản phẩm tức thời (Optimistic UI)
- Khi xác nhận xóa, sản phẩm biến mất khỏi giao diện ngay lập tức trong khi API gửi lệnh ngầm, mang lại tốc độ phản hồi 0ms.

---

## 4. Hướng dẫn cài đặt & Chạy Frontend

### 4.1. Yêu cầu môi trường
- Node.js 18.x trở lên.
- Trình quản lý gói npm (hoặc yarn / pnpm).

### 4.2. Cài đặt & Khởi chạy
1. Chuyển vào thư mục dự án:
   ```bash
   cd Automation-Tool-E-Commerce-FE
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi chạy máy chủ phát triển Vite:
   ```bash
   npm run dev
   ```
4. Mở trình duyệt và truy cập: http://localhost:5173

---

# II. ENGLISH VERSION

## 1. Problem Statement & Objectives

The E-Commerce Scraper & AI Analysis Platform (Frontend) provides an intuitive, high-performance web interface for e-commerce market intelligence and automated data monitoring.

Key features include:
- Launching scraping tasks across Shopee and Lazada by search keyword or Direct Product URL.
- Live, session-scoped task monitoring with progress tracking.
- Centralized product catalog management with Google Gemini AI sentiment analysis and market price positioning (Lower, Higher, Fair).
- Multi-dimensional filtering, instant optimistic product deletion, and multi-format data export (CSV, Excel .xlsx, JSON .json).
- Seamless runtime language switching between Vietnamese (VI) and English (EN).

---

## 2. Frontend Architecture & Tech Stack

### 2.1. Technologies Used
- Core Framework: React 19, TypeScript 5, Vite 8.
- Styling: Tailwind CSS v4 with Dark Navy Glassmorphism design tokens.
- Routing: React Router DOM v7 (Single Page Application with nested layouts).
- HTTP Client: Axios with centralized base URL configuration and typed response handling.
- Internationalization (i18n): Native React Context API (LanguageContext) supporting seamless runtime switching between Vietnamese (VI) and English (EN), persisted in LocalStorage.
- Icons & Typography: Google Material Symbols Outlined, Google Fonts (Inter & JetBrains Mono).

### 2.2. Directory Layout
```
Automation-Tool-E-Commerce-FE/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components (ProgressBar, Card, Modal)
│   │   └── layout/          # Layout, Navbar (Search, Language Switcher), Sidebar
│   ├── context/
│   │   └── LanguageContext.tsx # Global i18n Language Context
│   ├── pages/
│   │   ├── DashboardPage.tsx   # Metrics overview & recent jobs log
│   │   ├── ScrapePage.tsx      # Job launch form & session monitor
│   │   └── ProductsPage.tsx    # Product catalog, AI insights, filters, export
│   ├── services/
│   │   └── api.ts              # API client wrapper
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces aligned with Backend DTOs
│   ├── utils/
│   │   └── format.ts           # Number, Currency (VND), and Date formatters
│   ├── App.tsx                 # Router setup & Context provider wrapping
│   └── index.css               # Design system definitions & Tailwind directives
└── package.json
```

---

## 3. Key Features & Technical Highlights

### 3.1. CDN Hotlink Protection Bypass (403 Shield)
- Implements meta referrer no-referrer and referrerPolicy="no-referrer" to bypass marketplace CDN referrer verification.
- Includes automatic fallback placeholders for broken image URLs.

### 3.2. Double Submit & Spam Click Prevention
- Utilizes useRef guards combined with loading states to eliminate concurrent duplicate job submissions.

### 3.3. Smart Reactive Polling
- Activates dynamic polling every 3 seconds for active jobs (RUNNING / PENDING) and automatically terminates timers upon completion to conserve resources.

### 3.4. Session-Only Task Monitoring
- Employs sessionStorage to isolate task history per session, keeping the UI uncluttered with support for manual session resets.

### 3.5. Smart Input Detection
- Automatically detects pasted URLs (http:// or https://) to switch to Direct URL mode while hiding redundant configuration fields.

### 3.6. Optimistic UI Updates
- Instantly removes deleted items from the view before API completion, delivering a 0ms perceived latency.

---

## 4. Frontend Setup & Run Guide

### 4.1. Prerequisites
- Node.js 18.x or higher.
- npm (or yarn / pnpm).

### 4.2. Installation & Run
1. Navigate to the project directory:
   ```bash
   cd Automation-Tool-E-Commerce-FE
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the web app at: http://localhost:5173
