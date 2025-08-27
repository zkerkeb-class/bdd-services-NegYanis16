const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resultsRoutes = require('./routes/resultsRoutes');

const app = express();
const cors = require('cors');
app.use(cors(
  "https://autenthication-service-staging.onrender.com",
  "https://service-ia-staging-avcv.onrender.com",
  "https://payment-services-staging.onrender.com",
  "https://front-neg-yanis16-bxt5.vercel.app",
  "http://localhost:3000"
));
app.use(express.json());



// Connexion à MongoDB
mongoose.connect("mongodb+srv://yanis:yanis2001@cluster1.osxbdyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1", { useNewUrlParser: true, useUnifiedTopology: true });

// Utilisation des routes utilisateurs
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/results', resultsRoutes);

app.listen(3006, () => {
  console.log('Database service running on port 3006');
});
