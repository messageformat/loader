var loaderUtils = require('loader-utils');
var MessageFormat = require('messageformat');

var JavascriptParser;
var JavascriptGenerator;
try {
  JavascriptParser = require('webpack/lib/Parser');
  JavascriptGenerator = require('webpack/lib/JavascriptGenerator');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') {
    throw e;
  }
}

module.exports = function(content) {
  var options = loaderUtils.getOptions(this);
  var locale = options.locale;
  if (typeof locale === 'string' && locale.indexOf(',') !== -1) locale = locale.split(',');
  var messages = JSON.parse(content);
  var messageFormat = new MessageFormat(locale);
  if (options.disablePluralKeyChecks) {
    messageFormat.disablePluralKeyChecks();
  }
  if (options.intlSupport) {
    messageFormat.setIntlSupport(true);
  }
  if (options.biDiSupport) {
    messageFormat.setBiDiSupport();
  }
  if (options.formatters) {
    messageFormat.addFormatters(options.formatters);
  }
  if (options.strictNumberSign) {
    messageFormat.setStrictNumberSign();
  }
  var messageFunctions = messageFormat.compile(messages);

  this.cacheable && this.cacheable();
  this.value = [ messageFunctions ];

  // BEGIN HACK
  // for https://github.com/webpack/webpack/issues/7057
  if (JavascriptParser && JavascriptGenerator) {
    this._module.type = 'javascript/auto';
    this._module.parser = new JavascriptParser();
    this._module.generator = new JavascriptGenerator();
  }
  // END HACK

  return messageFunctions.toString('module.exports');
};
