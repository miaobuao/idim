export class Batcher {
  private readonly _queue: Map<number, Function> = new Map()
  private _interval: number = 0
  private _running = false
  private _uniqueId = 0

  constructor(private readonly duration: number) {}

  push(fn: Function) {
    const uuid = this._uniqueId++
    this._queue.set(uuid, fn)
    return () => {
      this._queue.delete(uuid)
    }
  }

  start(duration?: number) {
    if (this._running)
      clearInterval(this._interval)
    this._running = true
    this._interval = setInterval(() => {
      this._queue.forEach(fn => fn())
      this._queue.clear()
    }, duration ?? this.duration) as unknown as number
  }

  end() {
    if (!this._running)
      return
    this._running = false
    clearInterval(this._interval)
  }
}
