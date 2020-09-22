#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Credo Reference
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // let param = parsedUrl.query || {};
  // console.error(parsedUrl);

  let match;

  if ((/^\/search\/all$/i.test(path)) || (/^\/content\/browse\/([a-z]+)$/i.test(path))) {
    // https://search.credoreference.com:443/search/all
    // https://search.credoreference.com:443/content/browse/title
    // https://search.credoreference.com:443/content/browse/topic
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';


  } else if (((match = /^\/([a-z_-]+)$/i.exec(path)) !== null) || ((match = /^\/content\/title\/([a-z_-]+)$/i.exec(path)) !== null) || ((match = /^\/courses\/course-(.*)\/course\/$/i.exec(path)) !== null)) {
    // https://search.credoreference.com:443/quick_tips
    // https://search.credoreference.com:443/content/title/persgreatest
    // https://frame.credocourseware.com:443/courses/course-v1:Emory-University+Core+Core/course/
    // https://frame.credocourseware.com:443/dashboard
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (((match = /^\/(quick_tips)\/([a-zA-Z0-9_-]+)$/i.exec(path)) !== null) || ((match = /^\/content\/entry\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/i.exec(path)) !== null)) {
    // https://search.credoreference.com:443/quick_tips/creating_research_plan
    // https://search.credoreference.com:443/content/entry/columency/archimedes/0
    // https://search.credoreference.com:443/content/entry/ashgtpag/part_v_the_hellenistic_philosophers
    // https://search.credoreference.com:443/content/entry/fofinside/3d_wall_of_virtual_reality/0
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2] || match[1];

  } else if ((match = /^\/courses\/course-(.*)\/courseware\/([a-zA-Z0-9_/-]+)/i.exec(path)) !== null) {
    // https://frame.credocourseware.com:443/courses/course-v1:Emory-University+Core+Core/courseware/94b74c7c70f14e7a8d4045b68f9e1e5a/9f8f849d5fdf486e9088aded125e9b9f/1?activate_block_id=block-v1%3AEmory-University%2BCore%2BCore%2Btype%40vertical%2Bblock%40231d0f6b465b433aa115db4191ce7490
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  }

  return result;
});
