<template>
    <div class=content>
        <!-- 左侧容器 -->
        <div class="left-content">
            <div class="left-header">
                <!-- 新建对话按钮 -->
                <div class="new-talk" @click="handleNewTalk">
                    新建对话
                </div>
                <!-- gpt提示词设置 -->
                <div class="role-set" @click="handleModleSet">
                    <el-button :icon="Setting" circle class="btn" />
                </div>
            </div>
            <!-- 历史记录容器 -->
            <div class="history-content">
                <!-- 有历史记录 -->
                <div v-if="historyTalkList.length > 0" class="history-list">
                    <div class="history-item" :class="{ 'active': $route.query.id === item._id }"
                        @click="handleHistoryItem(item)" @contextmenu.prevent="handleContextMenu(item._id)"
                        v-for="(item, index) in historyTalkList" :key="index">
                        <svg class="left-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
                            <path
                                d="M10.667 15.167H2C1.36 15.167.833 14.64.833 14V5.333c0-2.946 1.554-4.5 4.5-4.5h5.334c2.946 0 4.5 1.554 4.5 4.5v5.334c0 2.946-1.554 4.5-4.5 4.5M5.333 1.833c-2.386 0-3.5 1.114-3.5 3.5V14c0 .093.074.167.167.167h8.667c2.386 0 3.5-1.114 3.5-3.5V5.333c0-2.386-1.114-3.5-3.5-3.5z">
                            </path>
                            <path
                                d="M5.3 11.833c-.313 0-.6-.113-.813-.32a1.14 1.14 0 0 1-.307-1l.186-1.32c.04-.286.22-.653.427-.86l3.46-3.46c1.187-1.186 2.22-.653 2.874 0 .513.514.746 1.054.693 1.594-.04.44-.274.853-.694 1.28l-3.46 3.46a1.733 1.733 0 0 1-.86.433l-1.32.187c-.06 0-.126.006-.186.006m4.386-6.666c-.246 0-.466.16-.72.406l-3.46 3.46a.81.81 0 0 0-.146.294l-.187 1.32c-.006.066 0 .126.027.153.026.027.086.033.153.027l1.32-.187a.76.76 0 0 0 .293-.147l3.46-3.46c.254-.253.387-.473.407-.673.02-.227-.113-.493-.406-.787-.294-.28-.527-.406-.74-.406">
                            </path>
                            <path
                                d="M10.28 8.387a.43.43 0 0 1-.133-.02 3.653 3.653 0 0 1-2.514-2.514.506.506 0 0 1 .347-.62c.266-.073.54.08.613.347a2.658 2.658 0 0 0 1.82 1.82.503.503 0 0 1-.133.987">
                            </path>
                        </svg>
                        <span>{{ item.content }}</span>
                    </div>
                </div>
                <!-- 暂无历史对话记录 -->
                <div v-else class="no-talk">
                    <img width="150" height="150" src="@/assets/images/no_talk.png" alt="">
                    <span>暂无对话</span>
                </div>
            </div>
        </div>
        <!-- 分割线 -->
        <div class="line"></div>
        <!-- 右侧容器 -->
        <div class="right-content">
            <!-- 顶部可拖拽区域 -->
            <div class="drag-header drag">为了避免数据的丢失, 请在AI回答完问题后再切换页面等操作</div>
            <main>
                <!-- 消息列表 -->
                <el-scrollbar v-if="talkList.length" class="message-content" ref="chatContent">
                    <div class="message-list">
                        <div class="message-item" v-for="(item, index) in talkList.filter(i => i.role !== 'system')"
                            :key="index">
                            <div class="pic">
                                <img v-if="item.role === 'user'" :src="proxy.$baseUrl + userInfoStore.userInfo.imgUrl"
                                    alt="">
                                <img v-else src="@/assets/svg/ai.svg" alt="">
                            </div>
                            <div class="message" :class="item.role === 'user' ? 'user' : 'ai'">
                                <p v-if="item.role === 'user'">{{ item.content }}</p>
                                <p v-else-if="item.role === 'assistant' && item.content === ''" class="ai-loading">
                                    正在思考中
                                    <el-icon class="loading-icon" style="margin-left: 5px;">
                                        <Loading />
                                    </el-icon>
                                </p>
                                <MdPreview v-else :modelValue="item.content" />
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
                <!-- 无消息展示 -->
                <div v-else class="default-content">
                    <h1>你好，我是ChatAI</h1>
                    <p>我可以帮助你高效完成AI回答、AI对话、代码生成以及开发相关的问题，提高你的工作学习效率。</p>
                </div>
                <!-- 输入框 -->
                <div class="bottom-content">
                    <el-input v-model="question" :disabled="inputDisabled" placeholder="请输入你的问题，例如如何用c语言实现冒泡排序" />
                    <button :disabled="inputDisabled" @click="handleSendQuestion">发送</button>
                </div>
            </main>
        </div>
    </div>
    <!-- 大模型设置按钮弹窗 -->
    <el-dialog v-model="modelConfigVisible" width="460" align-center :close-on-click-modal="false"
        @open="openModelConfig" style="border-radius: 7.5px;">
        <template #header>
            <span class="dialog-title">大模型设置</span>
        </template>
        <div class="dialog-config-content">
            <el-form :model="modelConfigInfo" label-width="auto" label-position="top">
                <el-form-item label="大模型选择" style="margin-bottom: 15px;">
                    <el-select v-model="modelConfigInfo.modelOptions[0].model" placeholder="请选择大模型">
                        <el-option v-for="(item, index) in modelConfigInfo.modelOptions" :key="index"
                            :label="item.model" :value="item.model" />
                    </el-select>
                </el-form-item>
                <el-form-item label="随机性" style="margin-bottom: 15px;">
                    <div class="tips">用于决定结果随机性，取值越高随机性越强即相同的问题得到的不同答案的可能性越高。</div>
                    <el-slider v-model="modelConfigInfo.temperature" size="small" />
                </el-form-item>
                <el-form-item label="角色助手" style="margin-bottom: 15px;">
                    <el-scrollbar>
                        <div class="role-list">
                            <div class="role-item"
                                :class="{ active: role.active && role.custom !== 1 && role.custom !== 3 }"
                                v-for="(role, k) in modelConfigInfo.roles" :key="k" @click="choiceRole(k)">
                                <div class="pic">
                                    <img :src="role.img" alt="">
                                </div>
                                <div class="role-info">
                                    <div class="role-name">{{ role.role }}</div>
                                    <div class="role-desc">{{ role.describe }}</div>
                                </div>
                                <div class="btn-content" v-if="role.custom !== 0">
                                    <button v-if="role.custom === 1" @click="openRoleDialog(role)">新增</button>
                                    <button v-if="role.custom === 2">{{ role.active ? '取消' : '选择' }}</button>
                                    <button v-if="role.custom === 2" @click="openRoleDialog(role)">编辑</button>
                                    <button v-if="role.custom === 2" @click="delRole((role._id) as string)">删除</button>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </el-form-item>
            </el-form>
        </div>
        <footer>
            <el-button type="primary" @click="saveModelConfig">保存</el-button>
        </footer>
    </el-dialog>
    <!-- 新增/编辑角色弹窗 -->
    <el-dialog v-model="roleVisible" width="520" align-center :close-on-click-modal="false"
        style="border-radius: 7.5px;" @close="closeRoleDialog">
        <template #header>
            <span class="dialog-title">角色设置</span>
        </template>
        <el-form ref="ruleFormRef" :model="createRoleInfo" :rules="createRoleRules" label-width="auto"
            label-position="top">
            <el-form-item label="角色名称" prop="role">
                <el-input v-model="createRoleInfo.role" placeholder="请填写角色名称" maxlength="10" show-word-limit />
            </el-form-item>
            <el-form-item label="角色描述" prop="describe">
                <el-input v-model="createRoleInfo.describe" placeholder="请填写角色名称" maxlength="30" show-word-limit />
            </el-form-item>
            <el-form-item label="角色Prompt提示词" prop="content">
                <el-input v-model="createRoleInfo.content" placeholder="请填写角色名称" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item style="margin-bottom: 0;">
                <el-button style="margin-left: auto;" type="primary" @click="handleFormRole(ruleFormRef)">{{
                    createRoleInfo.id ? '保存' : '创建' }}</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance, nextTick, onMounted, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Setting, Loading } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import Toast from "@/plugins/Toast"
