import {
  type ButtonProps,
  type LabelProps,
  type OptionProps,
  OptionType,
  type RadioProps,
} from './types'

export function createPages(...pages: PageBuilder[]) {
  const values = pages.map(d => d.value)
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i].id === values[j].id)
        throw new Error(`duplicated id: ${values[i].id}`)
    }
  }
  const maps = new Map(values.map(d => [d.id, d]))
  return [values, maps] as const
}

export class PageBuilder {
  private readonly cards: CardBuilder[] = []

  constructor(
    private readonly id: string,
    private readonly label: string,
  ) {}

  addCard(card: CardBuilder) {
    this.cards.push(card)
    return this
  }

  get value() {
    return {
      id: this.id,
      label: this.label,
      children: this.cards.map(d => d.value),
    }
  }
}

export class CardBuilder {
  private readonly options: OptionProps[] = []
  private _hidden?: () => boolean
  constructor(private readonly label: string) {}

  hidden(fn: () => boolean) {
    this._hidden = fn
    return this
  }

  addOption(option: OptionProps) {
    this.options.push(option)
    return this
  }

  addBtn(opts: Omit<ButtonProps, 'type'>) {
    return this.addOption({
      type: OptionType.Btn,
      ...opts,
    } as unknown as OptionProps)
  }

  addRadio(opts: Omit<RadioProps, 'type'>) {
    return this.addOption({
      type: OptionType.Radio,
      ...opts,
    } as unknown as OptionProps)
  }

  addLabel(opts: Omit<LabelProps, 'type'>) {
    return this.addOption({
      type: OptionType.Label,
      ...opts,
    } as unknown as OptionProps)
  }

  get value() {
    return {
      label: this.label,
      hidden: this._hidden,
      children: this.options,
    }
  }
}
