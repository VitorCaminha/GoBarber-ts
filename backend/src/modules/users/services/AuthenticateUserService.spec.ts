import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    await createUser.execute({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository);

    const { token } = await authenticateUser.execute({
      email: 'vitorcaminha@gmail.com',
      password: '123456',
    });

    expect(token).toBeTruthy();
  });

  it('should not be able to authenticate with wrong e-mail', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    await createUser.execute({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository);

    expect(
      authenticateUser.execute({
        email: 'vitorcaminha1@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    await createUser.execute({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const authenticateUser = new AuthenticateUserService(fakeUsersRepository);

    expect(
      authenticateUser.execute({
        email: 'vitorcaminha@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