// api
import { reqGetRoleList, reqCreateRole, reqUpdateRole, reqDeleteRole, reqGetHistoryList, reqGetTalkDetail, reqDeleteTalk } from '@/api/chatAI'
import type { ModelConfig, DefaultConfig, HistoryTalkItem, CreateRoleResponseData, GetRoleListResponseData, Role, UpdateRole, GetHistoryListResponseData, GetTalkDetailResponseData } from '@/api/chatAI/type'
import { chatAI_Url } from '@/api/chatAI'
// route
import { useRoute, useRouter } from 'vue-router'
// pinia
import { useUserInfoStore } from "@/store/modules/user"
const { ipcRenderer } = require('electron')
const $route = useRoute()
const $router = useRouter()
const userInfoStore = useUserInfoStore()
const { proxy } = getCurrentInstance() as any

// 模型默认配置信息
let defaultConfig = ref<DefaultConfig>({
    uid: userInfoStore.userInfo._id,
    modelOption: { model: 'Spark Pro', active: true, value: 'generalv3' },
    temperature: 0.5,
    role: {
        _id: '',
        role: '',
        describe: '',
        content: '',
        custom: 3,
        active: false
    }
})

// 初始化模型配置信息
const initDefaultConfig = () => {
    defaultConfig.value = {
        uid: userInfoStore.userInfo._id,
        modelOption: { model: 'Spark Pro', active: true, value: 'generalv3' },
        temperature: 0.5,
        role: {
            _id: '',
            role: '',
            describe: '',
            content: '',
            custom: 3,
            active: false
        }
    }
}

