import { ABOUT_PAGE } from '@/data/site';

export interface NavItem {
	label: string;
	/** Section of the home page */
	id?: string;
	/** Another page */
	page?: string;
}

/** True on the home page, false on the « À propos » page. */
export const isHomePage = () => !window.location.pathname.startsWith(ABOUT_PAGE.replace(/\/$/, ''));

/** Link of a menu entry, from the page we are on. */
export const navHref = (item: NavItem) => item.page ?? (isHomePage() ? `#${item.id}` : `/#${item.id}`);

/** Key used to mark the current entry. */
export const navKey = (item: NavItem) => item.id ?? item.page ?? item.label;
