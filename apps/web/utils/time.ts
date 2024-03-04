import type { Dayjs } from 'dayjs'

import dayjs from 'dayjs'

export function isExpired(datetime: Dayjs) {
  return datetime.isBefore(dayjs())
}
