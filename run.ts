import { readFileSync } from "node:fs";
import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer";

const file = process.argv[2];

if (!file) {
  console.error("Usage: npx ts-node run.ts <file.dna>");
  process.exit(1);
}

const code = readFileSync(file, "utf8");

const tokenizer = new Tokenizer(code);
tokenizer.tokenize();

const parser = new Parser(tokenizer.tokens);
parser.parseTokens();

const interpreter = new Interpreter();
interpreter.Execute(parser.ast);
