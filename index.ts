import { Interpreter } from "./interpreter";
import { Parser } from "./parser";
import { Tokenizer } from "./tokenizer";

let tokenizer = new Tokenizer(`
GC MessageContent AA AHello WorldA
GC HelloWorldFunc AA CT
  C Message G
  TCGG C Message G
TC
HelloWorldFunc C MessageContent G
MessageContent AA AHello World number twoA
HelloWorldFunc C MessageContent G
`);

tokenizer.tokenize();
let parser = new Parser(tokenizer.tokens);
parser.parseTokens();
const interpreter = new Interpreter();
interpreter.Execute(parser.ast);
