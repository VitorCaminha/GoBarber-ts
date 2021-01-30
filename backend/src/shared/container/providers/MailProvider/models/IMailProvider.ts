import ISendMailDTO from '../dtos/ISendMainDTO';

export default interface IMailProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}
