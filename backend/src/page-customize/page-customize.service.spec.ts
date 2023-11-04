import { Test, TestingModule } from '@nestjs/testing';
import { PageCustomizeService } from './page-customize.service';

describe('PageCustomizeService', () => {
  let service: PageCustomizeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageCustomizeService],
    }).compile();

    service = module.get<PageCustomizeService>(PageCustomizeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
