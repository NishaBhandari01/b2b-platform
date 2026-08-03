import companyRepository from "../repository/company.repository.js";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { r2, bucketName, R2_PUBLIC_BASE_URL } from "../config/r2.js";

export const REQUIRED_DOCUMENT_NAMES = [
  "GST Certificate",
  "PAN Card",
  "Company Registration",
  "Bank Statement",
];

/** Scalar fields allowed on create / update */
function pickCompanyFields(data: any) {
  const allowed = [
    "name",
    "gstNumber",
    "panNumber",
    "established",
    "employees",
    "description",
    "website",
    "email",
    "phone",
    "headquarters",
    "industry",
  ] as const;

  const result: Record<string, unknown> = {};
  for (const key of allowed) {
    if (data[key] !== undefined) {
      result[key] = data[key];
    }
  }
  return result;
}

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

    if (!data?.name?.trim()) {
      throw new Error("Company name is required");
    }

    return this.companyRepository.createCompany({
      userId,
      ...pickCompanyFields(data),
    });
  }

  async getCompanyProfile(userId: string) {
    const company = await this.companyRepository.getCompanyByUserId(userId);

    if (!company) {
      throw new Error("Company not Found!");
    }

    return company;
  }

  async getCompanyById(companyId: string) {
    const company = await companyRepository.getCompanyById(companyId);

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  }

  async getAllCompanies() {
    const companies = await companyRepository.getAllCompanies();

    return companies;
  }

  async updateCompanyProfile(userId: string, data: any) {
    const company = await this.companyRepository.getCompanyByUserId(userId);

    if (!company) {
      throw new Error("Company profile not found");
    }

    return this.companyRepository.updateCompany(userId, {
      ...pickCompanyFields(data),
      // pass nested arrays only if client sends them
      ...(data.documents !== undefined && { documents: data.documents }),
      ...(data.certifications !== undefined && {
        certifications: data.certifications,
      }),
      ...(data.branches !== undefined && { branches: data.branches }),
    });
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
          { expiresIn: 60 * 60 * 24 * 7 },
        );

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
