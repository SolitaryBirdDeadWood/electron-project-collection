<template>
    <!-- 头像 -->
    <el-popover placement="right-end" :width="300" trigger="click" :show-arrow="false">
        <template #reference>
            <div class="user-pic no-drag">
                <img :src="proxy.$baseUrl + userInfoStore.userInfo.imgUrl" alt="" />
            </div>
        </template>
        <div class="user-pic-pop">
            <div class="user-bg"></div>
            <div class="user-info-opacity"></div>
            <div class="user-info-content">
                <!-- 顶部 -->
                <div class="user-info-header">
                    <div class="user-info-pic">
                        <img :src="proxy.$baseUrl + userInfoStore.userInfo.imgUrl" alt="" />
                    </div>
                    <div class="user-info-main">
                        <div class="user-nick">{{ userInfoStore.userInfo.nick }}</div>
                        <div class="user-phone">手机号 {{ userInfoStore.userInfo.phone }}</div>
                    </div>
                </div>
                <!-- 其他信息 -->
                <div class="user-other-info-content">
                    <el-row class="user-other-info-item">
                        <el-col :span="6" class="info-title">性别</el-col>
                        <el-col :span="18">{{ userInfoStore.userInfo.sex }}</el-col>
                    </el-row>
                    <el-row class="user-other-info-item" v-if="userInfoStore.userInfo.birthday">
                        <el-col :span="6" class="info-title">生日</el-col>
                        <el-col :span="18">{{ userInfoStore.userInfo.birthday }} {{ userInfoStore.userInfo.start
                            }}</el-col>
                    </el-row>
                    <el-row class="user-other-info-item">
                        <el-col :span="6" class="info-title">个性签名</el-col>
                        <el-col :span="18">{{ userInfoStore.userInfo.sign }}</el-col>
                    </el-row>
                </div>
                <el-divider />
                <!-- 编辑按钮 -->
                <div class="user-edit-content" @click="editUserInfo">
                    <div class="edit-btn">
                        <el-icon size="20">
                            <EditPen />
                        </el-icon>
                    </div>
                </div>
                <!-- dialog -->
                <el-dialog v-model="editDialogVisible" width="45%" :show-close="false"
                    style="background-color: #f2f2f2;">
                    <template #header>
                        <div style="width: 100%; text-align: center;">编辑资料</div>
                    </template>
                    <div class="edit-content">
                        <!-- 上传头像 -->
                        <el-upload :action="proxy.$baseUrl + reqUploaduploadUserPic" :limit="1" :show-file-list="false"
                            :on-error="handleUploadError" :on-success="handleUploadSuccess">
                            <div class="user-pic">
                                <img :src="proxy.$baseUrl + ruleForm.imgUrl" alt="">
                                <div class="pic-pop">
                                    <el-icon color="#fff" size="20">
                                        <Camera />
                                    </el-icon>
                                </div>
                            </div>
                        </el-upload>
                        <div class="form-content">
                            <el-form :model="ruleForm" label-width="auto" :rules="rules">
                                <el-form-item label="昵称" prop="nick">
                                    <el-input v-model="ruleForm.nick" maxlength="15" show-word-limit
                                        placeholder="请填写你的昵称" />
                                </el-form-item>
                                <el-form-item label="性别" prop="sex">
                                    <el-select v-model="ruleForm.sex" placeholder="请选择你的性别" style="width: 100%"
                                        :teleported="false">
                                        <el-option label="未知" value="未知" />
                                        <el-option label="男" value="男" />
                                        <el-option label="女" value="女" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生日" prop="birthday">
                                    <el-date-picker v-model="ruleForm.birthday" type="date" placeholder="请选择你的生日"
                                        style="width: 100%" :teleported="false" format="YYYY/MM/DD"
                                        value-format="YYYY-MM-DD" />
                                </el-form-item>
                                <el-form-item label="个签" prop="sign">
                                    <el-input v-model="ruleForm.sign" maxlength="80" show-word-limit
                                        placeholder="请填写你的个性签名" />
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="handleCancel">取消</el-button>
                            <el-button type="primary" @click="onSubmit">
                                保存
                            </el-button>
                        </span>
                    </template>
                </el-dialog>
            </div>
        </div>
    </el-popover>
    <!-- 菜单 -->
    <ul class="menu-content">
        <li class="menu-item no-drag" v-for="(item, index) in menuList" :key="index" @click="changeMenu(item.path)">
            <img v-if="$route.path === item.path" :src="item.active_icon" :alt="item.title" />
            <img v-else :src="item.icon" :alt="item.title" />
            <template v-if="item.path === '/message' && messageStore.messageTotal > 0">
                <div class="dot" v-if="item.isDot">{{ messageStore.messageTotal }}</div>
            </template>
            <template
                v-if="item.path === '/contact' && contactStore.friendContactNum + contactStore.groupContactNum > 0">
                <div class="dot" v-if="item.isDot">{{ contactStore.friendContactNum + contactStore.groupContactNum > 99
        ?
        '99+' : contactStore.friendContactNum + contactStore.groupContactNum }}</div>
            </template>
        </li>
    </ul>
    <!-- 设置按钮 -->
    <SetupBtn />
