import {
  type ConfigProviderProps,
  createDiscreteApi,
  useOsTheme,
  darkTheme,
  lightTheme,
  type NotificationOptions,
} from 'naive-ui';

const { $pinia } = useNuxtApp();

const configProviderPropsRef = computed<ConfigProviderProps>(() => {
  try {
    const preferences = useGuiPreferencesStore($pinia);
    return {
      theme: preferences.theme,
    };
  } catch {
    return {
      theme: useOsTheme().value === 'dark' ? darkTheme : lightTheme,
    };
  }
});

export const { message, notification, dialog, loadingBar } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar'],
  {
    configProviderProps: configProviderPropsRef,
  }
);

export class Notify {
  constructor(public config: Omit<NotificationOptions, 'content'>) {}

  success(content: string) {
    notification.success({
      ...this.config,
      content,
    });
  }

  error(content: string) {
    notification.error({
      ...this.config,
      content,
    });
  }

  warning(content: string) {
    notification.warning({
      ...this.config,
      content,
    });
  }

  info(content: string) {
    notification.info({
      ...this.config,
      content,
    });
  }
}
