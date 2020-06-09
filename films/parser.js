#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Films on Demand
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if (/^\/p_Search.aspx$/i.test(path)) {
    // https://digital.films.com:443/p_Search.aspx?rd=title&type=browse&home=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/p_ViewVideo.aspx$/i.test(path)) {
    // https://digital.films.com:443/p_ViewVideo.aspx?xtid=120519&tScript=0
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = param.xtid;

  }

  return result;
});
