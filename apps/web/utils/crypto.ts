export async function kdf(text: string) {
  const worker = new Worker(
    new URL('./argon2id.worker.js', import.meta.url),
    { type: 'module' },
  )
  return new Promise<string>((resolve, reject) => {
    worker.postMessage(text)
    worker.onmessage = ({ data }) => {
      resolve(data)
      worker.terminate()
    }
    worker.onerror = reject
  })
}
