export type TelephoneStoreType = {
    fId: string;
    toId: string;
    chatType: string;
    type: string;
    messageDetailsTelephoneInfo?: {
        show: boolean;
        urlId: string;
        userId: string;
        nick: string;
        type: string;
    }
}