//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	
	return {
		CallExpression(node) {
			if(node && node.type && node.callee && node.callee.name && node.type === 'CallExpression' && node.callee.name === 'eval'){
				context.report(node.callee, 'Do not use eval in a script.');
			}
		}
		
	}
};
						