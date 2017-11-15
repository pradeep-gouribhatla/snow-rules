//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function isOOTBMethod(node) {
	return node && node.parent && node.parent.type == "FunctionExpression" && node.parent.parent && node.parent.parent.type == "Property" && node.parent.parent.key && node.parent.parent.key.type == "Identifier" && node.parent.parent.key.name == "initialize";
}

module.exports = function(context){
	return {
		
		"BlockStatement:exit"(node) {
			if(node && node.body && node.body.length  === 0) {
                        console.log('aaaa -> ' + node.parent.parent.key.type)
                if(!isOOTBMethod(node)) {
					context.report(node, "Scripts should not have an empty blocks defined ");
                }
			}          
		}
	}
	
};
