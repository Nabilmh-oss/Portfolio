import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import DecodeText from '@/components/ui/decode-text';
import PixelButton from '@/components/ui/pixel-button';
import PixelCurtain from '@/components/ui/pixel-curtain';
import PixelImage from '@/components/ui/pixel-image';
import MacbookMockup from '@/components/ui/macbook-mockup';
import MacbookCarousel from '@/components/ui/macbook-carousel';
import IphoneStrip from '@/components/ui/iphone-strip';
import Lightbox, { type LightboxImage } from '@/components/ui/lightbox';
import { mockupMediaCount, mockups } from '@/data/mockups';
import { imageUrl, projects } from '@/data/projects';
import { cn } from '@/lib/utils';

interface ProjectModalProps {
	/** Index of the open project, or null when closed. */
	index: number | null;
	onClose: () => void;
	onNavigate: (index: number) => void;
}

const CURTAIN_MS = 280;
const pad = (n: number) => String(n).padStart(2, '0');

export default function ProjectModal({ index, onClose, onNavigate }: ProjectModalProps) {
	// The project on screen lags behind `index` so open/close/switch can animate
	const [shown, setShown] = useState<number | null>(null);
	const [covered, setCovered] = useState(true);
	const [backdrop, setBackdrop] = useState(false);
	const [maximized, setMaximized] = useState(false);
	const [zoomed, setZoomed] = useState<number | null>(null);
	const shownRef = useRef<number | null>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const returnFocus = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const current = shownRef.current;
		const timers: number[] = [];
		const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

		if (index !== null && current === null) {
			// Open: blocks cover the window, then dissolve away
			returnFocus.current = document.activeElement as HTMLElement | null;
			shownRef.current = index;
			setShown(index);
			setCovered(true);
			later(() => {
				setBackdrop(true);
				setCovered(false);
			}, 30);
		} else if (index !== null && current !== null && index !== current) {
			// Switch project: cover, swap content, uncover
			setCovered(true);
			later(() => {
				shownRef.current = index;
				setShown(index);
				bodyRef.current?.scrollTo(0, 0);
				setCovered(false);
			}, CURTAIN_MS);
		} else if (index === null && current !== null) {
			// Close: cover, then unmount
			setCovered(true);
			setBackdrop(false);
			later(() => {
				shownRef.current = null;
				setShown(null);
				setMaximized(false);
				returnFocus.current?.focus({ preventScroll: true });
			}, CURTAIN_MS + 60);
		}

		return () => timers.forEach((t) => window.clearTimeout(t));
	}, [index]);

	const isOpen = shown !== null;

	// Close the full-screen viewer when the project changes or the window closes
	useEffect(() => setZoomed(null), [index]);

	// Lock the page behind the popup
	useEffect(() => {
		if (!isOpen) return;
		document.documentElement.classList.add('overflow-hidden');
		closeRef.current?.focus({ preventScroll: true });
		return () => document.documentElement.classList.remove('overflow-hidden');
	}, [isOpen]);

	// Keyboard: Esc closes, arrows navigate, Tab stays inside the window
	useEffect(() => {
		if (!isOpen) return;
		const total = projects.length;

		const onKey = (event: KeyboardEvent) => {
			const current = shownRef.current ?? 0;
			if (event.key === 'Escape') onClose();
			else if (event.key === 'ArrowRight') onNavigate((current + 1) % total);
			else if (event.key === 'ArrowLeft') onNavigate((current - 1 + total) % total);
			else if (event.key === 'Tab' && dialogRef.current) {
				const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
					'button, a[href], [tabindex]:not([tabindex="-1"])'
				);
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (event.shiftKey && document.activeElement === first) {
					event.preventDefault();
					last?.focus();
				} else if (!event.shiftKey && document.activeElement === last) {
					event.preventDefault();
					first?.focus();
				}
			}
		};

		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [isOpen, onClose, onNavigate]);

	if (shown === null) return null;

	const project = projects[shown];
	const total = projects.length;
	const prev = (shown - 1 + total) % total;
	const next = (shown + 1) % total;
	const fileName = `PROJET_${pad(shown + 1)}.EXE`;
	const projectMockups = mockups[project.slug] ?? [];
	const mediaCount = project.gallery.length + 1 + mockupMediaCount(projectMockups);

	// Images that open full screen: the cover, then the gallery photos (not videos)
	const zoomable: LightboxImage[] = [
		{ src: project.cover.src, alt: project.cover.alt || project.title },
		...project.gallery
			.filter((image) => !image.type || image.type === 'image')
			.map((image, i) => ({ src: image.src, alt: image.alt || `${project.title} — image ${pad(i + 1)}` })),
	];
	const zoomIndex = (src: string) => zoomable.findIndex((image) => image.src === src);

	// Link details (Lien, GitHub…) become buttons instead of raw URLs in the list
	const isLink = (d: { label: string; value: string }) =>
		/^(lien|site|url|github)$/i.test(d.label.trim()) || /^https?:\/\//i.test(d.value.trim());
	const toHref = (v: string) => (/^https?:\/\//i.test(v.trim()) ? v.trim() : `https://${v.trim()}`);
	const linkLabel = (d: { label: string; value: string }) => {
		const v = d.value.toLowerCase();
		if (/^github$/i.test(d.label.trim()) || v.includes('github.com')) return 'Voir sur GitHub';
		if (v.includes('figma.com')) return 'Voir la maquette';
		if (v.includes('drive.google.com') || v.includes('youtu') || v.includes('vimeo.com')) return 'Voir la vidéo';
		return 'Voir le site';
	};
	const links = project.details.filter(isLink).map((d) => ({ href: toHref(d.value), text: linkLabel(d) }));
	const specs = [
		...(project.year ? [['Année', String(project.year)]] : []),
		['Catégorie', project.category],
		...project.details.filter((d) => !isLink(d)).map((d) => [d.label, d.value]),
	];

	return createPortal(
		<div className="fixed inset-0 z-[70] flex items-center justify-center p-2 md:p-6">
			{/* Backdrop */}
			<button
				type="button"
				aria-label="Fermer le projet"
				tabIndex={-1}
				onClick={onClose}
				className={cn(
					'absolute inset-0 cursor-default bg-ink/85 backdrop-blur-sm transition-opacity duration-300',
					backdrop ? 'opacity-100' : 'opacity-0'
				)}
			/>

			{/* Window */}
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="project-title"
				className={cn(
					'relative flex h-full w-full flex-col overflow-hidden border border-paper bg-ink transition-[max-width,max-height] duration-300',
					maximized ? 'max-h-full max-w-full' : 'max-h-[92svh] max-w-6xl'
				)}
			>
				{/* Title bar */}
				<div className="flex h-10 shrink-0 items-center justify-between gap-4 border-b border-paper bg-paper px-3 text-[11px] uppercase tracking-[0.2em] text-ink">
					<span className="flex items-center gap-2 font-medium">
						<span className="h-2.5 w-2.5 bg-ink" aria-hidden="true" />
						{fileName}
					</span>
					<span className="hidden truncate text-ink/60 md:block">
						~/travaux/{project.slug} — {mediaCount} fichiers
					</span>
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={onClose}
							aria-label="Réduire"
							className="grid h-6 w-6 cursor-pointer place-items-center border border-ink hover:bg-ink hover:text-paper"
						>
							_
						</button>
						<button
							type="button"
							onClick={() => setMaximized((m) => !m)}
							aria-label={maximized ? 'Restaurer la fenêtre' : 'Agrandir la fenêtre'}
							className="hidden h-6 w-6 cursor-pointer place-items-center border border-ink hover:bg-ink hover:text-paper md:grid"
						>
							□
						</button>
						<button
							ref={closeRef}
							type="button"
							onClick={onClose}
							aria-label="Fermer"
							className="grid h-6 w-6 cursor-pointer place-items-center border border-ink hover:bg-ink hover:text-paper"
						>
							×
						</button>
					</div>
				</div>

				{/* Content */}
				<div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
					<div className="grid gap-px bg-line md:grid-cols-[1fr_minmax(320px,380px)] md:grid-rows-[auto_1fr]">
						{/* Cover */}
						<div className="bg-ink p-3 md:col-start-1 md:row-start-1 md:p-4">
							<ZoomButton onClick={() => setZoomed(0)} label={project.cover.alt || project.title}>
								<PixelImage
									key={project.cover.src}
									src={imageUrl(project.cover.src, 1600)}
									alt={project.cover.alt}
									immediate
									className="aspect-[3/2] w-full"
								/>
							</ZoomButton>
							<p className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-stone">
								<span>{project.cover.alt}</span>
								<span>00</span>
							</p>
						</div>

						{/* Info */}
						<aside className="min-w-0 bg-ink p-5 md:col-start-2 md:row-span-2 md:row-start-1 md:p-7">
							<div className="md:sticky md:top-7">
								<p className="text-[11px] uppercase tracking-[0.25em] text-stone">
									Projet {pad(shown + 1)} / {pad(total)}
								</p>
								<h2 id="project-title" className="mt-6 font-pixel text-5xl uppercase leading-[0.9] tracking-tight md:text-6xl">
									<DecodeText text={project.title} play={!covered} duration={1000} />
								</h2>
								<p className="mt-5 text-sm leading-relaxed text-paper">
									<DecodeText text={project.summary} play={!covered} delay={200} duration={1100} />
								</p>
								<div className="mt-5 space-y-3 text-[13px] leading-relaxed text-paper/70">
									{project.description.map((paragraph) => (
										<p key={paragraph}>{paragraph}</p>
									))}
								</div>

								<dl className="mt-8 border-t border-line text-[11px] uppercase tracking-[0.15em]">
									{specs.map(([label, value]) => (
										<div key={label} className="flex justify-between gap-4 border-b border-dashed border-line py-2.5">
											<dt className="text-stone">{label}</dt>
											<dd className="min-w-0 text-right [overflow-wrap:anywhere]">{value}</dd>
										</div>
									))}
								</dl>

								{links.length > 0 && (
									<div className="mt-8 grid gap-2">
										{links.map((link, i) => (
											<PixelButton
												key={link.href}
												href={link.href}
												external
												className={cn('w-full', i === 0 && 'bg-paper')}
											>
												{link.text}
												<span aria-hidden="true">↗</span>
											</PixelButton>
										))}
									</div>
								)}

								<div className={cn('grid grid-cols-2 gap-2', links.length ? 'mt-2' : 'mt-8')}>
									<PixelButton onClick={() => onNavigate(prev)} className="px-3" cursor="Précédent">
										← Préc.
									</PixelButton>
									<PixelButton onClick={() => onNavigate(next)} className="px-3" cursor="Suivant">
										Suiv. →
									</PixelButton>
								</div>
								<p className="mt-3 truncate text-[10px] uppercase tracking-[0.2em] text-stone">
									Suivant : {projects[next].title}
								</p>
							</div>
						</aside>

						{/* Gallery */}
						<div className="grid grid-cols-2 gap-3 bg-ink p-3 md:col-start-1 md:row-start-2 md:gap-4 md:p-4 md:pt-0">
							{/* Site en ligne : MacBook dont l'écran défile */}
							{projectMockups.map((mockup) =>
								mockup.type === 'phones' ? (
									<figure key={`phones-${mockup.label}`} className="col-span-2 pb-6 pt-2 md:pb-10">
										<IphoneStrip key={project.slug} slides={mockup.slides} label={mockup.label} color={mockup.color} />
									</figure>
								) : mockup.type === 'carousel' ? (
									<figure key={`carousel-${mockup.label}`} className="col-span-2 pb-6 pt-2 md:pb-10">
										<MacbookCarousel key={project.slug} slides={mockup.slides} label={mockup.label} dark={mockup.dark} />
									</figure>
								) : (
									<figure key={mockup.src} className="col-span-2 pb-4 pt-2 md:pb-6">
										<MacbookMockup src={mockup.src} alt={mockup.alt} />
										<figcaption className="mt-5 flex justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-stone">
											<span>{mockup.label}</span>
											<span className="shrink-0">↕ défiler l'écran</span>
										</figcaption>
									</figure>
								)
							)}
							{project.gallery.map((image, i) => {
								// Videos always take the full width, in 16:9
								const wide = i % 3 === 0 || image.type === 'video' || image.type === 'embed';
								return (
								<figure key={image.src} className={wide ? 'col-span-2' : undefined}>
									{image.type === 'embed' ? (
										<div className="relative aspect-video w-full overflow-hidden bg-line">
											<iframe
												src={image.src}
												title={image.alt || `Vidéo ${i + 1} — ${project.title}`}
												allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
												allowFullScreen
												loading="lazy"
												className="absolute inset-0 h-full w-full border-0"
											/>
										</div>
									) : image.type === 'video' ? (
										<video
											src={image.src}
											aria-label={image.alt || `Vidéo ${i + 1} — ${project.title}`}
											className="aspect-video w-full bg-line object-cover"
											autoPlay
											muted
											loop
											playsInline
											controls
											preload="metadata"
										/>
									) : (
										<ZoomButton onClick={() => setZoomed(zoomIndex(image.src))} label={image.alt || `image ${pad(i + 1)}`}>
											<PixelImage
												src={imageUrl(image.src, wide ? 1600 : 900)}
												alt={image.alt}
												className={wide ? 'aspect-[16/9] w-full' : 'aspect-[4/5] w-full'}
											/>
										</ZoomButton>
									)}
									<figcaption className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-stone">
										<span>{image.alt}</span>
										<span>{image.type === 'video' || image.type === 'embed' ? `▶ ${pad(i + 1)}` : pad(i + 1)}</span>
									</figcaption>
								</figure>
								);
							})}
						</div>
					</div>
				</div>

				{/* Status bar */}
				<div className="flex h-8 shrink-0 items-center justify-between gap-4 border-t border-line px-3 text-[10px] uppercase tracking-[0.2em] text-stone">
					<span className="flex items-center gap-2">
						<span className="h-1.5 w-1.5 animate-blink bg-accent" />
						{mediaCount} médias
					</span>
					<span className="hidden md:block">[←] [→] naviguer · [Esc] fermer</span>
				</div>

				{/* Pixel dissolve over the whole window */}
				<PixelCurtain covered={covered} cols={20} rows={12} duration={CURTAIN_MS - 60} className="z-10" />
			</div>

			<Lightbox images={zoomable} index={zoomed} onClose={() => setZoomed(null)} onChange={setZoomed} title={project.title} />
		</div>,
		document.body
	);
}

/** Wraps an image so a click opens it full screen. */
function ZoomButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={`Voir en plein écran : ${label}`}
			className="group/zoom relative block w-full cursor-zoom-in text-left outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-paper"
		>
			{children}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute right-2 top-2 border border-paper bg-ink/80 px-1.5 py-1 text-[9px] uppercase tracking-[0.2em] text-paper opacity-0 transition-opacity duration-200 [transition-timing-function:steps(3)] group-hover/zoom:opacity-100 group-focus-visible/zoom:opacity-100 [@media(hover:none)]:opacity-100"
			>
				⤢ Plein écran
			</span>
		</button>
	);
}
