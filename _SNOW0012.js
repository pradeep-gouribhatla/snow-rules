//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	return {
		Program(node) {
			
			if(node && node.body){
				var count = 0;
				for (var i = 0; i < node.body.length; i++) {
					if (node.body[i].type == "FunctionDeclaration") {
						count++;
					}
				}
				if (count == 0) {
					context.report(node, ' function declaration not found');
				}
			}
		}
		
	}
};
