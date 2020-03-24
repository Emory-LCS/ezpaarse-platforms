#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Roper Center for Public 
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

  if ((/^\/CFIDE\/cf\/action\/(ipoll|catalog)\/(ipoll|catalog)Result.cfm$/i.test(path)) || (/^\/search/i.test(path))) {
    // https://ropercenter.cornell.edu:443/CFIDE/cf/action/ipoll/ipollResult.cfm?keyword=dwight+eisenhower
    // https://ropercenter.cornell.edu:443/CFIDE/cf/action/ipoll/ipollResult.cfm?filterSearchWithin=Search+Within&keywordDisplay=dwight%2520eisenhower
    // https://ropercenter.cornell.edu:443/CFIDE/cf/action/catalog/catalogResult.cfm?country=1
    // https://ropercenter.cornell.edu:443/search/site?keys=barton
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/studies-location\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://ropercenter.cornell.edu:443/studies-location/colombia
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if (/^\/CFIDE\/cf\/action\/catalog\/abstract.cfm$/i.test(path)) {
    // https://ropercenter.cornell.edu:443/CFIDE/cf/action/catalog/abstract.cfm?type=&start=&id=&archno=31116989&abstract=
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = param.archno;

  } else if ((/^\/CFIDE\/cf\/action\/ipoll\/questionDetail.cfm$/i.test(path)) || (/^\/CFIDE\/cf\/action\/ipoll\/downloadQSTN.cfm$/i.test(path))) {
    // https://ropercenter.cornell.edu:443/CFIDE/cf/action/ipoll/questionDetail.cfm?keyword=&keywordoptions=1&exclude=&excludeOptions=1&topic=taxing&organization=Any&label=&fromdate=1/1/1935&toDate=&stitle=&sponsor=Fox%20News&studydate=01-JAN-34&sample=1000&qstn_list=&qstnid=1945594&qa_list=&qstn_id4=1945594&study_list=&lastSearchId=317679980979&archno=&keywordDisplay=
    // https://ropercenter.cornell.edu:443/CFIDE/cf/action/ipoll/questionDetail.cfm?keyword=80653&keywordoptions=&exclude=&excludeOptions=&topic=Any&organization=Any&label=&fromdate=1/1/1935&toDate=&stitle=&sponsor=Fox%20News&studydate=01-JAN-34&sample=1000&qstn_list=&qstnid=1945594&qa_list=&qstn_id4=1945594&study_list=&lastSearchId=317679980982&archno=&keywordDisplay=
    // https://ropercenter.cornell.edu:443/CFIDE/cf/action/ipoll/downloadQSTN.cfm?ref=questionDetail&csv=1&questionID=1945594
    // https://ropercenter.cornell.edu:443/CFIDE/cf/action/ipoll/downloadQSTN.cfm?ref=questionDetail&csv=1&questionID=1945594
    result.rtype    = 'REF';
    result.mime     = 'MISC';
    result.unitid   = param.qstnid || param.questionID;

  } else if (((match = /^\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) || ((match = /^\/([a-zA-Z0-9-]+)\/$/i.exec(path)) !== null)) {
    // https://ropercenter.cornell.edu:443/presidential-approval/
    // https://ropercenter.cornell.edu:443/roper-2020-topic-tracker-environment
    result.rtype    = 'DATASET';
    result.mime     = 'MISC';
    result.unitid   = match[1];

  } else if ((match = /^\/presidential-approval\/([a-zA-Z0-9-]+)$/i.exec(path)) !== null) {
    // https://ropercenter.cornell.edu:443/presidential-approval/highslows
    result.rtype    = 'DATASET';
    result.mime     = 'MISC';
    result.unitid   = 'presidential-approval/' + match[1];

  }

  return result;
});
