import { gsap } from 'gsap';

// ScrollTrigger'ı lazy load et - sadece browser'da yükle
// Top-level import yapmıyoruz çünkü SSR sırasında sorun yaratabilir
let ScrollTrigger: any = null;
let scrollTriggerPromise: Promise<any> | null = null;

// ScrollTrigger'ı dynamic import ile yükle
async function loadScrollTrigger() {
	if (typeof window === 'undefined') return null;
	
	if (ScrollTrigger) return ScrollTrigger;
	
	if (scrollTriggerPromise) return scrollTriggerPromise;
	
	scrollTriggerPromise = import('gsap/ScrollTrigger').then((module) => {
		const ST = module.ScrollTrigger;
		gsap.registerPlugin(ST);
		ScrollTrigger = ST;
		return ST;
	}).catch(() => {
		ScrollTrigger = null;
		return null;
	});
	
	return scrollTriggerPromise;
}

// Browser'da ScrollTrigger'ı hemen yükle (non-blocking)
if (typeof window !== 'undefined') {
	loadScrollTrigger().catch(() => {
		// Sessizce geç
	});
}

export { gsap, ScrollTrigger, loadScrollTrigger };
export default gsap;

