'use strict';
var _a, _b;
Object.defineProperty(exports, '__esModule', { value: true });
var apollo_1 = require('./apollo');
var commander_1 = require('commander');
commander_1.program
  .name((_a = process.env.APP_NAME) !== null && _a !== void 0 ? _a : 'graphql')
  .version((_b = process.env.APP_VERSION) !== null && _b !== void 0 ? _b : '')
  .description('GraphQL server kit: Apollo Gateway with schema federation, Faker API server')
  .addCommand(apollo_1.createServerCommand())
  .addCommand(apollo_1.createGatewayCommand());
commander_1.program.parse(process.argv);
