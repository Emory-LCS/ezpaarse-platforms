#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform National Journal
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

  if ((/^\/search\/$/i.test(path)) || (/^\/almanac\/search\/$/i.test(path))) {
    // https://www.nationaljournal.com:443/search/?q=book&by=relv
    // https://www.nationaljournal.com:443/almanac/search/?q=&type=&office=Sen&office=Rep&office=Gov&party=&gender=&ethnicity=&religion=Other&jobtitle2=&state=&majmin=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/(almanac|daily|daybook|events|hotline|presentations|racetracker|research|2020election)$/i.exec(path)) !== null) {
    // https://www.nationaljournal.com:443/[multiple]
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if (((match = /^\/(almanac|daily|daybook|events|hotline|presentations|racetracker|research|2020election)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/(almanac|daily|daybook|events|hotline|presentations|racetracker|research|2020election)\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null)) {
    // https://www.nationaljournal.com:443/[multiple]/[multiple]
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[2];

  } else if (((match = /^\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/daybook\/event\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null)) {
    // https://www.nationaljournal.com:443/virtual-event-cook-catch-up-may-29
    // https://www.nationaljournal.com:443/daybook/event/91434/
    result.rtype    = 'METADATA';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/almanac\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://www.nationaljournal.com:443/almanac/person/270/
    // https://www.nationaljournal.com:443/almanac/committee/274/
    // https://www.nationaljournal.com:443/almanac/staff/254984/
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/racetracker\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null) {
    // https://www.nationaljournal.com:443/racetracker/state/GA/2020/
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];

  } else if ((match = /^\/media\/documents\/([0-9]+)\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9_-]+).([a-z]+)$/i.exec(path)) !== null) {
    if (match[5]    == 'pdf') {
      // https://www.nationaljournal.com:443/media/documents/2020/05/27/nj_covid_aian_health_52720.pdf
      result.rtype  = 'ARTICLE';
      result.mime   = 'PDF';
      result.unitid = match[4];
    } else {
      // https://www.nationaljournal.com:443/media/documents/2020/05/27/nj_covid_aian_health_52720.pptx
      // https://www.nationaljournal.com:443/media/documents/2020/05/27/nj_covid_aian_health_52720.xlsx
      result.rtype  = 'ARTICLE';
      result.mime   = 'MISC';
      result.unitid = match[4];
    }

  } else if (((match = /^\/([a-z]+)\/([0-9]+)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/([a-z]+)\/([0-9]+)\/([a-zA-Z0-9_-]+)\/$/i.exec(path)) !== null)) {
    // https://www.nationaljournal.com:443/s/704929/hotline-extra-some-wisdom-from-nigel-farage?
    // https://www.nationaljournal.com:443/md/707067/coronavirus-health-impact-on-american-indian-and-alaska-native-communities/?
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[3];

  }

  return result;
});