</template>

<script setup lang="ts">
import { reactive, getCurrentInstance, ref } from "vue"
import { ElMessage } from 'element-plus'
import { EditPen, Camera } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadProps } from 'element-plus'
// api
import { reqUploaduploadUserPic, reqUpdateUserInfo } from '@/api/user/index'
// ts类型
import type { UploadPicResponseData, UpdateUserData, UpdateUserResponseData } from '@/api/user/type'
// router
import { useRoute, useRouter } from "vue-router"
// pinia
import { useUserInfoStore } from "@/store/modules/user"
import { useMessageStore } from '@/store/modules/message'
import { useContactStore } from "@/store/modules/contact"
// router
const $route = useRoute()
const $router = useRouter()
// pinia
const userInfoStore = useUserInfoStore()
const messageStore = useMessageStore()
const contactStore = useContactStore()
// baseUrl
const { proxy } = getCurrentInstance() as any

// 菜单列表
const menuList = reactive([
    {
        title: "消息",
        icon: "./svg/message.svg",
        active_icon: "./svg/message_active.svg",
        path: "/message",
        isDot: true
    },
    {
        title: "好友",
        icon: "./svg/contact.svg",
        active_icon: "./svg/contact_active.svg",
        path: "/contact",
        isDot: true
    },
    {
        title: "空间",
        icon: "./svg/space.svg",
        active_icon: "./svg/space_active.svg",
        path: "/space",
        isDot: false
    },
    {
        title: "留言板",
        icon: "./svg/notes.svg",
        active_icon: "./svg/notes_active.svg",
        path: "/notes",
        isDot: false
    },
    {
        title: "AI",
        icon: "./svg/chatAI.svg",
        active_icon: "./svg/chatAI_active.svg",
        path: "/chatAI",
        isDot: false
    }
])

// 切换菜单回调
const changeMenu = (path: string) => {
    $router.push(path)
}

// 控制dialog的显示隐藏
let editDialogVisible = ref<boolean>(false)

// 更新用户信息按钮
const editUserInfo = () => {
    editDialogVisible.value = true
    ruleForm.sign = userInfoStore.userInfo.sign
}

const ruleForm = reactive({
    imgUrl: userInfoStore.userInfo.imgUrl,
    nick: userInfoStore.userInfo.nick,
    sex: userInfoStore.userInfo.sex,
    birthday: userInfoStore.userInfo.birthday,
    sign: userInfoStore.userInfo.sign
})

const ruleFormRef = ref<FormInstance>()

const validateNick = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('昵称不能为空'))
    } else {
        if (ruleForm.nick !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass', () => {})
        }
        callback()
    }
}

const rules = reactive<FormRules<typeof ruleForm>>({
    nick: [{ validator: validateNick, trigger: 'blur' }]
})

