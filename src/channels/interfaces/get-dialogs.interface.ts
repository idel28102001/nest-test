import { getChannelInfoInterface } from './get-channel-info.interface';

export interface getDialogsInterface {// Доп интерфейс, так как gramjs не выдаёт нужные типы при получении данных и TS ругается
  isChannel: boolean,
  title: string,
  entity: getChannelInfoInterface
}