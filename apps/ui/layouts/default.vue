<template>
  <n-config-provider
    :theme="preferences.theme"
    :locale="preferences.lang?.locale"
    :date-locale="preferences.lang?.date"
  >
    <n-layout position="absolute">
      <slot />
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
const preferences = useGuiPreferencesStore();
const { $i18n } = useNuxtApp();
watch(
  () => preferences.lang,
  (value) => {
    const locale = value?.locale.name.substring(0, 2);
    if (locale) {
      $i18n.setLocale(locale);
    }
  },
  {
    immediate: true,
  }
);
onMounted(() => {
  preferences.load();
});
</script>
