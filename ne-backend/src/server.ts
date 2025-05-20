import app from "./app";
import { config } from "dotenv";

config();
console.log("🔥 bootstrapping server.ts");


const PORT = process.env.PORT || 3000;

console.log("🛡️ about to call app.listen");
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}/api`);
  console.log(`📚 API docs available at http://localhost:${PORT}/docs`);
});
server.on('error', (err) => console.log(err))
