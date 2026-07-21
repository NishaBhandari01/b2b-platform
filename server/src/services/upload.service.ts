import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { r2 } from "../config/r2.js";

export async function uploadFile(file: Express.Multer.File, folder: string) {
  const extension = file.originalname.split(".").pop();

  const key = `${folder}/${uuid()}.${extension}`;

  const bucket = process.env.R2_BUCKET!;
  console.log("=== UPLOAD SERVICE ===");
  console.log("Bucket:", bucket);
  console.log("Key:", key);
  console.log("ContentType:", file.mimetype);

  try {
    await r2.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    console.log("Upload to R2 successful!");
  } catch (error) {
    console.error("Error during R2 upload:", error);
    throw error;
  }

  return {
    key,
    url: `${process.env.R2_PUBLIC_URL}/${key}`,
  };
}
