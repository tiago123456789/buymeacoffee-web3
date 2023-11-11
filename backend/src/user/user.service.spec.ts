import { TokeInterface } from 'src/common/adapters/token.interface';
import { EncrypterInterface } from './adapters/encrypter.interface';
import { SocialMedia } from './entities/social-media.entity';
import { User } from './entities/user.entity';
import { SocialMediaRepositoryInterface } from './repositories/social-media-repository.interface';
import { UserRepositoryInterface } from './repositories/user-repository.interface';
import { UserService } from './user.service';
import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import {
  EMAIL_ALREADY_USED,
  INVALID_CREDENTIALS,
  NAME_ALREADY_USED,
  USER_NOT_FOUND,
} from '../common/errors/message.error';

describe('UserService unit tests', () => {
  let socialMediaRepository: jest.Mocked<
    SocialMediaRepositoryInterface<SocialMedia>
  >;
  let repository: jest.Mocked<UserRepositoryInterface<User>>;
  let encrypterAdapter: jest.Mocked<EncrypterInterface>;
  let tokenAdapter: jest.Mocked<TokeInterface>;
  let fakeUser;
  beforeEach(async () => {
    socialMediaRepository = {
      save: jest.fn(),
    };
    repository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      getMetricsByUserId: jest.fn(),
      save: jest.fn(),
    };
    encrypterAdapter = {
      getHash: jest.fn(),
      isValid: jest.fn(),
    };
    tokenAdapter = {
      get: jest.fn(),
      isValid: jest.fn(),
    };

    fakeUser = new User();
    fakeUser.email = 'teste@gmail.com';
    fakeUser.name = 'fake teste';
    fakeUser.password = await hash('123456', 8);
    fakeUser.walletAddress = randomUUID();
  });

  it('Should be throw exception when try authenticate to invalid credentials', async () => {
    try {
      const userService = new UserService(
        socialMediaRepository,
        repository,
        encrypterAdapter,
        tokenAdapter,
      );

      repository.findByEmail.mockReturnValue(Promise.resolve(fakeUser));

      await userService.authenticate({
        email: 'teste@gmail.com',
        password: '123456789',
      });
    } catch (error) {
      expect(error.message).toBe(INVALID_CREDENTIALS);
    }
  });

  it('Should be authenticate with success', async () => {
    const userService = new UserService(
      socialMediaRepository,
      repository,
      encrypterAdapter,
      tokenAdapter,
    );

    repository.findByEmail.mockResolvedValue(fakeUser);
    encrypterAdapter.isValid.mockResolvedValue(true);

    await userService.authenticate({
      email: 'teste@gmail.com',
      password: '123456',
    });

    expect(encrypterAdapter.isValid).toBeCalledTimes(1);
    expect(tokenAdapter.get).toBeCalledTimes(1);
  });

  it('Should be throw exception when try create new user, but email already used', async () => {
    try {
      const userService = new UserService(
        socialMediaRepository,
        repository,
        encrypterAdapter,
        tokenAdapter,
      );

      repository.findByEmail.mockResolvedValue(fakeUser);
      repository.findByName.mockResolvedValue(fakeUser);

      await userService.register({
        name: fakeUser.name,
        email: fakeUser.email,
        walletAddress: fakeUser.walletAddress,
        password: '123456',
      });
    } catch (error) {
      expect(error.message).toBe(EMAIL_ALREADY_USED);
    }
  });

  it('Should be throw exception when try create new user, but email already used', async () => {
    try {
      const userService = new UserService(
        socialMediaRepository,
        repository,
        encrypterAdapter,
        tokenAdapter,
      );

      repository.findByEmail.mockResolvedValue(fakeUser);
      repository.findByName.mockResolvedValue(fakeUser);

      await userService.register({
        name: fakeUser.name,
        email: fakeUser.email,
        walletAddress: fakeUser.walletAddress,
        password: '123456',
      });
    } catch (error) {
      expect(error.message).toBe(EMAIL_ALREADY_USED);
    }
  });

  it('Should be throw exception when try create new user, but name already used', async () => {
    try {
      const userService = new UserService(
        socialMediaRepository,
        repository,
        encrypterAdapter,
        tokenAdapter,
      );

      repository.findByEmail.mockResolvedValue(null);
      repository.findByName.mockResolvedValue(fakeUser);

      await userService.register({
        name: fakeUser.name,
        email: fakeUser.email,
        walletAddress: fakeUser.walletAddress,
        password: '123456',
      });
    } catch (error) {
      expect(error.message).toBe(NAME_ALREADY_USED);
    }
  });

  it('Should be create new user with success', async () => {
    const userService = new UserService(
      socialMediaRepository,
      repository,
      encrypterAdapter,
      tokenAdapter,
    );

    repository.findByEmail.mockResolvedValue(null);
    repository.findByName.mockResolvedValue(null);

    await userService.register({
      name: fakeUser.name,
      email: fakeUser.email,
      walletAddress: fakeUser.walletAddress,
      password: '123456',
    });
    expect(encrypterAdapter.getHash).toHaveBeenCalledTimes(1);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('Should be throw exception when try add social links to user, but user not exist', async () => {
    try {
      const userService = new UserService(
        socialMediaRepository,
        repository,
        encrypterAdapter,
        tokenAdapter,
      );

      repository.findById.mockResolvedValue(null);
      await userService.addSocialMediaLink({
        link: 'http://link.example.com.br',
        userId: randomUUID(),
      });
    } catch (error) {
      expect(error.message).toBe(USER_NOT_FOUND);
    }
  });

  it('Should be add social links to user with success', async () => {
    const userService = new UserService(
      socialMediaRepository,
      repository,
      encrypterAdapter,
      tokenAdapter,
    );

    repository.findById.mockResolvedValue(fakeUser);

    await userService.addSocialMediaLink({
      link: 'http://link.example.com.br',
      userId: randomUUID(),
    });
    expect(socialMediaRepository.save).toHaveBeenCalledTimes(1);
  });
});
