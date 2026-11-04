import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface DecodeTextProps {
	text: string;
	as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div' | 'a';
	className?: string;
	/**
	 * Controls when the text decodes in. When omitted, it decodes the first
	 * time it scrolls into view.
	 */
	play?: boolean;
	/** Dissolves the text back into binary, then into nothing. */
	out?: boolean;
	delay?: number;
	duration?: number;
	/** Change this value to scramble and decode the text again (e.g. on hover). */
	replay?: number;
}

// A non-breaking space keeps the line width stable while nothing is shown
const BLANK = '\u00A0';
// Global tempo: <1 = faster. Durations and delays passed as props are scaled.
const TEMPO = 0.5;
const randomBit = () => (Math.random() < 0.5 ? '0' : '1');

const prefersReducedMotion = () =>
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Text that materialises as a stream of 0s and 1s before resolving,
 * character by character, into the real copy.
 */
export default function DecodeText({
	text,
	as: Tag = 'span',
	className,
	play,
	out = false,
	delay = 0,
	duration = 1000,
	replay = 0,
}: DecodeTextProps) {
	const ref = useRef<HTMLElement>(null);
	const [inView, setInView] = useState(false);
	const active = (play ?? inView) && !out;
	const shown = useRef(false);

	// Start blank so the real text never flashes before decoding
	useLayoutEffect(() => {
		if (!ref.current || prefersReducedMotion()) return;
		ref.current.textContent = text.replace(/\S/g, BLANK);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (play !== undefined || !ref.current) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [play]);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		if (prefersReducedMotion()) {
			el.textContent = out ? '' : text;
			return;
		}

		// Nothing to animate until the text has been revealed at least once
		if (!active && !shown.current) return;
		const wasShown = shown.current;
		shown.current = active;

		const total = duration * TEMPO;
		const chars = [...text];
		const n = Math.max(chars.length, 1);
		// Each character first turns into a bit, then settles on its final state
		const flipAt = chars.map((_, i) => (i / n) * total * 0.35);
		const settleAt = chars.map(
			(_, i) => total * 0.35 + (i / n) * total * 0.45 + Math.random() * total * 0.2
		);

		let frame = 0;
		let lastTick = 0;
		const start = performance.now() + delay * TEMPO;

		const render = (now: number) => {
			const t = now - start;
			if (t >= 0 && now - lastTick > 35) {
				lastTick = now;
				let done = true;
				el.textContent = chars
					.map((char, i) => {
						if (/\s/.test(char)) return char;
						if (t >= settleAt[i]) return active ? char : BLANK;
						done = false;
						if (t >= flipAt[i]) return randomBit();
						// Replays keep the text readable until it flips to binary
						return active && !wasShown ? BLANK : char;
					})
					.join('');
				if (done) return;
			}
			frame = requestAnimationFrame(render);
		};

		frame = requestAnimationFrame(render);
		return () => cancelAnimationFrame(frame);
	}, [active, out, text, delay, duration, replay]);

	return (
		<Tag className={cn('relative', className)} aria-label={text}>
			<span ref={ref} aria-hidden="true">
				{text}
			</span>
		</Tag>
	);
}
