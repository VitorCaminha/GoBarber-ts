import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await createUser.execute({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'vitorcaminha@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.token).toBeTruthy();
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non-existing e-mail', async () => {
    await expect(
      authenticateUser.execute({
        email: 'vitorcaminha1@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await createUser.execute({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'vitorcaminha@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
