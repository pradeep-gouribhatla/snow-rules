//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	
	
	/* create(context) {
		const options = context.options[0];
		var funcInfoStack = [];
		const considerTypeOf = options && options.typeof === true || false; */
		
		
		return {

			"condition" (record) {
				return record.sys_class_name == 'sys_script_client'
						|| record.sys_class_name == 'catalog_script_client';
			},

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
	