import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

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

  it('it should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Vitor Caminha',
      email: 'vitorcaminha@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Vitor Leao',
      email: 'vitorcaminha2@gmail.com',
    });

    expect(updatedUser.name).toBe('Vitor Leao');
    expect(updatedUser.email).toBe('vitorcaminha2@gmail.com');
  });

  it('it should not be able to update the non-existing user profile', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Vitor Caminha',
        email: 'vitorcaminha@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the email to an already existing email', async () => {
    await fakeUsersRepository.create({
      name: 'Vitor Caminha',
      email: 'vitorcaminha2@gmail.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Vitor Caminha',
      email: 'vitorcaminha@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Vitor Leao',
        email: 'vitorcaminha2@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Vitor Caminha',
      email: 'vitorcaminha@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Vitor Leao',
      email: 'vitorcaminha2@gmail.com',
      password: '123123',
      oldPassword: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('it should not be able to update the password without the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Vitor Caminha',
      email: 'vitorcaminha@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Vitor Leao',
        email: 'vitorcaminha2@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('it should not be able to update the password with the wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Vitor Caminha',
      email: 'vitorcaminha@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Vitor Leao',
        email: 'vitorcaminha2@gmail.com',
        password: '123123',
        oldPassword: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
