/*
 * MIT License
 *
 * Copyright (c) 2020 Hiberbee
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Request, Response } from 'express'
import { Algorithm, verify } from 'jsonwebtoken'

export const context = ({ req, res }: { req: Request; res: Response }): any => {
  const authHeader = req.headers.authorization || ''
  if (authHeader !== '') {
    const bearerToken = authHeader.split(' ')
    const secretOrPublicKey = process.env.API_KEY ?? ''
    if (secretOrPublicKey) {
      const options = { algorithms: [(process.env.JWT_ALGORITHM as Algorithm) || 'HS512'] }
      const usernameClaim = process.env.API_USER_CLAIM_ID || 'username'
      const rolesClaim = process.env.API_USER_CLAIM_ROLES || 'roles'
      const token = bearerToken.length === 2 || bearerToken[0].toLowerCase() === 'bearer' ? bearerToken[1] : process.env.API_TOKEN
      if (token) {
        verify(token, secretOrPublicKey, options, (error, user: any) => {
          error !== null ? console.log(error) : res.header('X-User-Id', user[usernameClaim]).header('X-User-Roles', user[rolesClaim])
        })
      }
    }
  }
  res.header('X-App-Id', process.env.APP_NAME ?? 'hiberbee-graphql')
  return { req, res }
}
