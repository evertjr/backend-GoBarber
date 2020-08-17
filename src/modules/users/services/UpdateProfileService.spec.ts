import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/fakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Geovanni Henrique',
      email: 'geovanni@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Evert Junior',
      email: 'evert@email.com',
    });
    expect(updatedUser.name).toBe('Evert Junior');
    expect(updatedUser.email).toBe('evert@email.com');
  });
  it('should not be able to update inexistent profile', async () => {
    expect(
      updateProfile.execute({
        user_id: 'randomId',
        name: 'Test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to change the email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Geovanni Henrique',
      email: 'geovanni@email.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Geovanni Henrique',
        email: 'geovanni@email.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Geovanni Henrique',
      email: 'geovanni@email.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Evert Junior',
      email: 'evert@email.com',
      old_password: '123456',
      password: '123123',
    });
    expect(updatedUser.password).toBe('123123');
  });
  it('should be not be able to update the password without informing the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Geovanni Henrique',
      email: 'geovanni@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Evert Junior',
        email: 'evert@email.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should be not be able to update the password with incorrect previous password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Geovanni Henrique',
      email: 'geovanni@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Evert Junior',
        email: 'evert@email.com',
        old_password: 'wrong',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
