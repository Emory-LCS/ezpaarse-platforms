#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform World Shakespeare Bibliographys
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

  if ((/^\/browse$/i.exec(path)) || ((match = /^\/(basic-search|advanced-search|bibliography)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null)) {
    // https://www.worldshakesbib.org:443/browse
    // https://www.worldshakesbib.org:443/basic-search/results?[PAYLOAD]
    // https://www.worldshakesbib.org:443/advanced-search/results?[PAYLOAD]
    // https://www.worldshakesbib.org:443/bibliography/biographical-studies
    // https://www.worldshakesbib.org:443/bibliography/comedies
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/entry\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.worldshakesbib.org:443/entry/aw31?back=/basic-search/results%3Fkeywords%3Dmacbeth%26sort_by%3Dsearch_api_relevance
    // https://www.worldshakesbib.org:443/entry/aaf1459?back=/basic-search/results%3Fkeywords%3Dmacbeth%26sort_by%3Dsearch_api_relevance
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/entry\/export\/(text|ris)\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://www.worldshakesbib.org:443/entry/export/text/601998
    // https://www.worldshakesbib.org:443/entry/export/ris/601998
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  }

  return result;
});
