//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var GLIDERECORD = "GlideRecord";
  var SETVALUE ="setValue";
  var AUTOSYSFIELDS = "autoSysFields";
  var _activeCallee = [];

  var _checkStringValidity = function(string){
  	if(string)
      return true;
    return false;
  }

  var _getArgumentsList = function(node){
    return node.parent ?
            			(node.parent.arguments ? node.parent.arguments:null)
              					:null;
  }

  var _getGlideVariableOrAssignee = function(activeNode){
    var name;
    switch(activeNode.type){
        case "VariableDeclarator":
        		name = activeNode.id.name;
        		_activeCallee.push(name);

        		break;
      	case "AssignmentExpression":
        		name = activeNode.left.name;
        		_activeCallee.push(name);

        		break;
    }

  }

  var _checkForAutoSysFields = function(nodePropertyName,node){
    if(nodePropertyName && nodePropertyName === AUTOSYSFIELDS){
        var argumentsList = _getArgumentsList(node);
      	if(argumentsList && argumentsList.length!==1){
        	context.report(node,"autoSysFields must have boolean Parameter")
        }else if(argumentsList && argumentsList.length===1 && argumentsList[0].value===false){
        	context.report(node,"Avoid using autoSysFields with parameter as false");
        }
        console.log(argumentsList)

    }
  }

  var getTypeOfParent = function(parent){
    return parent.type;
  }



  return {
    "NewExpression" : function(node){
      if(node.callee && node.callee.name && node.callee.name === GLIDERECORD){
      	_getGlideVariableOrAssignee(node.parent);
      }
    },
    "MemberExpression" : function(node){
      	var memberExpName = node.object.name || null;
        /*
        	Best case scenario if var gr = new GlideRecord('sv') and setValue
            and autoSysFields are called in it. So below if will validate and
            error is displayed.

            worst case scenario if glideRecord object is passed as parameter in the function so
            else will evaluate and look for setValue and autoSysFields irrespective
            of value in _activeCallee[].
        */
      	var nodePropertyName = node.property ? node.property.name : null;
      	if(memberExpName && _activeCallee.indexOf(memberExpName)>-1){
          	_checkForAutoSysFields(nodePropertyName,node);
        }
    }
  };
};