// 模型配置信息
let modelConfigInfo = ref<ModelConfig>({
    uid: userInfoStore.userInfo._id,
    modelOptions: [
        { model: 'Spark Pro', active: true, value: 'generalv3' }
    ],
    temperature: 50, // 展示的是放大100倍的数
    roles: [
        {
            _id: 'sys_1',
            role: '前端助手', // 角色
            img: './images/role-1.png',
            describe: '解答前端相关领域问题', // 描述
            content: '我希望你能担任高级前端开发员。我将描述一个项目的细节，你将用这些工具来编码项目。Create React App, yarn, Ant Design, List, Redux Toolkit, createSlice, thunk, axios. 你应该将文件合并到单一的 index.js 文件中，而不是其他。不要写解释。', // 身份描述
            custom: 0, // 是否自定义
            active: false // 是否选中
        },
        {
            _id: 'sys_2',
            role: 'SQL助手',
            img: './images/role-2.png',
            describe: '解答SQL相关问题',
            content: '我希望你充当一个数据库专家的角色，当我问你 sql 相关的问题时，我需要你转换为标准的 sql 语句，当我的描述不够精准时，请给出合适的反馈',
            custom: 0,
            active: false
        },
        {
            _id: 'sys_3',
            role: '网络安全助手',
            img: './images/role-3.png',
            describe: '根据网络环境，提供网络安全建议，解答网络安全相关领域问题',
            content: '我希望你能作为一名网络安全专家。我将提供一些关于数据如何存储和共享的具体信息，而你的工作将是提出保护这些数据免遭恶意行为的策略。这可能包括建议加密方法、创建防火墙或实施将某些活动标记为可疑的政策。',
            custom: 0,
            active: false
        },
        {
            _id: 'sys_4',
            role: '论文助手',
            img: './images/role-4.png',
            describe: '根据主题撰写内容翔实、有信服力的论文。',
            content: '我希望你能作为一名学者行事。你将负责研究一个你选择的主题，并将研究结果以论文或文章的形式呈现出来。你的任务是确定可靠的来源，以结构良好的方式组织材料，并以引用的方式准确记录。我的第一个建议要求是 “论文主题”',
            custom: 0,
            active: false
        },
        {
            _id: 'sys_5',
            role: '写作助理',
            img: './images/role-5.png',
            describe: '优化句子、文章的语法、清晰度和简洁度，提高可读性。',
            content: '作为一名中文写作改进助理，你的任务是改进所提供文本的拼写、语法、清晰、简洁和整体可读性，同时分解长句，减少重复，并提供改进建议。请只提供文本的更正版本，避免包括解释',
            custom: 0,
            active: false
        },
        {
            role: '自定义',
            img: './images/role-6.png',
            describe: '自定义Prompt提示词',
            content: '',
            custom: 1,
            active: false
        }
    ]
})

