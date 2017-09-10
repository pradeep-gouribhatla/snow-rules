"use strict";
 
 
//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
 
/**
* Checks if the given name is a prohibited identifier.
* @param {string} name The name to check
* @returns {boolean} Whether or not the name is prohibited.
*/
function isProhibitedMember(name) {
    return /^(console)$/.test(name);
}

/**
* Checks if the given name is a prohibited identifier.
* @param {string} name The name to check
* @returns {boolean} Whether or not the name is prohibited.
*/
function isProhibitedIdentifier(name) {
    return /^(log|assert|count|debug|dir|dirxml|error|group|groupCollapsed|groupEnd|info|profile|profileEnd|table|time|timeEnd|timeStamp|trace|warn)$/.test(name);
}
 
/**
* Reports the given node and identifier name.
* @param {RuleContext} context The ESLint rule context.
* @param {ASTNode} node The node to report on.
* @param {string} identifierName The name of the identifier.
* @returns {void}
*/
function report(context, node, identifierName) {
    context.report(node, "Console Log Found : {{name}}.", { name: identifierName });
}
 
/**
* Finds the escope reference in the given scope.
* @param {Object} scope The scope to search.
* @param {ASTNode} node The identifier node.
* @returns {Reference|null} Returns the found reference or null if none were found.
*/
function findReference(scope, node) {
    const references = scope.references.filter(reference => reference.identifier.range[0] === node.range[0] &&
            reference.identifier.range[1] === node.range[1]);
 
    if (references.length === 1) {
        return references[0];
    }
    return null;
}
 
/**
* Checks if the given identifier node is shadowed in the given scope.
* @param {Object} scope The current scope.
* @param {Object} globalScope The global scope.
* @param {string} node The identifier node to check
* @returns {boolean} Whether or not the name is shadowed.
*/
function isShadowed(scope, globalScope, node) {
    const reference = findReference(scope, node);
 
    return reference && reference.resolved && reference.resolved.defs.length > 0;
}
 
/**
* Checks if the given identifier node is a ThisExpression in the global scope or the global window property.
* @param {Object} scope The current scope.
* @param {Object} globalScope The global scope.
* @param {string} node The identifier node to check
* @returns {boolean} Whether or not the node is a reference to the global object.
*/
function isGlobalThisReferenceOrGlobalWindow(scope, globalScope, node) {
    if (scope.type === "global" && node.type === "ThisExpression") {
        return true;
    } else if (node.name === "window") {
        return !isShadowed(scope, globalScope, node);
    }
 
    return false;
}
 
//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
 
module.exports = function(context){  
	let globalScope;

	return {

		Program() {
			globalScope = context.getScope();
		},

		CallExpression(node) {
			const callee = node.callee,
				  currentScope = context.getScope();
			const property = node.property;    

			if (callee && callee.type && callee.object && callee.object.name && callee.type === "MemberExpression") {
				const identifierName = callee.object.name;

				if(callee.property && callee.property.type && callee.property.type === "Identifier"){
					const propertyName = callee.property.name;

					if (isProhibitedMember(callee.object.name)&& isProhibitedIdentifier(callee.property.name)) {
						report(context, node, identifierName+'.'+propertyName);
					}
				}


			} 

		}
	};

};