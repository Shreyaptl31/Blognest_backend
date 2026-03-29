const express = require("express");
const app = express();
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

require("./db");
const port = process.env.PORT || 3000;
const routes = require("./Route/route");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));
app.use("/", routes);

app.get("/", (req, res) => res.send("BlogNest API Running ✅"));
app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));