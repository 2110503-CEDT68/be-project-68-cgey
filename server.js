const express = require("express");
const dotenv = require("dotenv");

dotenv.config({ path: "../config/.env" });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 5050;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
