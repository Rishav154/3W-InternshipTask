# Mini Social Post Application

A clean, premium full-stack Social Post Application featuring account creation, custom post creation (text, image, or both), public feed viewing, pagination, and real-time like/comment interactions. Inspired by the TaskPlanet UI design.

---

## 🚀 Key Features
- **User Authentication**: Secure sign up and login with passwords hashed using `bcryptjs` and session tokens handled via `jsonwebtoken` (JWT).
- **Create Post**: Post text, images (base64 data), or both. Validation ensures posts are not empty.
- **Dynamic Feed**: Browse all posts in chronological order, with responsive pagination controls.
- **Client-side Sorting Tab Filter**: Sort posts instantly on the frontend by *All Posts*, *For You* (shuffled), *Most Liked*, or *Most Commented*.
- **Interactive Liking & Commenting**:
  - Like/unlike posts instantly with **Optimistic UI updates** for instant visual feedback.
  - Interactive hover dropdown displaying the usernames of people who liked the post.
  - Comment drawer showing comments in chronological order with instant appending.
- **Premium UI Design**: Built using custom vanilla CSS featuring glassmorphism, Star/Rupee badges, dynamic floating action buttons (FAB), and smooth micro-animations.

---

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite) + Lucide Icons + Custom CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)

---

## 📁 Folder Structure
```
3WFullstackInternship/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Connection (db.js)
│   │   ├── middleware/      # Auth security middleware (auth.js)
│   │   ├── models/          # Mongoose Schemas (User.js, Post.js)
│   │   ├── routes/          # Express Routers (auth.js, posts.js)
│   │   └── server.js        # Main server entrypoint
│   ├── .env                 # Database & JWT Secrets
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Auth, Feed, Navbar, BottomNav)
│   │   ├── context/         # AuthContext global state
│   │   ├── App.jsx          # Modals and overall Layout
│   │   ├── App.css          # Theme styles & custom CSS
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js installed on your system.
- A MongoDB Atlas database connection string (configured in `backend/.env`).

### 1. Install Dependencies
Install dependencies in both the backend and frontend folders separately:
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment Variables
The backend environment is configured in `backend/.env`.
```ini
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

### 3. Run the Application
Open two terminal windows to run both servers:

**Terminal 1 (Backend):**
```bash
cd backend
npm run start
```
- Runs the API server at `http://localhost:5000`

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
- Runs the Vite React dev server at `http://localhost:5173`

---

## ☁️ Deployment Guidelines

- Hosted on **MongoDB Atlas** (using your configured connection URI).

### Backend (e.g. Render)
1. Link your public GitHub repository to a new web service on Render.
2. Set build command to `npm install` and start command to `npm start` (with directory pointing to `backend/`).
3. Add environmental variables:
   - `MONGODB_URI` = `<your_mongodb_atlas_uri>`
   - `JWT_SECRET` = `<secure_random_key>`
   - `NODE_ENV` = `production`

### Frontend (e.g. Vercel / Netlify)
1. Create a new project pointing to the `frontend/` subdirectory.
2. Set build command to `npm run build` and output directory to `dist`.
3. Set environment variable:
   - `VITE_API_URL` = `https://<your-render-backend-url>/api`
