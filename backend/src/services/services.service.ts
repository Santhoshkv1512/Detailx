import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(slug: string) {
    const service = await this.prisma.service.findUnique({
      where: { slug },
    });

    if (!service || !service.isActive) {
      throw new NotFoundException(`Service with slug "${slug}" not found`);
    }

    return service;
  }

  async getWashPricing(vehicleType?: string) {
    const where = vehicleType ? { vehicleType } : {};
    const pricing = await this.prisma.washPricing.findMany({
      where,
      orderBy: [{ package: 'asc' }, { vehicleType: 'asc' }],
    });

    // Group by package for convenience
    const grouped: Record<string, Record<string, number>> = {};
    for (const row of pricing) {
      if (!grouped[row.package]) {
        grouped[row.package] = {};
      }
      grouped[row.package][row.vehicleType] = row.priceInPaise;
    }

    return { pricing: grouped, raw: pricing };
  }
}
