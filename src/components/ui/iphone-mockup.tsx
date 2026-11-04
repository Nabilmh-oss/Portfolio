import { useEffect, useRef, useState } from 'react';
import type { IphoneColor } from '@/data/mockups';
import { cn } from '@/lib/utils';
import './iphone-mockup.css';

/** iPhone 16 (423 × 876, écran 393 × 852) mis à l'échelle de la largeur de son conteneur. */
const DEVICE_W = 423;

interface IphoneMockupProps {
	src: string;
	alt: string;
	color?: IphoneColor;
	className?: string;
}

export default function IphoneMockup({ src, alt, color = 'black', className }: IphoneMockupProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(0.5);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const fit = () => setScale(el.clientWidth / DEVICE_W);
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} className={cn('ip', className)} data-color={color}>
			<div className="ip-device" style={{ transform: `scale(${scale})` }}>
				<i className="ip-btn l ip-action" />
				<i className="ip-btn l ip-volup" />
				<i className="ip-btn l ip-voldn" />
				<i className="ip-btn r ip-power" />
				<i className="ip-btn r ip-camctl" />
				<div className="ip-body">
					<div className="ip-bezel" />
				</div>
				<div className="ip-screen">
					<img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} />
					<div className="ip-glass" />
					<div className="ip-island" />
					<div className="ip-home" />
				</div>
			</div>
		</div>
	);
}
