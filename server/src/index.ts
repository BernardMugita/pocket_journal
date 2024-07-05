import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const cors = require("cors");
const app = express();

const db = require("./models/sequelize");
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/user_routes");
const journalRoutes = require("./routes/journal_routes");
const categoryRoutes = require("./routes/category_routes")

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Server Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/categories", categoryRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
