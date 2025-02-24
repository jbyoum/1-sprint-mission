import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import articleRouter from "./routes/article.js";
import productRouter from "./routes/product.js";
import uploadRouter from "./routes/upload.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://127.0.0.1:3000",
    "https://one-sprint-mission-3.onrender.com",
  ],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use("/download", express.static("files"));

app.use("/products", productRouter);

app.use("/articles", articleRouter);

app.use("/upload", uploadRouter);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
