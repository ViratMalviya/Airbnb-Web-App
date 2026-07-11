# Airbnb Clone - Full Stack Web Application

This repository contains a full-stack clone of Airbnb, built with modern web technologies. It features a responsive design, dynamic dark mode, real-time search, an interactive host dashboard with image uploads, and a comprehensive booking and review system.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Variables for Dark Mode & Theming)
- **State Management**: React Context API (`ThemeContext`, `ToastContext`, `WishlistContext`)

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Data Validation**: Pydantic

## 🏗️ Architecture Overview

The application follows a decoupled client-server architecture:
1. **Client (Next.js)**: Handles all user interfaces, client-side routing, and state management. It communicates with the backend via RESTful API calls. Server Components are used for initial data fetching (SEO optimization), while Client Components handle interactivity.
2. **Server (FastAPI)**: Provides a robust, asynchronous REST API. It handles business logic, database transactions, and data integrity.
3. **Database (SQLite)**: A relational database storing users, listings, bookings, and reviews.

## 🗄️ Database Schema

The database consists of 4 primary tables:
- `users`: Stores user profiles (id, name, email, is_host, avatar_url).
- `listings`: Stores property details (id, host_id, title, location, price, property_type, amenities (JSON), image_urls (JSON), rating).
- `bookings`: Stores reservation data (id, listing_id, guest_id, check_in, check_out, guests, total_price, status).
- `reviews`: Stores guest feedback (id, listing_id, guest_id, rating, comment, created_at).

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 1. Backend Setup
```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic

# Run the server
python -m uvicorn main:app --reload
```
*The backend will run on `http://127.0.0.1:8000` and automatically seed the database on startup.*

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```
*The frontend will be available at `http://localhost:3000`.*

## 💡 Assumptions Made
- **Authentication**: For the scope of this prototype, authentication is mocked. The app automatically assumes the identity of a seeded Guest for bookings, and a seeded Host for the Host Dashboard.
- **Image Storage**: Cloud storage (AWS S3/Cloudinary) is bypassed in favor of Base64 encoding. Images uploaded via the Host Dashboard are converted to Base64 strings and stored directly in the SQLite database to allow immediate local testing without API keys.
- **Maps**: Map interfaces are currently represented by static placeholder components.

## 📜 License
This project is for educational purposes as a demonstration of full-stack development capabilities.
