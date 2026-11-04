import { useState, type MouseEvent, type ReactNode } from 'react';
import PixelCurtain from '@/components/ui/pixel-curtain';
import { cn } from '@/lib/utils';

interface PixelButtonProps {
	children: ReactNode;
	href?: string;
	onClick?: (event: MouseEvent) => void;
	className?: string;
	cursor?: string;
	type?: 'button' | 'submit';
	/** Open the link in a new tab (external sites). */
	external?: boolean;
	/** 'icon': small square button for arrows and ✕ */
	size?: 'default' | 'icon';
	/** Accessible name, needed when the button only shows a symbol. */
	label?: string;
	disabled?: boolean;
}

/**
 * The one button style of the site: white with black text, and on hover
 * (or keyboard focus) black pixel blocks fill it in random order while the
 * text turns white. Use it for every button so they all look and move alike.
 */
export default function PixelButton({
	children,
	href,
	onClick,
	className,
	cursor,
	type = 'button',
	external = false,
	size = 'default',
	label,
	disabled = false,
}: PixelButtonProps) {
	const [hover, setHover] = useState(false);
	const active = hover && !disabled;
	const icon = size === 'icon';
	const classes = cn(
		'group relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden border border-paper bg-paper uppercase outline-none transition-colors duration-200 [transition-timing-function:steps(2)] focus-visible:ring-1 focus-visible:ring-paper focus-visible:ring-offset-4 focus-visible:ring-offset-ink active:translate-y-px',
		icon ? 'h-9 w-9 shrink-0 text-sm' : 'gap-3 px-6 py-4 text-[11px] tracking-[0.2em]',
		className,
		active ? 'text-paper' : 'text-ink',
		disabled && 'cursor-default border-line bg-transparent text-stone active:translate-y-0'
	);
	const content = (
		<>
			<PixelCurtain
				covered={active}
				cols={icon ? 4 : 14}
				rows={icon ? 4 : 3}
				duration={260}
				cellClassName="bg-ink"
			/>
			<span className={cn('relative flex items-center', !icon && 'gap-3')}>{children}</span>
		</>
	);
	const handlers = {
		onMouseEnter: () => setHover(true),
		onMouseLeave: () => setHover(false),
		onFocus: () => setHover(true),
		onBlur: () => setHover(false),
		'aria-label': label,
		'data-cursor': cursor,
	};

	return href ? (
		<a
			href={href}
			onClick={onClick}
			className={classes}
			{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
			{...handlers}
		>
			{content}
		</a>
	) : (
		<button type={type} onClick={onClick} disabled={disabled} className={classes} {...handlers}>
			{content}
		</button>
	);
}
