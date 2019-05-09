
let application = {

}
let keywords = { //all keywords defined here, move to another file later
    var: {
        process: (statement) => {
            let endIndex = statement.length;
            if(statement.includes("=")){
                endIndex = statement.indexOf("=") - 1;
            }
            //first 3 characters should be "var "
            let varName = statement.substring(4, endIndex);
            keywords.var.action(varName);
        },
        action: (name) => {application[name] = undefined}
    }
}

let keyList = Object.keys(keywords);

function Keyword(name, action){
    this.name = name;
    this.action = action;
}

export default function compiler(data){
    let allStatements = getStatements(data); // all statements split by the semi-colon
    for(var i = 0; i < allStatements.length; i++){
        readStatement(allStatements[i]);
    }
    console.log(application); //So we can review what the application state is at the end of compiling
}

function getStatements(file){ // returns all statements, handling reading all the formatting of the code
    let statements = file.split(";");
    return statements;
}
function readStatement(statement){ //Read and process each individual statement through pre-defined keywords
    statement = statement.trim();
    let keyword = statement.slice(0, statement.indexOf(" "));
    if(keywords[keyword]){
        keywords[keyword].process(statement);
    }

}
