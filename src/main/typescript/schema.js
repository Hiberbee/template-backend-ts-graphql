'use strict';
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
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var apollo_server_1 = require('apollo-server');
var gateway_1 = require('@apollo/gateway');
// eslint-disable-next-line @typescript-eslint/no-var-requires
var schema = require('../graphql/gateway/schema.graphql');
exports.typeDefs = apollo_server_1.gql(
  templateObject_1 || (templateObject_1 = tslib_1.__makeTemplateObject(['\n  ', '\n'], ['\n  ', '\n'])),
  schema,
);
var services = {};
exports.dataSources = function () {
  return services;
};
exports.gateway = new gateway_1.ApolloGateway({
  serviceList: [{ name: 'hiberbee', url: 'http://localhost:8000/graphql' }],
  debug: false,
  experimental_autoFragmentization: true,
  serviceHealthCheck: true,
  __exposeQueryPlanExperimental: true,
});
exports.resolvers = {
  Query: {
    app: function (root, args, context) {
      var _a;
      var res = context.res;
      return {
        id: res.get('X-App-Id'),
        version: (_a = process.env.APP_VERSION) !== null && _a !== void 0 ? _a : new Date().toISOString(),
      };
    },
    me: function (root, args, context) {
      var _a;
      var res = context.res;
      return {
        id: res.get('X-User-Id'),
        roles: (_a = res.get('X-User-Roles')) === null || _a === void 0 ? void 0 : _a.toString().split(','),
      };
    },
  },
  Mutation: {},
};
exports.graphqlModule = { resolvers: exports.resolvers, typeDefs: exports.typeDefs };
var templateObject_1;
