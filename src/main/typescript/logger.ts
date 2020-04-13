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
import { GraphQLExtension, GraphQLResponse } from 'graphql-extensions';
import { DocumentNode } from 'graphql';
import { Request } from 'apollo-server-env';
import { GraphQLRequestContext } from 'apollo-server-types';
import bunyan from 'bunyan';
import Logger from 'bunyan';

enum LogAction {
  request,
  parse,
  validation,
  execute,
  setup,
  cleanup,
}

export enum LogStep {
  start,
  end,
  status,
}

class LogFunctionExtension<TContext = any> implements GraphQLExtension<TContext> {
  private logFunction: Logger;
  public constructor() {
    this.logFunction = bunyan.createLogger({ name: process.env.APP_NAME ?? 'hiberbee-graphql' });
  }

  public requestDidStart(options: {
    request: Pick<Request, 'url' | 'method' | 'headers'>;
    queryString?: string;
    parsedQuery?: DocumentNode;
    persistedQueryHit?: boolean;
    persistedQueryRegister?: boolean;
    context: TContext;
    requestContext: GraphQLRequestContext<TContext>;
    operationName?: string;
    variables?: { [key: string]: [] };
  }): (...errors: Error[]) => void {
    this.logFunction.info({ action: LogAction.request, step: LogStep.start });
    const loggedQuery = options.queryString;
    this.logFunction.info({
      action: LogAction.request,
      step: LogStep.status,
      key: 'query',
      data: loggedQuery,
    });
    this.logFunction.info({
      action: LogAction.request,
      step: LogStep.status,
      key: 'variables',
      data: options.variables,
    });
    this.logFunction.info({
      action: LogAction.request,
      step: LogStep.status,
      key: 'operationName',
      data: options.operationName,
    });
    return (...errors: Array<Error>): void => {
      // If there are no errors, we log in willSendResponse instead.
      if (errors.length) {
        this.logFunction.info({ action: LogAction.request, step: LogStep.end });
      }
    };
  }

  public parsingDidStart(): () => void {
    this.logFunction.info({ action: LogAction.parse, step: LogStep.start });
    return (): void => {
      this.logFunction.info({ action: LogAction.parse, step: LogStep.end });
    };
  }

  public validationDidStart(): () => void {
    this.logFunction.info({ action: LogAction.validation, step: LogStep.start });
    return (): void => {
      this.logFunction.info({ action: LogAction.validation, step: LogStep.end });
    };
  }

  public executionDidStart(): () => void {
    this.logFunction.info({ action: LogAction.execute, step: LogStep.start });
    return (): void => {
      this.logFunction.info({ action: LogAction.execute, step: LogStep.end });
    };
  }

  public willSendResponse(o: { graphqlResponse: GraphQLResponse }): void {
    this.logFunction.info({
      action: LogAction.request,
      step: LogStep.end,
      key: 'response',
      data: o.graphqlResponse,
    });
  }
}

export default function (): LogFunctionExtension {
  return new LogFunctionExtension<any>();
}
