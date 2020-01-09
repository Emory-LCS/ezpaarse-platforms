#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Dyabola
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if (/^\/(de|en)\/indexfrm.htm$/i.test(path)) {
    // http://www.dyabola.de/de/indexfrm.htm?page=http://www.dyabola.de/Index_de.htm
    // http://www.dyabola.de/en/indexfrm.htm?page=http://www.dyabola.de/
    result.rtype    = 'CONNECTION';
    result.mime     = 'MISC';
    result.unitid   = param.page;

  }

  return result;
});
