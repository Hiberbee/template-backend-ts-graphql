"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_caching_1 = require("apollo-server-caching");
var apollo_server_cache_redis_1 = require("apollo-server-cache-redis");
var apollo_server_cache_memcached_1 = require("apollo-server-cache-memcached");
function createInMemoryCache() {
    return new apollo_server_caching_1.InMemoryLRUCache();
}
function createRedisCache() {
    var _a, _b, _c;
    return new apollo_server_cache_redis_1.RedisCache({
        host: (_a = process.env.REDIS_SERVICE_HOST) !== null && _a !== void 0 ? _a : 'localhost',
        port: Number.parseInt((_b = process.env.REDIS_SERVICE_PORT) !== null && _b !== void 0 ? _b : '6379'),
        password: process.env.REDIS_PASSWORD,
        db: Number.parseInt((_c = process.env.REDIS_DATABASE) !== null && _c !== void 0 ? _c : '0'),
        enableReadyCheck: true,
    });
}
function createMemcachedCache() {
    var _a, _b;
    var url = ((_a = process.env.MEMCACHED_SERVICE_HOST) !== null && _a !== void 0 ? _a : 'localhost') + ":" + ((_b = process.env.MEMCACHED_SERVICE_PORT) !== null && _b !== void 0 ? _b : 11211);
    return new apollo_server_cache_memcached_1.MemcachedCache(url);
}
exports.cacheControl = {
    defaultMaxAge: 0,
    stripFormattedExtensions: false,
};
function createCache(storage) {
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
exports.createCache = createCache;
