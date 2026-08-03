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

  async getCompanyById(companyId: string) {
    return prisma.companyProfile.findUnique({
      where: {
        id: companyId,
      },

      include: {
        certifications: true,
        branches: true,
        documents: true,

        user: {
          select: {
            name: true,
            email: true,

            products: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });
  }

  async updateCompany(userId: string, data: any) {
    const { documents, certifications, branches, ...companyData } = data;

    // Only pass real scalar fields so extra client keys don't break Prisma
    const allowed = {
      name: companyData.name,
      gstNumber: companyData.gstNumber,
      panNumber: companyData.panNumber,
      established: companyData.established,
      employees: companyData.employees,
      description: companyData.description,
      website: companyData.website,
      email: companyData.email,
      phone: companyData.phone,
      headquarters: companyData.headquarters,
      industry: companyData.industry,
    };

    // Drop undefined so we don't overwrite with undefined
    const cleanData = Object.fromEntries(
      Object.entries(allowed).filter(([, v]) => v !== undefined),
    );

    return prisma.companyProfile.update({
      where: {
        userId,
      },
      data: {
        ...cleanData,

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
              // schema uses `label`, not `name`
              label: branch.label ?? branch.name,
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

  async getAllCompanies() {
    return prisma.companyProfile.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        name: true,
        industry: true,
        description: true,
        website: true,
        headquarters: true,
        verified: true,
        established: true,
        employees: true,

        certifications: {
          select: {
            id: true,
            name: true,
          },
        },

        user: {
          select: {
            products: {
              select: {
                id: true,
              },
            },
          },
        },

        _count: {
          select: {
            certifications: true,
            branches: true,
            favoriteBy: true,
          },
        },
      },
    });
  }
}

export default new CompanyRepository();
