import type { OptionsListCardProps } from './types';

import { NCard, NList, NListItem } from 'naive-ui';

import Option from './option';
export default function SettingIsolatedCard(props: OptionsListCardProps) {
  return (
    <NCard title={props.label} size="small" contentClass="p-0!">
      <NList hoverable clickable>
        {props.children.map((item, index) => (
          <NListItem key={index}>
            <Option {...item} />
          </NListItem>
        ))}
      </NList>
    </NCard>
  );
}
