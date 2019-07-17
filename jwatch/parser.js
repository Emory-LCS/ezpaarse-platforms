#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NEJM Journal Watch
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/(search\/advanced)|([a-z-]+$)/i.test(path)) {
    // https://www.jwatch.org:443/search/advanced?fulltext=electricity&hits=20&page=1
    // https://www.jwatch.org:443/search/advanced?fulltext=podcast&hits=20&page=1
    // https://www.jwatch.org:443/cardiology
    // https://www.jwatch.org:443/depression-anxiety
    // https://www.jwatch.org:443/clinical-spotlight
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if ((match = /^\/([a-z-]+)\//i.exec(path)) !== null) {
    // https://blogs.jwatch.org:443/hiv-id-observations/?_ga=2.172113696.243381463.1562588137-26633474.1562161140
    if (match[1] !== 'search' && param._ga) {
      result.rtype = 'TOC';
      result.mime = 'HTML';
      result.unitid = param._ga;
      result.title_id = match[1];
    }

  } if ((match = /^\/index\.php\/([0-9a-z-]+)\/([0-9/]{10})\/$/i.exec(path)) !== null) {
    // https://podcasts.jwatch.org:443/index.php/podcast-226-what-we-need-to-talk-about-when-we-talk-about-health/2019/06/11/
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1].slice(0, 11);
    result.title_id = match[1] + '/' + match[2];

  } if ((match = /^\/([a-z]{2})([0-9]+)\/([0-9/]{10})\/([a-z-]+)/i.exec(path)) !== null) {
    // https://www.jwatch.org:443/fw115583/2019/07/08/synthetic-cannabinoids-associated-with-more-comas-and
    // https://www.jwatch.org:443/na47534/2018/10/05/bleeding-synthetic-cannabinoid-additives-coming-ed-near
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1] + match[2];
    result.title_id = match[4];

  } if ((match = /^\/([a-z-]+)\/index\.php\/([a-z-]+)\/([0-9/]{10})\/$/i.exec(path)) !== null) {
  // https://blogs.jwatch.org:443/hiv-id-observations/index.php/in-praise-of-experienced-id-fellows-and-a-dozen-on-service-id-learning-units/2019/07/07/
  // https://blogs.jwatch.org:443/hiv-id-observations/index.php/antibiotic-development-is-broken-brothers-in-id-practice-and-this-years-winner-of-the-id-related-social-media-award/2019/06/30/
    if (match[3]) {
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      result.unitid = match[1] + '/' + match[3];
      result.title_id = match[2];
    }

  } if ((match = /^\/([a-z-]+)\/index\.php\/([0-9/]{7})\/([a-z-]+)\/$/i.exec(path)) !== null) {
    // https://blogs.jwatch.org:443/general-medicine/index.php/2019/04/the-nephrology-social-media-collective/
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1] + '/' + match[2];
    result.title_id = match[3];

  }
  return result;
});
