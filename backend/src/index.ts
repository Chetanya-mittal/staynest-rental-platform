import dns from "dns";
import connectDB from "./config/db.js";
import app from "./app.js";
import env from "./config/env.js";

// Setting DNS
dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

connectDB(); // connect to database

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
