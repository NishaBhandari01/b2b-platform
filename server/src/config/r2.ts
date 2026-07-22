import { S3Client } from "@aws-sdk/client-s3";

// Matches your .env exactly:
//   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT (full URL), R2_BUCKET
export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT as string,
  forcePathStyle: true, // required for R2 with the AWS SDK v3 S3 client
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

export const bucketName = process.env.R2_BUCKET as string;

// You don't have this set, so the bucket is treated as private and every
// document URL is a signed GetObject URL (valid 7 days — re-signed on every
// profile fetch, see uploadCompanyDocument/getCompanyProfile).
// If you later attach a public bucket domain in the R2 dashboard, set
// R2_PUBLIC_BASE_URL and uploads will use permanent public URLs instead.
export const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;
