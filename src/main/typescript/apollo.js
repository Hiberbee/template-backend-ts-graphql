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
const tslib_1 = require("tslib");
const commander_1 = require("commander");
const apollo_server_1 = require("apollo-server");
const playground_settings_json_1 = tslib_1.__importDefault(require("../resources/playground.settings.json"));
const cache_1 = require("./cache");
const apollo_server_plugin_response_cache_1 = tslib_1.__importDefault(require("apollo-server-plugin-response-cache"));
const context_1 = require("./context");
const schema_1 = require("./schema");
const federation_1 = require("@apollo/federation");
function createApolloServer(config) {
    return new apollo_server_1.ApolloServer(Object.assign(Object.assign({}, config), { dataSources: schema_1.dataSources, engine: false, schema: federation_1.buildFederatedSchema([schema_1.graphqlModule]) }));
}
exports.createApolloServer = createApolloServer;
/**
 * @return Config
 */
function createConfigFromOpts(opts) {
    var _a;
    const cache = cache_1.createCache(opts.storage);
    return {
        cache,
        cacheControl: cache_1.cacheControl,
        context: context_1.context,
        debug: opts.debug,
        introspection: opts.introspection,
        persistedQueries: { cache },
        playground: (_a = opts.playground) !== null && _a !== void 0 ? _a : { settings: playground_settings_json_1.default },
        plugins: [apollo_server_plugin_response_cache_1.default({ cache })],
        subscriptions: false,
        tracing: opts.tracing,
        uploads: opts.uploads,
    };
}
/**
 * @return Command
 */
function decorateWithOptions(command) {
    return command
        .version('0.14.0')
        .requiredOption('-p, --port <port>', 'Server port', '4000')
        .requiredOption('-s, --storage <"redis" | "memcached" | "memory">', 'Cache storage for cache', 'memory')
        .option('-d, --debug', 'Enables debugging', false)
        .option('-g, --playground', 'Enable GraphQL Playground', false)
        .option('-i, --introspection', 'Enables schema introspection', false)
        .option('-r, --cors', 'Enable CORS support', false)
        .option('-t, --tracing', 'Enable query tracing', false)
        .option('-u, --uploads', 'Enable file uploads', false);
}
function createGatewayCommand() {
    return decorateWithOptions(commander_1.program
        .createCommand('gateway')
        .description('Start GraphQL API based on Apollo server with schema federatio')
        .action((opts) => {
        const config = Object.assign(Object.assign({}, createConfigFromOpts(opts)), { gateway: schema_1.gateway, engine: {
                apiKey: process.env.ENGINE_API_KEY,
            } });
        createApolloServer(config)
            .listen(opts.port)
            .then((info) => console.log(`🚀 Apollo Gateway is running ${info.url}`));
    }));
}
exports.createGatewayCommand = createGatewayCommand;
/**
 * @return Command
 */
function createServerCommand() {
    return decorateWithOptions(commander_1.program
        .createCommand('server')
        .description('Start GraphQL API based on Apollo server with schema federatio')
        .action((opts) => createApolloServer(createConfigFromOpts(opts))
        .listen(opts.port)
        .then((info) => console.log(`🚀 Apollo Server is running ${info.url}`))));
}
exports.createServerCommand = createServerCommand;
