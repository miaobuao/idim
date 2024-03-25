import MarkdownIt from 'markdown-it'
import abbr from 'markdown-it-abbr'
import anchorPlugin from 'markdown-it-anchor'
import MarkdownItAttrs from 'markdown-it-attrs'
import containerPlugin from 'markdown-it-container'
import deflist from 'markdown-it-deflist'
import { full as emojiPlugin } from 'markdown-it-emoji'
import footnotePlugin from 'markdown-it-footnote'
import githubTocPlugin from 'markdown-it-github-toc'
import highlight from 'markdown-it-highlight'
import insPlugin from 'markdown-it-ins'
import katex from 'markdown-it-katex'
import markPlugin from 'markdown-it-mark'
import sourceMapPlugin from 'markdown-it-source-map'
import subPlugin from 'markdown-it-sub'
import supPlugin from 'markdown-it-sup'
import taskListsPlugin from 'markdown-it-task-lists'

const md = MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})
  .use(subPlugin)
  .use(supPlugin)
  .use(MarkdownItAttrs)
  .use(emojiPlugin)
  .use(anchorPlugin)
  .use(containerPlugin)
  .use(footnotePlugin)
  .use(taskListsPlugin)
  .use(insPlugin)
  .use(markPlugin)
  .use(sourceMapPlugin)
  .use(abbr)
  .use(deflist)
  .use(githubTocPlugin)
  .use(highlight)
  .use(katex)

md.linkify.set({ fuzzyLink: false })

export default md
