// All the site copy in one place: change a sentence here, it changes on the site.

/**
 * Colour theme. `accent: null` = pure black & white. Otherwise the accent
 * colour only touches small details (cursors, squares, progress, active menu).
 * Presets: blue '#2E68FF' (ink '#FFFFFF') · yellow '#FFD60A' (ink '#0E0E0E').
 */
export const THEME: { accent: string | null; accentInk: string } = {
	accent: null,
	accentInk: '#0E0E0E',
};

export const ACCENT_PRESETS = {
	blue: { accent: '#2E68FF', accentInk: '#FFFFFF' },
	yellow: { accent: '#FFD60A', accentInk: '#0E0E0E' },
	none: { accent: null, accentInk: '#0E0E0E' },
} as const;

export const SITE = {
	name: 'Nabil Mohamed Hagos',
	/** Address of the site online (used in llms.txt) */
	url: 'https://portfolio-o14c.vercel.app',
	email: 'nabil.mohamedh@hes-so.ch',
	/** Optional — leave empty ('') to hide the phone everywhere */
	phone: '',
	linkedin: 'https://www.linkedin.com/in/nabil-mohamed-hagos-84602a274/',
	socials: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/nabil-mohamed-hagos-84602a274/' }],
};

/** Address of the « À propos » page (a page of its own, see a-propos/index.html). */
export const ABOUT_PAGE = '/a-propos/';

/**
 * Every visible sentence of the site, section by section. Titles are arrays:
 * one entry per line of the big pixel title (keep each line short).
 */
export const COPY = {
	hero: {
		label: '[Portfolio]',
		tagline: 'Ingénierie des médias · design d’interfaces, contenus visuels et communication numérique.',
	},
	intro: {
		label: '[01] — Profil',
		title: ['Des idées', 'concrètes.'],
		text: 'Étudiant en ingénierie des médias à la HEIG-VD, je mène des projets numériques de l’idée au livrable : interfaces, contenus visuels, vidéo et communication. Je cherche aujourd’hui une entreprise pour réaliser mon travail de Bachelor sur un projet concret.',
		primaryCta: 'Proposer un projet',
		secondaryCta: 'Voir les projets',
	},
	services: { label: 'Compétences' },
	work: {
		label: '[02] — Réalisations',
		title: ['Projets', 'réalisés.'],
		text: 'Plateforme web, documentaire interactif, concept d’application, vidéo : des projets menés en équipe, de la recherche jusqu’au livrable final. Ouvrez un projet pour découvrir ma contribution.',
	},
	process: {
		label: '[03] — Méthode',
		title: ['De l’idée', 'au résultat.'],
	},
	about: {
		label: '[04] — À propos',
		title: ['Polyvalent', 'par nature.'],
		text: 'Une formation commerciale, une année de stage en administration, puis l’ingénierie des médias depuis 2023 : j’ai appris à passer de l’organisation à la création. Aujourd’hui, je conçois des maquettes, des supports visuels, des vidéos et des sites, toujours en partant du besoin.',
		cta: 'Découvrir mon parcours',
		/** Area of the portrait kept free of pixels (the face), in 0–1 coordinates */
		face: { x0: 0.3, y0: 0.26, x1: 0.7, y1: 0.72 },
	},
	faq: {
		label: '[05] — FAQ',
		title: ['Questions', 'fréquentes.'],
		aside: 'Une autre question ?',
		asideLink: 'Écrivez-moi',
		asideEnd: ', je réponds sous 48 h.',
	},
	contact: {
		label: '[06] — Contact',
		title: ['Parlons', 'projet.'],
		text: 'Votre entreprise a un projet digital, de contenu ou de communication à faire avancer ? Je cherche une structure pour réaliser mon travail de Bachelor en ingénierie des médias. Écrivez-moi pour discuter d’une collaboration, me proposer un sujet ou échanger sur vos besoins.',
		messageLabel: 'Votre message',
		messagePlaceholder: 'Votre structure, le sujet ou le besoin que vous imaginez… quelques lignes suffisent.',
		responseTime: 'Réponse sous 48 h',
		mailSubject: 'Travail de Bachelor',
	},
	footer: {
		description: 'Étudiant en ingénierie des médias à la HEIG-VD. Design d’interfaces, contenus visuels, vidéo et communication numérique.',
	},
	header: { cta: 'Me contacter', ctaShort: 'Contact' },
};

