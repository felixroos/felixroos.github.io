# blog

## TODO

### general

- [ ] dark / light switcher as icon
- [ ] coolere list styles?
- [ ] listen styles
- [ ] checkbox styles
- [ ] title image in frontmatter ausprobieren
- [ ] add prev / next post links
- [ ] add tag filters
- [ ] add similar posts (at least one common tag)
- [ ] "The ScriptProcessorNode is deprecated. Use AudioWorkletNode instead"
- [ ] "The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page."

### http://localhost:3000/svg-piano

- [x] remove hrs
- [ ] why can't i drag over the keys?

### http://localhost:3000/chords

- [ ] why can't i drag over the keys?

### http://localhost:3000/combinatorial-search

- [ ] post breaks when commenting in Analyzer component at top (post is still comprehensible)

### http://localhost:3000/animation

- [ ] yellow color is too bright..
- [ ] progress goes to 102%...

### http://localhost:3000/harmonics

- [ ] "It looks like there are several instances of `@material-ui/styles` initialized in this application.
This may cause theme propagation issues, broken class names, specificity issues, and makes your application bigger without a good reason."
- [ ] "Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details"
- [ ] hovering does not start audiocontext - add button to start deliberately?
- [ ] when hovering the partial bars, sometimes they sound won't stop on mouse leave

## Standard README (NextJS - Typescript - MDX - Blog)

A Next.js starter for your next blog or personal site. Built with:

- [Typescript](https://www.typescriptlang.org/)
- Write posts with [MDX](https://mdxjs.com/)
- Style with [Theme UI](https://theme-ui.com/)
- Linting with [ESLint](https://eslint.org/)
- Formatting with [Prettier](https://prettier.io/)
- Linting, typechecking and formatting on by default using [`husky`](https://github.com/typicode/husky) for commit hooks
- Testing with [Jest](https://jestjs.io/) and [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro)

This Starter is **heavily** inspired by [Lee Robinson](https://github.com/leerob/leerob.io) and [Anson Lichtfuss](https://github.com/ansonlichtfuss/website).

👀 [View the Live Demo](https://nextjs-typescript-mdx-blog.vercel.app/)

## Getting Started

```bash
git clone https://github.com/ChangoMan/nextjs-typescript-mdx-blog.git
cd nextjs-typescript-mdx-blog

yarn install
# or
npm install

yarn dev
# or
npm run dev
```

Your new site will be up at http://localhost:3000/