// 头像上传成功回调
const handleUploadSuccess: UploadProps['onSuccess'] = (response: UploadPicResponseData) => {
    if (response.res_code === 0) {
        ElMessage({
            type: 'success',
            message: '头像更新成功'
        })
        ruleForm.imgUrl = (response.url) as string
    } else {
        ElMessage.error(response.msg)
    }
}

// 头像上传失败回调
const handleUploadError: UploadProps['onError'] = () => {
    ElMessage.error('上传失败')
}

// 取消按钮回调
const handleCancel = () => {
    editDialogVisible.value = false
}

// 确定按钮回调
const onSubmit = async () => {
    const { nick, sex, birthday, sign, imgUrl } = ruleForm
    let data: UpdateUserData = {
        _id: userInfoStore.userInfo._id,
        nick,
        sex,
        birthday: birthday ? birthday : '',
        sign: sign ? sign : '这个人很高冷, 暂时没有留下什么',
        imgUrl
    }
    let res: UpdateUserResponseData = await reqUpdateUserInfo(data)
    if (res.status === 200) {
        Object.assign(data, { start: res.start })
        // 更新pinia
        userInfoStore.updateInfo(data)
        // 更新本地存储
        localStorage.setItem('userInfo', JSON.stringify(userInfoStore.userInfo))
        ElMessage({
            type: 'success',
            message: res.msg
        })
        // 关闭弹窗
        handleCancel()
    } else {
        ElMessage.error(res.msg)
    }
}
</script>

<style lang="scss" scoped>
.user-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 30px;
    position: relative;
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
    }
}

.menu-content {
    flex: 1;

    .menu-item {
        width: 30px;
        height: 30px;
        margin: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .dot {
            position: absolute;
            left: 20px;
            top: -5px;
            height: 18px;
            padding: 0 6px;
            background-color: #f56c6c;
            font-size: 12px;
            border-radius: 10px;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99;
        }
    }
}

.user-pic-pop {
    width: 100%;
    overflow: hidden;
    background-color: var(--aside-pop-content-bg-color);
    border-radius: var(--el-popover-border-radius);
    position: relative;

    .user-bg {
        width: 100%;
        height: 100px;
        background-image: url(@/assets/images/user-bg.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
    }

    .user-info-opacity {
        position: absolute;
        top: 50px;
        width: 100%;
        height: 50px;
        background: var(--aside-pop-opacity-bg-color);
    }

    .user-info-content {
        padding: 0 15px;
        margin-bottom: 20px;
        box-sizing: border-box;

        .user-info-header {
            width: 100%;
            position: absolute;
            top: 60px;
            display: flex;
            align-items: center;

            .user-info-pic {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 10px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .user-info-main {
                .user-nick {
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 2px;
                    color: var(--aside-user-nick-color);
                }

                .user-phone {
                    font-size: 12px;
                    color: var(--aside-user-phone-color);
                }
            }
        }

        .user-other-info-content {
            padding: 40px 0 0;

            .user-other-info-item {
                font-size: 13px;
                color: var(--aside-user-other-info-color);
                width: 100%;
                height: 35px;
                display: flex;
                align-items: center;

                .info-title {
                    color: var(--aside-user-other-info--title-color);
                }
            }
        }

        .user-edit-content {
            width: 100%;
            display: flex;
            justify-content: flex-end;

            .edit-btn {
                width: 40px;
                height: 40px;
                border: 1px solid #dddddd;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                color: var(--aside-edit-btn-color);
            }
        }
    }
}

:deep(.el-divider--horizontal) {
    margin: 15px 0 !important;
}

.edit-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    box-sizing: border-box;

    .user-pic {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        overflow: hidden;
        border: var(--aside-edit-user-pic-border);
        cursor: pointer;
        position: relative;

        img {
            width: 100%;
            height: 100%;
        }

        .pic-pop {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .form-content {
        width: 100%;
        margin-top: 15px;
    }
}

:deep(.el-dialog__body) {
    padding: 0 !important;
}

:deep(.el-dialog__header) {
    margin: 0 !important;
}
</style>