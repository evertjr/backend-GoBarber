import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Geovanni Henrique',
      email: 'geovanni@email.com',
      password: '123456',
    });
    const user2 = await fakeUsersRepository.create({
      name: 'Geovanni Henrique 2',
      email: 'geovanni2@email.com',
      password: '123456',
    });

    const signedUser = await fakeUsersRepository.create({
      name: 'Geovanni Signed',
      email: 'geovannisigned@email.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: signedUser.id,
    });
    expect(providers).toEqual([user1, user2]);
  });
});
