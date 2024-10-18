<template>
  <RouterView/>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance() as any

// 连接socket
proxy.socket.io.connect()
</script>