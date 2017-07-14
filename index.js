var loaderUtils = require('loader-utils');
var MessageFormat = require('messageformat');

module.exports = function(messages) {
  var options = loaderUtils.getOptions(this);
  let lc = options.locale;
  if (typeof lc === 'string' && lc.indexOf(',') !== -1) lc = lc.split(',');
  var mf = new MessageFormat(lc);
  if (options.biDiSupport) mf.setBiDiSupport();
  if (options.disablePluralKeyChecks) mf.disablePluralKeyChecks();
  if (options.formatters) mf.addFormatters(options.formatters);
  if (options.intlSupport) mf.setIntlSupport(true);
  if (options.strictNumberSign) mf.setStrictNumberSign();
  return mf.compile(JSON.parse(messages)).toString('module.exports');
}
