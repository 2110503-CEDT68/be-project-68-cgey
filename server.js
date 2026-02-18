const express = require("express");
const dotenv = require("dotenv");
const dbconnection = require("./config/db");

dotenv.config({ path: "./config/.env" });

const app = express();
app.use(express.json());
dbconnection();
console.log("MONGO_URI:", process.env.MONGO_URI);

const auth = require("./routes/auth");
app.use("/api/v1/", auth);

const port = process.env.PORT || 5050;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
