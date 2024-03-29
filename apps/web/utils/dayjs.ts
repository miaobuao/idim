import type { Dayjs } from 'dayjs'

import dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh'
import 'dayjs/locale/en'

export function isExpired(datetime: Dayjs) {
  return datetime.isBefore(dayjs())
}

dayjs.extend(RelativeTime)
export default dayjs
