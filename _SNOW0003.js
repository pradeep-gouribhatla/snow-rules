//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	return {
		"condition" (node) {
			return 'type=sys_client_script';
		},
		
		"CallExpression:exit" (node) {
			if (node && node.callee && node.callee.property != null &&  node.callee.property.name && node.callee.property.name == "getXMLWait") {
				context.report(node.callee, 'Please change getXMLWait to getXML with a callback');
			}
		}
	}
};
