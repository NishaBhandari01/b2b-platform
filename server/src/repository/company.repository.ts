import prisma from "../config/db.js";

class CompanyRepository {
  async createCompany(data: any) {
    return prisma.companyProfile.create({
      data,
    });
  }

  async getCompanyByUserId(userId: string) {
    return prisma.companyProfile.findUnique({
      where: {
        userId,
      },
      include: {
        documents: true,
        certifications: true,
        branches: true,
      },
    });
  }

  async updateCompany(userId: string, data: any) {
    const { documents, certifications, branches, ...companyData } = data;

    return prisma.companyProfile.update({
      where: {
        userId,
      },

      data: {
        ...companyData,

        ...(documents && {
          documents: {
            deleteMany: {},

            create: documents.map((doc: any) => ({
              name: doc.name,
              url: doc.url,
              status: doc.status ?? "pending",
            })),
          },
        }),

        ...(certifications && {
          certifications: {
            deleteMany: {},

            create: certifications.map((cert: any) => ({
              name: cert.name,
            })),
          },
        }),

        ...(branches && {
          branches: {
            deleteMany: {},

            create: branches.map((branch: any) => ({
              name: branch.name,
              location: branch.location,
            })),
          },
        }),
      },

      include: {
        documents: true,
        certifications: true,
        branches: true,
      },
    });
  }

  /**
   * Upload flow needs to add/replace a SINGLE document without wiping the
   * rest (unlike updateCompany's documents block, which deletes+recreates
   * the whole set). We key on companyId + name since CompanyDocument has
   * no dedicated "type" field.
   */
  async upsertDocumentByName(
    companyId: string,
    name: string,
    url: string,
    status: string = "pending",
  ) {
    const existing = await prisma.companyDocument.findFirst({
      where: { companyId, name },
    });

    if (existing) {
      return prisma.companyDocument.update({
        where: { id: existing.id },
        data: { url, status },
      });
    }

    return prisma.companyDocument.create({
      data: { companyId, name, url, status },
    });
  }
}

export default new CompanyRepository();
