import type {
  DialogOptions,
  MessageOptions,
  NotificationOptions,
} from 'naive-ui';

import PubSub from 'pubsub-js';

export enum PubSubEvents {
  Notification = 'notification',
  Dialog = 'dialog',
  Message = 'message',
  Loading = 'loading',
}

export function notify(opt: NotificationOptions) {
  PubSub.publish(PubSubEvents.Notification, opt);
}

export function dialog(opt: DialogOptions) {
  PubSub.publish(PubSubEvents.Dialog, opt);
}

export function message(opt: MsgOptions) {
  PubSub.publish(PubSubEvents.Message, opt);
}

export type MsgOptions = { content: string } & MessageOptions;

export function startLoading() {
  PubSub.publish(PubSubEvents.Loading, true);
}

export function stopLoading() {
  PubSub.publish(PubSubEvents.Loading, false);
}