onMounted(() => {
    if (localStorage.getItem('modelConfig')) {
        let localModelConfig = JSON.parse(localStorage.getItem('modelConfig') as string)
        defaultConfig.value = localModelConfig
    }
    // 获取历史记录列表
    getHistoryList()
    // 获取对话详情
    getTalkDetail()
})

// 新建对话按钮回调
const handleNewTalk = () => {
    handleCancelResponse()
    talkList.value = []
    $router.push('/chatAI')
}

// 设置dialog显示或隐藏
let modelConfigVisible = ref<boolean>(false)
// 控制dialog显示
const handleModleSet = () => {
    const { temperature } = defaultConfig.value
    modelConfigInfo.value.temperature = temperature * 100
    modelConfigVisible.value = true
}

// 打开模型配置dialog的回调
const openModelConfig = async () => {
    let res: GetRoleListResponseData = await reqGetRoleList(userInfoStore.userInfo._id)
    if (res.status === 200) {
        // 数据初始化
        modelConfigInfo.value.roles = modelConfigInfo.value.roles.filter(i => i.custom === 0 || i.custom === 1)
        res.data.forEach(i => {
            Object.assign(i, {
                img: './images/role-6.png',
                custom: 2,
                active: false
            })
        })
        modelConfigInfo.value.roles.push(...res.data)
        let index = modelConfigInfo.value.roles.findIndex(i => i._id === defaultConfig.value.role._id)
        if (index !== -1) {
            modelConfigInfo.value.roles[index].active = true
        }
    }
}

// 保存模型配置信息
const saveModelConfig = () => {
    const { uid, modelOptions, temperature, roles } = modelConfigInfo.value
    // 模型选择
    let modelOptionIndex = modelOptions.findIndex(i => i.active)
    let modelOption = modelOptions[modelOptionIndex]
    // 角色选择
    let modelRoleIndex = roles.findIndex(i => i.active)
    let roleInfo = modelRoleIndex === -1 ? (initDefaultConfig(), defaultConfig.value.role) : roles[modelRoleIndex]
    let saveInfo = {
        uid,
        modelOption,
        temperature: temperature / 100,
        role: roleInfo
    }
    // 存本地
    localStorage.setItem('modelConfig', JSON.stringify(saveInfo))
    // 更改defaultConfig
    defaultConfig.value = saveInfo
    modelConfigVisible.value = false
    ElMessage.success('保存成功')
}

// 选择角色
const choiceRole = (index: number) => {
    if (modelConfigInfo.value.roles[index].active) return modelConfigInfo.value.roles[index].active = false
    modelConfigInfo.value.roles.forEach(i => i.active = false)
    modelConfigInfo.value.roles[index].active = true
}

// 控制新增/编辑角色dialog
let roleVisible = ref<boolean>(false)

// 打开新增/编辑角色dialog的回调
const openRoleDialog = (role: Role) => {
    roleVisible.value = true
    const { custom, _id } = role
    if (custom === 2) {
        // 编辑角色
        const { role: filRole, describe, content, _id: id } = modelConfigInfo.value.roles.filter(i => i._id === _id)[0]
        createRoleInfo.value = {
            id,
            role: filRole,
            describe,
            content
        }
    }
}

// 创建角色表单实例
let ruleFormRef = ref<FormInstance>()
// 新建角色信息
interface CreateRoleRuleForm {
    id?: string,
    role: string,
    describe: string,
    content: string
}
let createRoleInfo = ref<CreateRoleRuleForm>({
    id: '',
    role: '',
    describe: '',
    content: ''
})

// 创建角色表单校验规则
const createRoleRules = ref<FormRules<CreateRoleRuleForm>>({
    role: [
        { required: true, message: '角色名称不能为空', trigger: 'blur' },
        { min: 1, max: 10, message: '角色名称不能超过10个字符', trigger: 'change' },
    ],
    describe: [
        { required: true, message: '角色描述不能为空', trigger: 'blur' },
        { min: 1, max: 30, message: '角色描述不能超过30个字符', trigger: 'change' },
    ],
    content: [
        { required: true, message: '角色提示词不能为空', trigger: 'blur' },
        { min: 1, max: 100, message: '角色提示词不能超过100个字符', trigger: 'change' },
    ],
})

