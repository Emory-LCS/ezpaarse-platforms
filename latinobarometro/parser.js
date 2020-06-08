#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Latinobarometro Database
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

  if ((match =/^\/latdocs\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // http://www.latinobarometro.org:80/latdocs/Annus_Horribilis.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[1];

  } else if ((match =/^\/LATDC\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).pdf$/i.exec(path)) !== null) {
    // http://www.latinobarometro.org:80/LATDC/DC00592/F00008742-Latinobarometro_2015_Libro_de_codigos_v20190707.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid = match[2];

  } else if ((match = /^\/LATDC\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+).zip$/i.exec(path)) !== null) {
    // http://www.latinobarometro.org:80/LATDC/DC00638/F00008543-Latinobarometro_2018_Eng_Stata_v20190303.zip
    result.rtype    = 'DATASET';
    result.mime     = 'MISC';
    result.unitid   = match[2];

  // Searches and online data analysis are unparseable.

  }

  return result;
});
