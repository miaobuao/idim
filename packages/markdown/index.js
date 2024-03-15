import MarkdownIt from 'markdown-it'
import anchorPlugin from 'markdown-it-anchor'
import MarkdownItAttrs from 'markdown-it-attrs'
import containerPlugin from 'markdown-it-container'
import { full as emojiPlugin } from 'markdown-it-emoji'
import mathPlugin from 'markdown-it-mathjax3'

const md = MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})
  .use(MarkdownItAttrs)
  .use(emojiPlugin)
  .use(anchorPlugin)
  .use(mathPlugin)
  .use(containerPlugin)

md.linkify.set({ fuzzyLink: false })

export default md
