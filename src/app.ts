import express, { Express } from "express";
import morgan from "morgan";
import authRouter from "./routes/authRoute.js";
import { GlobalErrorHandler } from "./utils/middlewares.js";

const app: Express = express();
const PORT = 3001;
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/auth", authRouter);

// error handler
app.use(GlobalErrorHandler);

app.listen(PORT, () => console.log(`Running at port :${PORT}`));
