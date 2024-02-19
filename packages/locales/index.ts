import { isPlainObject } from 'lodash';

import en from './src/en';
import zh from './src/zh';
export { zh, en };

export function buildLanguagePack(t: TranslateFunc) {
  const text = Object.assign({}, clone(en), clone(zh));
  const source = clone(text);

  ReplaceWithTranslateFunction(t)(text);
  ReplaceWithStringPath()(source);
  return [text as unknown as StringToI18nText<typeof text>, source];
}

function DFS<T extends Function>(cb: T) {
  function dfs(obj: any, prefix: string[] = []) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        obj[key] = cb([...prefix, key]);
      } else if (isPlainObject(value)) {
        dfs(value, [...prefix, key]);
      }
    }
  }
  return dfs;
}

function ReplaceWithStringPath() {
  return DFS((prefix: string[]) => prefix.join('.'));
}

function ReplaceWithTranslateFunction(t: TranslateFunc) {
  return DFS(
    (prefix: string[]) => (args?: I18nParams) => t(prefix.join('.'), args ?? {})
  );
}

type TranslateFunc = (
  template: string,
  args: Record<string, unknown>
) => string;

type I18nParams = Record<string, string | number>;

type StringToI18nText<T> = {
  [K in keyof T]: T[K] extends string
    ? (args?: I18nParams) => string
    : StringToI18nText<T[K]>;
};

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
