<script setup lang="ts">
import { Calendar } from '@repo/common'

const router = useRouter()
function gotoDetail(year: number, month: number, date: number) {
  router.push(`schedule/${year}-${month}-${date}`)
}
</script>

<template>
  <Calendar.MonthView locale="zh">
    <template #default="{ year, month, date }">
      <div
        class="w-full h-full shadow-sm"
        @click="gotoDetail(year, month, date)"
      >
        {{ date }}
      </div>
    </template>
  </Calendar.MonthView>
</template>
