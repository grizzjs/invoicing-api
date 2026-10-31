import { Test, TestingModule } from '@nestjs/testing';
import { LineItemsController } from './line-items.controller';

describe('LineItemsController', () => {
  let controller: LineItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineItemsController],
    }).compile();

    controller = module.get<LineItemsController>(LineItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
