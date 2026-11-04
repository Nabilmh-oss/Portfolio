import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

export interface LightboxImage {
	src: string;
	alt: string;
}

interface LightboxProps {
	images: LightboxImage[];
	/** Index of the image on screen, or null when closed. */
	index: number | null;
	onClose: () => void;
	onChange: (index: number) => void;
	/** Shown in the top bar, e.g. the project title. */
	title?: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const SWIPE = 50;

/**
 * Full-screen image viewer: the image at its largest size without cropping,
 * arrows / swipe to move between images, Esc / ✕ / tap outside to close.
 * Keyboard events are caught before the project window sees them.
 */
export default function Lightbox({ images, index, onClose, onChange, title }: LightboxProps) {
	const [visible, setVisible] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const closeRef = useRef<HTMLButtonElement>(null);
	const returnFocus = useRef<HTMLElement | null>(null);
	const swipe = useRef<{ x: number; y: number; id: number } | null>(null);
	const isOpen = index !== null;
	const total = images.length;

	const go = (step: number) => {
		if (index === null || total < 2) return;
		onChange((index + step + total) % total);
	};

	// Fade in, lock focus on the close button, give focus back when closing
	useEffect(() => {
		if (!isOpen) return;
		returnFocus.current = document.activeElement as HTMLElement | null;
		const frame = requestAnimationFrame(() => setVisible(true));
		closeRef.current?.focus({ preventScroll: true });
		return () => {
			cancelAnimationFrame(frame);
			setVisible(false);
			returnFocus.current?.focus({ preventScroll: true });
		};
	}, [isOpen]);

	useEffect(() => setLoaded(false), [index]);

	// Keys: handled in the capture phase so the project window underneath
	// doesn't close or switch project at the same time
	useEffect(() => {
		if (!isOpen) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
			else if (event.key === 'ArrowRight') go(1);
			else if (event.key === 'ArrowLeft') go(-1);
			else if (event.key === 'Tab') {
				const buttons = Array.from(document.querySelectorAll<HTMLElement>('[data-lightbox] button'));
				const i = buttons.indexOf(document.activeElement as HTMLElement);
				event.preventDefault();
				buttons[(i + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length]?.focus();
			} else return;
			event.stopPropagation();
		};
		window.addEventListener('keydown', onKey, true);
		return () => window.removeEventListener('keydown', onKey, true);
	});

	// Preload the neighbours so moving between images feels instant
	useEffect(() => {
		if (index === null || total < 2) return;
		for (const step of [1, -1]) {
			const img = new Image();
			img.src = images[(index + step + total) % total].src;
		}
	}, [index, images, total]);

	if (index === null || !images[index]) return null;
	const image = images[index];

	const onPointerDown = (event: ReactPointerEvent) => {
		if (event.pointerType === 'mouse') return;
		swipe.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
	};
	const onPointerUp = (event: ReactPointerEvent) => {
		const start = swipe.current;
		swipe.current = null;
		if (!start || start.id !== event.pointerId) return;
		const dx = event.clientX - start.x;
		const dy = event.clientY - start.y;
		if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
		else if (dy > SWIPE * 2 && Math.abs(dy) > Math.abs(dx)) onClose();
	};

	return createPortal(
		<div
			data-lightbox
			role="dialog"
			aria-modal="true"
			aria-label={`Image ${index + 1} sur ${total}${title ? ` — ${title}` : ''}`}
			className={cn(
				'fixed inset-0 z-[80] flex flex-col bg-ink/95 text-paper backdrop-blur-sm transition-opacity duration-200 [transition-timing-function:steps(4)]',
				visible ? 'opacity-100' : 'opacity-0'
			)}
		>
			{/* Top bar */}
			<div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-line px-3 text-[10px] uppercase tracking-[0.2em] md:h-14 md:px-5">
				<span className="min-w-0 truncate text-stone">
					<span className="tabular-nums text-paper">
						{pad(index + 1)} / {pad(total)}
					</span>
					{title && <span className="hidden sm:inline"> · {title}</span>}
				</span>
				<button
					ref={closeRef}
					type="button"
					onClick={onClose}
					aria-label="Fermer l’image"
					className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center border border-paper text-sm transition-colors duration-150 [transition-timing-function:steps(2)] hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-paper"
				>
					✕
				</button>
			</div>

			{/* Image area: a click on the empty space closes */}
			<div
				className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center p-3 md:p-8"
				onClick={(event) => event.target === event.currentTarget && onClose()}
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
				onPointerCancel={() => (swipe.current = null)}
			>
				<img
					key={image.src}
					src={image.src}
					alt={image.alt}
					onLoad={() => setLoaded(true)}
					draggable={false}
					className={cn(
						'max-h-full max-w-full select-none object-contain transition-opacity duration-200 [transition-timing-function:steps(3)]',
						loaded ? 'opacity-100' : 'opacity-0'
					)}
				/>
				{!loaded && (
					<span aria-hidden="true" className="pointer-events-none absolute text-[10px] uppercase tracking-[0.25em] text-stone">
						Chargement…
					</span>
				)}

				{total > 1 && (
					<>
						<NavButton side="left" onClick={() => go(-1)} label="Image précédente">
							←
						</NavButton>
						<NavButton side="right" onClick={() => go(1)} label="Image suivante">
							→
						</NavButton>
					</>
				)}
			</div>

			{/* Caption */}
			<div className="flex min-h-10 shrink-0 items-center justify-between gap-4 border-t border-line px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-stone md:px-5">
				<span className="min-w-0 truncate">{image.alt}</span>
				<span className="hidden shrink-0 md:block">[←] [→] naviguer · [Esc] fermer</span>
				{total > 1 && <span className="shrink-0 md:hidden">Glisser pour naviguer</span>}
			</div>
		</div>,
		document.body
	);
}

function NavButton({
	side,
	onClick,
	label,
	children,
}: {
	side: 'left' | 'right';
	onClick: () => void;
	label: string;
	children: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className={cn(
				'absolute top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center border border-paper bg-ink/70 text-sm text-paper transition-colors duration-150 [transition-timing-function:steps(2)] hover:bg-paper hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-paper active:translate-y-[calc(-50%+1px)] md:h-12 md:w-12',
				side === 'left' ? 'left-2 md:left-5' : 'right-2 md:right-5'
			)}
		>
			{children}
		</button>
	);
}
