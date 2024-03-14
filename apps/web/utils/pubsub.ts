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

export function createPubNotify<TPreset extends Partial<NotificationOptions>>(preset: TPreset) {
  return (opts: Omit<NotificationOptions, keyof TPreset>) => {
    return pubNotify({ ...preset, ...opts })
  }
}

export function pubDialog(opt: DialogOptions) {
  PubSub.publish(PubSubEvents.Dialog, opt)
}

export function createPubDialog<TPreset extends Partial<DialogOptions>>(preset: TPreset) {
  return (opts: Omit<DialogOptions, keyof TPreset>) => {
    return pubDialog({ ...preset, ...opts })
  }
}

export function pubMessage(opt: MsgOptions) {
  PubSub.publish(PubSubEvents.Message, opt)
}

export function createPubMessage<TPreset extends Partial<MsgOptions>>(preset: TPreset) {
  return (opts: Omit<MsgOptions, keyof TPreset> & Pick<MsgOptions, 'content'>) => {
    return pubMessage({ ...preset, ...opts })
  }
}

export type MsgOptions = { content: string } & MessageOptions

export function pubStartLoading() {
  PubSub.publish(PubSubEvents.Loading, true)
}

export function pubStopLoading() {
  PubSub.publish(PubSubEvents.Loading, false)
}
