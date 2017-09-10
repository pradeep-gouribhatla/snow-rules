 "use strict";
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	return {
		Program(node) {
			/* Check if VariableDeclaration is done on global scope */
			if(node && node.body ){
				node.body.forEach(function(element) {
					if (element.type === "VariableDeclaration" && element.declarations && element.declarations[0].init&& element.declarations[0].init.type != "CallExpression" ) {
						context.report(element, "Do not declare variables in global scope");
						
					}
				})
			}
		}
		
	}
	
};
