import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import './macbook-carousel.css';
import type { MockupSlide } from '@/data/mockups';
import { cn } from '@/lib/utils';

/**
 * MacBook (1640 × 984, mis à l'échelle) dont l'écran fait défiler des captures
 * horizontalement. Les captures viennent du tableau `slides` (src/data/mockups.ts).
 * Navigation : boutons, points, glisser, flèches du clavier quand le carrousel a le focus.
 * Styles du MacBook : classes .mb-* dans src/index.css.
 */
const DEVICE_W = 1640;
const DEVICE_H = 984;
const SWIPE = 0.12; // part de la largeur à glisser pour changer de capture
const pad = (n: number) => String(n).padStart(2, '0');

interface MacbookCarouselProps {
	slides: MockupSlide[];
	/** Nom du site, pour les descriptions accessibles. */
	label?: string;
	dark?: boolean;
	className?: string;
}

export default function MacbookCarousel({ slides, label, dark, className }: MacbookCarouselProps) {
	const stageRef = useRef<HTMLDivElement>(null);
	const screenRef = useRef<HTMLDivElement>(null);
	const drag = useRef<{ x: number; dx: number; id: number } | null>(null);
	const [scale, setScale] = useState(0.4);
	const [index, setIndex] = useState(0);
	const [offset, setOffset] = useState(0); // décalage en % pendant le glisser
	// Captures déjà demandées : on ne charge que la courante et ses voisines
	const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1, slides.length - 1]));

	const total = slides.length;
	const current = slides[index];

	useEffect(() => {
		const el = stageRef.current;
		if (!el) return;
		const fit = () => setScale(Math.min(1, el.clientWidth / DEVICE_W));
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		setLoaded((prev) => {
			const wanted = [index, (index + 1) % total, (index - 1 + total) % total];
			if (wanted.every((i) => prev.has(i))) return prev;
			return new Set([...prev, ...wanted]);
		});
	}, [index, total]);

	const goTo = (i: number) => setIndex(((i % total) + total) % total);
	const next = () => goTo(index + 1);
	const prev = () => goTo(index - 1);

	// Les flèches pilotent le carrousel (et non la navigation entre projets) quand il a le focus
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			event.stopPropagation();
			event.nativeEvent.stopImmediatePropagation();
			if (event.key === 'ArrowRight') next();
			else prev();
		}
	};

	const onPointerDown = (event: PointerEvent) => {
		if (event.pointerType === 'mouse' && event.button !== 0) return;
		drag.current = { x: event.clientX, dx: 0, id: event.pointerId };
		screenRef.current?.setPointerCapture(event.pointerId);
	};
	const onPointerMove = (event: PointerEvent) => {
		if (!drag.current) return;
		const width = screenRef.current?.getBoundingClientRect().width || 1;
		drag.current.dx = event.clientX - drag.current.x;
		setOffset((drag.current.dx / width) * 100);
	};
	const endDrag = () => {
		if (!drag.current) return;
		const width = screenRef.current?.getBoundingClientRect().width || 1;
		const { dx } = drag.current;
		drag.current = null;
		setOffset(0);
		if (Math.abs(dx) > width * SWIPE) (dx < 0 ? next : prev)();
	};

	if (!total) return null;

	return (
		<div
			className={cn('relative w-full', className)}
			role="region"
			aria-roledescription="carrousel"
			aria-label={label ? `Captures du site ${label}` : 'Captures du site'}
			onKeyDown={onKeyDown}
		>
			{/* MacBook */}
			<div ref={stageRef} className="relative w-full" style={{ height: DEVICE_H * scale }}>
				<div className={cn('mb-device', dark && 'mb-dark')} style={{ transform: `scale(${scale})` }}>
					<div className="mb-lid">
						<div className="mb-cam" />
						<div
							ref={screenRef}
							className="mb-carousel-screen"
							tabIndex={0}
							data-cursor="Glisser"
							aria-label="Écran : glisser ou utiliser les flèches pour changer de capture"
							onPointerDown={onPointerDown}
							onPointerMove={onPointerMove}
							onPointerUp={endDrag}
							onPointerCancel={endDrag}
						>
							<div
								className={cn('mb-carousel-track', offset !== 0 && 'is-dragging')}
								style={{ transform: `translateX(calc(${-index * 100}% + ${offset}%))` }}
							>
								{slides.map((slide, i) => (
									<figure
										key={slide.src}
										className="mb-carousel-slide"
										role="group"
										aria-roledescription="capture"
										aria-label={`${i + 1} sur ${total}`}
										aria-hidden={i !== index}
									>
										{loaded.has(i) && (
											<img
												src={slide.src}
												alt={slide.alt || `${label ? label + ' — ' : ''}${slide.label}`}
												decoding="async"
												draggable={false}
											/>
										)}
									</figure>
								))}
							</div>
						</div>
					</div>
					<div className="mb-base" />
				</div>
			</div>

			{total > 1 && (
				<>
					{/* Numéro + légende, au-dessus des boutons (hauteur fixe) */}
					<p
						className="mt-6 flex h-4 items-baseline justify-center gap-3 overflow-hidden whitespace-nowrap text-[10px] uppercase leading-4 tracking-[0.2em] md:mt-8"
						aria-live="polite"
					>
						<span className="tabular-nums text-paper">
							{pad(index + 1)} / {pad(total)}
						</span>
						<span className="truncate text-stone">{current.label}</span>
					</p>

					{/* Boutons : largeur fixe, ils ne bougent jamais */}
					<div className="mx-auto mt-3 flex w-max items-center gap-3 border border-line p-1.5">
						<CarouselButton onClick={prev} label="Capture précédente" cursor="Précédent">
							←
						</CarouselButton>
						<div
							className="hidden shrink-0 items-center gap-1.5 sm:flex"
							style={{ width: total * 8 + 16 + (total - 1) * 6 }}
							role="group"
							aria-label="Choisir une capture"
						>
							{slides.map((slide, i) => (
								<button
									key={slide.src}
									type="button"
									onClick={() => goTo(i)}
									aria-label={`Aller à la capture ${i + 1} : ${slide.label}`}
									aria-current={i === index}
									data-cursor={slide.label}
									className={cn(
										'h-2 shrink-0 cursor-pointer transition-[width,background-color] duration-300 [transition-timing-function:steps(4)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-paper',
										i === index ? 'w-6 bg-accent' : 'w-2 bg-stone/50 hover:bg-paper'
									)}
								/>
							))}
						</div>
						<CarouselButton onClick={next} label="Capture suivante" cursor="Suivant">
							→
						</CarouselButton>
					</div>
				</>
			)}
		</div>
	);
}

function CarouselButton({
	onClick,
	label,
	cursor,
	children,
}: {
	onClick: () => void;
	label: string;
	cursor: string;
	children: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			data-cursor={cursor}
			className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center border border-paper text-sm text-paper transition-colors duration-150 [transition-timing-function:steps(2)] hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-paper active:translate-y-px"
		>
			{children}
		</button>
	);
}
