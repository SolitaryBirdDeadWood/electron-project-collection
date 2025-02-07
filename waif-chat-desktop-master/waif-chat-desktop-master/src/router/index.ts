import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
    history: createWebHashHistory(),
    // 滚动行为
    scrollBehavior() {
        return {
            top: 0,
            left: 0
        }
    },
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login/index.vue')
        },
        {
            path: '/register',
            name: 'register',
            component: () => import('@/views/Register/index.vue')
        },
        {
            path: '/',
            component: () => import('@/views/Layout/index.vue'),
            redirect: '/message',
            children: [
                {
                    path: 'message',
                    name: 'message',
                    component: () => import('@/views/Layout/Message/index.vue'),
                    meta: {
                        isLogin: true
                    }
                },
                {
                    path: 'contact',
                    name: 'contact',
                    component: () => import('@/views/Layout/Contact/index.vue'),
                    meta: {
                        isLogin: true
                    }
                },
                {
                    path: 'space',
                    name: 'space',
                    component: () => import('@/views/Layout/Space/index.vue'),
                    meta: {
                        isLogin: true
                    }
                },
                {
                    path: 'notes',
                    name: 'notes',
                    component: () => import('@/views/Layout/Notes/index.vue'),
                    meta: {
                        isLogin: true
                    }
                },
                {
                    path: 'chatAI',
                    name: 'chatAI',
                    component: () => import('@/views/Layout/ChatAI/index.vue'),
                    meta: {
                        isLogin: true
                    }
                }
            ]
        },
        {
            path: '/video',
            name: 'video',
            component: () => import('@/views/Video/index.vue')
        },
        {
            path: '/edit/group',
            name: 'edit',
            component: () => import('@/views/Layout/Message/Edit/index.vue'),
            meta: {
                isLogin: true
            }
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/views/About/index.vue')
        },
        {
            path: '/webview',
            name: 'webview',
            component: () => import('@/views/WebView/index.vue')
        },
        // 语音通话、视频通话
        {
            path: '/telephone/:type',
            name: 'telephone',
            component: () => import('@/views/Telephone/VoiceOrVideo/index.vue'),
            meta: {
                isLogin: true
            }
        },
        // 屏幕共享缩略图
        {
            path: '/telephone/screen/share',
            name: 'telephoneScreenShare',
            component: () => import('@/views/Telephone/ScreenShare/index.vue'),
            meta: {
                isLogin: true
            }
        },
        // 屏幕共享
        {
            path: '/telephone/screen',
            name: 'telephoneScreen',
            component: () => import('@/views/Telephone/Screen/index.vue'),
            meta: {
                isLogin: true
            }
        }
    ]
})