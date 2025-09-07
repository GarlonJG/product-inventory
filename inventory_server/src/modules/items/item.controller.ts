// item.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { ItemService } from './item.service';
import { z } from 'zod';

const IdParam = z.coerce.number().int().positive();
const CreateSchema = z.object({
    name: z.string().min(1),
    stock: z.number().min(0),
    sku: z.string().min(1).regex(/^[a-zA-Z0-9]+$/, {
        message: "SKU must contain only letters and numbers"
    })
});
const UpdateSchema = z.object({
    name: z.string().min(1).optional(),
    stock: z.number().min(0).optional(),
    sku: z.string().min(1).regex(/^[a-zA-Z0-9]+$/, {
        message: "SKU must contain only letters and numbers"
    }).optional()
}).refine((data) => Object.keys(data).length > 0, { message: 'Provide at least one field to update' });

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  async getAll(@Query('search') search?: string) {
    const where = search
      ? { OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } }
        ]}
      : undefined;
    return this.itemService.findAll(where);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const parsedId = IdParam.parse(id);
    const item = await this.itemService.findOne(parsedId);
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  @Post()
  async create(@Body() body: any) {
    const data = CreateSchema.parse(body);
    return this.itemService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const parsedId = IdParam.parse(id);
    const data = UpdateSchema.parse(body);
    try {
      return await this.itemService.update(parsedId, data);
    } catch (err) {
      // Prisma error handling, e.g. code P2025 (not found)
      if ((err?.code) === 'P2025') throw new NotFoundException('Item not found');
      throw err;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const parsedId = IdParam.parse(id);
    try {
      await this.itemService.delete(parsedId);
      return { status: 204 };
    } catch (err) {
      if ((err?.code) === 'P2025') throw new NotFoundException('Item not found');
      throw err;
    }
  }
}