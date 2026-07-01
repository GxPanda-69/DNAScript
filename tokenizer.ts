const TokenType = {
  A: "A",
  T: "T",
  C: "C",
  G: "G",
  STRING: "STRING",
  NUMBER: "NUMBER",
  BOOLEAN_TRUE: "BOOLEAN_TRUE", // GAG
  BOOLEAN_FALSE: "BOOLEAN_FALSE", // GCG
  MAYBE: "MAYBE", // GTG
  FUNCTION_OPEN: "FUNCTION_OPEN", // CT
  FUNCTION_CLOSE: "FUNCTION_CLOSE", // TC
  DECLARE_CONSTANT: "DECLARE_CONSTANT", // CC
  DECLARE_VARIABLE: "DECLARE_VARIABLE", // GC
  SET: "SET", // AA
  // ==========
  NAME: "NAME", // Variable/function names
};

const LiteralWord = new Map<string, string>([
  ["GAG", TokenType.BOOLEAN_TRUE],
  ["GCG", TokenType.BOOLEAN_FALSE],
  ["GTG", TokenType.MAYBE],
  ["CC", TokenType.DECLARE_CONSTANT],
  ["GC", TokenType.DECLARE_VARIABLE],
  ["AA", TokenType.SET],
  ["CT", TokenType.FUNCTION_OPEN],
  ["TC", TokenType.FUNCTION_CLOSE],
  ["A", TokenType.A],
  ["T", TokenType.T],
  ["C", TokenType.C],
  ["G", TokenType.G],
]);

class Token {
  readonly type: string;
  readonly value: any;
  readonly start: number;
  readonly end: number;

  constructor(type: string, value: any, start: number, end: number) {
    this.type = type;
    this.value = value;
    this.start = start;
    this.end = end;
  }
}

class Tokenizer {
  input: string;
  readonly inputLength: number;
  position: number;
  tokens: Token[];

  constructor(input: string) {
    this.input = input;
    this.inputLength = input.length;
    this.position = 0;
    this.tokens = [];
  }

  // === Helper functions ===

  private getRealtiveChar(offset: number) {
    return this.input[this.position + offset];
  }

  private wordIs(
    word: string,
    advance?: boolean,
    callback?: (token: Token | null) => void,
  ) {
    console.log("Check if word is", word, "at char", this.position);

    for (let i = 0; i < word.length; i++) {
      if (this.getRealtiveChar(i) !== word[i]) {
        if (callback) {
          callback(null);
        }
        return false;
      }
    }

    if (
      !(
        this.getRealtiveChar(word.length) === " " ||
        !this.getRealtiveChar(word.length) // EOF
      )
    ) {
      if (callback) {
        callback(null);
      }
      return false;
    }

    if (callback) {
      callback(
        new Token(
          LiteralWord.get(word) || "NULL",
          word,
          this.position,
          this.position + word.length,
        ),
      );
    }

    this.position += advance ? word.length : 0;
    return true;
  }

  // === Class methods ===

  tokenize() {
    console.log("Tokenizing...");

    while (this.position < this.inputLength) {
      const currentChar = this.getRealtiveChar(0);

      // Skip spaces
      if (/\s/.test(currentChar)) {
        console.log("Skipping space at", this.position);
        this.position++;
        continue;
      }

      // Check for literals
      for (let [key, value] of LiteralWord) {
        // Check litterals first
        if (
          this.wordIs(key, true, (token) => {
            if (token) {
              console.log("Found word !");
              this.tokens.push(token);
            }
          })
        ) {
          break;
        }
      }

      console.log(
        "Literal not found for char",
        currentChar,
        "at",
        this.position,
      );

      // Check for strings
      if (currentChar === "A") {
        console.log("String at", this.position);

        this.position++;

        let start = this.position;
        let char = this.getRealtiveChar(0);
        let string = "";

        while (char !== "A") {
          string += char;
          this.position++;
          char = this.getRealtiveChar(0);
        }

        this.tokens.push(
          new Token(TokenType.STRING, string, start, this.position - 1),
        );
        this.position++;
        continue;
      }

      let start = this.position;
      let name = "";
      let done = false;

      while (!done) {
        const char = this.input[this.position];

        if (char === " " || !char) {
          done = true;
          break;
        }
        name += char;
        this.position++;
      }

      if (name !== "") {
        this.tokens.push(
          new Token(TokenType.NAME, name, start, this.position - 1),
        );
      }

      this.position++;
    }
    return this.tokens;
  }
}

export { Token, Tokenizer };
