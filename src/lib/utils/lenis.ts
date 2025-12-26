import Lenis from 'lenis';
import { ScrollTrigger } from '$lib/utils/gsap';

let lenis: Lenis | null = null;

export function initLenis() {
	if (typeof window === 'undefined') return;

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

	function raf(time: number) {
		lenis?.raf(time);
		ScrollTrigger.update();
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);

	// Lenis scroll event'ini ScrollTrigger'a bağla
	lenis.on('scroll', ScrollTrigger.update);

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

