<template>
  <n-card :title="page.label" size="small"></n-card>
  <setting-isolated-card
    v-for="(card, i) in page.children"
    :key="i"
    v-bind="card"
  />
</template>

<script setup lang="tsx">
import { NCard, NList, NListItem, NButton, NThing } from 'naive-ui';

import {
  OptionType,
  type OptionProps,
  type OptionsListCardProps,
  type SettingsPageProps,
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
      case OptionType.Btn:
        return (
          <NButton
            type={props.btnType}
            onClick={props.click}
            color={props.color}
          >
            {props.text}
          </NButton>
        );
      default:
        throw new Error('Unknown option type: ' + props.type);
    }
  }
  return hidden || <NListItem>{render()}</NListItem>;
}
</script>
