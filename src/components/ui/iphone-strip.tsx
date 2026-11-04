import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import IphoneMockup from '@/components/ui/iphone-mockup';
import type { IphoneColor, MockupSlide } from '@/data/mockups';
import { cn } from '@/lib/utils';

/**
 * Rangée d'iPhone 16 qu'on fait défiler horizontalement : boutons, glisser
 * (souris, doigt, trackpad), flèches du clavier quand la rangée a le focus.
 * Numéro + nom de l'écran au-dessus des boutons, boutons fixes.
 * Les écrans viennent du tableau `slides` (src/data/mockups.ts).
 */
const pad = (n: number) => String(n).padStart(2, '0');

interface IphoneStripProps {
	slides: MockupSlide[];
	label?: string;
	color?: IphoneColor;
	className?: string;
}

export default function IphoneStrip({ slides, label, color, className }: IphoneStripProps) {
	const stripRef = useRef<HTMLDivElement>(null);
	const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
	const [index, setIndex] = useState(0);
	const [atEnd, setAtEnd] = useState(false);
	const total = slides.length;

	/** Distance entre deux iPhone (largeur + espace). */
	const step = () => {
		const strip = stripRef.current;
		const items = strip?.children;
		if (!strip || !items || items.length < 2) return strip?.clientWidth ?? 1;
		return (items[1] as HTMLElement).offsetLeft - (items[0] as HTMLElement).offsetLeft;
	};

	const sync = useCallback(() => {
		const strip = stripRef.current;
		if (!strip) return;
		const i = Math.min(total - 1, Math.round(strip.scrollLeft / step()));
		setIndex(i);
		setAtEnd(i >= total - 1);
	}, [total]);

	useEffect(() => {
		const strip = stripRef.current;
		if (!strip) return;
		sync();
		strip.addEventListener('scroll', sync, { passive: true });
		const observer = new ResizeObserver(sync);
		observer.observe(strip);
		return () => {
			strip.removeEventListener('scroll', sync);
			observer.disconnect();
		};
	}, [sync]);

	const goTo = (i: number) => {
		const strip = stripRef.current;
		if (!strip) return;
		strip.scrollTo({ left: Math.max(0, Math.min(total - 1, i)) * step() });
	};
	const prev = () => goTo(index - 1);
	const next = () => goTo(index + 1);

	// Les flèches font défiler la rangée (et non changer de projet) quand elle a le focus
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
		event.preventDefault();
		event.stopPropagation();
		event.nativeEvent.stopImmediatePropagation();
		if (event.key === 'ArrowRight') next();
		else prev();
	};

	// Glisser à la souris (le doigt et le trackpad défilent nativement)
	const onPointerDown = (event: PointerEvent) => {
		if (event.pointerType !== 'mouse' || event.button !== 0 || !stripRef.current) return;
		drag.current = { x: event.clientX, left: stripRef.current.scrollLeft, moved: false };
	};
	const onPointerMove = (event: PointerEvent) => {
		const strip = stripRef.current;
		if (!drag.current || !strip) return;
		const dx = event.clientX - drag.current.x;
		if (!drag.current.moved && Math.abs(dx) > 4) {
			drag.current.moved = true;
			strip.classList.add('is-dragging');
			strip.setPointerCapture(event.pointerId);
		}
		if (drag.current.moved) strip.scrollLeft = drag.current.left - dx;
	};
	const endDrag = () => {
		const strip = stripRef.current;
		if (!drag.current || !strip) return;
		const moved = drag.current.moved;
		drag.current = null;
		if (!moved) return;
		strip.classList.remove('is-dragging');
		goTo(Math.round(strip.scrollLeft / step())); // se cale sur l'iPhone le plus proche
	};

	if (!total) return null;

	return (
		<div
			className={cn('relative w-full', className)}
			role="region"
			aria-roledescription="carrousel"
			aria-label={label ? `Écrans de l'application ${label}` : "Écrans de l'application"}
			onKeyDown={onKeyDown}
		>
			<div
				ref={stripRef}
				className="ip-strip"
				tabIndex={0}
				data-cursor="Glisser"
				aria-label="Faire défiler les écrans avec les flèches"
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
			>
				{slides.map((slide, i) => (
					<figure key={slide.src} className="ip-strip-item" aria-label={`${i + 1} sur ${total}`}>
						<IphoneMockup
							src={slide.src}
							alt={slide.alt || `${label ? label + ' — ' : ''}${slide.label}`}
							color={color}
						/>
					</figure>
				))}
			</div>

			{total > 1 && (
				<>
					{/* Numéro + nom de l'écran, au-dessus des boutons (hauteur fixe) */}
					<p
						className="mt-2 flex h-4 items-baseline justify-center gap-3 overflow-hidden whitespace-nowrap text-[10px] uppercase leading-4 tracking-[0.2em]"
						aria-live="polite"
					>
						<span className="tabular-nums text-paper">
							{pad(index + 1)} / {pad(total)}
						</span>
						<span className="truncate text-stone">{slides[index].label}</span>
					</p>

					{/* Boutons : largeur fixe, ils ne bougent jamais */}
					<div className="mx-auto mt-3 flex w-max items-center gap-3 border border-line p-1.5">
						<StripButton onClick={prev} disabled={index === 0} label="Écran précédent" cursor="Précédent">
							←
						</StripButton>
						<div
							className="hidden shrink-0 items-center gap-1.5 sm:flex"
							style={{ width: total * 8 + 16 + (total - 1) * 6 }}
							role="group"
							aria-label="Choisir un écran"
						>
							{slides.map((slide, i) => (
								<button
									key={slide.src}
									type="button"
									onClick={() => goTo(i)}
									aria-label={`Aller à l'écran ${i + 1} : ${slide.label}`}
									aria-current={i === index}
									data-cursor={slide.label}
									className={cn(
										'h-2 shrink-0 cursor-pointer transition-[width,background-color] duration-300 [transition-timing-function:steps(4)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-paper',
										i === index ? 'w-6 bg-accent' : 'w-2 bg-stone/50 hover:bg-paper'
									)}
								/>
							))}
						</div>
						<StripButton onClick={next} disabled={atEnd} label="Écran suivant" cursor="Suivant">
							→
						</StripButton>
					</div>
				</>
			)}
		</div>
	);
}

function StripButton({
	onClick,
	disabled,
	label,
	cursor,
	children,
}: {
	onClick: () => void;
	disabled: boolean;
	label: string;
	cursor: string;
	children: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
			data-cursor={cursor}
			className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center border border-paper text-sm text-paper transition-colors duration-150 [transition-timing-function:steps(2)] hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-paper active:translate-y-px disabled:cursor-default disabled:border-line disabled:text-stone disabled:hover:bg-transparent"
		>
			{children}
		</button>
	);
}
