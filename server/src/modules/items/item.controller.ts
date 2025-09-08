// item.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, Query, NotFoundException } from '@nestjs/common';
import { ItemService } from './item.service';
import { z } from 'zod';

export const ItemSchema = z.object({
    name: z.string().max(100).min(1),
    stock: z.number().int(),
    sku: z.string().length(6).regex(/^\d+$/, "SKU must be exactly 6 digits"),
    price: z.number().min(0).multipleOf(0.01, {
      message: "Price must have at most 2 decimal places"
    }),
    description: z.string().max(255).optional()
});
export const CreateSchema = ItemSchema;
export const UpdateSchema = ItemSchema.partial().refine((data) => Object.keys(data).length > 0, { message: 'Provide at least one field to update' });
export const IdParam = z.coerce.number().int().positive();

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