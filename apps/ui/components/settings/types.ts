import { type RouteLocationNamedRaw } from 'vue-router';
export type HiddenField = () => boolean;

export interface SettingsPageProps {
  id: string;
  label: string;
  children: OptionsListCardProps[];
}

export type OptionProps = ButtonType | RadioType | LabelType;

export interface OptionsListCardProps {
  hidden?: HiddenField;
  label: string;
  children: OptionProps[];
}

export enum OptionType {
  Label,
  Btn,
  Radio,
}

export interface LabelType {
  hidden?: HiddenField;
  type: OptionType.Label;
  title: string;
  caption: string;
  // 只能RouteLocationPathRaw, 用RouteLocationNamedRaw会出错!
  to: RouteLocationNamedRaw | string;
}

export interface ButtonType {
  hidden?: HiddenField;
  type: OptionType.Btn;
  text: string;
  color?: string;
  click: () => void;
  class?: string;
}

export type RadioOptionsType = {
  label: string;
  value: any;
  disable?: boolean;
  [props: string]: any;
}[];

export interface RadioType {
  type: OptionType.Radio;
  hidden?: HiddenField;
  options: RadioOptionsType;
  value: any;
  select: (value: any) => void;
}
