#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The History Makers
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

  if ((match = /^\/(search|advanced-search)$/i.exec(path)) !== null) {
    // https://www.thehistorymakers.org:443/search?search_api_fulltext=martin+luther+king
    // https://www.thehistorymakers.org:443/advanced-search?search_api_fulltext=atlanta
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.thehistorymakers.org:443/media
    // https://www-thehistorymakers-org:443/digital-archives
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (((match = /^\/node\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) || ((match = /^\/special-collections\/details\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null)) {
    // https://www-thehistorymakers-org:443/special-collections/details/pioneers-struggle
    // https://www-thehistorymakers-org:443/node/114863
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/biography\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.thehistorymakers.org:443/biography/luther-williams-41
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/sites\/([a-zA-Z0-9-]+)\/files\/(.*).pdf$/i.exec(path)) !== null) {
    // https://devwww.thehistorymakers.org:443/sites/default/files/2019-01/PITS%20Curriculum_0.pdf
    // http://www.thehistorymakers.org:80/sites/production/files/S2001_014_PITS_EAD_WEB.pdf
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[2];

  }

  return result;

});