// 创建角色按钮
const handleFormRole = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            let data = { userId: userInfoStore.userInfo._id, ...createRoleInfo.value }
            let res: CreateRoleResponseData
            // 表单校验成功
            try {
                if (createRoleInfo.value.id) {
                    // 修改角色
                    res = await reqUpdateRole(data as UpdateRole)
                } else {
                    // 创建角色
                    res = await reqCreateRole(data)
                }
                if (res!.status === 200) {
                    await openModelConfig()
                    ElMessage.success(res!.msg)
                    // 清空内容
                    ruleFormRef.value!.resetFields()
                    roleVisible.value = false
                } else {
                    ElMessage.error(res!.msg)
                }
            } catch (err) {
                ElMessage.error('出错啦')
            }
        } else {
            ElMessage.error('请填写完整角色信息')
        }
    })
}

// 关闭新建/修改角色dialog
const closeRoleDialog = () => {
    ruleFormRef.value!.resetFields()
    createRoleInfo.value.id = ''
}

// 删除角色回调
const delRole = async (_id: string) => {
    let res: CreateRoleResponseData = await reqDeleteRole(_id)
    if (res.status === 200) {
        ElMessage.success(res.msg)
        await openModelConfig()
    } else {
        ElMessage.error(res.msg)
    }
}

// 历史对话列表
const historyTalkList = ref<HistoryTalkItem[]>([])

// 获取历史记录
const getHistoryList = async () => {
    let res: GetHistoryListResponseData = await reqGetHistoryList(userInfoStore.userInfo._id)
    if (res.status === 200) {
        historyTalkList.value = []
        historyTalkList.value = res.data
    } else {
        ElMessage.error(res.msg)
    }
}

// 获取对话详情数据
const getTalkDetail = async () => {
    if (!$route.query.id) return
    let uId = userInfoStore.userInfo._id
    let _id = $route.query.id as string
    let res: GetTalkDetailResponseData = await reqGetTalkDetail(uId, _id)
    talkList.value = []
    if (res.status === 200) {
        talkList.value = res.data.contents
        handleScroll(true)
    }
}

watch(() => $route.query.id, () => {
    handleCancelResponse()
    let index = historyTalkList.value.findIndex(item => item._id === '')
    if (index !== -1) {
        return historyTalkList.value.splice(index, 1)
    }
    getHistoryList()
    getTalkDetail()
})

// 点击进入对话详情回调
const handleHistoryItem = (item: HistoryTalkItem) => {
    $router.push({
        path: '/chatAI',
        query: {
            id: item._id
        }
    })
}

// 右键事件回调
const handleContextMenu = (id: string) => {
    ipcRenderer.send('open-context-menu', id)
}

// 监听主进程传来的删除对话的id
ipcRenderer.on('del-talk', (e: any, id: string) => {
    deleteTalk(id)
})

// 删除对话回调
const deleteTalk = async (_id: string) => {
    let uId = userInfoStore.userInfo._id
    let res: CreateRoleResponseData = await reqDeleteTalk(uId, _id)
    if (res.status === 200) {
        ElMessage.success(res.msg)
        historyTalkList.value = historyTalkList.value.filter(item => item._id !== _id)
        if ($route.query.id === _id) {
            talkList.value = []
            $router.push({
                path: '/chatAI'
            })
        }
    } else {
        ElMessage.error(res.msg)
    }
}

// 输入框内容
let question = ref<string>('')
// 输入框是否可输入
let inputDisabled = ref<boolean>(false)
// 当前对话列表
interface TalkItem {
    role: 'system' | 'user' | 'assistant'
    content: string
}
const talkList = ref<TalkItem[]>([])
// 列表容器
let chatContent = ref()

watch(() => talkList.value.length, (len: number) => {
    if (!$route.query.id && len !== 0) {
        const { temperature, role } = defaultConfig.value
        historyTalkList.value.unshift({
            _id: '',
            content: talkList.value[0].content,
            config: {
                temperature,
                content: role.content
            }
        })
    }
})

let controller = ref<AbortController>()

