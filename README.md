# ScamShield AI

Production-oriented MERN application for analysing potentially fraudulent text, URLs, screenshots and QR-code destinations.

## Quick start

1. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and `JWT_SECRET`.
2. `npm install`
3. `npm run install:all`
4. `npm run dev`

Client: `http://localhost:5173`; API: `http://localhost:5000/api`.

Without AI/reputation keys, the API uses a transparent local heuristic so the product remains demonstrable. Add `OPENAI_API_KEY` and `VIRUSTOTAL_API_KEY` in production to enable external enrichment.

## API

`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`  
`POST /api/analyses/text`, `/url`, `/screenshot`, `/qr` (authenticated)  
`GET|DELETE /api/analyses`, `GET /api/dashboard`  
`GET|POST /api/reports`, `POST /api/reports/:id/upvote`  
`GET /api/admin/stats`, `GET|DELETE /api/admin/users` (admin)

## Deployment

**MongoDB Atlas:** create a database user, allow your deployment IP, and set its connection string as `MONGO_URI`.

**Render:** create a Node Web Service rooted at `server`, set build command `npm install`, start command `npm start`, and add all variables from `.env.example`. Set `CLIENT_URL` to the Vercel URL.

**Vercel:** import the repo with root directory `client`, build command `npm run build`, output `dist`, and set `VITE_API_URL=https://your-render-service.onrender.com/api`.

Security measures include Helmet headers, CORS allow-listing, rate limits, Joi validation, Mongo sanitization, JWTs, bcrypt passwords, protected role routes, and restrictive upload validation.
