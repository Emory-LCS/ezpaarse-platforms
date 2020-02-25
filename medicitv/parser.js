#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Medici.tv
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if ((/^\/$/i.test(path) && (param.s != null)) || (/^\/(en|es|ru)\/(search|concerts|operas|ballets|documentaries|masterclasses)\/$/i.test(path)) || (/^\/category\/([a-zA-Z0-9]+)\/$/i.test(path))) {
    // https://musicwithvision.medici.tv:443/?s=wagner
    // https://www.medici.tv:443/en/search/?q=swan+lake
    // https://www.medici.tv:443/en/documentaries/
    // https://www.medici.tv:443/en/operas/?composer=Richard+Wagner
    // https://musicwithvision.medici.tv:443/category/playlists/
    // https://musicwithvision.medici.tv:443/category/community/
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if ((match = /^\/(en|es|ru)\/(concerts|operas|ballets|documentaries|masterclasses)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.medici.tv:443/en/ballets/swan-lake-rudolf-nureyev-jose-martinez-agnes-letestu-opera-national-de-paris/
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.title_id = match[2];
    result.unitid   = match[3];

  } else if ((match = /^\/(en|es|ru)\/artists\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.medici.tv:443/en/artists/olivier-messiaen/
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = 'artists';
    result.unitid   = match[2];

  } else if ((match = /^\/author\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://musicwithvision.medici.tv:443/author/alixmedicitv/
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.title_id = 'author';
    result.unitid   = match[1];

  } else if (((match = /^\/(video-of-the-moment-archives)\/$/i.exec(path)) !== null) || ((match = /^\/(clef-notes|artists)\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null)) {
    // https://musicwithvision.medici.tv:443/video-of-the-moment-archives/
    // https://musicwithvision.medici.tv:443/clef-notes/one-thing-to-listen-for/brahms-violin-concerto/
    // https://musicwithvision.medici.tv:443/artists/herbert-von-karajan/10-dinner-party-facts-about-about-der-chef-herbert-von-karajan/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if (match[2] === undefined) {
      result.title_id = match[1];
      result.unitid   = match[1];
    } else {
      result.title_id = match[1] + '/' + match[2];
      result.unitid   = match[3];
    }

  }

  return result;
});
