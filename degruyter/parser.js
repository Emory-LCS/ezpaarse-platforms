#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

const doiPrefix = '10.1515';

/**
 * Identifie les consultations de la plateforme De Gruyter
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/view\/[a-z]+\/([a-z]+)\.([0-9]+)\.([0-9]+)\.issue-([0-9]+)\/([a-z0-9-]+)\/([a-z0-9._-]+).xml$/i.exec(path)) !== null) {
    // /view/j/jtms.2014.1.issue-2/issue-files/jtms.2014.1.issue-2.xml
    // /view/j/jtms.2014.1.issue-2/jtms-2014-0026/jtms-2014-0026.xml?format=INT
    result.rtype            = 'TOC';
    result.mime             = 'HTML';
    result.title_id         = match[1];
    result.publication_date = match[2];
    result.vol              = match[3];
    result.issue            = match[4];
    result.unitid           = match[6];

    if (match[5] !== 'issue-files') {
      result.doi   = `${doiPrefix}/${match[5]}`;
      result.rtype = 'PREVIEW';
    }

  } else if ((match = /^\/dg\/view(article|journalissue)[a-z.:]+\/\$002f[a-z]+\$002f([a-z]+)\.([0-9]{4})[0-9.]+issue-([0-9-]+)\$002f.+?\$002f(.+?)\.pdf(\/[a-z0-9._-]+)?$/i.exec(path)) !== null) {
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fetly.2011.2011.issue-1$002f9783110239423.200$002f9783110239423.200.pdf
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fkant.1957.48.issue-1-4$002fkant.1957.48.1-4.185$002fkant.1957.48.1-4.185.pdf
    // /dg/viewarticle.fullcontentlink:pdfeventlink/$002fj$002fling.2012.50.issue-4$002fling-2012-0026$002fling-2012-0026.pdf/ling-2012-0026.pdf
    // /dg/viewjournalissue.articlelist.resultlinks.fullcontentlink:pdfeventlink/$002fj$002fetly.2011.2011.issue-1$002f9783110239423.vii$002f9783110239423.vii.pdf

    result.mime             = 'PDF';
    result.rtype            = match[1] === 'article' ? 'ARTICLE' : 'TOC';
    result.title_id         = match[2];
    result.publication_date = match[3];
    result.issue            = match[4];
    result.unitid           = match[5];

    match = /^[a-z]+\.[0-9]{4}\.([0-9]+)\.[0-9-]+\.([0-9]+)+$/i.exec(result.unitid);

    if (match) {
      result.vol = match[1];
      result.first_page = match[2];
    }

  } else if ((match = /^\/downloadpdf\/[a-z]{1}\/([a-z]+)\.([0-9]{4})\.[a-z0-9.-]+\/[a-z0-9.-]+\/([a-z0-9.-]+)\.(xml|pdf)$/i.exec(path)) !== null) {
    // /downloadpdf/j/acs.2016.9.issue-1/acs-2016-0003/acs-2016-0003.xml
    // /downloadpdf/j/etly.2011.2011.issue-1/9783110239423.121/9783110239423.121.pdf

    result.mime             = 'PDF';
    result.rtype            = 'ARTICLE';
    result.title_id         = match[1];
    result.publication_date = match[2];
    result.unitid           = match[3];
    result.doi              = `${doiPrefix}/${match[3]}`;

  } else if ((match = /^(\/printpdf)?\/view\/([a-z]+)\/([0-9a-z_]+)$/i.exec(path)) !== null) {
    // /printpdf/view/AKL/_40431827T3?rskey=tIhc8o&result=1&dbq_0=Gaugeron&dbf_0=akl-fulltext&dbt_0=fulltext&o_0=AND
    // /view/AKL/_40431827T3?rskey=tIhc8o&result=1&dbq_0=Gaugeron&dbf_0=akl-fulltext&dbt_0=fulltext&o_0=AND

    result.rtype    = 'ABS';
    result.mime     = match[1] ? 'PDF' : 'HTML';
    result.title_id = match[2].toLowerCase();
    result.unitid   = match[3];

  } else if (/^\/(search|browse|databasecontent)$/i.test(path)) {
    // /search?q=brain&source=%2Fjournals%2Fselt%2Fselt-overview.xml
    // /browse?pageSize=10&sort=first-page-sort-option&type_7=chapter
    // /databasecontent?dbid=spark&dbsource=%2Fdb%2Fspark&pageSize=50&sort=spark-book&spark-taxonomy=SPARK_L01_02_L02_02

    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/subject\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // /subject/CH

    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = 'subjects';
    result.unitid   = match[1];

  } else if ((match = /^\/view\/journals\/([a-z]+)\/([a-z]+)-overview.xml$/i.exec(path)) !== null) {
    // /view/journals/cti/cti-overview.xml

    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];

  } else if ((match = /^\/view\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/article-([a-zA-Z0-9]+).xml$/i.exec(path)) !== null) {
    // /view/journals/cclm/58/6/article-p914.xml?rskey=cNfhbh&result=1

    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[4];

  } else if ((match = /^\/downloadpdf\/title\/([a-zA-Z0-9]+).pdf$/i.exec(path)) !== null) {
    // /downloadpdf/title/513088.pdf

    result.mime     = 'PDF';
    result.rtype    = 'BOOK';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/downloadepub\/title\/([a-zA-Z0-9]+)$/i.exec(path)) !== null) {
    // /downloadepub/title/506296

    result.mime     = 'MISC';
    result.rtype    = 'BOOK';
    result.title_id = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/downloadpdf\/book\/([a-zA-Z0-9]+)\/([a-zA-Z0-9.]+)\/([a-zA-Z0-9.]+).pdf$/i.exec(path)) !== null) {
    // /downloadpdf/book/9783110412628/10.2478/9783110412628.1.pdf

    result.mime             = 'PDF';
    result.rtype            = 'BOOK_SECTION';
    result.print_identifier = match[1];
    result.title_id         = match[1];
    result.unitid           = match[3];
    result.doi              = `${doiPrefix}/${match[3]}`;

  } else if ((match = /^\/downloadpdf\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)\/article-([a-z]+)\.([0-9]+).([a-z0-9.-]+).pdf.pdf$/i.exec(path)) !== null) {
    // /downloadpdf/journals/selt/4/3/article-selt.2011.4.3.1141.pdf.pdf

    result.mime             = 'PDF';
    result.rtype            = 'ARTICLE';
    result.title_id         = match[1];
    result.publication_date = match[5];
    result.unitid           = match[5] + '.' + match[6];

  }

  return result;
});
