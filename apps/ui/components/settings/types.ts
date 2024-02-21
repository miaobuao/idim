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
  type: OptionType.Label;
  hidden?: HiddenField;
  title: string;
  caption: string;
  to?: RouteLocationNamedRaw | string;
}

export interface ButtonType {
  type: OptionType.Btn;
  hidden?: HiddenField;
  text: string;
  click: () => void;
  color?: string;
  btnType?:
    | 'default'
    | 'tertiary'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
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
