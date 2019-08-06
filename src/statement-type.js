let TokenType = {
    Unknown: 0,
    Keyword: 1,
    Operand: 2,
    Character: 3,
    Variable: 4,
    Literal: 5,

    //New attempt - Dont use prior keywords and there wont be a conflict
    Symbol: 0,
    Number: 1,
    Special: 2,
    String: 3,
    Operator: 4,
}
let SpecialCharacters = ["=", "(", ")", ";", "{", "}"];
let Operators = ["*", "/", "+", "-"];
let Keywords = ["int", "string", "boolean", "class", "void"];
export {TokenType, SpecialCharacters, Operators}
