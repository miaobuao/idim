<script setup lang="ts">
import type { FormInst, FormItemRule } from 'naive-ui'

import { kdf } from '~/utils/crypto'

const btnLoading = ref(false)
const { $text, $trpc, $i18n } = useNuxtApp()
const router = useRouter()
const user = useUserStore()
const cd = ref(0)
const forgetPwdFormRef = ref<FormInst>()
const forgetPwdFormValue = ref({
  email: '',
  code: '',
  password: '',
  password2: '',
})
const maskedEmail = computed(() => {
  const addr = forgetPwdFormValue.value.email.split('@')[0]
  return `${addr.substring(0, 3)}${'*'.repeat(Math.min(5, addr.length - 3))}@${forgetPwdFormValue.value.email.split('@')[1]}`
})
const forgetPwdFormRules = {
  email: {
    required: true,
    trigger: [ 'blur' ],
  },
  code: {
    required: true,
    trigger: [ 'blur' ],
  },
  password: {
    required: true,
    trigger: [ 'blur' ],
  },
  password2: {
    required: true,
    trigger: [ 'input', 'blur' ],
    validator(_: FormItemRule, value: string) {
      if (value !== forgetPwdFormValue.value.password)
        return new Error($text.retype_password_error())
      return true
    },
  },
}

watch(
  user,
  (value) => {
    if (value.self.email)
      forgetPwdFormValue.value.email = value.self.email
  },
  {
    immediate: true,
  },
)

async function onSubmit() {
  btnLoading.value = true
  forgetPwdFormRef.value?.validate(async (errors) => {
    if (errors)
      return (btnLoading.value = false)
    const hashed = await kdf(forgetPwdFormValue.value.password)
    $trpc.user.changePwd
      .mutate({
        email: forgetPwdFormValue.value.email,
        code: forgetPwdFormValue.value.code,
        password: hashed,
      })
      .then(() => {
        pubNotify({
          type: 'success',
          duration: 1500,
          content: $text.pwd_changed_succ(),
        })
        router.replace({ name: 'user-login' })
      })
      .catch(errorHandler)
      .finally(() => {
        btnLoading.value = false
      })
  })
}

function onClickSendCode(startCd: Function) {
  $trpc.user.sendVerifyCodeToChangePwd
    .mutate({
      email: forgetPwdFormValue.value.email,
      locale: $i18n.locale.value,
    })
    .then(() => {
      startCd()
      pubNotify({
        type: 'success',
        duration: 2000,
        content: $text.send_succ(),
      })
    })
    .catch((e) => {
      if (e.data.code === 'TOO_MANY_REQUESTS') {
        const cd = Number(e.shape.message)
        if (!Number.isNaN(cd))
          startCd(cd)
      }
      errorHandler(e)
    })
}
</script>

<template>
  <div class="hfull flex flex-col justify-center items-center">
    <n-card class="w-[90%] max-w-[400px]">
      <n-form
        ref="forgetPwdFormRef"
        :model="forgetPwdFormValue"
        :rules="forgetPwdFormRules"
      >
        <n-form-item-row :label="$text.email()" path="email">
          <n-input v-if="user.self.email" disabled :value="maskedEmail" />
          <n-input v-else v-model:value="forgetPwdFormValue.email" />
        </n-form-item-row>

        <n-form-item-row :label="$text.verify_code()" path="code">
          <n-input v-model:value="forgetPwdFormValue.code">
            <template #suffix>
              <cd-btn
                v-model:cd="cd"
                :disabled="!forgetPwdFormValue.email"
                :text="cd > 0"
                round
                size="small"
                @click="onClickSendCode"
              >
                {{ cd === 0 ? $text.send() : `( ${Math.round(cd / 1000)} )` }}
              </cd-btn>
            </template>
          </n-input>
        </n-form-item-row>

        <n-form-item-row :label="$text.new_password()" path="password">
          <n-input
            v-model:value="forgetPwdFormValue.password"
            type="password"
            :disabled="!forgetPwdFormValue.code"
          />
        </n-form-item-row>

        <n-form-item-row :label="$text.retype_password()" path="password2">
          <n-input
            v-model:value="forgetPwdFormValue.password2"
            :disabled="!forgetPwdFormValue.password"
            type="password"
          />
        </n-form-item-row>
      </n-form>

      <n-button
        type="primary"
        :loading="btnLoading"
        block
        secondary
        strong
        @click="onSubmit"
      >
        {{ $text.change_psw() }}
      </n-button>
    </n-card>
  </div>
</template>
