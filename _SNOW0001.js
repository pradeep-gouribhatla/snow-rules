//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
	
	return {
		"CallExpression:exit" (node) {
			
			if (node.callee && node.callee.name && node.callee.name == "gel") {
				context.report(node, 'Do not use gel in client side code');
			}
			if (node.callee && node.callee.name && node.callee.name == "jQuery") {
				context.report(node, 'Do not use gel in client side code');
			}
			if (node.callee && node.callee.object && node.callee.object.name && node.callee.object.name === "document") {
				context.report(node, "Dont use document object for DOM manipulation");
			}
			if (node.callee && node.callee.name && node.callee.name === '$j') {
				context.report(node, 'Do not use $j object for DOM manipulation');
			}
		}
	}
	
};
