import { algo, enc } from 'crypto-js'
import { pipe } from 'fp-ts/function'
import { createServer } from 'node:http'
import process from 'node:process'
import { createTransport } from 'nodemailer'

import { logger } from './logger'

const config = {
  host: process.env.SMTP_API_LISTEN?.split(':')?.[0] ?? '0.0.0.0',
  port: process.env.SMTP_API_LISTEN?.split(':')?.[1] ?? '8081',
  key: process.env.SMTP_API_AES_KEY!,
  iv: process.env.SMTP_API_AES_IV!,
}

const KEY = enc.Hex.parse(config.key)
const IV = enc.Hex.parse(config.iv)
const decryptor = algo.AES.createDecryptor(KEY, { iv: IV })

const SUCCESS_RESULT = JSON.stringify({
  success: true,
})

export interface SMTPRequest {
  name: string
  password: string
  host: string
  port: number
  from: string
  to: string
  subject: string
  type: 'html' | 'text'
  body: string
}

const server = createServer((req, res) => {
  logger.info('recv')
  if (req.method !== 'POST' || req.url !== '/') {
    res.statusCode = 405
    res.end()
    return
  }

  let data = ''

  req.on('data', chunk => data += chunk)
  req.on('end', () => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    try {
      decryptor.reset()
      const smtp: SMTPRequest = pipe(
        enc.Base64.parse(data),
        d => decryptor.finalize(d).toString(enc.Utf8),
        JSON.parse,
      )
      createTransport({
        host: smtp.host,
        port: smtp.port,
        from: smtp.from,
        name: smtp.name,
        auth: {
          user: smtp.from,
          pass: smtp.password,
        },
      }).sendMail({
        from: smtp.from,
        to: smtp.to,
        subject: smtp.subject,
        ...(smtp.type === 'html' ? { html: smtp.body } : { text: smtp.body }),
      }).then(() => {
        res.statusCode = 200
        res.end(SUCCESS_RESULT)
      }).catch(() => {
        res.statusCode = 500
        res.end()
      })
    }
    catch (e) {
      res.statusCode = 500
      res.end()
      logger.error(e)
    }
    finally {
      decryptor.reset()
    }
  })
})

server.listen(config.port, () => {
  const BASE_URL = `http://${config.host}:${config.port}`
  logger.info(`Server running at: ${BASE_URL}`)
})
