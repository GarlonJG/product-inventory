import { Test, TestingModule } from '@nestjs/testing';
import { ItemService } from '../item.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ItemService', () => {
  let service: ItemService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: PrismaService,
          useValue: {
            item: {
              findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Item' }]),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all items', async () => {
    const items = await service.findAll();
    expect(Array.isArray(items)).toBe(true);
    expect(prisma.item.findMany).toHaveBeenCalled();
  });
});