export interface Response {
    status: number
}

type InfoType = {
    _id: string;
    userId: {
        _id: string;
        nick: string;
    };
    fId: string;
    toId: string;
    chatType: string;
    type: string;
    startTime: Date;
}

// 判断该用户是否已经加入会议返回的ts类型
export interface IsJoinTelephoneResponse extends Response {
    data: boolean;
    msg?: string;
    info?: InfoType;
}

// 获取聊天详情页面是否有通话接口返回的ts类型
export interface GetDetailsTelephoneResponse extends Response {
    msg: string;
    data: {
        status: boolean;
        info: InfoType | null
    }
}

// 加入通话按钮判断是否可以加入通话返回的ts类型
export interface CanJoinTelephoneResponse extends Response {
    msg: string;
    data: {
        status: boolean;
        info: {
            userId: string;
            fId: string;
            toId: string;
            chatType: string;
            type: string;
            startTime: string;
        }
    } | boolean;
}