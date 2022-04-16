export interface getChannelInfoInterface { // Доп интерфейс, так как gramjs не выдаёт нужные типы при получении данных и TS ругается
  creator: boolean,
  id: number,
  title: string,
  
}