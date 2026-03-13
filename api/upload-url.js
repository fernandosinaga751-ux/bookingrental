import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "POST only" });

  const { bookingId, filename, contentType, folder } = req.body || {};
  if (!bookingId || !filename || !contentType)
    return res.status(400).json({ error: "bookingId, filename, contentType wajib diisi" });

  const allowed = ["image/jpeg","image/png","image/webp","image/gif","application/pdf"];
  if (!allowed.includes(contentType))
    return res.status(400).json({ error: "Tipe file tidak diizinkan" });

  const dir  = folder === "invoice" ? "invoices" : "photos";
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key  = `${dir}/${bookingId}/${Date.now()}_${safe}`;

  try {
    const cmd = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(r2, cmd, { expiresIn: 300 });
    const publicUrl    = `${process.env.R2_PUBLIC_URL}/${key}`;
    return res.status(200).json({ presignedUrl, publicUrl, key });
  } catch (e) {
    console.error("R2 presign error:", e);
    return res.status(500).json({ error: "Gagal generate upload URL", detail: e.message });
  }
}
