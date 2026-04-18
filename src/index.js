require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Sparklink API is running 🚀');
});

// ─── Auth (/auth) ─────────────────────────────────────────────────────────────
app.use('/auth', require('./routes/auth'));
app.use('/auth', require('./routes/password'));
// Stateless logout — client discards JWT
app.post('/auth/logout', (req, res) => {
  res.status(200).json({ status: true, message: 'Logged out successfully', data: [] });
});

// ─── API routes (/api) ────────────────────────────────────────────────────────
app.use('/api', require('./routes/profile'));           // GET|PUT /api/profile, POST /api/profile/photo, DELETE /api/profile/photo/:photoId
app.use('/api/interests', require('./routes/interests')); // GET /api/interests
app.use('/api', require('./routes/questionnaire'));     // GET /api/questions, POST /api/questionnaire, GET /api/questionnaire/:userId
app.use('/api', require('./routes/matches'));           // GET|POST /api/matches/*
app.use('/api', require('./routes/matchProfile'));      // GET /api/matches/:matchId/profile|contact
app.use('/api', require('./routes/availability'));      // GET|POST /api/availability, GET /api/availability/overlap/:matchId, GET /api/availability/:userId
app.use('/api', require('./routes/videoCalls'));        // POST|GET /api/video-calls, POST /api/video-calls/:callId/feedback, GET /api/video-calls/:match_id
app.use('/api', require('./routes/notifications'));     // GET /api/notifications, PUT /api/notifications/read|read-all
app.use('/api', require('./routes/rewards'));           // GET /api/rewards, GET /api/rewards/my-offers, POST /api/rewards/redeem
app.use('/api', require('./routes/gapReport'));         // GET /api/gap-report/:matchId, GET /api/gap-report/:matchId/reasons
app.use('/api', require('./routes/report'));            // POST /api/report
app.use('/api', require('./routes/account'));           // POST /api/profile/delete|settings
app.use('/api', require('./routes/users'));             // GET /api/users/:userId/profile

// ─── Swagger UI (/api-docs) ───────────────────────────────────────────────────
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../docs/swagger.json'))
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
