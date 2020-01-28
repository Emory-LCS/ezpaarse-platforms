#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NK News
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

  if ((/^\/$/i.test(path)) && (param.s != null)) {
    // https://www.nknews.org:443/?s=books&sort=date&start=01-01-2010&end=10-01-2020
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';
    result.unitid   = param.s;

  } else if ((match = /^\/(category|tag|gallery)\/([a-zA-Z0-9-/]+)podcast([a-zA-Z0-9-/]+)\/$/i.exec(path)) !== null) {
    // https://www.nknews.org:443/category/north-korea-news-podcast/older-podcasts/the-rocky-road-to-normalizing-north-korea-u-s-relations-nknews-podcast-ep-112/879237/
    result.rtype    = 'AUDIO';
    result.mime     = 'MISC';
    result.unitid   = match[1] + '/' + match[2] + 'podcast' + match[3];

  } else if ((match = /^\/(category|tag|gallery)\/([a-zA-Z0-9-/]+)\/$/i.exec(path)) !== null) {
    // https://www.nknews.org:443/category/news/
    // https://www.nknews.org:443/category/news/page/2/
    // https://www.nknews.org:443/category/featured-content/interview/
    // https://www.nknews.org:443/category/featured-content/interview/page/2/
    // https://www.nknews.org:443/category/nk-voices/defector-survey-2014/
    // https://www.nknews.org:443/tag/culture/
    // https://www.nknews.org:443/tag/culture/page/2/
    // https://www.nknews.org:443/gallery/page/2/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2];

  } else if ((match = /^\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.nknews.org:443/2020/01/kim-jong-un-turns-36-but-north-korea-is-conspicuously-silent-about-the-big-day/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];

  } else if ((match = /^\/content_author\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.nknews.org:443/content_author/oliver-hotham/
    result.rtype    = 'BIO';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/pro\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null) {
    // https://www.nknews.org:443/pro/north-korea-company-database/
    result.rtype    = 'DATASET';
    result.mime     = 'MISC';
    result.unitid   = match[1];

  } else if ((match = /^\/wp-content\/uploads\/([0-9]+)\/([0-9]+)\/([a-zA-Z0-9-]+).jpeg$/i.exec(path)) !== null) {
    // https://www.nknews.org:443/wp-content/uploads/2019/04/sinuiju-2019-group-pic-1-300x200.jpeg
    result.rtype     = 'IMAGE';
    result.mime     = 'MISC';
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];

  }

  return result;
});
