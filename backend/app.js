import express from "express";
import product from "./routes/productRoute.js";
import errorMiddleware from "./middleware/error.js";
import user from "./routes/userRoute.js";
import order from "./routes/orderRoute.js";
import cookieParser from "cookie-parser";

// Routes import
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)

// Middleware for error
app.use(errorMiddleware)
export default app;