// 发送问题的回调
const handleSendQuestion = async () => {
    let msg = question.value.trim()
    if (!msg) return Toast.show({ content: '你还没有提问呢' })
    question.value = ''
    talkList.value.push({ role: "user", content: msg })
    let data = {
        _id: $route.query.id as string,
        userId: userInfoStore.userInfo._id,
        contents: JSON.stringify(talkList.value),
        ...(defaultConfig.value.role.custom === 2 ? {
            model: JSON.stringify(
                {
                    temperature: defaultConfig.value.temperature,
                    content: defaultConfig.value.role.content
                }
            )
        } : {})
    }
    inputDisabled.value = true
    talkList.value.push({ role: "assistant", content: '' })
    // 请求
    try {
        controller.value = new AbortController()
        let res = await fetch(chatAI_Url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: controller.value.signal,
            body: JSON.stringify(data)
        })
        const reader = res!.body!.getReader()
        while (true) {
            let { value } = await reader.read()
            const decoder = new TextDecoder()
            const { status, content } = JSON.parse(decoder.decode(value))
            if (!status && content) {
                if (!$route.query.id) $router.push({
                    path: '/chatAI',
                    query: {
                        id: content._id
                    }
                })
                handleCancelResponse()
                historyTalkList.value[0]._id = historyTalkList.value[0]._id ? historyTalkList.value[0]._id : content._id
                return
            }
            talkList.value[talkList.value.length - 1].content += content
            handleScroll()
        }
    } catch (error: any) {
        if (error.name !== 'AbortError') {
            ElMessage.error('出错啦')
            inputDisabled.value = false
        }
    }
}

// 取消请求
const handleCancelResponse = () => {
    controller.value?.abort()
    inputDisabled.value = false
}

// 控制容器滚动
const handleScroll = (isInit: boolean = false) => {
    nextTick(() => {
        // 容器的dom元素
        let wrap = chatContent.value.wrapRef
        if (isInit) {
            wrap.scrollTop = wrap.scrollHeight
        } else {
            wrap.scrollTo({
                top: wrap.scrollHeight,
                behavior: 'smooth'
            })
        }
    })
}

onUnmounted(() => {
    handleCancelResponse()
})
</script>

