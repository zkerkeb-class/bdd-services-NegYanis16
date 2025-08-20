const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resultsRoutes = require('./routes/resultsRoutes');

const app = express();

app.use(
  cors(
    'https://autenthication-service-staging.onrender.com',
    'https://service-ia-staging-avcv.onrender.com',
    'https://payment-services-staging.onrender.com'
  )
);
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(
  'mongodb+srv://yanis:yanis2001@cluster1.osxbdyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Utilisation des routes utilisateurs
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/results', resultsRoutes);

app.listen(3006, () => {
  console.log('Database service running on port 3006');
});
