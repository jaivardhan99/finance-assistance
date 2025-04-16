import express from 'express';
import chatRoute from './routes/chat'; // Adjust the path if necessary

const app = express();
app.use(express.json()); // To parse JSON requests

// Use the /api/chat route
app.use('/api', chatRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
