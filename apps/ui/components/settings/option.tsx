import type { OptionProps } from './types';

import { NThing } from 'naive-ui';

export default function Option(props: OptionProps) {
  return <NThing title="title">{props.type}</NThing>;
}
