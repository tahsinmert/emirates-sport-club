import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initLenis() {
	if (typeof window === 'undefined') return null;

	lenis = new Lenis({
		duration: 1.5,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		orientation: 'vertical',
		gestureOrientation: 'vertical',
		smoothWheel: true,
		wheelMultiplier: 1.2,
		smoothTouch: false,
		touchMultiplier: 2,
		infinite: false
	});

	// ScrollTrigger'ı dynamic import ile yükle (async, non-blocking)
	let scrollTriggerInstance: any = null;
	
	import('$lib/utils/gsap').then(({ loadScrollTrigger }) => {
		return loadScrollTrigger();
	}).then((ScrollTrigger) => {
		if (!ScrollTrigger || !lenis) return;
		
		scrollTriggerInstance = ScrollTrigger;

		// Lenis scroll event'ini ScrollTrigger'a bağla
		lenis.on('scroll', ScrollTrigger.update);
	}).catch(() => {
		// ScrollTrigger yüklenemezse sessizce geç
	});

	// RAF loop - ScrollTrigger yüklenmişse kullan
	function raf(time: number) {
		lenis?.raf(time);
		if (scrollTriggerInstance) {
			scrollTriggerInstance.update();
		}
		requestAnimationFrame(raf);
	}
	requestAnimationFrame(raf);

	return lenis;
}

export function getLenis() {
	return lenis;
}

export function pauseLenis() {
	if (lenis) {
		lenis.stop();
	}
}

export function resumeLenis() {
	if (lenis) {
		lenis.start();
	}
}

export function destroyLenis() {
	if (lenis) {
		lenis.destroy();
		lenis = null;
	}
}

