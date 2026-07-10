# Airbnb Web App Clone

This is a functional clone of the Airbnb web application. It replicates the core browse/search/booking workflows and the host CRUD experience.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Vanilla CSS
- **Backend:** Python, FastAPI, SQLAlchemy
- **Database:** SQLite

## Architecture Overview
The application follows a standard client-server architecture:
1. **Frontend (Next.js):** Communicates with the FastAPI backend via RESTful endpoints. Uses Vanilla CSS for styling to replicate the modern Airbnb aesthetic without utility libraries.
2. **Backend (FastAPI):** Handles business logic, input validation (via Pydantic), and database interactions (via SQLAlchemy).
3. **Database (SQLite):** Relational database storing Users, Listings, and Bookings.

## Database Schema

- **Users Table**
  - `id`: UUID (Primary Key)
  - `name`: String
  - `email`: String (Unique)
  - `is_host`: Boolean
  - `avatar_url`: String

- **Listings Table**
  - `id`: UUID (Primary Key)
  - `host_id`: UUID (Foreign Key -> Users.id)
  - `title`: String
  - `description`: Text
  - `location`: String
  - `price_per_night`: Float
  - `property_type`: String
  - `amenities`: JSON String
  - `image_urls`: JSON String
  - `rating`: Float

- **Bookings Table**
  - `id`: UUID (Primary Key)
  - `listing_id`: UUID (Foreign Key -> Listings.id)
  - `guest_id`: UUID (Foreign Key -> Users.id)
  - `check_in`: Date
  - `check_out`: Date
  - `guests`: Integer
  - `total_price`: Float
  - `status`: String

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `.\venv\Scripts\Activate.ps1`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install fastapi uvicorn sqlalchemy pydantic`
5. Run the development server: `uvicorn main:app --reload`
*Note: The database is seeded automatically with mock users and listings upon startup.*

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Assumptions
- Real payment processing is out of scope and is mocked.
- Image uploads are mocked by providing URLs directly to the database.
- A basic, mocked authentication strategy is employed (guest vs host mock contexts).
- Maps and messaging are represented as placeholders.
