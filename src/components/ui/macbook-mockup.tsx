import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * MacBook dessiné à 1640 × 984 px puis mis à l'échelle de son conteneur.
 * L'écran (1440 × 900) défile verticalement pour parcourir une capture pleine page.
 * Styles : classes .mb-* dans src/index.css.
 */
const DEVICE_W = 1640;
const DEVICE_H = 984;

interface MacbookMockupProps {
	src: string;
	alt: string;
	className?: string;
}

export default function MacbookMockup({ src, alt, className }: MacbookMockupProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0.4);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const fit = () => setScale(Math.min(1, el.clientWidth / DEVICE_W));
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className={cn('relative w-full', className)} style={{ height: DEVICE_H * scale }}>
			<div className="mb-device" style={{ transform: `scale(${scale})` }}>
				<div className="mb-lid">
					<div className="mb-cam" />
					<div className="mb-screen" tabIndex={0} aria-label={`${alt} — faire défiler pour parcourir la page`}>
						<img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} />
					</div>
				</div>
				<div className="mb-base" />
			</div>
		</div>
	);
}
