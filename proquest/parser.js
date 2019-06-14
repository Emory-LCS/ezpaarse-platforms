#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Proquest
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((/^\/search/i.test(path)) || (/^\/([a-z]+)\/search/i.test(path)) || (/^\/results/i.test(path)) || (/^\/([a-z]+)\/results/i.test(path))) {
    // https://www.proquest.com:443/search?searchKeyword=bananas
    // https://congressional.proquest.com:443/congressional/search/advanced/advanced?selectedcheckboxes=crsr
    // https://search.proquest.com:443/results/5BD7F010FA5D477FPQ/1?accountid=10747
    // https://search.proquest.com:443/wma/results/8EEE29C22B274D13PQ/1?accountid=10747
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/([a-z]+)\/result\/pqpresultpage$/i.test(path)) {
    // https://congressional.proquest.com:443/congressional/result/pqpresultpage?accountid=10747&groupid=105260&pgId=f4014d99-5acd-40c8-8f09-24debb8646b2&rsId=16AA84BADF6
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/blog\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.proquest.com:443/blog/mfl?showBlogArchive=November+2012
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1] + '/' + param.showBlogArchive;
    result.unitid   = match[1] + '/' + param.showBlogArchive;

  } else if (((match = /^\/docview\/([0-9]+)\/fulltextPDF/i.exec(path)) !== null) || ((match = /^\/docview\/([0-9]+)\/pageviewPDF/i.exec(path)) !== null)) {
    // https://search.proquest.com:443/docview/92029608/fulltextPDF/5BD7F010FA5D477FPQ/1?accountid=10747
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if (((match = /^\/([a-z]+)\/docview\/([0-9]+)\/fulltextPDF/i.exec(path)) !== null) || ((match = /^\/([a-z]+)\/docview\/([0-9]+)\/pageviewPDF/i.exec(path)) !== null)) {
    // https://search.proquest.com:443/nppma/docview/1797173663/fulltextPDF
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if ((match = /^\/docview\/([0-9]+)\/fulltext/i.exec(path)) !== null) {
    // https://search.proquest.com:443/docview/431636831/fulltext/5BD7F010FA5D477FPQ/1?accountid=10747
    // https://search.proquest.com:443/nppma/docview/1797173663/fulltext
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/([a-z]+)\/docview\/([0-9]+)\/fulltext/i.exec(path)) !== null) {
    // https://search.proquest.com:443/docview/431636831/fulltext/5BD7F010FA5D477FPQ/1?accountid=10747
    // https://search.proquest.com:443/nppma/docview/1797173663/fulltext
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if ((match = /^\/blog\/([a-z]+)\/([0-9]+)\/([a-zA-Z0-9-]+).html/i.exec(path)) !== null) {
    // https://www.proquest.com:443/blog/mfl/2012/Journal-of-Philosophy-of-Life.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1].concat('/', (match[2].concat('/', match[3])));

  } else if ((match = /^\/([a-z]+)\/result\/pqpresultpage.gispdfhitspanel.pdflink\/([a-zA-Z0-9$_-]+).pdf/i.exec(path)) !== null) {
    // https://congressional.proquest.com:443/congressional/result/pqpresultpage.gispdfhitspanel.pdflink/$2fapp-bin$2fgis-congresearch$2f9$2fb$2f4$2f6$2fcmp-1925-sls-0002_from_1_to_6.pdf+/thomas+jefferson$40$2fapp-gis$2fcongresearch$2fcmp-1925-sls-0002$40Congressional+Research+Digital+Collection$40Committee+Prints$40January+01,+1925$40null?pgId=f4014d99-5acd-40c8-8f09-24debb8646b2&rsId=16AA84BADF6
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if ((match = /^\/documents\/([a-zA-Z0-9_-]+).html/i.exec(path)) !== null) {
    // https://www.proquest.com:443/documents/agricola_prosheet.html?docID=246014831
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/statisticalinsight\/result\/pqpdocumentview.pqppanelgroup_1.gispanelfour:pdfLinkUri/i.exec(path)) !== null) {
    // https://statistical.proquest.com:443/statisticalinsight/result/pqpdocumentview.pqppanelgroup_1.gispanelfour:pdfLinkUri?pdfLinkUri=%2Fftv2%2F4c4e000000577c70.pdf&docUri=%2Fcontent%2F2009%2F6722-1.235.xml
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = param.pdfLinkUri;
    result.unitid   = param.pdfLinkUri;

  } else if ((match = /^\/pdfs\/([0-9]+)\/([0-9_]+)\/([a-zA-Z0-9_]+).pdf/i.exec(path)) !== null) {
    // https://hv.proquest.com:443/pdfs/002248/002248_014_0739/002248_014_0739_0001_From_1_to_50.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[3];

  } else if ((/^\/([a-z]+)\/result\/pqpresultpage.previewtitle/i.test(path)) || (/^\/([a-z]+)\/result\/pqpresultpage.citationandabstract/i.test(path)))  {
    // https://statistical.proquest.com:443/statisticalinsight/result/pqpresultpage.previewtitle/0?pgId=53788fcd-9178-4bdf-bcb7-21c19cdd6c07&rsId=16AA860184A
    // https://statistical.proquest.com:443/statisticalinsight/result/pqpresultpage.citationandabstract/8?pgId=53788fcd-9178-4bdf-bcb7-21c19cdd6c07&rsId=16AA860184A
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = param.pgId;
    result.unitid   = param.pgId;

  } else if ((match = /^\/docview\/([0-9]+)\/([A-Z0-9]+)\//i.exec(path)) !== null) {
    // https://search.proquest.com:443/docview/1803074655/114D6AD1D9C843E8PQ/6?accountid=10747
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/([a-z]+)\/docview\/([0-9]+)\/([A-Z0-9]+)\//i.exec(path)) !== null) {
    // https://dialog.proquest.com:443/professional/docview/1510396083/16AA846887F54FF1474/1?accountid=10747
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if (/^\/historyvault\/docview.jsp/i.test(path)) {
    // https://hv.proquest.com:443/historyvault/docview.jsp?folderId=002248-014-0739&q=(fulltext%3Athomas%20jefferson)%20AND%20%20module%3A48990%20OR%2051459&position=3&numResults=10&numTotalResults=1787
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = param.folderId;
    result.unitid   = param.folderId;

  } else if (/^\/congressional\/result\/congressional\/pqpdocumentview/i.test(path)) {
    // https://congressional.proquest.com:443/congressional/result/congressional/pqpdocumentview?accountid=10747&groupid=105260&pgId=693f4b6f-2036-4be1-a214-5f7da8ebbe6b&rsId=16AA84BADF6
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = param.pgId;
    result.unitid   = param.pgId;

  } else if ((match = /^\/docview\/([0-9]+)\/abstract/i.exec(path)) !== null) {
    // https://search.proquest.com:443/docview/92029608/abstract/5BD7F010FA5D477FPQ/1?accountid=10747
    result.rtype    = 'ABS';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/([a-z]+)\/docview\/([0-9]+)\/abstract/i.exec(path)) !== null) {
    // https://search.proquest.com:443/nppma/docview/1797173663/abstract/123139341104369PQ/2?accountid=10747
    result.rtype    = 'ABS';
    result.mime     = 'PDF';
    result.title_id = match[2];
    result.unitid   = match[2];

  } else if (/^\/sa\/docview.html/i.test(path)) {
    // https://statabs.proquest.com:443/sa/docview.html?table-no=335&acc-no=C7095-1.5&year=2019&z=39FF8192582E4BE07D882FA68B06B53839029680&rc=1&seq=2&y=current&q=murder
    result.rtype    = 'DATASET';
    result.mime     = 'HTML';
    result.title_id = param['table-no'];
    result.unitid   = param['table-no'];

  }

  return result;
});
