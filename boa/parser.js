#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform British Online Archives
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

  if (/^\/boa\/search/i.test(path)) {
    // https://microform.digital:443/boa/search?q=barton
    // https://microform.digital:443/boa/search?q=edinburgh
    // https://microform.digital:443/boa/search/?st=adv&all=edinburgh%20castle&not-1=slave&date_type=Date%20Range&currMinYear=1800&currMaxYear=1900&facetCollection=30&_=1581082276323
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/boa\/(collections|series)\/([0-9]+)\/(volumes)\/([0-9]+)\/([0-z-]+)/i.exec(path)) !== null) {
    // https://microform.digital:443/boa/collections/40/volumes/241/resolutions-etc-of-the-organisation-of-african-unity-and-other-documents-since-1963
    result.rtype = 'TOC';
    result.mime = 'HTML';
    if (match[3] === 'volumes') {
      result.unitid = match[4] + '/' + match[5];
      result.title_id = match[4] + '/' + match[5];
    }

  } else if ((match=/^\/boa\/(collections|series)\/([0-9]+)\/([0-z-]+)/i.exec(path)) !== null) {
    // https://microform.digital:443/boa/collections/14/slavery-in-jamaica-records-from-a-family-of-slave-owners-1686-1860/key-data << this could be a TOC for this collection; it loads a lot of other urls with similar paths but only this top page ends with "key-data"
    // https://microform.digital:443/boa/series/13/representing-britain-international-relations-and-diplomacy
    result.rtype = 'TOC';
    result.mime = 'HTML';
    if (match[3] !== 'volumes') {
      result.unitid = match[2] + '/' + match[3];
      result.title_id = match[2] + '/' + match[3];
    }

  } else if ((match = /^\/boa\/((documents)|(posts\/category\/(articles|collection-releases|news)))\/([0-9]+)\/([0-z-]+)/i.exec(path)) !== null) {
    // https://microform.digital:443/boa/documents/726/the-blackshirt-february-to-june-1933
    // https://microform.digital:443/boa/posts/category/articles/356/dispatches-from-the-coin-wars-a-post-revisionist-appraisal-of-american-strategy-in-the-vietnam-war
    // https://microform.digital:443/boa/posts/category/collection-releases/349/prosecuting-the-holocaust-british-investigations-into-nazi-war-crimes-1944-1949
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[5] + '/' + match[6];
    result.title_id = match[5] + '/' + match[6];

  } else if ((match = /^\/boa\/documents\/([0-z-]+)\/page-url\/([0-9]+)/i.exec(path)) !== null) {
    // https://microform.digital:443/boa/documents/J-BOX1-01/page-url/2?base64=true
    // https://microform.digital:443/boa/documents/125-bla-1933a/page-url/1?base64=true
    // https://microform.digital:443/boa/documents/Bb-01/page-url/1?base64=true
    // https://microform.digital:443/boa/documents/Bb-01/page-url/9?base64=true
    result.rtype = 'IMAGE';
    result.mime = 'PDF';
    result.unitid = match[1] + '/' + match[2];
    result.title_id = match[1] + '/' + match[2];
    result.print_identifier = match[1];

  } else if ((match = /^\/boa\/posts\/category\/podcasts\/([0-z-/]+)/i.exec(path)) !== null) {
    // https://microform.digital:443/boa/posts/category/podcasts/360/remembering-the-holocaust
    // https://microform.digital:443/boa/posts/category/podcasts/332/is-space-the-final-frontier-of-inter-state-rivalry
    result.rtype = 'AUDIO';
    result.mime = 'MISC';
    result.unitid = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/boa\/posts\/category\/video\/([0-z-/]+)/i.exec(path)) !== null) {
    // https://microform.digital:443/boa/posts/category/video/346/battle-of-britain-meps-on-brexit
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = match[1];
    result.title_id = match[1];

  }

  return result;
});