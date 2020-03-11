#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ethnologue
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  let match;

  if ((match = /^\/browse\/(.*)$/i.exec(path)) !== null) {
    // https://www.ethnologue.com:443/browse/countries
    // https://www.ethnologue.com:443/browse/names/n
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/(language|cloud|country|map)\/(.*)$/i.exec(path)) !== null) {
    // https://www.ethnologue.com:443/language/nds
    // https://www.ethnologue.com:443/language/nds/map
    // https://www.ethnologue.com:443/cloud/nds
    // https://www.ethnologue.com:443/country/CO
    // https://www.ethnologue.com:443/country/JM/languages
    // https://www.ethnologue.com:443/country/JM/status
    // https://www.ethnologue.com:443/country/JM/maps
    // https://www.ethnologue.com:443/map/CRB_n
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid = match[1] + '/' + match[2];

  } else if ((match = /^\/product\/(.*)$/i.exec(path)) !== null) {
    // https://www.ethnologue.com:443/product/23-Digest-CO
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/guides\/(.*)$/i.exec(path)) !== null) {
    // https://www.ethnologue.com:443/guides/largest-families
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = 'guides/' + match[1];

  }

  return result;
});
