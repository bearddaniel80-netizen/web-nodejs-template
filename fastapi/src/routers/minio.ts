import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { Client } from "minio";
import { readSecret, verifyInternalKey } from "../security/apiKeyCheck.js";
import { parseUploadUrlRequest } from "./dataModel.js";

const MINIO_BUCKET = process.env.MINIO_BUCKET;
if (!MINIO_BUCKET) throw new Error("MINIO_BUCKET is required");

const minioClient = new Client({
  endPoint: "minio",
  port: 9000,
  useSSL: false,
  accessKey: readSecret("minio_app_user"),
  secretKey: readSecret("minio_app_password"),
});

const router = Router();

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// Generate presigned upload URL
router.post(
  "/api/uploads",
  verifyInternalKey,
  async (req: Request, res: Response) => {
    const file = parseUploadUrlRequest(req.body);
    if (!file) {
      res
        .status(422)
        .json({ detail: "content_type and filename are required" });
      return;
    }

    const extension = file.filename.includes(".")
      ? "." + file.filename.split(".").pop()
      : "";
    const objectName = `${randomUUID()}${extension}`;

    try {
      const url = await minioClient.presignedPutObject(
        MINIO_BUCKET,
        objectName,
        24 * 60 * 60 // 1 day
      );
      res.json({ object_name: objectName, url });
    } catch (e) {
      console.error(errorMessage(e));
      res.status(500).json({ detail: errorMessage(e) });
    }
  }
);

// Generate download URL
router.get("/api/downloads/*", async (req: Request, res: Response) => {
  const objectName = req.params[0];

  try {
    const url = await minioClient.presignedGetObject(
      MINIO_BUCKET,
      objectName,
      10 * 60 // 10 minutes
    );
    res.json({ url });
  } catch (e) {
    res.status(500).json({ detail: errorMessage(e) });
  }
});

export default router;