/**
 * Main menu. `id` = a section of the home page, `page` = another page.
 */
export const NAV: { label: string; id?: string; page?: string }[] = [
	{ label: 'Réalisations', id: 'travaux' },
	{ label: 'Méthode', id: 'processus' },
	{ label: 'À propos', page: ABOUT_PAGE },
	{ label: 'Contact', id: 'contact' },
];

export const STATS = [
	{ value: '4', label: 'Projets présentés' },
	{ value: '2023', label: 'Entrée à la HEIG-VD' },
	{ value: '4', label: 'Langues parlées' },
	{ value: '48 h', label: 'Délai de réponse' },
];

/** Skills scrolling in the band under the intro (short, one or two words each) */
export const SERVICES = [
	'Design d’interface',
	'Maquettes Figma',
	'Data visualisation',
	'Communication visuelle',
	'Photographie',
	'Vidéographie',
	'Création de contenus',
	'WordPress & Elementor',
	'Suite Adobe',
];

export const PROCESS = [
	{
		title: 'Comprendre',
		text: 'Cerner le contexte, le public visé et l’objectif réel avant de produire quoi que ce soit.',
		duration: 'Brief',
		icon: 'chat',
	},
	{
		title: 'Explorer',
		text: 'Rechercher des données et des références, analyser l’existant et choisir un angle clair.',
		duration: 'Recherche',
		icon: 'search',
	},
	{
		title: 'Concevoir',
		text: 'Structurer le contenu, maquetter les interfaces et les supports, puis ajuster avec l’équipe.',
		duration: 'Maquettes',
		icon: 'board',
	},
	{
		title: 'Réaliser',
		text: 'Produire et livrer : site, visuels, vidéo ou prototype, prêts à être utilisés.',
		duration: 'Livrable',
		icon: 'check',
	},
] as const;

export const FAQ = [
	{
		q: 'Que recherchez-vous exactement ?',
		a: 'Une entreprise ou une organisation prête à m’accueillir pour mon travail de Bachelor en ingénierie des médias, autour d’un projet concret qui répond à un vrai besoin de votre structure.',
	},
	{
		q: 'Quels sujets vous intéressent ?',
		a: 'La création de contenu, la gestion de projets web et de sites sous CMS, la communication numérique et le design d’interfaces. Je reste ouvert à toute problématique où les médias et le numérique peuvent apporter une solution.',
	},
	{
		q: 'Faut-il déjà avoir un sujet défini ?',
		a: 'Non. Vous pouvez venir avec un sujet précis ou simplement avec un besoin : nous pouvons définir ensemble une problématique adaptée à votre structure et au cadre du Bachelor.',
	},
	{
		q: 'Avec quels outils travaillez-vous ?',
		a: 'Figma pour les maquettes, la Suite Adobe (Photoshop, Illustrator, Premiere Pro) pour les visuels et la vidéo, WordPress et Elementor pour les sites, ainsi que HTML, CSS, JavaScript et D3.js pour le web et la visualisation de données.',
	},
	{
		q: 'Comment se passe un premier échange ?',
		a: 'Écrivez-moi via le formulaire ou par e-mail, en quelques lignes. Je vous réponds sous 48 h pour convenir d’un premier échange et parler de vos besoins.',
	},
];