<style lang="scss" scoped>
.content {
    width: 100%;
    height: 100vh;
    background-color: var(--chatAI-content-bg-color);
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;

    .left-content {
        width: 230px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 10px;
        padding: 20px 0 15px;
        box-sizing: border-box;

        .left-header {
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: 15px;

            .new-talk {
                width: 90%;
                height: 35px;
                border-radius: 20px;
                margin-right: 10px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(to right, #746ce2, #69b3fd);
                color: var(--chatAI-new-talk-color);
                font-size: 13px;
                cursor: pointer;

                &:hover {
                    background: linear-gradient(to right, #635cce, #509eed);
                    transition: all .5s;
                }
            }

            .role-set {
                .btn {
                    background-color: var(--chatAI-role-set-bg-color);
                    border: var(--chatAI-role-set-border);
                }
            }
        }

        .history-content {
            width: 230px;
            flex: 1;
            overflow: auto;

            &::-webkit-scrollbar {
                display: none;
            }

            .history-list {
                width: 100%;

                .history-item {
                    width: 100%;
                    height: 42px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    padding: 0 5px;
                    border-radius: 7.5px;
                    color: var(--chatAI-history-item-color);
                    cursor: pointer;
                    margin-bottom: 5px;

                    .left-icon {
                        fill: var(--chatAI-history-item-color);
                        margin-right: 5px;
                    }

                    span {
                        flex: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    &:hover {
                        background-color: var(--chatAI-history-item-active-bg-color);
                    }
                }

                .active {
                    background-color: var(--chatAI-history-item-active-bg-color);
                }
            }

            .no-talk {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding-top: 80px;
                box-sizing: border-box;

                span {
                    color: #999999;
                    font-size: 13px;
                }
            }
        }
    }

    .line {
        width: 2px;
        height: calc(100vh - 40px);
        background-color: var(--chatAI-line-bg-color);
        margin-right: 10px;
        align-self: center
    }

    .right-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 15px;

        .drag-header {
            width: 100%;
            height: 50px;
            display: flex;
            align-items: center;
            font-size: 13px;
            padding-left: 10px;
            padding-top: 10px;
            box-sizing: border-box;
            color: #b2b2b2;
        }

        main {
            width: 100%;
            height: calc(100vh - 50px);
            display: flex;
            flex-direction: column;

            .message-content,
            .default-content {
                width: 100%;
                flex: 1;
                overflow: auto;

                .message-list {
                    width: 100%;
                    padding: 10px 10px;
                    box-sizing: border-box;

                    .message-item {
                        width: 100%;
                        display: flex;
                        margin-bottom: 15px;
                        padding-right: 15px;

                        .pic {
                            width: 35px;
                            height: 35px;
                            border-radius: 50%;
                            overflow: hidden;
                            margin-right: 10px;

                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .message {
                            max-width: calc(100% - 45px);
                            line-height: 24px;
                            border-radius: 0 7.5px 7.5px 7.5px;
                            overflow: hidden;
                            margin-top: 5px;
                            font-size: 13.5px;
                            color: #ffffff;
                        }

                        .user {
                            padding: 7.5px 10px;
                            background: linear-gradient(90deg, #81a8f7, #665BFF);
                        }

                        .ai {
                            background: linear-gradient(90deg, #e2aaf8, #c264f4);

                            .ai-loading {
                                padding: 7.5px 10px;
                                display: flex;
                                align-items: center;

                                .loading-icon {
                                    animation: spin 1s linear infinite;
                                }
                            }

                            @keyframes spin {
                                0% {
                                    transform: rotate(0deg);
                                }

                                100% {
                                    transform: rotate(360deg);
                                }
                            }

                        }
                    }
                }
            }

            .default-content {
                padding: 0 50px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                h1 {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    color: var(--chatAI-talk-title-color);
                }

                p {
                    line-height: 24px;
                    text-align: center;
                    color: #6c6c6c;
                    font-size: 14px;
                }
            }

            .bottom-content {
                width: 100%;
                height: 50px;
                display: flex;
                padding-top: 10px;
                align-items: center;

                button {
                    width: 60px;
                    height: 32px;
                    border: none;
                    margin-left: 10px;
                    font-size: 13px;
                    border-radius: 5px;
                    color: #ffffff;
                    background: linear-gradient(to right, #776df8, #69b3fd);
                    cursor: pointer;

                    &:hover {
                        background: linear-gradient(to right, #635cce, #509eed);
                        transition: all .5s;
                    }

                    &:disabled {
                        background: linear-gradient(to right, #7c76c8, #88bbef);
                        cursor: not-allowed;
                    }
                }
            }
        }
    }
}

:deep(.md-editor-preview) {
    max-width: 55vw !important;
}

:deep(.el-input__wrapper) {
    background-color: var(--chatAI-content-bg-color) !important;
}

.dialog-title {
    font-size: 16px;
}

.dialog-config-content {
    width: 100%;

    .tips {
        font-size: 12px;
        line-height: 18px;
        color: #9d9d9d;
    }

    .role-list {
        display: flex;
        margin-bottom: 12px;
        gap: 7.5px;

        .role-item {
            width: 120px;
            flex-shrink: 0;
            background-color: #eeeeee;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            box-sizing: border-box;
            position: relative;

            .pic {
                width: 100%;
                height: 120px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .role-info {
                width: 100%;
                padding: 5px 8px;
                box-sizing: border-box;

                .role-name {
                    font-size: 14px;
                    line-height: 24px;
                    font-weight: bold;
                }

                .role-desc {
                    width: 100%;
                    font-size: 12px;
                    color: #9d9d9d;
                    line-height: 18px;
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }

            .btn-content {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;

                button {
                    padding: 6px 15px;
                    margin-bottom: 7.5px;
                    background-color: #6D5FFD;
                    border: none;
                    border-radius: 6px;
                    color: #eeeeee;
                    cursor: pointer;
                    font-size: 12px;

                    &:hover {
                        background-color: #5c4ed8;
                    }
                }
            }

            &:hover {
                .btn-content {
                    backdrop-filter: blur(4px);
                    background: #0000004d;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    transition: all .5s;
                }
            }
        }

        .active {
            &::after {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                content: '';
                border: 3px solid #82b9ef;
                border-radius: 8px;
                z-index: 10;
            }
        }
    }
}

footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

:deep(.md-editor-preview-wrapper) {
    padding: 0 10px !important;
}

:deep(.default-theme p) {
    line-height: 24px !important;
    color: #ffffff !important;
    font-size: 13.5px;
}

:deep(.md-editor) {
    background: linear-gradient(90deg, #e2aaf8, #c264f4) !important;
}

:deep(.el-slider__button) {
    width: 15px !important;
    height: 15px !important;
}

:deep(.el-slider__bar) {
    background: linear-gradient(to left, #655dd6, #69b3fd) !important;
}
</style>