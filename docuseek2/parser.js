#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Docuseek
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};

  let match;

  if (/^\/cart\/advsearch\/hf$/i.test(path)) {
    // https://docuseek2.com:443/cart/advsearch/hf?subjectid=75
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (((match = /^\/cart\/([a-zA-Z0-9_]+)$/i.exec(path)) !== null) || ((match = /^\/cart\/product\/([a-zA-Z0-9_]+)$/i.exec(path)) !== null)) {
    // http://docuseek2.com:80/cart/newreleases_2018
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/([a-zA-Z0-9_]+){0,2}-([a-zA-Z0-9_]+)$/i.exec(path)) !== null) {
    result.unitid   = match[1] + '-' + match[2];
    if (match[1] == 'ds') {
      result.rtype    = 'TOC';
      result.mime     = 'HTML';
    } else {
      result.rtype    = 'VIDEO';
      result.mime     = 'MISC';
    }

  }

  return result;
});
