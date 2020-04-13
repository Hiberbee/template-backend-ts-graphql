'use strict';
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
var jsonwebtoken_1 = require('jsonwebtoken');
exports.context = function (_a) {
  var req = _a.req,
    res = _a.res;
  var _b, _c;
  var authHeader = req.headers.authorization || '';
  if (authHeader !== '') {
    var bearerToken = authHeader.split(' ');
    var secretOrPublicKey = (_b = process.env.API_KEY) !== null && _b !== void 0 ? _b : '';
    if (secretOrPublicKey) {
      var options = { algorithms: [process.env.JWT_ALGORITHM || 'HS512'] };
      var usernameClaim_1 = process.env.API_USER_CLAIM_ID || 'username';
      var rolesClaim_1 = process.env.API_USER_CLAIM_ROLES || 'roles';
      var token = bearerToken.length === 2 || bearerToken[0].toLowerCase() === 'bearer' ? bearerToken[1] : process.env.API_TOKEN;
      if (token) {
        req.headers.authorization = 'Bearer ' + token;
        jsonwebtoken_1.verify(token, secretOrPublicKey, options, function (error, user) {
          error !== null ? console.log(error) : res.header('X-User-Id', user[usernameClaim_1]).header('X-User-Roles', user[rolesClaim_1]);
        });
      }
    }
  }
  res.header('X-App-Id', (_c = process.env.APP_NAME) !== null && _c !== void 0 ? _c : 'hiberbee');
  return { res: res };
};
