import AppError from '@shared/errors/AppError';
import FakeAppointmentRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointementService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentRepository;

let createAppointment: CreateAppointementService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    createAppointment = new CreateAppointementService(
      fakeAppointmentRepository,
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 30, 12).getTime();
    });
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(2021, 0, 30, 13),
      user_id: 'user_id',
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments on the same date', async () => {
    const appointmentDate = new Date(2021, 0, 31, 13);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: 'user_id',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '123123',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 30, 11),
        provider_id: '123123',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 30, 13),
        provider_id: 'user_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on an invalid hour', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 31, 7),
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2021, 0, 31, 18),
        provider_id: 'provider_id',
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
