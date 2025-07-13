import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import morgan from "morgan";
import chalk from "chalk";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;
const allowedOrigin = process.env.URL || 'http://localhost:5173';

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
};

// 🪵 Log all requests with custom format
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(morgan((tokens, req, res) => {
  return [
    chalk.cyan(tokens.method(req, res)),
    chalk.yellow(tokens.url(req, res)),
    chalk.green(tokens.status(req, res)),
    chalk.magenta(`${tokens['response-time'](req, res)} ms`),
    chalk.gray("→"),
    chalk.white("body:"),
    chalk.gray(tokens.body(req, res)),
  ].join(" ");
}));

// 🌐 Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// 🧩 Custom Timing Logger (optional)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      chalk.blueBright(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`)
    );
  });
  next();
});

// 📦 Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);

// 🚀 Start Server
app.listen(PORT, () => {
  connectDB();
  console.log(chalk.greenBright(`✅ Server listening on port ${PORT}`));
});
