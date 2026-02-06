import express from "express";

const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
  res.send("Express app is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
