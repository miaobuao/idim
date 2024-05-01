<script setup lang="ts">
import { range } from 'lodash-es'

import dayjs from '../utils/dayjs'

const props = defineProps<{
  locale: 'zh' | 'en'
}>()

defineEmits<{
  (e: 'click', year: number, month: number): void
}>()

defineSlots<{
  default: (props: {
    year: number
    month: number
    day: number
    date: number
  }) => any
}>()

const year = defineModel('year', {
  type: Number,
  default: dayjs(Date.now()).year(),
})
const month = defineModel('month', {
  type: Number,
  default: dayjs(Date.now()).month() + 1, // 1-12
})
const firstDay = defineModel('firstDay', {
  type: Number,
  default: 0, // 0-6, 0 means Sunday
})
const endDay = computed(() => (firstDay.value + 6) % 7)
const _map = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
}
function getDays(year: number, month: number) {
  if (month === 2) {
    const day = dayjs(`${year}-${month}`)
    if (day.isLeapYear())
      return 29
    else return 28
  }
  return _map[month]
}
const viewData = computed(() => {
  const days = getDays(year.value, month.value)
  let ptr = dayjs(`${year.value}-${month.value}-1`)
  const res: dayjs.Dayjs[] = []
  {
    let p = ptr
    while (p.day() !== firstDay.value) {
      p = p.subtract(1, 'day')
      res.push(p)
    }
  }
  res.reverse()
  for (let i = 1; i < days; i++) {
    res.push(ptr)
    ptr = ptr.add(1, 'day')
  }
  res.push(ptr)
  {
    let p = ptr
    while (p.day() !== endDay.value) {
      p = p.add(1, 'day')
      res.push(p)
    }
  }
  return res
})

const rows = computed(() => {
  const res: dayjs.Dayjs[][] = range(
    0,
    Math.ceil(viewData.value.length / 7),
  ).map(() => [])
  for (let i = 0; i < viewData.value.length; ++i)
    res[Math.floor(i / 7)]!.push(viewData.value[i]!)
  return res
})

const langPack = {
  zh: [ '日', '一', '二', '三', '四', '五', '六' ],
  en: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
} as const

function getDayLocale(i: number) {
  return computed(() => langPack[props.locale][i])
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex">
      <div
        v-for="i in range(
          Math.min(firstDay, endDay),
          Math.max(firstDay, endDay) + 1,
        )"
        :key="i"
        class="flex-1 text-[10px] shadow-sm p-1"
      >
        {{ getDayLocale(i).value }}
      </div>
    </div>
    <div v-for="row in rows" :key="row" class="flex-1 flex flex-row w-full">
      <div v-for="day in row" :key="day" class="flex-1 w-[0.143%]">
        <slot :year="year" :month="month" :day="day.day()" :date="day.date()" />
      </div>
    </div>
  </div>
</template>
