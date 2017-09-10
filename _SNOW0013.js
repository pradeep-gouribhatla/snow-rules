//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	
	return {
		"Literal:exit" (node) {
			
			var regex = /[0-9a-z]{32}/;
				
				if (node && node.value && regex.test(node.value)) {
					context.report(node, " don't use sys_id in code");
				}
				
				
			}
			
		}
		
	};
	