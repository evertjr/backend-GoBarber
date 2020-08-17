import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Geovanni Henrique',
      email: 'geovanni@email.com',
      password: '123456',
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });
    expect(profile.name).toBe('Geovanni Henrique');
    expect(profile.email).toBe('geovanni@email.com');
  });
  it('should not be able to show inexistent profile', async () => {
    expect(
      showProfile.execute({
        user_id: 'randomId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
