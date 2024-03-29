<script setup lang="tsx">
import { ChevronBack as BackIcon } from '@vicons/ionicons5'
import { NButton, NCard, NList, NListItem, NSelect, NThing } from 'naive-ui'

import {
  type ButtonProps,
  type LabelProps,
  type OptionProps,
  OptionType,
  type OptionsListCardProps,
  type RadioProps,
  type SettingsPageProps,
} from './types'

defineProps<{
  page: SettingsPageProps
  pop?: () => void
}>()

const emits = defineEmits<{
  (e: 'push', value: string): void
}>()

const router = useRouter()

function SettingIsolatedCard(props: OptionsListCardProps) {
  const hidden = $computed(props.hidden ?? (() => false))
  return (
    hidden || (
      <NCard title={props.label} size="small" contentClass="p-0!">
        <NList hoverable clickable>
          {props.children.map(item => (
            // @ts-expect-error
            <Option {...item} />
          ))}
        </NList>
      </NCard>
    )
  )
}

function Option(props: OptionProps) {
  const hidden = $computed(props.hidden ?? (() => false))
  function render() {
    switch (props.type) {
      case OptionType.Label:
        return <LabelOption {...props} />
      case OptionType.Btn:
        return <BtnOption {...props} />
      case OptionType.Radio:
        return <RadioOption {...props} />
    }
  }
  return hidden || <NListItem>{render()}</NListItem>
}

function LabelOption(props: LabelProps) {
  return (
    <div
      onClick={() => {
        if (!props.to)
          return
        if (typeof props.to === 'string')
          emits('push', props.to)
        else router.push(props.to)
      }}
    >
      <NThing title={props.title} contentClass="m-0!">
        {props.caption}
      </NThing>
    </div>
  )
}
function BtnOption(props: ButtonProps) {
  return (
    <NButton type={props.btnType} onClick={props.click} color={props.color}>
      {props.text}
    </NButton>
  )
}

function RadioOption(props: RadioProps) {
  const value = computed(props.value)
  return (
    <NSelect
      value={value.value}
      options={props.options}
      onUpdate:value={e => props.select(e)}
    />
  )
}
</script>

<template>
  <NCard size="small">
    <n-flex>
      <NButton v-if="pop" text circle @click="pop">
        <template #icon>
          <n-icon>
            <BackIcon />
          </n-icon>
        </template>
      </NButton>
      <div class="font-600 text-lg">
        {{ page.label }}
      </div>
    </n-flex>
  </NCard>
  <SettingIsolatedCard
    v-for="(card, i) in page.children"
    :key="i"
    v-bind="card"
  />
</template>
