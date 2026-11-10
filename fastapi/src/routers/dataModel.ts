export interface UploadUrlRequest {
  content_type: string;
  filename: string;
}

export function parseUploadUrlRequest(body: unknown): UploadUrlRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.content_type !== "string" || typeof b.filename !== "string") {
    return null;
  }
  return { content_type: b.content_type, filename: b.filename };
}

export class FileList {
  constructor(public name: string) {}

  toDict(): { name: string } {
    return { name: this.name };
  }
}