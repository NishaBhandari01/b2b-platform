import companyRepository from "../repository/company.repository.js";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { r2, bucketName, R2_PUBLIC_BASE_URL } from "../config/r2.js";

// Fixed set of expected document names — matches what the UI renders as
// rows even before anything has been uploaded.
export const REQUIRED_DOCUMENT_NAMES = [
  "GST Certificate",
  "PAN Card",
  "Company Registration",
  "Bank Statement",
];

class CompanyService {
  private companyRepository;

  constructor(companyRepository: any) {
    this.companyRepository = companyRepository;
  }

  async createCompanyProfile(userId: string, data: any) {
    const existingCompany =
      await this.companyRepository.getCompanyByUserId(userId);

    if (existingCompany) {
      throw new Error("Company Profile already existed");
    }

    return this.companyRepository.createCompany({
      userId,
      ...data,
    });
  }

  async getCompanyProfile(userId: string) {
    const company = await this.companyRepository.getCompanyByUserId(userId);

    if (!company) {
      throw new Error("Company not Found!");
    }

    return company;
  }

  async updateCompanyProfile(userId: string, data: any) {
    const company = await this.companyRepository.getCompanyByUserId(userId);

    if (!company) {
      throw new Error("Company profile not found");
    }

    return this.companyRepository.updateCompany(userId, data);
  }

  async uploadCompanyDocument(
    userId: string,
    documentName: string,
    file: Express.Multer.File,
  ) {
    if (!REQUIRED_DOCUMENT_NAMES.includes(documentName)) {
      throw new Error("Invalid document name");
    }

    const company = await this.companyRepository.getCompanyByUserId(userId);
    if (!company) {
      throw new Error("Company profile not found");
    }

    const ext = file.originalname.split(".").pop();
    const fileKey = `companies/${company.id}/documents/${documentName
      .toLowerCase()
      .replace(/\s+/g, "-")}-${randomUUID()}.${ext}`;

    await r2.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const url = R2_PUBLIC_BASE_URL
      ? `${R2_PUBLIC_BASE_URL}/${fileKey}`
      : await getSignedUrl(
          r2,
          new GetObjectCommand({ Bucket: bucketName, Key: fileKey }),
          { expiresIn: 60 * 60 * 24 * 7 }, // 7 days
        );

    // Best-effort cleanup of the previous file for this document slot.
    // Only works when the bucket is public (we can derive the key from the
    // stored URL); with signed private URLs we skip this rather than risk
    // deleting the wrong object.
    const existingDoc = company.documents.find(
      (d: any) => d.name === documentName,
    );
    if (
      existingDoc?.url &&
      R2_PUBLIC_BASE_URL &&
      existingDoc.url.startsWith(R2_PUBLIC_BASE_URL)
    ) {
      const oldKey = existingDoc.url.replace(`${R2_PUBLIC_BASE_URL}/`, "");
      try {
        await r2.send(
          new DeleteObjectCommand({ Bucket: bucketName, Key: oldKey }),
        );
      } catch (e) {
        console.warn("Failed to delete old R2 object:", (e as Error).message);
      }
    }

    return this.companyRepository.upsertDocumentByName(
      company.id,
      documentName,
      url,
      "uploaded",
    );
  }
}

export default new CompanyService(companyRepository);
