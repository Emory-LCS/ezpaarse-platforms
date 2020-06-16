#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Library PressDisplay by PressReader
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if (/^\/pressdisplay\/(AdvancedSearch|AdvancedSimilarSearch).aspx$/i.test(path)) {
    // /pressdisplay/AdvancedSearch.aspx
    // /pressdisplay/AdvancedSimilarSearch.aspx
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/pressdisplay\/showarticle.aspx$/i.test(path)) {
    // /pressdisplay/showarticle.aspx?article=ad9b89fd-4649-49ba-927d-dbd2125f5fbc&key=LAcKN4vvFxV9C7aknxiDsg%3d%3d&issue=84222020051600000000001001
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.article;

  } else if (/^\/pressdisplay\/Services\/ImgGalleryHandler.ashx$/i.test(path)) {
    // /pressdisplay/Services/ImgGalleryHandler.ashx?type=0&page=1&issue=9f582020042200000000001001
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.issue;

  } else if (/^\/pressdisplay\/pageview.aspx$/i.test(path)) {
    result.mime     = 'HTML';
    if (param.issue != null) {
      // /pressdisplay/pageview.aspx?issue=34c22020051300000000001001
      result.rtype  = 'ARTICLE';
      result.unitid = param.issue;
    } else if (param.category != null) {
      // /pressdisplay/pageview.aspx?cid=34c2&category=Germany%20[country]
      result.rtype  = 'TOC';
      result.unitid = param.category;
    }

  } else if (/^\/pressdisplay\/PageViewManager.aspx$/i.test(path)) {
    result.mime     = 'HTML';
    if (param.issue != null) {
      // /pressdisplay/PageViewManager.aspx?issue=09622020051500000000001001
      result.rtype  = 'ARTICLE';
      result.unitid = param.issue;
    } else if (param.category != null) {
      // /pressdisplay/PageViewManager.aspx?cid=0962&category=Croatian%20[language]
      result.rtype  = 'TOC';
      result.unitid = param.category;
    }

  }

  return result;
});