/** Content of the « À propos » page. */
export const ABOUT = {
	label: '[À propos]',
	title: ['Nabil', 'Mohamed Hagos'],
	role: 'Étudiant en ingénierie des médias · HEIG-VD',
	intro: 'Je travaille à la croisée du design, du web et de la création de contenus. Ce qui me motive : partir d’une idée, comprendre à qui elle s’adresse et la transformer en quelque chose de concret, que ce soit une interface, une affiche, une vidéo ou un site.',
	sections: [
		{
			title: 'Parcours',
			paragraphs: [
				'Mon parcours a commencé par le commerce. Après l’École de commerce du Gymnase de Beaulieu, j’ai obtenu en 2022 mon CFC d’employé de commerce et ma maturité professionnelle. Cette formation m’a donné des bases solides : rigueur, organisation et sens du service.',
				'En 2023, j’ai rejoint la filière Ingénierie des médias de la HEIG-VD. J’y ai trouvé ce que je cherchais : la possibilité de créer. Design d’interfaces, développement web, visualisation de données, vidéo et communication : chaque projet m’a permis d’élargir mes compétences et de travailler avec des profils différents.',
			],
		},
		{
			title: 'Ma façon de travailler',
			paragraphs: [
				'Je pars toujours du besoin. Avant de dessiner une maquette ou de lancer un montage, je cherche à comprendre le contexte, le public et l’objectif. Sur Mission Donneur, il fallait convaincre des entreprises de participer aux collectes de sang des HUG : j’ai travaillé à la fois sur les maquettes de la plateforme, les affiches, les posts et le concept de remise des trophées.',
				'J’aime aussi rendre accessible ce qui est complexe. Pour le documentaire interactif sur le Bitcoin, j’ai contribué à la recherche de données, à la maquette et à la construction du récit, afin qu’un sujet financier devienne compréhensible par le grand public.',
			],
		},
		{
			title: 'Expérience',
			paragraphs: [
				'Pendant ma maturité professionnelle, j’ai effectué un stage d’un an à la Direction générale de l’enseignement postobligatoire. J’y ai validé des contrats, authentifié des documents, géré des courriels et une base de données, et préparé des présentations. Une année qui m’a appris à gérer des dossiers avec précision et en autonomie.',
				'Un premier stage au CUTR Sylvana m’avait déjà familiarisé avec l’accueil téléphonique et le suivi administratif. En parallèle de mes études, des emplois dans la vente et la livraison m’ont appris la fiabilité et le contact avec la clientèle.',
			],
		},
	],
	skills: [
		{ title: 'Design & web', items: ['UX/UI', 'Maquettes Figma', 'WordPress', 'Elementor', 'HTML, CSS, JavaScript', 'D3.js'] },
		{ title: 'Contenus', items: ['Photographie', 'Vidéographie', 'Montage (Premiere Pro)', 'Photoshop, Illustrator'] },
		{ title: 'Communication', items: ['Affiches et posts', 'Concepts événementiels', 'Narration de données'] },
		{ title: 'Organisation', items: ['Suite Office', 'Gestion de bases de données', 'Suivi administratif'] },
	],
	languages: [
		{ name: 'Français', level: 'Courant' },
		{ name: 'Tigrinya', level: 'Bilingue' },
		{ name: 'Anglais', level: 'C1' },
		{ name: 'Allemand', level: 'B2' },
	],
	interests: {
		title: 'En dehors des projets',
		text: 'La photographie et la vidéo sont aussi des passions personnelles. Le sport, football, boxe et musculation, m’apporte discipline et persévérance : deux qualités que je retrouve dans ma manière de mener un projet.',
	},
	goal: {
		title: ['Ce que', 'je cherche.'],
		text: 'Pour mon travail de Bachelor, je cherche une entreprise avec laquelle mener un projet utile : création de contenu, gestion de projets web et de sites, communication numérique ou design d’interfaces. J’ai envie de m’investir sur une vraie problématique et d’y apporter un regard à la fois créatif et structuré.',
		cta: 'Me contacter',
	},
};
