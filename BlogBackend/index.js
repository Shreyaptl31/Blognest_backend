const express = require("express");
const app = express();
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("./db");
const port = process.env.PORT || 3000;
const routes = require("./Route/route");
const googleLoginRoute = require("./Route/googleLogin");

// ✅ CORS must be first — before any routes or body parsers
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://blogpost-blogging.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", googleLoginRoute);
app.use("/", routes);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => res.send("BlogNest API Running ✅"));

app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));