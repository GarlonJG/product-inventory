import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ItemController } from '../item.controller';
import { ItemService } from '../item.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppModule } from '../../../app.module';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let controller: ItemController;
  let service: ItemService;

  const mockItemService = {
    findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Test Item' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [ItemController],
      providers: [
        {
          provide: ItemService,
          useValue: mockItemService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  it('/GET items', () => {
    return request(app.getHttpServer())
      .get('/items')
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});