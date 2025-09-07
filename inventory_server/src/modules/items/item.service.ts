// item.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  findAll(where?: any) {
    return this.prisma.item.findMany({ where, orderBy: { id: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.item.findUnique({ where: { id } });
  }

  create(data: any) {
    return this.prisma.item.create({ data });
  }

  update(id: number, data: any) {
    return this.prisma.item.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.item.delete({ where: { id } });
  }
}