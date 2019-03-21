#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Garnier Numérique
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (param && param.link) {
    let cleanLink = param.link.replace(/\s+/g, '');
    let type      = cleanLink.split('_');
    switch (type[1]) {
    case 'article':
      // numerique-bases/index.php?module=App&action=PanelText&link=jmp_article_17%09-A-%0A
      result.rtype  = 'ARTICLE';
      result.mime   = 'HTML';
      result.unitid = cleanLink;
      break;
    case 'tabmat':
      // numerique-bases/index.php?module=App&action=PanelTabmat&link=jmp_tabmat__tmxa_007
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
      result.unitid = cleanLink;
      break;
    }
  } else if ((match = /^\/doi\/[a-z]+-([a-z]+)?$/.exec(path)) !== null) {
    // /doi/article-pdf?article=HpeMS02_9
    if (match[1] === 'pdf') {
      result.mime = 'PDF';
    }
    if (param && param.article) {
      result.rtype  = 'ARTICLE';
      result.unitid = param.article;
    }
  } else if ((match = /^\/search$/.exec(path)) !== null) {
    // https://classiques-garnier.com/search
    result.rtype  = 'SEARCH';
    result.mime   = 'HTML';
  } else if ((match = /^\/export\/pdf\/(.*)$/.exec(path)) !== null) {
    // https://classiques-garnier.com:443/export/pdf/cahiers-de-memoire-kigali-2019-carte-du-rwanda.html?displaymode=full
    result.rtype  = 'BOOK CHAPTER';
    result.mime   = 'PDF';
  } else if ((match = /^\/(.*)\.html$/.exec(path)) !== null) {
    // https://classiques-garnier.com:443/cahiers-de-memoire-kigali-2019-carte-du-rwanda.html
    if (param.displaymode == 'full') {
      result.rtype  = 'BOOK CHAPTER';
      result.mime   = 'HTML';
    }
    if (param.displaymode !== 'full') {
      result.rtype  = 'TOC';
      result.mime   = 'HTML';
    }
  }

  return result;
});
