#!/usr/bin/env node
'use strict';
const Parser = require('../.lib/parser.js');
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  console.error(parsedUrl);
});
