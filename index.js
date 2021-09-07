'use strict'

import fs from 'fs'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import fetch from 'node-fetch'
import multer from 'multer'
import express from 'express'
import FormData from 'form-data'
import { config } from 'dotenv'
import { createHash } from 'crypto'

config()
const app = express()

app.use(cors())

app.post('/api/v1/verify', multer().single('file'), async function (request, response) {
  const requestId = request.get('Request-ID')
  const commonCheckResponse = await verify(requestId, request.file)

  response.send(commonCheckResponse)
})

const {
  LICENSE,
  PRIVATE_KEY_PATH, // path to your private key that will be used for signing
  SECRET_PASSPHRASE, // secret that was used when created key pair
  COMMON_CHECK_ENDPOINT
} = process.env

const hashFromFile = (file) => {
  return createHash('sha256').update(file).digest('hex')
}

const signJwt = async (objectToSign) => {
  const privateKey = fs.readFileSync(PRIVATE_KEY_PATH)
  const token = jwt.sign(objectToSign, { key: privateKey, passphrase: SECRET_PASSPHRASE }, { algorithm: 'RS512' })

  return token
}

const verify = async (requestId, encryptedFile) => {
  const fileBuffer = encryptedFile.buffer

  const objectToSign = await hashFromFile(fileBuffer)
  const jwt = await signJwt(objectToSign)

  const formData = new FormData()

  formData.append('file', fileBuffer, {
    name: 'file',
    filename: 'encryptedFile',
  })

  const options = {
    method: 'POST',
    body: formData,
    headers: {
      'Api-Key': LICENSE,
      'Authorization': jwt,
      'Request-ID': requestId,
      ...formData.getHeaders()
    },
    timeout: 15000
  }

  const response = await fetch(COMMON_CHECK_ENDPOINT, options)

  return response.json()
}

const PORT = 3000

app.listen(PORT, async () => {
  console.log(`App running on port ${PORT}`)
})
