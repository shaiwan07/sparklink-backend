require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 👈 ADD THIS
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

// ✅ CORS middleware (IMPORTANT)
app.use(cors({
  origin: "*", // production में domain डाल सकते हो
  methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Sparklink API is running 🚀');
});

// Profile routes
const profileRoutes = require('./routes/profile');
app.use('/api', profileRoutes);

// Interests routes
const interestsRoutes = require('./routes/interests');
app.use('/api/interests', interestsRoutes);

// Questionnaire routes
const questionnaireRoutes = require('./routes/questionnaire');
app.use('/api', questionnaireRoutes);

// Matches routes
const matchesRoutes = require('./routes/matches');
app.use('/api', matchesRoutes);

// Notifications routes
const notificationsRoutes = require('./routes/notifications');
app.use('/api', notificationsRoutes);

// Rewards routes
const rewardsRoutes = require('./routes/rewards');
app.use('/api', rewardsRoutes);

// Video Calls routes
const videoCallsRoutes = require('./routes/videoCalls');
app.use('/api', videoCallsRoutes);

// Account routes
const accountRoutes = require('./routes/account');
app.use('/api', accountRoutes);

// Swagger setup
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../docs/swagger.json'))
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Password routes
const passwordRoutes = require('./routes/password');
app.use('/auth', passwordRoutes);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
