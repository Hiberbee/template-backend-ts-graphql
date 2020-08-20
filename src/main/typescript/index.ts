import { createGatewayCommand, createServerCommand } from './apollo'
import { program } from 'commander'

program
  .name(process.env.APP_NAME ?? 'graphql')
  .version(process.env.APP_VERSION ?? '')
  .description('GraphQL server kit: Apollo Gateway with schema federation, Faker API server')
  .addCommand(createServerCommand())
  .addCommand(createGatewayCommand())
program.parse(process.argv)
