import { AbstractSyntaxTree, Node } from "./parser";

class Interpreter {
  isConstant: Map<string, boolean> = new Map([["TCGG", true]]);

  constants: Map<string, any> = new Map([
    ["TCGG", (args: string[]) => args.forEach((arg) => console.log(arg))],
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

  private setVariable(variable: Node, init: Node) {
    if (variable.type !== "Identifier" || !variable.name) {
      throw new Error("Expected a variable");
    }
    if (this.isConstant.get(variable.name)) {
      throw new Error("You cannot change the value of a constant");
    }
  }

  Execute(ast: AbstractSyntaxTree) {
    const root = ast.root;

    root.forEach((node) => {
      if (node.type === "CallExpression") {
      }
    });
  }
}

export { Interpreter };
