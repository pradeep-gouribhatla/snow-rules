/**
 * @fileoverview Rule to flag references to undeclared variables.
 * @author Karunakar Medamoni
 */
"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function findRowCount(reference) {
	
	if (reference.identifier && reference.identifier.parent && reference.identifier.parent.property && reference.identifier.parent.property.name === "getRowCount" && reference.identifier.parent.type == "MemberExpression") {
		return reference.identifier.name;
	}
}

function findGlideRecord(gr, reference) {
	
	if (reference.identifier && reference.identifier.name === gr && reference.identifier.parent && reference.identifier.parent.init != undefined && reference.identifier.parent.init.type === "NewExpression" && reference.identifier.parent.init.callee != undefined && reference.identifier.parent.init.callee.name === "GlideRecord") {
		return true;
		
	} else {
		
		return false;
		
	}
}


function hasNextUsed(gr, reference) {
	
	if (reference.identifier && reference.identifier.name === gr && reference.identifier.parent != undefined && reference.identifier.parent.property != undefined && reference.identifier.parent.property.name === "next" && reference.identifier.parent.type == "MemberExpression") {
		return true;
	} else {
		return false;
	}
}


//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context){
	
	return {
		"condition" (record) {
			return record.sys_class_name == 'sys_script_include'
					|| record.sys_class_name == 'sys_script';
		},

		"BlockStatement:exit" (node) {
			const globalScope = context.getScope();
			
			var glideRef = [];
			var glideRefList = [];
			
			globalScope.references.forEach(ref => {
				
				var result = findRowCount(ref);
				if (result)
					glideRef.push(result);
				
			});
			
			
			glideRef.forEach(gRef => {
				
				var rowCount = 0;
				var nextCount = 0;
				globalScope.references.forEach(ref => {
					
					if (findGlideRecord(gRef, ref)) {
						rowCount++;
					}
					
					if (hasNextUsed(gRef, ref)) {
						nextCount++;
					}
					
				});
				
				var obj = {};
					obj.name = gRef;
					obj.rowCount = rowCount;
					obj.nextCount = nextCount;
					
					glideRefList.push(obj);
					
				});
				
				glideRefList.forEach(name => {
					
					if (name.rowCount == 0)
						context.report({
						node: node,
						message: name.name + " is not a GlideRecord reference.",
						data: node
					});
					
					
					if (name.rowCount >= 0 && name.nextCount == 0)
						context.report({
						node: node,
						message: name.name + " ; In place of getRowcount use glide aggregate to get result count",
						data: node
					});
					
				});
				
				
				
			}
		};
	};
	