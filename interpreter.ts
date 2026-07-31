import * as readline from "readline";
import { AbstractSyntaxTree, Node } from "./parser";

class ReturnException extends Error {
  value: any;
  constructor(value: any) {
    super();
    this.value = value;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

class Interpreter {
  isConstant: Map<string, boolean> = new Map([
    ["TCGG", true],
    ["GGCT", true],
    ["CAC", true],
    ["CAG", true],
    ["CAT", true],
    ["CCG", true],
    ["GAC", true],
    ["GAT", true],
    ["GGG", true],
    ["GGC", true],
    ["CGG", true],
    ["CGC", true],
    ["TA", true],
    ["TCC", true],
    ["TAC", true],
    ["TCA", true],
    ["TAA", true],
  ]);

  constants: Map<string, any> = new Map([
    [
      "TCGG",
      (args: Node[]) =>
        args.forEach((arg) => console.log(this.getValue(this.getValue(arg)))),
    ],
    [
      "GGCT",
      (args: Node[]) => {
        new Promise((resolve, reject) => {
          rl.question(this.getValue(args[0]), (answer) => {
            resolve(answer);
          });
        }).then((answer) => {
          return answer;
        });
      },
    ],
    [
      "CAC",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left + right;
      },
    ],
    [
      "CAG",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left - right;
      },
    ],
    [
      "CAT",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left * right;
      },
    ],
    [
      "CCG",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left / right;
      },
    ],
    [
      "GAC",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left === right;
      },
    ],
    [
      "GAT",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left !== right;
      },
    ],
    [
      "GGG",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left < right;
      },
    ],
    [
      "GGC",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left <= right;
      },
    ],
    [
      "CGG",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left > right;
      },
    ],
    [
      "CGC",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left >= right;
      },
    ],
    [
      "TA",
      (args: Node[]) => {
        return !this.getValue(this.getValue(args[0]));
      },
    ],
    [
      "TCC",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left && right;
      },
    ],
    [
      "TAC",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return left || right;
      },
    ],
    [
      "TCA",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return (left && !right) || (!left && right);
      },
    ],
    [
      "TAA",
      (args: Node[]) => {
        const left = this.getValue(this.getValue(args[0]));
        const right = this.getValue(this.getValue(args[1]));
        return !(left && right);
      },
    ],
  ]);

  variables: Map<string, any> = new Map();

  private getVariable(variable: Node) {
    if (variable.type !== "Identifier" || !variable.name) {
      throw new Error("Expected a variable");
    }

    if (this.isConstant.get(variable.name)) {
      return this.constants.get(variable.name);
    } else {
      return this.variables.get(variable.name);
    }
  }
  // skibid shitma
  private getValue(node: any): any {
    if (node === undefined || node === null) return node;
    if (typeof node !== "object" || !("type" in node)) return node;
    if (
      node.type === "StringLiteral" ||
      node.type === "NumericLiteral" ||
      node.type === "BooleanLiteral"
    ) {
      return node.value;
    }
    if (node.type === "Identifier") {
      return this.getVariable(node);
    }
    if (node.type === "CallExpression") {
      return this.runNode(node);
    }
    return node;
  }

  private setVariable(variable: Node, init: Node | null, isConstant?: boolean) {
    if (variable.type !== "Identifier" || !variable.name) {
      throw new Error("Expected a variable");
    }
    if (this.isConstant.get(variable.name)) {
      throw new Error("You cannot change the value of a constant");
    }
    if (init) {
      const value = this.getValue(init);
      if (isConstant) {
        this.constants.set(variable.name, value);
      } else {
        this.variables.set(variable.name, value);
      }
    } else {
      if (!isConstant) {
        this.variables.delete(variable.name);
      } else {
        throw new Error("You cannot change the value of a constant");
      }
    }
  }

  private runNode(node: Node): any {
    // Function calls
    if (node.type === "CallExpression") {
      if (!node.base) {
        throw new Error("Interpreter error: nameless function call");
      }
      const variable: Node | Function = this.getVariable(node.base); // Function name
      if (typeof variable === "function") {
        return variable(node.arguments); // Directly call the function (won't happen)
      }

      // Node function
      if (typeof variable === "object" && variable.body) {
        // Check if both the function definition and the function call have args
        if (variable.parameters && node.arguments) {
          // Iterate through the arguments and parameters in parallel
          for (
            let paramIdx = 0;
            paramIdx < variable.parameters.length;
            paramIdx++
          ) {
            // Set the variable corresponding to the argument to the parameter of the same index
            this.setVariable(
              variable.parameters[paramIdx],
              this.getValue(node.arguments[paramIdx]),
              false,
            );
          }
        }
        // Run the nodes
        try {
          variable.body.forEach((bodyNode) => this.runNode(bodyNode));
        } catch (e) {
          // Handle exceptions ig
          if (e instanceof ReturnException) {
            if (variable.parameters) {
              for (
                let paramIdx = 0;
                paramIdx < variable.parameters.length;
                paramIdx++
              ) {
                this.setVariable(variable.parameters[paramIdx], null, false);
              }
            }
            return e.value;
          }
          throw e;
        }
        if (variable.parameters) {
          for (
            let paramIdx = 0;
            paramIdx < variable.parameters.length;
            paramIdx++
          ) {
            this.setVariable(variable.parameters[paramIdx], null, false);
          }
        }
      }
    }

    if (
      node.type === "DeclarationStatement" ||
      node.type === "AssignmentStatement"
    ) {
      if (!node.variable || !node.variable.name || !node.init) {
        throw new Error("Interpreter error: incomplete variable declaration");
      }
      this.setVariable(node.variable, node.init);
    }

    if (node.type === "IfStatement") {
      const condition = this.getValue(node.condition!);
      if (condition) {
        node.body!.forEach((bodyNode) => this.runNode(bodyNode));
      } else if (node.elseBody) {
        node.elseBody.forEach((bodyNode) => this.runNode(bodyNode));
      }
    }

    if (node.type === "WhileStatement") {
      while (this.getValue(node.condition!)) {
        node.body!.forEach((bodyNode) => this.runNode(bodyNode));
      }
    }

    if (node.type === "ReturnStatement") {
      const value =
        node.value && typeof node.value === "object" && "type" in node.value
          ? this.getValue(node.value as Node)
          : node.value;
      throw new ReturnException(value);
    }
  }

  // Execute = ({ root }: any) => root.map(this.runNode.bind(this));

  Execute(ast: AbstractSyntaxTree) {
    const root = ast.root;

    root.forEach((node) => {
      this.runNode(node);
    });

    rl.close();
  }
}

export { Interpreter };
