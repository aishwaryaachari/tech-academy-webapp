# Tech Academy Webapp

Frontend for the Tech Academy e-learning platform. Built with React (Vite), React Router, and Axios.

## Tech Stack
- **Framework**: React 18 + Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS (monochromatic design system)
- **Deployment**: Render (Static Site)

## Pages
| Route | Page | Auth Required |
|-------|------|--------------|
| `/` | Home — Hero + featured courses | No |
| `/courses` | Course catalog with filters | No |
| `/courses/:id` | Course detail + enroll | No |
| `/login` | Login form | No |
| `/register` | Register form | No |
| `/dashboard` | My enrolled courses | Yes |

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/your-username/tech-academy-webapp.git
cd tech-academy-webapp
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# .env already set to http://localhost:5000/api for local dev
```

### 3. Make sure the backend is running
See [tech-academy-api](https://github.com/your-username/tech-academy-api)

### 4. Start development server
```bash
npm run dev
```

App runs at: `http://localhost:5173`

## Deployment on Render
1. Create a **Static Site** on Render
2. Connect this GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = your backend Render URL + `/api`
   (e.g. `https://tech-academy-api.onrender.com/api`)
