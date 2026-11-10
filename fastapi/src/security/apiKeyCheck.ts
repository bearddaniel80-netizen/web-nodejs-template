import fs from "fs";
import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

export function readSecret(name: string): string {
  const path = `/run/secrets/${name}`;
  if (fs.existsSync(path)) {
    return fs.readFileSync(path, "utf8").trim();
  }
  // Local development outside Docker
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing secret: ${name}`);
  }
  return value;
}

const INTERNAL_API_KEY = readSecret("fastapi_internal_key");

export function verifyInternalKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const provided = Buffer.from(req.get("x-internal-key") ?? "");
  const expected = Buffer.from(INTERNAL_API_KEY);

  const ok =
    provided.length === expected.length &&
    crypto.timingSafeEqual(provided, expected);

  if (!ok) {
    res.status(403).json({ detail: "Forbidden" });
    return;
  }
  next();
}