import type { Dayjs } from 'dayjs'

import dj from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh'
import 'dayjs/locale/en'

export function isExpired(datetime: Dayjs) {
  return datetime.isBefore(dj())
}

const dayjs = dj.extend(RelativeTime)

export default dayjs
