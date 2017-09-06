const dhf = require('/com.marklogic.hub/dhf.xqy');

const contentPlugin = require('./content/content.sjs');
const headersPlugin = require('./headers/headers.sjs');
const triplesPlugin = require('./triples/triples.sjs');

/*
 * Plugin Entry point
 *
 * @param id          - the identifier returned by the collector
 * @param options     - a map containing options. Options are sent from Java
 *
 */
function main(id, options) {
  var contentContext = dhf.contentContext();
  var content = dhf.run(contentContext, function() {
    return contentPlugin.createContent(id, options);
  });

  var headerContext = dhf.headersContext(content);
  var headers = dhf.run(headerContext, function() {
    return headersPlugin.createHeaders(id, content, options);
  });

  var tripleContext = dhf.triplesContext(content, headers);
  var triples = dhf.run(tripleContext, function() {
    return triplesPlugin.createTriples(id, content, headers, options);
  });

  var envelope = dhf.makeEnvelope(content, headers, triples, options.dataFormat);

  // explain. needed to call this way for static analysis
  dhf.runWriter(xdmp.function(null, './writer/writer.sjs'), id, envelope, options);
}

module.exports = {
  main: main
};
