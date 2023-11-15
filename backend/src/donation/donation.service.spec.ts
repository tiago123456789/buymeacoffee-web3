import { UserRepositoryInterface } from '../user/repositories/user-repository.interface';
import { Donation } from './donation.entity';
import { DonationService } from './donation.service';
import { DonationRepositoryInterface } from './repositories/donation-repository.interface';
import { User } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { USER_NOT_FOUND } from '../common/errors/message.error';
import { hash } from 'bcryptjs';

describe('DonationService unit tests', () => {
  let repository: jest.Mocked<DonationRepositoryInterface<Donation>>;
  let userRepository: jest.Mocked<UserRepositoryInterface<User>>;
  const receiverId = randomUUID();
  let fakeUser: User;
  beforeEach(async () => {
    repository = {
      findPaginateByReceiverId: jest.fn(),
      save: jest.fn(),
    };

    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findByName: jest.fn(),
      getMetricsByUserId: jest.fn(),
      save: jest.fn(),
    };

    fakeUser = new User();
    fakeUser.email = 'teste@gmail.com';
    fakeUser.name = 'fake teste';
    fakeUser.password = await hash('123456', 8);
    fakeUser.walletAddress = randomUUID();
  });

  it('Should be throw exception when try donate ethereum for user no exist', async () => {
    try {
      userRepository.findById.mockResolvedValue(null);
      const donationService = new DonationService(repository, userRepository);
      await donationService.save({
        donatorAddress: randomUUID(),
        message: '',
        receiverId,
        value: 0.01,
      });
    } catch (error) {
      expect(error.message).toBe(USER_NOT_FOUND);
    }
  });

  it('Should be donate ethereum for user with success', async () => {
    userRepository.findById.mockResolvedValue(fakeUser);
    const donationService = new DonationService(repository, userRepository);
    await donationService.save({
      donatorAddress: randomUUID(),
      message: '',
      receiverId,
      value: 0.01,
    });

    expect(repository.save).toHaveBeenCalledTimes(1);
  });
});
