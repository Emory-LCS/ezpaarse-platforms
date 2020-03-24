#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform IndiaStat
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

  if (/^\/Searchresult.aspx$/i.test(path)) {
    // https://www.indiastat.com:443/Searchresult.aspx
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-zA-Z0-9-/]+)\/stats.aspx$/i.exec(path)) !== null) {
    // https://www.indiastat.com:443/cooperatives-data/104592/stats.aspx
    // https://www.indiastat.com:443/transport-data/30/roads/246/stats.aspx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/(table|Cooperatives)\/([a-zA-Z0-9-/]+)\/(data|specimen).aspx$/i.exec(path)) !== null) {
    // https://www.indiastat.com:443/table/agriculture-data/2/retail-prices-of-food-commodities-2019/1209287/1236466/data.aspx
    // https://www.indiastat.com:443/table/transport-data/30/roads/246/106281/data.aspx
    // https://www.indiastat.com/Cooperatives/104592/specimen.aspx
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  }

  return result;
});
