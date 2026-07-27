# DNAScript

Esoteric language. Uses only A, T, C, G to imitate DNA.

## Usage

```
npm install
npx ts-node run.ts example/hello.dna
```

## Types

| Syntax | Type | Notes |
|--------|------|-------|
| `A<text>A` | String | `TTT` is escape char |
| `T<digits>T` | Number | Base 4: A=0 T=1 C=2 G=3 |
| `GAG` | Boolean | True |
| `GCG` | Boolean | False |
| `GTG` | Undefined | Maybe |

**Number examples:** 5 = `TTTT`, 12 = `TGAT`, 0 = `TAT`

## Brackets

| Char | Role |
|------|------|
| `A` | Open block |
| `T` | Close block |
| `C` | Open args |
| `G` | Close args |

## Variables

`GC <name> AA <init>` — declare variable
`<name> AA <value>` — set variable

## Functions

`CT C <params> G <body> TC` — define function
`<name> C <args> G` — call function

## Built-ins

| Code | Action |
|------|--------|
| `TCGG C <arg> G` | Print |
| `CAC C a b G` | Add |
| `CAG C a b G` | Subtract |
| `CAT C a b G` | Multiply |
| `CCG C a b G` | Divide |
| `GAC C a b G` | Equal |
| `GAT C a b G` | Not equal |

## Control Flow

`GA <cond> A <body> T` — if
`GA <cond> A <body1> T GG A <body2> T` — if/else
`GT <cond> A <body> T` — while loop
`CA <expr>` — return

## Examples

See `example/` folder.
