import StatementType from './statement-type';
import Lexer from 'lex';
function Integer(n){
    let value = null;
    let name = n;
    this.setValue = function(val){
        if(val == undefined || val == null){
            value = val;
            return;
        }
        else if(typeof value == "number"){
            value = val;
            return;
        }
        let newVal = JSON.parse(val);
        if(typeof newVal == "number")
            value = newVal;
        else {
            throw new TypeError("Value not of type Integer");
        }

    }
    this.setName = function(_name){
        name = _name;
    }
    this.getType = function(){
        return "Integer";
    }
    this.getValue = function(){
        return value;
    }
    this.getName = function(){
        return name;
    }
    this.toString = function(){
        return this.getValue();
    }
}
let application = {}
let keywords = { //all keywords defined here, move to another file later
    "int": {
        process: (statement) => {
            processDeclarationStatement(statement, Integer);
        }
    },
    "string": {
        process: (statement) => {
            processDeclarationStatement(statement, String);
        }
    },
    "bool": {
        process: (statement) => {
            processDeclarationStatement(statement, Boolean);
        }
    },
}
let operands = {
    "+": "+",
    "-": "-",
    "/": "/",
    "%": "%",
    "(": "(",
    ")": ")",
    "*": "*",
}
var row = 1;
var col = 1;
var l = new Lexer();
export default function compiler(data){
    let allStatements = [];
    applyLexerRules(l, allStatements);
    l.input = data;
    l.lex(); // all statements split by the semi-colon
    for(var i = 0; i < allStatements.length; i++){
        let current = allStatements[i];
        if(current in keywords){ //it is a type declaration. Current will be the keyword used to access the type
            i += 1; //we dont need to read for the variable name - will skip it anyway
            keywords[current].process(allStatements[i]);
        }
        else if(current == "="){
            processAssignment(allStatements, i-1);
        }
    }
    console.log(application); //So we can review what the application state is at the end of compiling
}
function applyLexerRules(l, allStatements){
    l.addRule(/\/\*[\s\S]*?\*\/|\/\/.*/g, (lexeme) => {});
    l.addRule(/[a-z_]+/i, (lexeme) => {allStatements.push(lexeme);});
    l.addRule(/".*"/g, (lexeme) => {allStatements.push(lexeme);});
    l.addRule(/\s+/, function(){});
    l.addRule(/=/, (lexeme) => {allStatements.push(lexeme);});
    l.addRule(/[0-9]+/, (lexeme) => {allStatements.push(lexeme);});
    l.addRule(/;/, (lexeme) => {allStatements.push(lexeme);});
    l.addRule(/\*|\/|\-|\+|%|\(|\)/, (lexeme) => {allStatements.push(lexeme);});
    l.addRule(/\n/, function(){row++; col = 1; });
    l.addRule(/\r/, function(){row++; col = 1;});
}
function processAssignment(list, index){
    let name = list[index];
    console.log(name);
    index += 2; //moves it to the first element of the right hand of the assignment
    let endIndex = index + 1; // the index of the semi-colon
    for(var i = index; i < list.length;i++){
        if(list[i] == ";"){
            endIndex = i;
            break;
         }
    }
    let rightSideList = list.slice(index, endIndex);
    let rightSide = rightSideList.join(" ");
    if(application[name].setValue){
        application[name].setValue(eval(rightSide));
    }
    else
        application[name] = eval(rightSide);
    console.log(rightSide);
}
function getStatementAnalysis(statement){
    let analysis = [];
    for(var i = 0; i < statement.length; i++){
        let s = statement[i];
        if(s in keywords){
            analysis.push(StatementType.Keyword);
        }
        else if(s in operands){
            analysis.push(StatementType.Operand);
        }
        else if(s in application){
            analysis.push(StatementType.Variable);
        }
        else{
            try{
                let type = typeof JSON.parse(s);
                if(type == "number" || type == "boolean" || type == "string"){
                    analysis.push(StatementType.Literal);
                }
                else{
                    analysis.push(StatementType.Unknown);
                }
            }
            catch(e){
                analysis.push(StatementType.Unknown);
            }
        }
    }
    return analysis;
}
function readRighthandStatement(right){
    let a = getStatementAnalysis(right);
    if(a.includes(StatementType.Operand)){
        if(a.includes(StatementType.Unknown)){
            throw new ReferenceError(right[a.indexOf(StatementType.Unknown)] + " is not a known variable name");
        }
        else if(a.includes(StatementType.Variable)){
            for(var i = 0; i < right.length; i++){
                if(a[i] == StatementType.Variable){
                    right[i] = getVariableData(right[i]);
                }
            }
        }
        return eval(right.join(' '));
    }
    else if(right.length == 1){
        return right.join(' ');
    }
    else{
        return "Unknown value";
    }
}
function processDeclarationStatement(name, type){
    let declaration = new type(name); //This is an object with a getter property getName and getValue (primitive)
    application[name] = declaration;
}
function getVariableData(name){
    if(!application[name])
        throw new ReferenceError(name + " is undefined");
    return application[name].getValue();
}
function String(n){
    let name = n;
    let value = undefined;
    this.getName = function(){
        return name;
    }
    this.getValue = function(){
        return value;
    }
    this.setValue = function(val){
        value = "" + val;
    }
    this.getType = function(){
        return "String";
    }
}
function Boolean(n){
    let name = n;
    let value = undefined;
    this.getValue = function(){
        return value;
    }
    this.setValue = function(val){
        if(typeof val != "boolean")
            throw new TypeError("Value of a boolean must be true or false");
        value = val;
    }
    this.getName = function(){
        return name;
    }
}
