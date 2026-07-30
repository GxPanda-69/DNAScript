import { Token, TokenType } from "./tokenizer";

class ParsingException extends Error {
  value: any;
  constructor(value: any) {
    super();
    this.value = value;
  }
}

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
    | "IfStatement"
    | "WhileStatement";

  // Identifier
  name?: string;

  // Literals and ReturnStatement
  value?: string | number | boolean | Node | undefined;

  // FunctionLiterals, IfStatement, WhileStatement
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

  // IfStatement
  condition?: Node;
  elseBody?: Node[];
}

interface AbstractSyntaxTree {
  root: Node[];
}

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

    // Identifier
    if (firstToken.type === TokenType.NAME) {
      const identifier: Node = { type: "Identifier", name: firstToken.value };

      this.position++; // Skip ahead to see what's in front

      // Function Calls
      if (this.getTokenRelative().type === TokenType.C) {
        let args = [];
        this.position++;

        while (this.getTokenRelative().type !== TokenType.G) {
          const arg = this.getNode();
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
          init: this.getNode(),
        };
      }

      // Else return the identifier
      this.position--;
      return identifier;
    }

    if (firstToken.type === TokenType.DECLARE_VARIABLE) {
      this.position++;
      if (this.getTokenRelative().type !== TokenType.NAME) {
        throw new Error("Unexpected token at position " + this.position);
      }
      const variableIdentifier: Node = {
        type: "Identifier",
        name: this.getTokenRelative().value,
      };
      this.position++;
      if (this.getTokenRelative().type !== TokenType.SET) {
        throw new Error("Unexpected token at position " + this.position);
      }
      this.position++;
      return {
        type: "DeclarationStatement",
        variable: variableIdentifier,
        init: this.getNode(),
      };
    }

    // Strings
    if (firstToken.type === TokenType.STRING) {
      return { type: "StringLiteral", value: firstToken.value };
    }

    // Numbers
    if (firstToken.type === TokenType.NUMBER) {
      return { type: "NumericLiteral", value: firstToken.value };
    }

    // Function
    if (firstToken.type === TokenType.FUNCTION_OPEN) {
      let parameters: Node[] = [];

      this.position++;
      if (this.getTokenRelative().type === TokenType.C) {
        while (this.getTokenRelative().type !== TokenType.G) {
          this.position++;
          const currentToken = this.getTokenRelative();
          if (currentToken.type !== TokenType.NAME) {
            if (currentToken.type === TokenType.G) {
              break;
            }
            throw new Error("Unexpected token at position " + this.position);
          }
          parameters.push({
            type: "Identifier",
            name: currentToken.value,
          });
        }
      }

      let body: Node[] = [];

      this.position++;

      while (this.getTokenRelative().type !== TokenType.FUNCTION_CLOSE) {
        body.push(this.getNode());
        this.position++;
      }

      return {
        type: "FunctionLiteral",
        parameters: parameters,
        body: body,
      };
    }

    // If Statement: GA <condition> A body T [GG A elseBody T]
    if (firstToken.type === TokenType.IF) {
      this.position++;
      const condition = this.getNode();
      // Skip to body opener A
      while (
        this.getTokenRelative() &&
        this.getTokenRelative().type !== TokenType.A
      ) {
        this.position++;
      }
      this.position++;
      let body: Node[] = [];
      while (this.getTokenRelative().type !== TokenType.T) {
        body.push(this.getNode());
        this.position++;
      }

      let elseBody: Node[] | undefined;
      if (this.getTokenRelative()?.type === TokenType.ELSE) {
        this.position++;
        if (this.getTokenRelative().type !== TokenType.A) {
          throw new Error(
            "Expected A for else body at position " + this.position,
          );
        }
        this.position++;
        elseBody = [];
        while (this.getTokenRelative().type !== TokenType.T) {
          elseBody.push(this.getNode());
          this.position++;
        }
      }

      return {
        type: "IfStatement",
        condition: condition,
        body: body,
        elseBody: elseBody,
      };
    }

    // While Statement: GT <condition> A body T
    if (firstToken.type === TokenType.WHILE) {
      this.position++;
      const condition = this.getNode();
      // Skip to body opener A
      while (
        this.getTokenRelative() &&
        this.getTokenRelative().type !== TokenType.A
      ) {
        this.position++;
      }
      this.position++;
      let body: Node[] = [];
      while (this.getTokenRelative().type !== TokenType.T) {
        body.push(this.getNode());
        this.position++;
      }

      return {
        type: "WhileStatement",
        condition: condition,
        body: body,
      };
    }

    // Return Statement: CA expression
    if (firstToken.type === TokenType.RETURN) {
      this.position++;
      const value = this.getNode();
      return {
        type: "ReturnStatement",
        value: value,
      };
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

export { Parser, AbstractSyntaxTree, Node };
