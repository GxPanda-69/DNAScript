# DNAScript

DNAScript is an esoteric language built to imitate DNA notaion using only the letters A, T, C and G.

# Grammar

## Types

`A<string>A` : string (use `TTT` as an escape character, so "A string" would be `ATTTA stringA`)
`T<number>T` : number in base 4 (A=0; T=1; C=2; G=3, 12=`TGAT`)
`GAG` : True
`GCG` : False
`GTG` : Maybe (undefined)
`CT C <args> G <code> CT` or `CT <code> TC` : functions

## Variables

`CC <name> AA <init>` : declare a constant
`GC <name> AA <init>` : declare a variable
(Use `AA` for dynamic or `AC` for static)

`<variable> AA <value>` : change a variable's value

## Brackets

`A` : open statement (like `{` in js)
`T` : close statement (`}`)

`C` : open args (like `(` in js)
`G` : close args (`)`)

`TCGG C <string> G` : logs the string to the output
