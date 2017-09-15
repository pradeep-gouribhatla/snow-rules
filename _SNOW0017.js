//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var GLIDERECORD = "GlideRecord";
  var SETVALUE ="setValue";
  var AUTOSYSFIELDS = "autoSysFields";
  var _activeCallee = [];

  var _checkStringValidity = function(node){
    console.log(node);
    if(node.type == "Literal"){
      return node.value;
    }else{
      return true;
    }
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

  var _checkForSetValue = function(nodePropertyName,node){

    if(nodePropertyName && nodePropertyName === SETVALUE ){
              var argumentsList = node.parent ?
                  				(node.parent.arguments ? node.parent.arguments:null)
              					:null;
              if(argumentsList && argumentsList.length!==2){
                context.report(node,"setValue must have 2 parameters");
                return;
              }else if(argumentsList &&
                       argumentsList.length === 2 &&
                       (!_checkStringValidity(argumentsList[0]) ||
                       !_checkStringValidity(argumentsList[1]))
                      ){
              	context.report(node,"setValue parameter shoudnot contain empty string");
              }

            }

  }

  var getTypeOfParent = function(parent){
    return parent.type;
  }



  return {
    "condition" (record) {
      return record.sys_class_name == 'sys_script_include' 
              || record.sys_class_name == 'sys_script';
		},

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
        	_checkForSetValue(nodePropertyName,node);
        }
    }
  };
};

