/* eslint-disable */
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

import { GraphQLSchemaModule } from 'apollo-graphql'
import { Query, Application, User } from './types'
import { Response } from 'express'
import { ApolloGateway } from '@apollo/gateway'
import typeDefs from './../graphql/gateway/schema.graphql'

export const dataSources: () => {} = () => services

const services: {} = {}

export const gateway = new ApolloGateway({
  serviceList: [{ name: 'hiberbee', url: 'http://127.0.0.1:8000/graphql' }],
  debug: false,
  experimental_autoFragmentization: true,
  serviceHealthCheck: true,
  __exposeQueryPlanExperimental: true,
})

export const resolvers: any = {
  Query: {
    app: (root: Query, args: null, context: { res: Response }): Application => {
      const { res } = context
      return {
        id: res.get('X-App-Id'),
        version: process.env.APP_VERSION ?? new Date().toISOString(),
      }
    },
    me: (root: Query, args, context: { res: Response }): User => {
      const { res } = context
      return {
        id: res.get('X-User-Id'),
        roles: res.get('X-User-Roles')?.toString().split(','),
      }
    },
  },
  Mutation: {},
}

export const graphqlModule: GraphQLSchemaModule = { resolvers, typeDefs }
