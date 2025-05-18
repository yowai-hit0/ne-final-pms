import app from './app';
import { config } from 'dotenv';


config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}/api`);
  console.log(`📚 API docs available at http://localhost:${PORT}/docs`);
});

