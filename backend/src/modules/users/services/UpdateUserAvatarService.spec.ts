import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('should be able to create avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    const newUser = await createUser.execute({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository);

    const user = await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'teste.jpg',
    });

    expect(user.avatar).toBe('teste.jpg');
  });

  it('should not be able to update avatar from user with wrong id', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository);

    expect(
      updateUserAvatar.execute({
        user_id: '1',
        avatarFilename: 'teste.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const createUser = new CreateUserService(fakeUsersRepository);

    const newUser = await createUser.execute({
      email: 'vitorcaminha@gmail.com',
      name: 'Vitor Caminha',
      password: '123456',
    });

    const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository);

    await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'eea5bc638a4df55f7e0b-50715987.jpg',
    });

    const user = await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'teste2.jpg',
    });

    expect(user.avatar).toBe('teste2.jpg');
  });
});
