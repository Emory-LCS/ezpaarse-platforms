#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Brill Databases (World Christian & World Religion)
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  let match;

  if ((match = /^\/(wcd|wrd)$/i.exec(path)) !== null) {
    // https://worldreligiondatabase.org:443/wcd
    // https://worldreligiondatabase.org:443/wrd
    result.rtype    = 'CONNECTION';
    result.mime     = 'MISC';
    if (match[1] == 'wcd') {
      result.publication_title = 'World Christian Database';
      result.unitid            = 'World Christian Database';
    } else if (match[1] == 'wrd') {
      result.publication_title = 'World Religion Database';
      result.unitid            = 'World Religion Database';
    }

  } else if (((match = /^\/(wcd|wrd)\/launcher\/wcd_search.json$/i.exec(path)) !== null) || ((match = /^\/(wcd|wrd)\/value_list\/gkc:([0-9]+)$/i.exec(path)) !== null) ||
((match = /^\/(wcd|wrd)\/launcher\/(wcd|wrd)_search.json$/i.exec(path)) !== null)) {
    // https://worldreligiondatabase.org:443/wrd/launcher/wcd_search.json?term=cows
    // https://worldchristiandatabase.org:443/wcd/value_list/gkc:2066
    // https://worldchristiandatabase.org:443/wcd/launcher/wcd_search.json?term=catholic
    result.rtype     = 'SEARCH';
    result.mime      = 'HTML';
    if (match[1] == 'wcd') {
      result.publication_title = 'World Christian Database';
    } else if (match[1] == 'wrd') {
      result.publication_title = 'World Religion Database';
    }


  } else if ((match = /^\/(wcd|wrd)\/detail\/([a-zA-Z0-9-]+)\/data\/([a-zA-Z0-9-]+).json$/i.exec(path)) !== null) {
    // https://worldreligiondatabase.org:443/wrd/detail/city-2010-archive/data/14.json
    // https://worldchristiandatabase.org:443/wcd/detail/denomination/data/1577.json
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[2] + '-' + match[3];
    if (match[1] == 'wcd') {
      result.publication_title = 'World Christian Database';
    } else if (match[1] == 'wrd') {
      result.publication_title = 'World Religion Database';
    }

  }

  return result;
});
