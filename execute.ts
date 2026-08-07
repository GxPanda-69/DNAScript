import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer";

const code = process.argv[2];

if (!code) {
  console.error('Usage: npx ts-node execute.ts "<script to execute>"');
  process.exit(1);
}

const tokenizer = new Tokenizer(code);
tokenizer.tokenize();

const parser = new Parser(tokenizer.tokens);
parser.parseTokens();

const interpreter = new Interpreter();
interpreter.Execute(parser.ast);
