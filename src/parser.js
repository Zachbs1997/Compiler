import { Operators, SpecialCharacters, TokenType, Keywords }
let Validator = {
    isDefinition: (token) => { return new RegExp(Keywords.join("|").test(token))},
    isSymbol: (token) => {return /[a-z_]*/i.test(token)}
}
class SyntaxBranch{
    constructor(){

    }
}
let SyntaxTree = {

}
export default{
    Parse(tokens){
        for(var i = 0; i < tokens.length; i++){
            let tokenInfo = {token: tokens[i], index: i} //We're passing the index to other methods where it can be modified, so use this obj to pass for reference
            //let token = tokens[i];
            if(tokenInfo.token.type == TokenType.Symbol){
                if(Validator.isDefinition(tokenInfo.token)){
                    handleDefinition(tokens, tokenInfo);
                }
            }
            i = tokenInfo.index;
        }
    }
}

function findClosingBracket(tokens, curIndex){
    var bracketIndex = 1, curIndex = curIndex + 1;
    //for()
}

function handleDefinition(tokens, tokenInfo){
    let type = tokenInfo.token;
    tokenInfo.index++;
    let definitionName = tokens[tokenInfo.index];
    tokenInfo.index++;
}
