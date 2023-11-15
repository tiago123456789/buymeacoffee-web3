import { UserRepositoryInterface } from 'src/user/repositories/user-repository.interface';
import { StorageInterface } from './adapters/storage.interface';
import { PageCustomizedService } from './page-customized.service';
import { PageCustomized } from './page-customized.entity';
import { PageCustomizedRepositoryInterface } from './repositories/page-customized-repository-interface';
import { User } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { USER_CANT_HAVE_MANY_PAGES } from '../common/errors/message.error';

describe('PageCustomizedService unit tests', () => {
  let storage: jest.Mocked<StorageInterface>;
  let userRepository: jest.Mocked<UserRepositoryInterface<User>>;
  let repository: jest.Mocked<
    PageCustomizedRepositoryInterface<PageCustomized>
  >;

  const fakeLinkUpload = 'http://link.file.example.com.br';
  const fakeFile = Buffer.from('fake image');
  const fakeParams = {
    description: 'fake',
    enableTotalSupporters: true,
    featuredVideo: 'http://youtube.com.br',
    name: 'fake',
    themeColor: 'black',
    userId: randomUUID(),
    whatAreYouDoing: 'Test coding',
  };
  beforeEach(() => {
    storage = {
      upload: jest.fn(),
    };
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      getMetricsByUserId: jest.fn(),
      save: jest.fn(),
    };
    repository = {
      findByUserId: jest.fn(),
      save: jest.fn(),
    };
  });

  it('Should be throw exception when try save page customized', async () => {
    try {
      const pageCustomizedService = new PageCustomizedService(
        storage,
        userRepository,
        repository,
      );

      const fakePageCustomized = new PageCustomized();
      fakePageCustomized.description = 'fake';
      fakePageCustomized.enableTotalSupporters = true;
      fakePageCustomized.featuredVideo = 'http://youtube.com.br';
      fakePageCustomized.whatAreYouDoing = 'fake';
      fakePageCustomized.user = new User();
      fakePageCustomized.user.id = randomUUID();
      fakePageCustomized.themeColor = 'black';

      storage.upload.mockResolvedValue(fakeLinkUpload);
      repository.findByUserId.mockResolvedValue(fakePageCustomized);
      await pageCustomizedService.save(fakeParams, fakeFile);
    } catch (error) {
      expect(error.message).toBe(USER_CANT_HAVE_MANY_PAGES);
    }
  });

  it('Should be create page customized with success', async () => {
    const pageCustomizedService = new PageCustomizedService(
      storage,
      userRepository,
      repository,
    );

    const fakePageCustomized = new PageCustomized();
    fakePageCustomized.description = 'fake';
    fakePageCustomized.enableTotalSupporters = true;
    fakePageCustomized.featuredVideo = 'http://youtube.com.br';
    fakePageCustomized.whatAreYouDoing = 'fake';
    fakePageCustomized.user = new User();
    fakePageCustomized.user.id = randomUUID();
    fakePageCustomized.themeColor = 'black';

    storage.upload.mockResolvedValue(fakeLinkUpload);
    repository.findByUserId.mockResolvedValue(null);
    await pageCustomizedService.save(fakeParams, fakeFile);

    expect(repository.save).toHaveBeenCalledTimes(1);
  });
});
