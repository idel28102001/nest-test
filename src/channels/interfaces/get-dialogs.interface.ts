import { getChannelInfoInterface } from './get-channel-info.interface';

export interface getDialogsInterface {
  isChannel: boolean,
  title: string,
  entity: getChannelInfoInterface
}