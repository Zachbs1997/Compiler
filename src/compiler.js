import { TokenType } from './statement-type';
import Lexer from 'lex';
import myLexer from './lexer';

function Integer(n){
    let value = null;
    let name = n;
    this.value = value;
    this.name = name;
    this.setValue = function(val){
        if(val == undefined || val == null){
            this.value = val;
            return;
        }
        else if(typeof value == "number"){
            this.value = val;
            return;
        }
        let newVal = JSON.parse(val);
        if(typeof newVal == "number")
            this.value = newVal;
        else {
            throw new TypeError("Value not of type Integer");
        }

    }
    this.setName = function(_name){
        this.name = _name;
    }
    this.getType = function(){
        return "Integer";
    }
    this.getValue = function(){
        return this.value;
    }
    this.getName = function(){
        return this.name;
    }
    this.toString = function(){
        return this.getValue();
    }
}
let application = {
    type: "program",
    prog: []
}
let declarations = { //all keywords defined here, move to another file later
    "int": {
        process: () => {
            //processDeclarationStatement(statement, Integer);
            return Integer;
        }
    },
    "string": {
        process: () => {
            //processDeclarationStatement(statement, String);
            return String;
        }
    },
    "bool": {
        process: () => {
            //processDeclarationStatement(statement, Boolean);
            return Boolean;
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
    /*let allStatements = [];
    applyLexerRules(l, allStatements);
    l.input = data;
    l.lex(); // all statements split by the semi-colon
    allParser.parse();
    applicationCompiler.start();*/
    //myLexer.Lex(data);
    console.log(myLexer.Lex(data));
    /*for(var i = 0; i < application.prog.length; i++){
        let p = application.prog[i];
        if(p.type == "method"){
            console.log(p);
        }
    }*/
    //console.log(application);//So we can review what the application state is at the end of compiling
    //console.log(applicationCompiler.base);
}
function applyLexerRules(l, allStatements){
    l.addRule(/\/\*[\s\S]*?\*\/|\/\/.*/g, (lexeme) => {}); //ignore comments
    l.addRule(/[a-z_]*\s[a-z]*\([a-z]*\)\{([^\{\}]*)\}/gi, (lexeme) => {allParser.methodStatements.push(lexeme)}); //typeof method
    l.addRule(/[a-z_]*\s[a-z]*\{([^\{\}]*)\}/gi, (lexeme) => {allParser.classDeclarations.push(lexeme)}); //typeof class
    l.addRule(/[^\r\n]*;/, (lexeme) => {allParser.oneLineStatements.push(lexeme.substring(0, lexeme.length - 1))}) //line statement (without ; at the end)
    l.addRule(/./, () => {});
    l.addRule(/\n/, function(){row++; col = 1; });
    l.addRule(/\r/, function(){row++; col = 1;});
}

function getVariableData(name){
    if(!application[name])
        throw new ReferenceError(name + " is undefined");
    return application[name].getValue();
}
function String(n){
    let name = n;
    let value = undefined;
    this.name = name;
    this.value = value;
    this.getName = function(){
        return this.name;
    }
    this.getValue = function(){
        return this.value;
    }
    this.setValue = function(val){
        this.value = "" + val;
    }
    this.getType = function(){
        return "String";
    }
}
function Boolean(n){
    let name = n;
    let value = undefined;
    this.name = name;
    this.value = value;
    this.getValue = function(){
        return this.value;
    }
    this.setValue = function(val){
        if(typeof val != "boolean")
            throw new TypeError("Value of a boolean must be true or false");
        this.value = val;
    }
    this.getName = function(){
        return this.name;
    }
}
function Parser(){
    this.oneLineStatements = [];
    this.methodStatements = [];
    this.classDeclarations = [];
    this.parse = function(){
        this.handleOneLineStatements();
        this.handleMethodStatements();
    };
    this.handleOneLineStatements = function(){
        for(var i = 0; i < this.oneLineStatements.length; i++){
            let stmt = this.oneLineStatements[i];
            let bodies = this.parseOneLineStatement(stmt);
            application.prog.push(...bodies);
        }
    };
    this.handleMethodStatements = function(){
        for(var i = 0; i < this.methodStatements.length; i++){
            let obj = {type: "method", prog: []}
            let method = this.methodStatements[i];
            let statementsInMethod = [];
            let methodLexer = newMethodLexer(method, statementsInMethod);
            methodLexer.lex();
            for(var j = 0; j < statementsInMethod.length; j++){
                let stmt = statementsInMethod[j];
                let bodies = this.parseOneLineStatement(stmt);
                obj.prog.push(...bodies);
            }
            application.prog.push(obj);
        }
    }
    this.parseOneLineStatement = function(stmt){
        let bodies = [];
        let splitStmt = stmt.split(" ");
        if(splitStmt[0] in declarations){
            let d = {type: "declaration", name: splitStmt[1], valueType: splitStmt[0]};
            bodies.push(d);
        }
        if(stmt.match(/[^=]=[^=]/) != null){
            let sides = stmt.split("=");
            let leftSide = sides[0].trim().split(" ");
            let name = undefined;
            if(leftSide[0] in declarations)
                name = leftSide[1];
            else
                name = leftSide[0];
            let right = {};
            let rightHand = sides[1].trim();
            if(rightHand.match(/[\+\(\)\-\s\/\*]/) && (rightHand[0] != "\"" && rightHand[rightHand.length - 1] != "\"")){
                right["type"] = "expression";
                right["variables"] = rightHand.match(/[a-z]+/gi);
                right["expression"] = rightHand;
            }else{
                right["type"] = "variable";
                right["value"] = rightHand;
            }
            let assign = {type: "assignment", left: name, right: right}
            bodies.push(assign);
        }
        return bodies;
    };
}
var allParser = new Parser();
function newMethodLexer(input, outputStatements){
    let methodLexer = new Lexer(), col = 1, row = 1;
    methodLexer.addRule(/./, () => {});
    methodLexer.addRule(/[^\r\n]*;/, (lexeme) => {outputStatements.push(lexeme.substring(0, lexeme.length - 1).trim())})
    methodLexer.addRule(/\n/, function(){row++; col = 1; });
    methodLexer.addRule(/\r/, function(){row++; col = 1;});
    methodLexer.input = input;
    return methodLexer;
}

let applicationCompiler = {
    base: {},
    readProgs: function(progs){
        let result = {};
        for(var i = 0; i < progs.length; i++){
            let prog = progs[i];
            if(prog.type == "declaration"){
                let type = declarations[prog.valueType].process();
                result[prog.name] = new type(prog.name);
                continue;
            }
            else if(prog.type == "assignment"){
                let valueToAssign = "";
                if(prog.right.type == "expression"){
                    let variables = prog.right["variables"];
                    let expression = prog.right["expression"];
                    if(variables){
                        for(var v = 0; v < variables.length; v++){
                            let val = 5;
                            expression = expression.replace(variables[v], val);
                        }
                    }
                    valueToAssign = eval(expression);
                }
                else{
                    valueToAssign = prog.right.value;
                }
                try{
                    valueToAssign = JSON.parse(valueToAssign);
                }catch(e){//forget the error
                    if(valueToAssign.includes("\""))
                        valueToAssign = valueToAssign.replace(/"/g, "");
                }
                if(result[prog.left])
                    result[prog.left].setValue(valueToAssign);
                else if(applicationCompiler.base[prog.left])
                    applicationCompiler.base[prog.left].setValue(valueToAssign);
                else
                    throw new ReferenceError("Variable " + prog.left + " is undefined");
            }
            else if(prog.type == "method"){

            }
        }
        if(progs.progs)
            result.scope = applicationCompiler.readProgs(progs.progs);
        console.log(result);
        return result;
    },
    start: function(){
        var result = applicationCompiler.readProgs(application.prog);

        applicationCompiler.base = { ...result }
    }
}
