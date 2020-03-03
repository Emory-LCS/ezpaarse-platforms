#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform China Online Journals/ Wangfang Data
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

  if ((match = /^\/details\/detail.do/i.exec(path)) != null) {
    // http://www.wanfangdata.com.cn:80/details/detail.do?_type=perio&id=MBD2%255C%255CMBD%255C%255CMBD2%255C%255CS1755267209001183h.xml
    // http://www.wanfangdata.com.cn:80/details/detail.do?_type=degree&id=D01099412
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = param.id;

  } else if ((match = /^\/search\/searchList.do$/i.exec(path)) || (match = /^\/s\/search\/$/i.exec(path)) != null) {
    // http://video.wanfangdata.com.cn:80/s/search/?conditionString=CWX12-0-0-0-0-0-0-0-1-0-0/&
    // http://www.wanfangdata.com.cn:80/search/searchList.do?searchType=tech&showType=&pageSize=&searchWord=oxygen&isTriggerTag=
    // http://www.wanfangdata.com.cn:80/search/searchList.do?searchType=patent&showType=detail&pageSize=20&searchWord=%E7%94%B3%E8%AF%B7%E4%BA%BA%2F%E4%B8%93%E5%88%A9%E6%9D%83%E4%BA%BA%3A
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/themeBootPage\/explainAndstatistics\.do$/i.exec(path)) != null) {
    // http://miner.wanfangdata.com.cn:80/themeBootPage/explainAndstatistics.do?themeWord=United%20states
    // http://miner.wanfangdata.com.cn:80/themeBootPage/explainAndstatistics.do?themeWord=Female
    result.rtype = 'DATA';
    result.mime = 'HTML';
    result.unitid = param.themeWord;
    result.title_id = param.themeWord;

  } else if ((match = /^\/v\/play\/([0-9A-Z]+)\.html$/i.exec(path)) != null) {
    // http://video.wanfangdata.com.cn:80/v/play/SI160419149.html
    // http://video.wanfangdata.com.cn:80/v/play/SL160727690.html
    // http://video.wanfangdata.com.cn:80/v/play/SD140110274.html
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = match[1];
  }

  return result;
});
