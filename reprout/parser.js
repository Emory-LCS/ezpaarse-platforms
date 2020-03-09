#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform 
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

  if (/^\/search$/i.test(path)) {
    // https://www.rep.routledge.com:443/search?searchString=immanuel+kant&newSearch=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/articles\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.rep.routledge.com:443/articles/biographical/kant-immanuel-1724-1804/v-1
    // https://www.rep.routledge.com:443/articles/overview/medieval-philosophy/v-1
    // https://www.rep.routledge.com:443/articles/thematic/business-ethics/v-1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];

  } else if ((match = /^\/articles\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/sections\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.rep.routledge.com:443/articles/biographical/kant-immanuel-1724-1804/v-1/sections/pure-concepts-of-the-understanding
    // https://www.rep.routledge.com:443/articles/overview/medieval-philosophy/v-1/sections/philosophical-theology-1
    // https://www.rep.routledge.com:443/articles/thematic/business-ethics/v-1/sections/external-stakeholders-social-responsibility
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3] + '/sections/' + match[4];

  } else if ((match = /^\/articles\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/bibliography\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.rep.routledge.com:443/articles/thematic/business-ethics/v-1/bibliography/business-ethics-bib
    result.rtype    = 'SUPPL';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3] + '/bibliography/' + match[4];

  }

  return result;
});
