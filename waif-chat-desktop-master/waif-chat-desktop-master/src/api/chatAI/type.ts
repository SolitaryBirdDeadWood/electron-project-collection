export interface ResponseData {
    status: number
}

export type ModelOption = {
    model: string // 
    active: boolean // 是否选中
    value: string // 模型 generalv3
}
export type Role = {
    _id?: string // 只有系统（以 sys_ 开头的）和自定义（并且是保存在数据库的才有）的有id
    role: string // 角色
    img?: string // 头像
    describe: string // 描述
    content: string // 提示词
    custom?: 0 | 1 | 2 | 3 // 是否自定义 0=>系统配置  1=>可自定义，新增  2=>可以自定义，编辑  3=>空，无
    active?: boolean // 是否选中
}
// 模型配置信息
export interface ModelConfig {
    uid: string // 每个用户的id，用于区分不同用户
    modelOptions: ModelOption[],
    temperature: number, // 核采样阈值。用于决定结果随机性，取值越高随机性越强即相同的问题得到的不同答案的可能性越高。取值范围 (0，1] ，默认值0.5
    roles: Role[]
}

// 模型默认配置信息
export interface DefaultConfig {
    uid: string
    modelOption: ModelOption
    temperature: number
    role: Role
}

// 新建角色
export type CreateRole = {
    userId: string
    role: string
    describe: string
    content: string
}

// 新建角色接口返回的ts类型
export interface CreateRoleResponseData extends ResponseData {
    msg: string
}

// 修改角色
export interface UpdateRole extends CreateRole {
    id: string
}

// 获取角色列表接口返回的ts类型
export interface GetRoleListResponseData extends ResponseData {
    msg: string
    data: Role[]
}

// 历史会话列表的每一项
export interface HistoryTalkItem {
    _id: string
    content: string
    config: {
        content: string
        temperature: number
    }
}

// 获取历史会话列表接口返回的ts类型
export interface GetHistoryListResponseData extends ResponseData {
    msg: string
    data: HistoryTalkItem[]
}

interface TalkItem {
    role: 'system' | 'user' | 'assistant'
    content: string
}
// 获取对话详情接口返回的ts类型
export interface GetTalkDetailResponseData extends ResponseData {
    msg: string
    data: {
        _id: string
        usreId: string
        model: {
            content: string
            temperature: number
        }
        contents: TalkItem[]
    }
}