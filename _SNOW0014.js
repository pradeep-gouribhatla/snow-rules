//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	return {
		
		"BlockStatement:exit"(node) {
			if(node && node.body && node.body.length  === 0) {
				context.report(node, "Scripts should not have an empty blocks defined ")
			}
		}
	}
	
};
