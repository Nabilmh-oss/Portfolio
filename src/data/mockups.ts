/**
 * Mockups (MacBook, iPhone) affichés dans la fenêtre du projet, avant la galerie.
 *
 * Trois sortes :
 *  - « scroll »   : une capture pleine page, l'écran du MacBook défile verticalement
 *  - « carousel » : plusieurs captures d'écran (16:10), on passe de l'une à l'autre
 *  - « phones »   : une rangée d'iPhone 16 (captures d'app ~ 393 × 852), qu'on fait défiler
 *
 * Ce fichier est géré à la main (il n'est PAS régénéré par la publication
 * depuis l'artefact). Clé = slug du projet (voir src/data/projects.json).
 * Images : public/mockups/<projet>/ — en .webp.
 * Pour ajouter / retirer une capture : ajoute / retire une ligne, c'est tout.
 */
export interface ScrollMockup {
	type?: 'scroll';
	/** Capture pleine page (largeur conseillée 2400 px). */
	src: string;
	/** Nom de la page, affiché sous le MacBook. */
	label: string;
	alt: string;
}

export interface MockupSlide {
	/** Capture d'un écran, 1440 × 900 ou 2880 × 1800 conseillé. */
	src: string;
	/** Nom court, affiché au-dessus des boutons. */
	label: string;
	/** Description pour les lecteurs d'écran (sinon générée depuis label). */
	alt?: string;
}

export interface CarouselMockup {
	type: 'carousel';
	/** Nom du site, affiché devant le nom de la capture. */
	label: string;
	slides: MockupSlide[];
	/** MacBook gris sidéral (sinon aluminium clair). */
	dark?: boolean;
}

export type IphoneColor = 'black' | 'white' | 'teal' | 'ultramarine' | 'pink';

export interface PhonesMockup {
	type: 'phones';
	/** Nom de l'app, pour les descriptions accessibles. */
	label: string;
	slides: MockupSlide[];
	/** Couleur du châssis (noir par défaut). */
	color?: IphoneColor;
}

export type Mockup = ScrollMockup | CarouselMockup | PhonesMockup;

export const mockups: Record<string, Mockup[]> = {
	'mission-donneur-hug-heig': [
		{
			src: '/mockups/mission-donneur/accueil.webp',
			label: 'missiondonneur.ch — Accueil',
			alt: 'Page d’accueil du site missiondonneur.ch',
		},
		{
			src: '/mockups/mission-donneur/certification.webp',
			label: 'missiondonneur.ch — Certification',
			alt: 'Page Certification du site missiondonneur.ch',
		},
		{
			src: '/mockups/mission-donneur/trophee.webp',
			label: 'missiondonneur.ch — Trophée',
			alt: 'Page Trophée de la Générosité du site missiondonneur.ch',
		},
	],

	'bitcoin-visualdon': [
		{
			type: 'carousel',
			label: 'Bitcoin',
			dark: true,
			slides: [
				{ src: '/mockups/bitcoin/01-ledger.webp', label: 'The Trustless Ledger' },
				{ src: '/mockups/bitcoin/02-cypherpunk.webp', label: 'Cypherpunk Genesis' },
				{ src: '/mockups/bitcoin/03-innocence.webp', label: 'The Death of Innocence' },
				{ src: '/mockups/bitcoin/04-institutional.webp', label: 'Institutional' },
				{ src: '/mockups/bitcoin/05-quiz.webp', label: 'Quiz' },
				{ src: '/mockups/bitcoin/07-wealth.webp', label: 'Wealth Gap' },
				{ src: '/mockups/bitcoin/08-scarcity.webp', label: 'Scarcity' },
				{ src: '/mockups/bitcoin/09-distribution.webp', label: 'Distribution' },
				{ src: '/mockups/bitcoin/10-goldrush.webp', label: 'The Digital Gold Rush' },
			],
		},
	],

	nutrione: [
		{
			type: 'phones',
			label: 'NutriOne',
			slides: [
				{ src: '/mockups/nutrione/01-accueil.webp', label: 'Accueil' },
				{ src: '/mockups/nutrione/02-accueil-standard.webp', label: 'Accueil standard' },
				{ src: '/mockups/nutrione/03-ticket.webp', label: 'Ticket' },
				{ src: '/mockups/nutrione/04-profil.webp', label: 'Profil' },
				{ src: '/mockups/nutrione/05-premium-debloquer.webp', label: 'Premium', alt: 'NutriOne — Premium : débloquer les statistiques' },
				{ src: '/mockups/nutrione/06-dashboard-1.webp', label: 'Tableau de bord 1' },
				{ src: '/mockups/nutrione/07-dashboard-2.webp', label: 'Tableau de bord 2' },
				{ src: '/mockups/nutrione/08-dashboard-3.webp', label: 'Tableau de bord 3' },
				{ src: '/mockups/nutrione/09-dashboard-4.webp', label: 'Tableau de bord 4' },
				{ src: '/mockups/nutrione/10-profil-premium.webp', label: 'Profil premium' },
			],
		},
	],
};

/** Nombre de médias apportés par les mockups d'un projet (pour les compteurs). */
export const mockupMediaCount = (list: Mockup[]) =>
	list.reduce((n, m) => n + (m.type === 'carousel' || m.type === 'phones' ? m.slides.length : 1), 0);
