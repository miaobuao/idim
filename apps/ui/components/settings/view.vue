<template>
  <n-card :title="page.label" size="small"></n-card>
  <setting-isolated-card
    v-for="(card, i) in page.children"
    :key="i"
    v-bind="card"
  />
</template>

<script setup lang="tsx">
import { NCard, NList, NListItem, NButton, NThing, NSelect } from 'naive-ui';

import {
  OptionType,
  type OptionProps,
  type OptionsListCardProps,
  type SettingsPageProps,
  type LabelType,
  type ButtonType,
  type RadioType,
} from './types';

defineProps<{
  page: SettingsPageProps;
}>();

const emits = defineEmits<{
  (e: 'push', value: string): void;
}>();

const router = useRouter();

function SettingIsolatedCard(props: OptionsListCardProps) {
  const hidden = $computed(props.hidden ?? (() => false));
  return (
    hidden || (
      <NCard title={props.label} size="small" contentClass="p-0!">
        <NList hoverable clickable>
          {props.children.map((item) => (
            // @ts-ignore
            <Option {...item} />
          ))}
        </NList>
      </NCard>
    )
  );
}

function Option(props: OptionProps) {
  const hidden = $computed(props.hidden ?? (() => false));
  function render() {
    switch (props.type) {
      case OptionType.Label:
        return <LabelOption {...props} />;
      case OptionType.Btn:
        return <BtnOption {...props} />;
      case OptionType.Radio:
        return <RadioOption {...props} />;
    }
  }
  return hidden || <NListItem>{render()}</NListItem>;
}

function LabelOption(props: LabelType) {
  return (
    <div
      onClick={() => {
        if (!props.to) return;
        if (typeof props.to === 'string') {
          emits('push', props.to);
        } else {
          router.push(props.to);
        }
      }}
    >
      <NThing title={props.title} contentClass="m-0!">
        {props.caption}
      </NThing>
    </div>
  );
}
function BtnOption(props: ButtonType) {
  return (
    <NButton type={props.btnType} onClick={props.click} color={props.color}>
      {props.text}
    </NButton>
  );
}

function RadioOption(props: RadioType) {
  const value = computed(props.value);
  return (
    <NSelect
      value={value.value}
      options={props.options}
      onUpdate:value={(e) => props.select(e)}
    />
  );
}
</script>
