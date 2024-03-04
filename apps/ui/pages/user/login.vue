<script setup lang="ts">
import type { FormInst, FormItemRule } from 'naive-ui'

const token = useTokenStore()
const user = useUserStore()
const { $text, $trpc } = useNuxtApp()
enum Tabs {
  SIGNIN = 'signin',
  SIGNUP = 'signup',
}
const tab = ref(Tabs.SIGNIN)

const loginFormRef = ref<FormInst>()
const loginFormValue = ref({
  email: '',
  password: '',
})
const loginFormRules = {
  email: {
    required: true,
    trigger: ['blur'],
  },
  password: {
    required: true,
    trigger: ['blur'],
  },
}
function onLogin() {
  loginFormRef.value?.validate((errors) => {
    if (errors)
      return

    $trpc.session.create
      .mutate(loginFormValue.value)
      .then((data) => {
        token.updateJwtToken(data.token)
        user.self.id = data.id
        user.self.name = data.name
        dialog({
          type: 'success',
          title: $text.login_success(),
          content: $text.whether_keep_logged_in(),
          negativeText: $text.cancel(),
          positiveText: $text.ok(),
          onPositiveClick() {
            token.saveInLocalStorage()
          },
          onNegativeClick() {
            token.saveInSessionStorage()
          },
          onAfterLeave() {
            navigateTo('/')
          },
        })
      })
      .catch(errorHandler)
  })
}

const registerFormRef = ref<FormInst>()
const registerFormValue = ref({
  ...loginFormValue.value,
  name: '',
  password2: '',
})
const registerFormRules = {
  ...loginFormRules,
  password2: {
    required: true,
    trigger: ['input', 'blur'],
    validator(rule: FormItemRule, value: string) {
      if (value !== registerFormValue.value.password)
        return new Error($text.retype_password_error())

      return true
    },
  },
  name: {
    required: true,
    trigger: ['blur'],
  },
}

function onRegister() {
  registerFormRef.value?.validate((errors) => {
    if (errors)
      return

    $trpc.user.create
      .mutate(registerFormValue.value)
      .then(() => {
        tab.value = Tabs.SIGNIN
        notify({
          type: 'success',
          content: $text.reg_succ(),
        })
      })
      .catch(errorHandler)
  })
}
</script>

<template>
  <div class="hfull flex flex-col justify-center">
    <n-card class="w-[90%] max-w-[400px] my-0 mx-auto">
      <n-tabs v-model:value="tab" size="large" justify-content="space-evenly">
        <n-tab-pane name="signin" :tab="$text.login()">
          <n-form
            ref="loginFormRef"
            :model="loginFormValue"
            :rules="loginFormRules"
          >
            <n-form-item-row :label="$text.email()" path="email">
              <n-input v-model:value="loginFormValue.email" />
            </n-form-item-row>
            <n-form-item-row :label="$text.password()" path="password">
              <n-input
                v-model:value="loginFormValue.password"
                type="password"
              />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong @click="onLogin">
            {{ $text.login() }}
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="signup" :tab="$text.register()">
          <n-form
            ref="registerFormRef"
            :model="registerFormValue"
            :rules="registerFormRules"
          >
            <n-form-item-row :label="$text.username()" path="name">
              <n-input v-model:value="registerFormValue.name" />
            </n-form-item-row>
            <n-form-item-row :label="$text.email()" path="email">
              <n-input v-model:value="registerFormValue.email" />
            </n-form-item-row>
            <n-form-item-row :label="$text.password()" path="password">
              <n-input
                v-model:value="registerFormValue.password"
                type="password"
              />
            </n-form-item-row>
            <n-form-item-row :label="$text.retype_password()" path="password2">
              <n-input
                v-model:value="registerFormValue.password2"
                type="password"
              />
            </n-form-item-row>
          </n-form>
          <n-button type="primary" block secondary strong @click="onRegister">
            {{ $text.register() }}
          </n-button>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
