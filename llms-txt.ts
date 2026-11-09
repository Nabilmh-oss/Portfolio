/**
 * Builds /llms.txt and /llms-full.txt: a plain-text summary of the site for
 * AI assistants and search engines (format: https://llmstxt.org).
 * Everything comes from src/data/site.ts and src/data/projects.json, so a new
 * project shows up here automatically at the next build.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { ABOUT, COPY, FAQ, SITE } from './src/data/site'

interface Project {
  slug: string
  title: string
  category: string
  year: number | null
  details: { label: string; value: string }[]
  summary: string
  description: string[]
}

const isLink = (d: { label: string; value: string }) =>
  /^(lien|site|url|github)$/i.test(d.label.trim()) || /^https?:\/\//i.test(d.value.trim())
const toHref = (v: string) => (/^https?:\/\//i.test(v.trim()) ? v.trim() : `https://${v.trim()}`)

function readProjects(root: string): Project[] {
  const file = path.resolve(root, 'src/data/projects.json')
  return JSON.parse(fs.readFileSync(file, 'utf8')) as Project[]
}

function projectBlock(project: Project, full: boolean) {
  const meta = [project.category, project.year ? String(project.year) : ''].filter(Boolean).join(' · ')
  const lines = [`### ${project.title}`, '', `${meta}`, '', project.summary]
  const clean = (v: string) => v.trim().replace(/[,;\s]+$/, '')
  const info = project.details.filter((d) => !isLink(d)).map((d) => ({ ...d, value: clean(d.value) }))
  const links = project.details.filter(isLink)
  if (full) lines.push('', ...project.description.flatMap((p) => [p, '']))
  if (info.length) lines.push('', ...info.map((d) => `- ${d.label} : ${d.value}`))
  if (links.length) lines.push(...links.map((d) => `- ${d.label} : ${toHref(d.value)}`))
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function buildLlmsTxt(root: string, full: boolean) {
  const projects = readProjects(root)
  const url = SITE.url.replace(/\/$/, '')
  const out = [
    `# ${SITE.name}`,
    '',
    `> ${ABOUT.role}. ${COPY.footer.description.replace(/^[^.]*\.\s*/, '')} Recherche une entreprise pour réaliser son travail de Bachelor.`,
    '',
    ABOUT.intro,
    '',
    '## Pages',
    '',
    `- [Accueil et projets](${url}/) : profil, réalisations, méthode, FAQ et contact`,
    `- [À propos](${url}/a-propos/) : parcours, façon de travailler, compétences et langues`,
    '',
    '## Projets',
    '',
    ...projects.map((p) => projectBlock(p, full) + '\n'),
    '## Profil',
    '',
    ...(full
      ? ABOUT.sections.flatMap((s) => [`### ${s.title}`, '', ...s.paragraphs.flatMap((p) => [p, ''])])
      : [ABOUT.sections[0].paragraphs[1], '']),
    '### Compétences',
    '',
    ...ABOUT.skills.map((g) => `- ${g.title} : ${g.items.join(', ')}`),
    '',
    '### Langues',
    '',
    ...ABOUT.languages.map((l) => `- ${l.name}${l.level ? ` : ${l.level}` : ''}`),
    '',
    '## Travail de Bachelor',
    '',
    ABOUT.goal.text,
    '',
    ...(full ? ['### Questions fréquentes', '', ...FAQ.flatMap((f) => [`**${f.q}**`, f.a, ''])] : []),
    '## Contact',
    '',
    `- E-mail : ${SITE.email}`,
    `- LinkedIn : ${SITE.linkedin}`,
    `- Formulaire : ${url}/#contact`,
    '',
    ...(full ? [] : ['## Optional', '', `- [Version complète](${url}/llms-full.txt) : descriptions détaillées des projets et du parcours`, '']),
  ]
  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

/** Serves both files in dev and writes them into dist/ at build time. */
export function llmsTxt(): Plugin {
  let root = process.cwd()
  const files = { 'llms.txt': false, 'llms-full.txt': true } as const
  return {
    name: 'llms-txt',
    configResolved(config) {
      root = config.root
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.split('?')[0].replace(/^\//, '') as keyof typeof files
        if (!(name in files)) return next()
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(buildLlmsTxt(root, files[name]))
      })
    },
    generateBundle() {
      for (const [name, full] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName: name, source: buildLlmsTxt(root, full) })
      }
    },
  }
}
