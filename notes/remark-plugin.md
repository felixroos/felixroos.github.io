---
title: Writing a Markdown Plugin
date: '2021-12-29'
tags: ['code']
description: blabla
draft: true
---

- https://egghead.io/lessons/javascript-introduction-to-the-remark-cli

```sh
npm install remark-cli remark-toc -D
```

- [remark-toc](https://github.com/remarkjs/remark-toc)
- [remark-slug](https://github.com/rehypejs/rehype-slug)
- [rehype-autolink-headings](https://github.com/rehypejs/rehype-autolink-headings#rehype-autolink-headings)
add test.md:

```md
# Test

This is a markdown test.

## Table of contents

## What?

Just some markdown to test...

## Ok

Nice!
```

```js
npx remark test.md --inspect
```

```sh
root[6] (1:1-12:1, 0-88)
├─0 heading[1] (1:1-1:7, 0-6)
│   │ depth: 1
│   └─0 text "Test" (1:3-1:7, 2-6)
├─1 paragraph[1] (3:1-3:25, 8-32)
│   └─0 text "This is a markdown test." (3:1-3:25, 8-32)
├─2 heading[1] (5:1-5:9, 34-42)
│   │ depth: 2
│   └─0 text "What?" (5:4-5:9, 37-42)
├─3 paragraph[1] (7:1-7:30, 44-73)
│   └─0 text "Just some markdown to test..." (7:1-7:30, 44-73)
├─4 heading[1] (9:1-9:6, 75-80)
│   │ depth: 2
│   └─0 text "Ok" (9:4-9:6, 78-80)
└─5 paragraph[1] (11:1-11:6, 82-87)
    └─0 text "Nice!" (11:1-11:6, 82-87)
test.md: no issues found
```

```js
npx remark test.md --use toc
```

```md
# Test

This is a markdown test.

## Table of contents

- [What?](#what)
- [Ok](#ok)

## What?

Just some markdown to test...

## Ok

Nice!
```

# https://css-tricks.com/hash-tag-links-padding/