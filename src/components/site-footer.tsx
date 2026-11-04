import { useEffect, useState } from 'react';
import Marquee from '@/components/ui/marquee';
import PixelLogo from '@/components/ui/pixel-logo';
import { COPY, NAV, SITE } from '@/data/site';
import { isHomePage, navHref } from '@/lib/nav';
import { scrollToSection } from '@/lib/scroll';

function LausanneClock() {
	const [now, setNow] = useState(() => new Date());
	useEffect(() => {
		const id = window.setInterval(() => setNow(new Date()), 1000);
		return () => window.clearInterval(id);
	}, []);
	return (
		<span className="tabular-nums">
			{new Intl.DateTimeFormat('fr-FR', {
				timeZone: 'Europe/Zurich',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			}).format(now)}
		</span>
	);
}

export default function SiteFooter() {
	return (
		<footer className="relative z-10 border-t border-line bg-ink">
			<div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-10 px-5 py-16 text-[11px] uppercase tracking-[0.2em] md:grid-cols-4 md:px-10">
				<div className="col-span-2 md:col-span-1">
					<p className="flex items-center gap-3 font-pixel text-xl tracking-[0.15em]">
						<PixelLogo className="h-6" />
						{SITE.name}
					</p>
					<p className="mt-4 max-w-[16rem] normal-case leading-relaxed tracking-normal text-paper/60">
						{COPY.footer.description}
					</p>
				</div>
				<nav aria-label="Pied de page">
					<p className="text-stone">Navigation</p>
					<ul className="mt-4 space-y-2">
						{NAV.map((item) => (
							<li key={item.label}>
								<a
									href={navHref(item)}
									onClick={(event) => {
										if (!item.id || !isHomePage()) return;
										event.preventDefault();
										scrollToSection(item.id);
									}}
									className="uppercase hover:opacity-60"
								>
									{item.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
				<div>
					<p className="text-stone">Réseau</p>
					<ul className="mt-4 space-y-2">
						{SITE.socials.map((social) => (
							<li key={social.label}>
								<a href={social.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
									{social.label} ↗
								</a>
							</li>
						))}
					</ul>
				</div>
				<div>
					<p className="text-stone">Lausanne</p>
					<p className="mt-4">
						<LausanneClock />
					</p>
					<button
						type="button"
						onClick={() => window.scrollY > 0 && scrollToSection('top')}
						className="mt-6 cursor-pointer uppercase hover:opacity-60"
					>
						Retour en haut ↑
					</button>
				</div>
			</div>

			<div aria-hidden="true" className="border-t border-line py-6">
				<Marquee speed={30} direction={-1}>
					<span className="flex items-center gap-10 pr-10 font-pixel text-[clamp(4rem,12vw,10rem)] uppercase leading-none text-paper/10">
						{SITE.name}
						<span className="h-6 w-6 bg-paper/10" />
					</span>
				</Marquee>
			</div>

			<div className="mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-line px-5 py-6 text-[10px] uppercase tracking-[0.2em] text-stone sm:flex-row sm:justify-between md:px-10">
				<span>
					© {new Date().getFullYear()} {SITE.name}
				</span>
				<span className="tabular-nums">01001100 01010101 01001101 01000101 01001110</span>
			</div>
		</footer>
	);
}
