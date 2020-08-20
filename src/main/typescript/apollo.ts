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

import { Command, program } from 'commander'
import { buildFederatedSchema } from '@apollo/federation'
import { ApolloServer, Config } from 'apollo-server'
import playgroundSettings from '../resources/playground.settings.json'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import { InMemoryLRUCache } from 'apollo-server-caching'
import { context } from './context'
import { dataSources, graphqlModule, gateway } from './schema'
import { CacheControlExtensionOptions } from 'apollo-cache-control'

export function createApolloServer(config: Config): ApolloServer {
  return new ApolloServer({
    ...config,
    dataSources,
    engine: false,
    schema: buildFederatedSchema([graphqlModule]),
  })
}

/**
 * @return Config
 */
function createConfigFromOpts(opts: any): Config {
  const cache = new InMemoryLRUCache()
  const cacheControl: CacheControlExtensionOptions = {
    defaultMaxAge: 0,
    stripFormattedExtensions: false,
  }

  return {
    cache,
    cacheControl,
    context,
    debug: opts.debug,
    introspection: opts.introspection,
    persistedQueries: { cache },
    playground: opts.playground ?? { settings: playgroundSettings },
    plugins: [responseCachePlugin({ cache })],
    subscriptions: false,
    tracing: opts.tracing,
    uploads: opts.uploads,
  }
}

/**
 * @return Command
 */
function decorateWithOptions(command): Command {
  return command
    .version('0.14.1')
    .requiredOption('-p, --port <port>', 'Server port', '4000')
    .requiredOption('-s, --storage <"redis" | "memcached" | "memory">', 'Cache storage for cache', 'memory')
    .option('-d, --debug', 'Enables debugging', false)
    .option('-g, --playground', 'Enable GraphQL Playground', false)
    .option('-i, --introspection', 'Enables schema introspection', false)
    .option('-r, --cors', 'Enable CORS support', false)
    .option('-t, --tracing', 'Enable query tracing', false)
    .option('-u, --uploads', 'Enable file uploads', false)
}

export function createGatewayCommand(): Command {
  return decorateWithOptions(
    program
      .createCommand('gateway')
      .description('Start GraphQL API based on Apollo server with schema federatio')
      .action((opts) => {
        const config: Config = {
          ...createConfigFromOpts(opts),
          gateway,
          engine: {
            apiKey: process.env.ENGINE_API_KEY,
          },
        }
        createApolloServer(config)
          .listen(opts.port)
          .then((info) => console.log(`🚀 Apollo Gateway is running ${info.url}`))
      }),
  )
}

/**
 * @return string Command
 */
export function createServerCommand(): Command {
  return decorateWithOptions(
    program
      .createCommand('server')
      .description('Start GraphQL API based on Apollo server with schema federatio')
      .action((opts) =>
        createApolloServer(createConfigFromOpts(opts))
          .listen(opts.port)
          .then((info) => console.log(`🚀 Apollo Server is running ${info.url}`)),
      ),
  )
}
