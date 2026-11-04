import type { ReactNode } from 'react';
import SiteFooter from '@/components/site-footer';
import SiteHeader from '@/components/site-header';
import DecodeText from '@/components/ui/decode-text';
import PixelButton from '@/components/ui/pixel-button';
import PixelEdgeImage from '@/components/ui/pixel-edge-image';
import Reveal from '@/components/ui/reveal';
import { media } from '@/data/media';
import { ABOUT, COPY, SITE } from '@/data/site';

const pad = (n: number) => String(n).padStart(2, '0');

/** One block of the page: number + title on the left, content on the right. */
function Block({ index, title, children }: { index: number; title: string; children: ReactNode }) {
	return (
		<section className="border-t border-line">
			<div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-12">
				<div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
					<p className="text-[11px] tabular-nums uppercase tracking-[0.25em] text-label">[{pad(index)}]</p>
					<h2 className="mt-4 font-pixel text-[clamp(2rem,5vw,3.25rem)] uppercase leading-[0.95] tracking-tight">
						<DecodeText text={title} duration={1000} />
					</h2>
				</div>
				<div className="lg:col-span-7 lg:col-start-6">{children}</div>
			</div>
		</section>
	);
}

function Paragraphs({ items }: { items: readonly string[] }) {
	return (
		<div className="max-w-2xl space-y-6 text-base leading-relaxed text-paper/80 md:text-lg">
			{items.map((text, i) => (
				<Reveal key={text} delay={i * 120}>
					<p>{text}</p>
				</Reveal>
			))}
		</div>
	);
}

export default function AboutPage() {
	let block = 0;

	return (
		<>
			<SiteHeader />

			<main id="top" className="relative z-10 bg-ink pt-16 text-paper md:pt-20">
				{/* Intro */}
				<section>
					<div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24 lg:grid-cols-12 lg:gap-12">
						<div className="lg:col-span-7">
							<DecodeText as="p" text={ABOUT.label} className="text-[11px] uppercase tracking-[0.25em] text-label" />
							<h1 className="mt-6 font-pixel text-[clamp(2.75rem,9vw,7rem)] uppercase leading-[0.88] tracking-tight lg:text-[clamp(2.75rem,6.2vw,7rem)]">
								{ABOUT.title.map((line, i) => (
									<DecodeText key={line} text={line} className="block" delay={i * 180} duration={1200 + i * 100} />
								))}
							</h1>
							<p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-stone">{ABOUT.role}</p>
							<Reveal delay={200}>
								<p className="mt-10 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg">{ABOUT.intro}</p>
							</Reveal>
							<Reveal delay={300} className="mt-10 flex flex-col gap-3 sm:flex-row">
								<PixelButton href="/#contact" className="bg-paper text-ink" cursor="Écrire">
									{ABOUT.goal.cta} <span aria-hidden="true">↗</span>
								</PixelButton>
								<PixelButton href="/#travaux" cursor="Voir">
									Voir les projets <span aria-hidden="true">→</span>
								</PixelButton>
							</Reveal>
						</div>

						<div className="mx-auto w-full max-w-md lg:col-span-4 lg:col-start-9 lg:max-w-none">
							<PixelEdgeImage
								src={media.about.src}
								alt={media.about.alt || SITE.name}
								protect={COPY.about.face}
								className="aspect-[4/5] w-full"
							/>
						</div>
					</div>
				</section>

				{/* Parcours, façon de travailler, expérience */}
				{ABOUT.sections.map((section) => (
					<Block key={section.title} index={++block} title={section.title}>
						<Paragraphs items={section.paragraphs} />
					</Block>
				))}

				{/* Compétences + langues */}
				<Block index={++block} title="Compétences">
					<div className="grid gap-px border border-line bg-line sm:grid-cols-2">
						{ABOUT.skills.map((group, i) => (
							<Reveal key={group.title} delay={i * 80} className="h-full">
								<div className="h-full bg-ink p-6 md:p-8">
									<p className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-stone">
										<span aria-hidden="true" className="h-1.5 w-1.5 bg-accent" />
										{group.title}
									</p>
									<ul className="mt-5 space-y-2 text-sm text-paper/85 md:text-[15px]">
										{group.items.map((item) => (
											<li key={item}>{item}</li>
										))}
									</ul>
								</div>
							</Reveal>
						))}
					</div>

					<p className="mt-12 text-[10px] uppercase tracking-[0.25em] text-stone">Langues</p>
					<dl className="mt-4 grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
						{ABOUT.languages.map((language) => (
							<div key={language.name} className="flex flex-col gap-3 border-b border-r border-line p-5">
								<dt className="text-[13px] text-paper">{language.name}</dt>
								<dd className="font-pixel text-xl uppercase leading-none md:text-2xl">{language.level || '—'}</dd>
							</div>
						))}
					</dl>
				</Block>

				<Block index={++block} title={ABOUT.interests.title}>
					<Paragraphs items={[ABOUT.interests.text]} />
				</Block>

				{/* Objectif */}
				<section className="border-t border-line">
					<div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 py-24 text-center md:px-10 md:py-36">
						<DecodeText as="p" text="[Travail de Bachelor]" className="text-[11px] uppercase tracking-[0.25em] text-label" />
						<h2 className="mt-6 font-pixel text-[clamp(2.5rem,7.5vw,6.5rem)] uppercase leading-[0.9] tracking-tight">
							{ABOUT.goal.title.map((line, i) => (
								<DecodeText key={line} text={line} className="block" delay={i * 200} duration={1200} />
							))}
						</h2>
						<Reveal delay={150}>
							<p className="mt-8 max-w-2xl text-base leading-relaxed text-paper/80 md:text-lg">{ABOUT.goal.text}</p>
						</Reveal>
						<Reveal delay={250} className="mt-10 flex flex-col gap-3 sm:flex-row">
							<PixelButton href="/#contact" className="bg-paper text-ink" cursor="Écrire">
								{ABOUT.goal.cta} <span aria-hidden="true">↗</span>
							</PixelButton>
							<PixelButton href={SITE.linkedin} external cursor="LinkedIn">
								LinkedIn <span aria-hidden="true">↗</span>
							</PixelButton>
						</Reveal>
					</div>
				</section>
			</main>

			<SiteFooter />

			{/* Film grain over the whole site */}
			<div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[60] opacity-[0.07]" />
		</>
	);
}
