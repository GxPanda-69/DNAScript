import { AbstractSyntaxTree, Node } from "./parser";

class Interpreter {
  isConstant: Map<string, boolean> = new Map([["TCGG", true]]);

  constants: Map<string, any> = new Map([
    [
      "TCGG",
      (args: Node[]) =>
        args.forEach((arg) => console.log(this.getValue(this.getValue(arg)))),
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

  private getValue(node: Node): any {
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
      if (isConstant) {
        this.constants.set(variable.name, init);
      } else {
        this.variables.set(variable.name, init);
      }
    } else {
      if (!isConstant) {
        this.variables.delete(variable.name);
      } else {
        throw new Error("You cannot change the value of a constant");
      }
    }
  }

  private runNode(node: Node) {
    if (node.type === "CallExpression") {
      if (!node.base) {
        throw new Error("Interpreter error: nameless function call");
      }
      const variable: Node | Function = this.getVariable(node.base);
      if (typeof variable === "function") {
        variable(node.arguments);
      }
      if (typeof variable === "object" && variable.body) {
        if (variable.parameters && node.arguments) {
          for (
            let paramIdx = 0;
            paramIdx < variable.parameters.length;
            paramIdx++
          ) {
            this.setVariable(
              variable.parameters[paramIdx],
              this.getValue(node.arguments[paramIdx]),
              false,
            );
          }
        }
        variable.body.forEach((bodyNode) => this.runNode(bodyNode));
        if (variable.parameters && node.arguments) {
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
  }

  Execute(ast: AbstractSyntaxTree) {
    const root = ast.root;

    root.forEach((node) => {
      this.runNode(node);
    });
  }
}

export { Interpreter };
