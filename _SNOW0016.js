//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	
	
	/* create(context) {
		const options = context.options[0];
		var funcInfoStack = [];
		const considerTypeOf = options && options.typeof === true || false; */
		
		
		return {
			/*  Client-side code should not use GlideRecord.
			If GlideRecord is used with new keyword, then this will throw the error.
 			*/
			NewExpression (node) {
				if (node && node.callee && node.callee.name && node.callee.name === "GlideRecord") {
					context.report(node, "Do not use GlideRecord in client script");
				}
			}
			
			
		}
	};
	