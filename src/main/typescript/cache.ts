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

import { KeyValueCache, InMemoryLRUCache } from 'apollo-server-caching';
import { RedisCache } from 'apollo-server-cache-redis';
import { MemcachedCache } from 'apollo-server-cache-memcached';
import { CacheControlExtensionOptions } from 'apollo-cache-control';

type CacheType = 'redis' | 'memcached' | 'memory';

function createInMemoryCache(): KeyValueCache {
  return new InMemoryLRUCache();
}

function createRedisCache(): KeyValueCache {
  return new RedisCache({
    host: process.env.REDIS_SERVICE_HOST ?? 'localhost',
    port: Number.parseInt(process.env.REDIS_SERVICE_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
    db: Number.parseInt(process.env.REDIS_DATABASE ?? '0'),
    enableReadyCheck: true,
  });
}

function createMemcachedCache(): KeyValueCache {
  const url = `${process.env.MEMCACHED_SERVICE_HOST ?? 'localhost'}:${process.env.MEMCACHED_SERVICE_PORT ?? 11211}`;
  return new MemcachedCache(url);
}
export const cacheControl: CacheControlExtensionOptions = {
  defaultMaxAge: 0,
  stripFormattedExtensions: false,
};

export function createCache(storage?: CacheType): KeyValueCache {
  switch (storage) {
    case 'memcached':
      return createMemcachedCache();
    case 'redis':
      return createRedisCache();
    case 'memory':
    case undefined:
    default:
      return createInMemoryCache();
  }
}
