import { gsap } from 'gsap';
import { ScrollTrigger as ST } from 'gsap/ScrollTrigger';

// ScrollTrigger'ı export et - SSR sırasında null olabilir
let ScrollTrigger: typeof ST | null = ST;

// GSAP ScrollTrigger'ı sadece browser'da kaydet
if (typeof window !== 'undefined') {
	try {
		gsap.registerPlugin(ST);
		ScrollTrigger = ST;
	} catch (e) {
		// SSR sırasında hata olursa sessizce geç
		ScrollTrigger = null;
	}
} else {
	// SSR sırasında ScrollTrigger null olarak ayarla
	ScrollTrigger = null;
}

export { gsap, ScrollTrigger };
export default gsap;

