import express from "express";
import cors from "cors";
import loginRouter from "./routes/login.route.js";
import userRouter from "./routes/user.route.js";
import blogRouter from "./routes/blog.route.js";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use('/api', loginRouter);
app.use('/api', userRouter);
app.use('/api', blogRouter);

app.use((req, res) => {
    res.status(404).json("Ruta no encontrada");
})

export default app;