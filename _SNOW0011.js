"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	return {
		"condition" (record) {
			return record.sys_class_name == 'sys_script' 
					&& record.when == 'before';
		},

		CallExpression(node) {
			
			if (node && node.type && node.callee && node.callee.object && node.callee.object.name && node.callee.property && node.callee.property.name && node.type === 'CallExpression' && node.callee.object.name === 'current' && node.callee.property.name == 'update') {
				context.report(node.callee, 'Do not use current.update in before Business Rule');
			}
			
		}
		
	}
};
