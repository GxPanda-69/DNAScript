import { Token, TokenType } from "./tokenizer";

interface FunctionDictionary {
  [key: string]: (...args: any[]) => any | void | undefined;
}

interface Node {
  type:
    | "Identifier"
    | "StringLiteral"
    | "NumericLiteral"
    | "BooleanLiteral"
    | "FunctionLiteral" // Values
    | "CallExpression" // Function calls
    | "DeclarationStatement" // Variable operations
    | "AssignmentStatement"
    | "UnaryExpression" // Operations
    | "BinaryExpression"
    | "ReturnStatement"
    | "ForStatement";

  // Identifier
  name?: string;

  // Literals
  value?: string | number | boolean | undefined;

  // FunctionLiterals
  parameters?: Node[];
  body?: Node[];

  // CallExpression
  base?: Node;
  arguments?: Node[];

  // DeclarationStatement AssignmentStatement
  variable?: Node;
  init?: Node;

  // UnaryExpression
  operator?: string;
  argument?: Node;
  // BinaryExpression
  left?: Node;
  right?: Node;
}

interface AbstractSyntaxTree {
  root: Node[];
}

let functions: FunctionDictionary = {
  TCGG: (args: any[]) => args.forEach((arg) => console.log(arg)),
};

class Parser {
  readonly tokens: Token[];
  ast: AbstractSyntaxTree;
  position = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.ast = { root: [] };
  }

  private getTokenRelative(offset?: number) {
    return this.tokens[offset ? this.position + offset : this.position];
  }

  private getNode(): Node {
    const firstToken: Token = this.getTokenRelative();

    if (!firstToken) {
      return { type: "BooleanLiteral", value: undefined };
    }

    console.log(firstToken);

    // Identifier
    if (firstToken.type === TokenType.NAME) {
      const identifier: Node = { type: "Identifier", name: firstToken.value };

      this.position++; // Skip ahead to see what's in front

      // Function Calls
      if (this.getTokenRelative().type === TokenType.C) {
        let args = [];
        this.position++;

        while (this.getTokenRelative().type !== TokenType.G) {
          args.push(this.getNode());
          this.position++;
        }

        return {
          type: "CallExpression",
          base: identifier,
          arguments: args,
        };
      }

      // Variable assignment
      if (this.getTokenRelative().type === TokenType.SET) {
        this.position++;
        return {
          type: "AssignmentStatement",
          variable: identifier,
          init: this.getNode()
        }
      }
    }

    if (firstToken.type === TokenType.DECLARE_VARIABLE) {
      this.position++;
      if (this.getTokenRelative().type !== TokenType.NAME) {
        throw new Error("Unexpected token at position " + this.position);
      }
      const variableIdentifier: Node = {
        type: "Identifier",
        name: this.getTokenRelative().value
      }
      this.position++;
      if (this.getTokenRelative().type !== TokenType.SET) {
        throw new Error("Unexpected token at position " + this.position);
      }
      this.position++;
      return {
        type: "DeclarationStatement",
        variable: variableIdentifier,
        init: this.getNode()
      }
    }

    if (firstToken.type === TokenType.STRING) {
      return { type: "StringLiteral", value: firstToken.value };
    }

    if (firstToken.type === TokenType.NUMBER) {
      return { type: "NumericLiteral", value: firstToken.value };
    }

    return { type: "BooleanLiteral", value: undefined };
  }

  parseTokens() {
    while (this.position < this.tokens.length) {
      this.ast.root.push(this.getNode());
      this.position++;
    }
  }
}

export { Parser };
