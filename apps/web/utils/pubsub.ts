import type {
  DialogOptions,
  MessageOptions,
  NotificationOptions,
} from 'naive-ui'

import PubSub from 'pubsub-js'

export enum PubSubEvents {
  Notification = 'notification',
  Dialog = 'dialog',
  Message = 'message',
  Loading = 'loading',
}

export function pubNotify(opt: NotificationOptions) {
  PubSub.publish(PubSubEvents.Notification, opt)
}

export function pubDialog(opt: DialogOptions) {
  PubSub.publish(PubSubEvents.Dialog, opt)
}

export function pubMessage(opt: MsgOptions) {
  PubSub.publish(PubSubEvents.Message, opt)
}

export type MsgOptions = { content: string } & MessageOptions

export function pubStartLoading() {
  PubSub.publish(PubSubEvents.Loading, true)
}

export function pubStopLoading() {
  PubSub.publish(PubSubEvents.Loading, false)
}
