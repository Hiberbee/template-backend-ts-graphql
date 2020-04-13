'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var tslib_1 = require('tslib');
var bunyan_1 = tslib_1.__importDefault(require('bunyan'));
var LogAction;
(function (LogAction) {
  LogAction[(LogAction['request'] = 0)] = 'request';
  LogAction[(LogAction['parse'] = 1)] = 'parse';
  LogAction[(LogAction['validation'] = 2)] = 'validation';
  LogAction[(LogAction['execute'] = 3)] = 'execute';
  LogAction[(LogAction['setup'] = 4)] = 'setup';
  LogAction[(LogAction['cleanup'] = 5)] = 'cleanup';
})(LogAction || (LogAction = {}));
var LogStep;
(function (LogStep) {
  LogStep[(LogStep['start'] = 0)] = 'start';
  LogStep[(LogStep['end'] = 1)] = 'end';
  LogStep[(LogStep['status'] = 2)] = 'status';
})((LogStep = exports.LogStep || (exports.LogStep = {})));
var LogFunctionExtension = /** @class */ (function () {
  function LogFunctionExtension() {
    var _a;
    this.logFunction = bunyan_1.default.createLogger({
      name: (_a = process.env.APP_NAME) !== null && _a !== void 0 ? _a : 'hiberbee-graphql',
    });
  }
  LogFunctionExtension.prototype.requestDidStart = function (options) {
    var _this = this;
    this.logFunction.info({ action: LogAction.request, step: LogStep.start });
    var loggedQuery = options.queryString;
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
    return function () {
      var errors = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        errors[_i] = arguments[_i];
      }
      // If there are no errors, we log in willSendResponse instead.
      if (errors.length) {
        _this.logFunction.info({ action: LogAction.request, step: LogStep.end });
      }
    };
  };
  LogFunctionExtension.prototype.parsingDidStart = function () {
    var _this = this;
    this.logFunction.info({ action: LogAction.parse, step: LogStep.start });
    return function () {
      _this.logFunction.info({ action: LogAction.parse, step: LogStep.end });
    };
  };
  LogFunctionExtension.prototype.validationDidStart = function () {
    var _this = this;
    this.logFunction.info({ action: LogAction.validation, step: LogStep.start });
    return function () {
      _this.logFunction.info({ action: LogAction.validation, step: LogStep.end });
    };
  };
  LogFunctionExtension.prototype.executionDidStart = function () {
    var _this = this;
    this.logFunction.info({ action: LogAction.execute, step: LogStep.start });
    return function () {
      _this.logFunction.info({ action: LogAction.execute, step: LogStep.end });
    };
  };
  LogFunctionExtension.prototype.willSendResponse = function (o) {
    this.logFunction.info({
      action: LogAction.request,
      step: LogStep.end,
      key: 'response',
      data: o.graphqlResponse,
    });
  };
  return LogFunctionExtension;
})();
function default_1() {
  return new LogFunctionExtension();
}
exports.default = default_1;
