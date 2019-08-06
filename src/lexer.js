import { TokenType, SpecialCharacters, Operators } from './statement-type';

class Token{
    constructor(type, value){
        this.type = type;
        this.value = value;
    }
    get token(){
        return {type: this.type, value: this.value}
    }
}
export default {
    Lex(contents){
        let tokens = readStream(contents);
        return tokens;
    }
}

let TokenValidators = {
    isNumber: (token) => { return /^[0-9]+(\.?[0-9]*)$/.test(token) },
    isEndOfLine: (token) => { return /[\r\n;"\s]/.test(token) }
}
function readStream(stream){
    let tokens = [];
    for(var i = 0; i < stream.length; i++){
        if(stream[i] == " "){ //If its a space, we do nothing, so move on
            continue;
        }
        else if(/[a-z_]/i.test(stream[i])){ //if its a letter or underscore
            let word = captureWord(stream, i);
            i += word.length - 1;//skip ahead
            tokens.push(new Token(TokenType.Symbol, word));
        }
        else if(/[0-9]/.test(stream[i])){ //If its a digit
            let number = captureWord(stream, i);
            i += number.length - 1;
            if(!TokenValidators.isNumber(number))
                throw new SyntaxError("Invalid number");
            tokens.push(new Token(TokenType.Number, number));
        }
        else if(SpecialCharacters.includes(stream[i])){ //If its one of the languages special characters
            tokens.push(new Token(TokenType.Special, stream[i]));
        }
        else if(stream[i] == "\""){ //A string
            i++;
            let string = captureWord(stream, i);
            i += string.length;
            tokens.push(new Token(TokenType.String, string));
        }
        else if(Operators.includes(stream[i])){ //A mathematical operator
            tokens.push(new Token(TokenType.Operator, stream[i]));
        }
    }
    return tokens;
}

function captureWord(contents, index){
    let leftBound = index, rightBound = -1;
    for(var i = index; i < contents.length; i++){
        if(TokenValidators.isEndOfLine(contents[i])){
            rightBound = i;
            break;
        }
    }
    if(rightBound == -1)
        rightBound = contents.length;
    return contents.slice(leftBound, rightBound);
}
