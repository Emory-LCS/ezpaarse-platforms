#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Vascular Surgery
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

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/action\/doSearch/i.test(path)) {
    // https://www.jvascsurg.org:443/action/doSearch?occurrences=all&searchText=rainbow&searchType=quick&searchScope=fullSite&journalCode=ymva
    // https://www.jvascsurg.org:443/action/doSearch?searchType=quick&occurrences=all&ltrlSrch=true&searchScope=fullSite&searchText=Abdominal%20aortic%20aneurysm%20(AAA)&code=ymva-site
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if ((match = /^\/(issue|content)\/([0-z()-]+)/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/issue/S0741-5214(19)X0007-5
    // https://www.jvascsurg.org:443/issue/S0741-5214(19)X0006-3
    // https://www.jvascsurg.org:443/issue/S0741-5214(17)X0013-X
    // https://www.jvascsurg.org:443/content/SVS2018
    // https://www.jvascsurg.org:443/content/specialCTU
    // https://www.jvascsurg.org:443/content/ymva-ImagesArchive
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.title_id = match[2];

  } if ((match = /^\/article\/([0-9S()-]{21})\/abstract$/i.exec(path)) !== null)  {
    // https://www.jvascsurg.org:443/article/S0741-5214(18)32469-8/abstract
    // https://www.jvascsurg.org:443/article/S0741-5214(06)01485-6/abstract
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } if ((match = /^\/article\/([0-9S()-]{21})\/fulltext$/i.exec(path)) !== null)  {
    // https://www.jvascsurg.org:443/article/S0741-5214(18)32556-4/fulltext
    // https://www.jvascsurg.org:443/article/S0741-5214(18)32481-9/fulltext
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } if ((match = /^\/article\/([0-9S()-]{21})\/pdf$/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/article/S0741-5214(18)32556-4/pdf
    // https://www.jvascsurg.org:443/article/S0741-5214(03)01112-1/pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];
    result.title_id = match[1];

  } if ((match = /^\/(ymva_va_([0-9]{2})_([0-9]{1})_([0-9]{1})_full)/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/ymva_va_70_1_2_full
    // https://www.jvascsurg.org:443/ymva_va_68_6_2_full
    result.rtype = 'IMAGE';
    result.mime = 'MISC';
    result.unitid = match[2] + '_' + match[3] + '_' + match[4];
    result.title_id = match[1];

  } if ((match = /^\/cms\/attachment\/([0-9a-z-]{36})\/mmc1\.mp4/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/cms/attachment/d527a335-3b5d-4cee-8baf-95fbec831b83/mmc1.mp4
    // https://www.jvascsurg.org:443/cms/attachment/7a8bbded-5320-45d8-a4f4-e50af2d5a017/mmc1.mp4
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = match[1];
    result.title_id = match[1];

  }

  return result;
});
