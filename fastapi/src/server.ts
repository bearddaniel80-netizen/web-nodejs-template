import express, { Request, Response } from "express";
import cors from "cors";
import { verifyInternalKey } from "./security/apiKeyCheck.js";
import minioRouter from "./routers/minio.js";

const app = express();

app.use(
  cors({
    origin: ["http://frontend:5173"],
    credentials: true,
  })
);
app.use(express.json());

app.use(minioRouter);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/api/data", verifyInternalKey, (_req: Request, res: Response) => {
  res.json({ message: "Hello from Express" });
});

const port = Number(process.env.PORT ?? 8000);
app.listen(port, () => console.log(`Listening on ${port}`));