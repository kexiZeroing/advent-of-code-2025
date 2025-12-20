# Advent of Code 2025

My TypeScript solution to [Advent of Code 2025](https://adventofcode.com/2025).

My solution to AoC 2024 can be found [here](https://github.com/kexiZeroing/advent-of-code-2024).

> Observe [the rule](https://reddit.com/r/adventofcode/wiki/faqs/copyright/inputs): Do not publicly share your puzzle input (and likewise do not ask others to share their puzzle inputs). Do not commit your puzzle input into your repo or at least not do not share the input publicly; use `.gitignore` or equivalent.

```sh
# initialize project
npm init -y
npm i -D @types/node typescript

# generate tsconfig.json
npx tsc --init

# run the code
# Node.js v22.18.0 and later
node ./day-1.ts

# Check types
npx tsc --noEmit
```

Note that when you specify input files on the command line (like `npx tsc ./day-1.ts`), TypeScript ignores your `tsconfig.json` file entirely and uses default compiler options instead. To respect your `tsconfig.json` settings, either:
- Run `npx tsc` without file arguments to compile all files in the project
- Use `npx tsc ./day-1.ts --noEmit` to type-check a single file without emitting JS
