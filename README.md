# DNAScript

Esoteric language. Uses only A, T, C, G to imitate DNA.

## Usage

```
npm install
npx ts-node run.ts example/hello.dna
```

## Types

| Syntax       | Type      | Notes                   |
| ------------ | --------- | ----------------------- |
| `A<text>A`   | String    | `TTT` is escape char    |
| `T<digits>T` | Number    | Base 4: A=0 T=1 C=2 G=3 |
| `GAG`        | Boolean   | True                    |
| `GCG`        | Boolean   | False                   |
| `GTG`        | Undefined | Maybe                   |

**Number examples:** 5 = `TTTT`, 12 = `TGAT`, 0 = `TAT`

## Brackets

| Char | Role        |
| ---- | ----------- |
| `A`  | Open block  |
| `T`  | Close block |
| `C`  | Open args   |
| `G`  | Close args  |

## Variables

`GC <name> AA <init>` — declare variable

`<name> AA <value>` — set variable

## Functions

`CT C <params> G <body> TC` — define function

`<name> C <args> G` — call function

## Built-ins

| Code                 | Action                              |
| -------------------- | ----------------------------------- |
| `TCGG C ...<args> G` | Print the given arguments           |
| `GGCT C <arg> G`     | Take input, `<arg>` is the question |
| `CAC C a b G`        | Add `a` and `b`                     |
| `CAG C a b G`        | Subtract `a` to `b`                 |
| `CAT C a b G`        | Multiply `a` and `b`                |
| `CCG C a b G`        | Divide `a` by `b`                   |
| `GAC C a b G`        | Is `a` equal to `b`                 |
| `GAT C a b G`        | If `a` not equal to `b`             |
| `GGG C a b G`        | Is `a` lower than `b`               |
| `GGC C a b G`        | Is `a` lower or equal to `b`        |
| `CGG C a b G`        | Is `a` higher than `b`              |
| `CGC C a b G`        | Is `a` higher or equal to `b`       |
| `TA C a G`           | NOT `a`                             |
| `TCC C a b G`        | `a` AND `b`                         |
| `TAC C a b G`        | `a` OR `b`                          |
| `TCA C a b G`        | `a` XOR `b`                         |
| `TAA C a b G`        | `a` NAND `b`                        |

## Control Flow

| Expression                             | Meaning    |
| -------------------------------------- | ---------- |
| `GA <cond> A <body> T`                 | if         |
| `GA <cond> A <body1> T GG A <body2> T` | if/else    |
| `GT <cond> A <body> T`                 | while loop |
| `CA <expr>`                            | return     |

## Examples

### For loops

You might have noticed that for loops aren't implemented. This is because they can be recreated with the already existing features.
For example, you could use the script

```
GC For AA CT C REPETITIONS BODY G
  GC I AA TAT
  GT GGG C I REPETITIONS G A
    BODY C I G
    I AA CAC C I TTT G
  T
TC
```

See `example/` folder.
