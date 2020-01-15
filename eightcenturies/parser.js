#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Eight Centuries
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if ((/^\/ncm\/ncm.php$/i.test(path)) || (/^\/ncm\/ncm.php\/r$/i.test(path)) || (/^\/customer\/blog\/category.php$/i.test(path))) {
    // https://history.paratext.com:443/ncm/ncm.php?_method=put&authenticity_token=vTmJ27%2BwZ0%2BiFvz9fcK1wDLUN40nlzLbEC3A%2BcH63f4%3D&request_type=initial_search&first=1&databases=adammatthew%2Cala%2Cportrait%2Cwright%2Cammem%2Casp%2Cannlibindex%2Csmithsonian%2Cmagindex%2Cartstor%2Cbritinst%2Cblmusic%2Cburlington%2Ccsp%2Cscientific%2Ccatpubdocs%2Ccentofloan%2Cchecklist%2Chansard%2Cames%2Ccongrec%2Ccislp%2Ccumsubj%2Ccumtitle%2Cgovdoc1%2Cdplancm%2Cdocamsouth%2Cengineering%2Cfarmers%2Cgalloupe%2Cgranite%2Charvard%2Ccotgreave%2Ccommons%2Clords%2Chickcox%2Clegperlit%2Caall%2Citp%2Crelig%2Cpooles%2Ccontcongress%2Cspectator%2Cpalmers%2Cindexcat%2Cindartsindex%2Cicsl%2Cmacjournal%2Cjstorejc%2Clibjour%2Clcmm%2Cmoa%2Cpresidents%2Carchives%2Cnydtrib%2Cnypl%2Cnytimes%2Cniles%2Cbooks%2Crgpl%2Cpsychology%2Cgreely%2Cgraves%2Cmacsketches%2Csoagb%2Csouthern%2Cstnicholas%2Cpatents%2Cncmserialset%2Cswems&search_field=&detail=0&saved_set=0&query=potato&search_field=all&Stemming=1&and=1&yearFrom=&yearTo=&databases=adammatthew%2Cala%2Cportrait%2Cwright%2Cammem%2Casp%2Cannlibindex%2Csmithsonian%2Cmagindex%2Cartstor%2Cbritinst%2Cblmusic%2Cburlington%2Ccsp%2Cscientific%2Ccatpubdocs%2Ccentofloan%2Cchecklist%2Chansard%2Cames%2Ccongrec%2Ccislp%2Ccumsubj%2Ccumtitle%2Cgovdoc1%2Cdplancm%2Cdocamsouth%2Cengineering%2Cfarmers%2Cgalloupe%2Cgranite%2Charvard%2Ccotgreave%2Ccommons%2Clords%2Chickcox%2Clegperlit%2Caall%2Citp%2Crelig%2Cpooles%2Ccontcongress%2Cspectator%2Cpalmers%2Cindexcat%2Cindartsindex%2Cicsl%2Cmacjournal%2Cjstorejc%2Clibjour%2Clcmm%2Cmoa%2Cpresidents%2Carchives%2Cnydtrib%2Cnypl%2Cnytimes%2Cniles%2Cbooks%2Crgpl%2Cpsychology%2Cgreely%2Cgraves%2Cmacsketches%2Csoagb%2Csouthern%2Cstnicholas%2Cpatents%2Cncmserialset%2Cswems
    // https://history.paratext.com:443/ncm/ncm.php/r?request_type=database_search&databases=palmers&detail=1
    // https://public.paratext.com:443/customer/blog/category.php?id=33
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if (/^\/customer\/blog\/article.php$/i.test(path)) {
    //https://public.paratext.com:443/customer/blog/article.php?id=193&type=research
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  }

  return result;
});
