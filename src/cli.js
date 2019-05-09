import arg from 'arg';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import compiler from './compiler';

let filePath = process.cwd();

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg({},{
        argv: rawArgs.slice(2),
    });
    return args["_"];
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    let fileName = options[0];
    fs.readFile(path.join(filePath, fileName), {encoding: "utf-8"}, function(err, data){
        if(!err){
            compiler(data);
        }
        else{
            console.log("error reading file")
        }
    });
}
