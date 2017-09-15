//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	return {
		"condition" (record) {
			return record.sys_class_name == 'sys_script_client'
					|| record.sys_class_name == 'catalog_script_client';
		},
		
		"CallExpression:exit" (node) {
			if (node && node.callee && node.callee.property != null &&  node.callee.property.name && node.callee.property.name == "getXMLWait") {
				context.report(node.callee, 'Please change getXMLWait to getXML with a callback');
			}
		}
	}
};
