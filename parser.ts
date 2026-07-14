import { Token, TokenType } from "./tokenizer";

interface FunctionDictionary {
  [key: string]: (...args: any[]) => any | void | undefined;
}

let functions : FunctionDictionary = {
  "TCGG": (args: any[]) => args.forEach((arg) => console.log(arg))
}

class Node {

}

class Parser {
  readonly tokens: Token[]
  ast: Node[]
  position = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.ast = [];
  }

  private getTokenRelative(offset?: number) {
    return this.tokens[offset ? this.position + offset : this.position]
  }

  private getValue(offset?: number) {
    if (!offset) { offset = 0; }

    const firstToken: Token = this.getTokenRelative(offset);

    if (firstToken.type === TokenType.STRING) {
      return firstToken.value;
    }
  }

  parseTokens() {
    while (this.position < this.tokens.length) {
      if (this.getTokenRelative().type === TokenType.NAME) { // Non-literals

        if (this.getTokenRelative(1).type === TokenType.C) { // Functions
          const funcName: string = this.getTokenRelative().value;
          let args = [];
          this.position += 2;

          while (this.getTokenRelative().type !== TokenType.G) {
            args.push(this.getValue() || this.getTokenRelative().value);
            this.position++;
          }

          console.log(funcName, "function called with args", args);

          functions[funcName](args);
        }
      }

      this.position++;
    }
  }
}

export { Parser };