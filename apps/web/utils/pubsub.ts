import type {
  DialogOptions,
  MessageOptions,
  NotificationOptions,
} from 'naive-ui'

import { Subject } from 'rxjs'

export const notify = new Subject<NotificationOptions>()
export const dialog = new Subject<DialogOptions>()
export const message = new Subject<MsgOptions>()
export const startLoading = new Subject<void>()
export const stopLoading = new Subject<void>()

export function createPubNotify<TPreset extends Partial<NotificationOptions>>(preset: TPreset) {
  return (opts: Omit<NotificationOptions, keyof TPreset>) => {
    return notify.next({ ...preset, ...opts })
  }
}

export function createPubDialog<TPreset extends Partial<DialogOptions>>(preset: TPreset) {
  return (opts: Omit<DialogOptions, keyof TPreset>) => {
    return dialog.next({ ...preset, ...opts })
  }
}

export function createPubMessage<TPreset extends Partial<MsgOptions>>(preset: TPreset) {
  return (opts: Omit<MsgOptions, keyof TPreset> & Pick<MsgOptions, 'content'>) => {
    return message.next({ ...preset, ...opts })
  }
}

export type MsgOptions = { content: string } & MessageOptions
