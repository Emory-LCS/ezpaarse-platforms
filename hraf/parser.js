#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Human Relations Area Files
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

  if (/^\/(ehrafa|ehrafe)\/(cultureResults|dispatchSearch|browseCultures)\.do/i.test(path)) {
    // https://ehrafarchaeology.yale.edu:443/ehrafa/cultureResults.do?selectedIndex=0
    // https://ehrafarchaeology.yale.edu:443/ehrafa/cultureResults.do?selectedIndex=1
    // https://ehrafarchaeology.yale.edu:443/ehrafa/dispatchSearch.do?method=documentSearch&col=collection%28%27%2FeHRAF%2Farchaeology%2FSouthAmer%2FSE80%27%29&owc=SE80&owcMatches=12&owcDocs=8&cache=0
    // https://ehrafarchaeology.yale.edu:443/ehrafa/browseCultures.do?context=main
    // http://ehrafworldcultures.yale.edu:80/ehrafe/cultureResults.do?selectedIndex=1 
    // https://ehrafworldcultures.yale.edu:443/ehrafe/dispatchSearch.do?method=documentSearch&col=collection%28%27%2FeHRAF%2Fethnography%2FOceania%2FOP04%27%29&owc=OP04&owcMatches=1&owcDocs=1&cache=0 
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
    
  } if (/^\//i.test(path)) {
    // https://hraf.yale.edu:443/?submit=Search&s=barton
    // https://hraf.yale.edu:443/?submit=Search&s=rainbow
    if (param.submit === "Search") {
    result.rtype = 'SEARCH';
    result.mime = 'HTML';  
    }

  } if (/^\/ehc\/api\/ehc_(variables|documents)/) {
    // https://hraf.yale.edu:443/ehc/api/ehc_variables/?q=id:5&wt=json
    // https://hraf.yale.edu:443/ehc/api/ehc_documents?defType=edismax&lowerCaseOperators=true&stopwords:true&hl.fl=title,abstract&hl=true&hl.simple.pre=%3Cmark%3E&hl.simple.post=%3C/mark%3E&hl.fragsize=0&hl.preserveMulti=true&qf=abstract^4%20author^3%20title^3%20text&json={%22fields%22:%22id,title,author,host_title,material_type,pub_year,hypo_id,abstract,current_status%22,%22offset%22:0,%22limit%22:10,%22sort%22:%22score+desc%22,%22query%22:%22author:\\%22Barry%20III,%20Herbert\\%22^2%20OR%20additional_authors:\\%22Barry%20III,%20Herbert\\%22%22}
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if ((match = /^\/resources\/reference\/([a-z-]+)/i.exec(path)) !== null) {
    // https://hraf.yale.edu:443/resources/reference/outline-of-cultural-materials/
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];
    
  } if (/^\/(ehrafa|ehrafe)\/citation\.do/i.test(path)) {
  // https://ehrafarchaeology.yale.edu:443/ehrafa/citation.do?method=citation&forward=searchFullContext&col=collection(%27/eHRAF/archaeology/Africa/FA75%27)&docId=fa75-000&tocOffsetId=tocPubInfoP
  // https://ehrafarchaeology.yale.edu:443/ehrafa/citation.do?method=citation&forward=browseAuthorsFullContext&col=collection(%27/eHRAF/archaeology/NorthAmer/NT76%27)&docId=nt76-001&tocOffset=tocPubInfoP
  // https://ehrafworldcultures.yale.edu:443/ehrafe/citation.do?method=citation&forward=browseCulturesFullContext&col=collection(%27/eHRAF/ethnography/Africa/FL12%27)&docId=fl12-010&tocOffsetId=tocPubInfoP
  // https://ehrafworldcultures.yale.edu:443/ehrafe/citation.do?method=citation&forward=browseAuthorsFullContext&col=collection(%27/eHRAF/ethnography/MidEast/M013%27)&docId=m013-026&tocOffset=tocPubInfoP
  result.rtype = 'REF';
  result.mime = 'HTML';
  result.unitid = param.docId;
  result.title_id = param.col.slice(13, -2);
  
  }

  return result;
});
