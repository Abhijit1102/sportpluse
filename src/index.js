import express from "express";
import { matchRouter } from "./routers/matches.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express app is running 🚀");
});

app.use("/matches", matchRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
