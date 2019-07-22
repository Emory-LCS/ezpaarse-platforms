#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform artnet
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

  if (/^\/search\/(artists|articles|)/i.test(path)) {
  // http://www.artnet.com:80/search/artists/?q=barton
  // http://www.artnet.com:80/search/?q=rainbow
  // http://www.artnet.com:80/search/articles/?q=luis-de-jesus
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if (/^\/artists\/artists-starting-with-(.*)$/i.test(path)) {
  // http://www.artnet.com:80/artists/artists-starting-with-b
  // http://www.artnet.com:80/artists/artists-starting-with-b%c3%adr%e2%80%93bis
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if (/^\/(api|pdb|PDB)\/(search|galleries|faadsearch|FAADSearch)\/([0-z]+)/i.test(path)) {
  // http://www.artnet.com:80/api/search/rainbow/artworks
  // http://www.artnet.com:80/api/galleries/rainbow/1/0
  // http://www.artnet.com:80/pdb/faadsearch/FAADResults3.aspx?Page=1&ArtType=FineArt
  // http://www.artnet.com:80/PDB/FAADSearch/FAADResults3.aspx?Page=1&ArtType=DecArt
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if ((match = /^\/galleries\/([a-z-]+)/i.exec(path)) !== null) {
  // http://www.artnet.com:80/galleries/luis-de-jesus
  // http://www.artnet.com:80/galleries/avant-gallery/
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  }
  return result;
});