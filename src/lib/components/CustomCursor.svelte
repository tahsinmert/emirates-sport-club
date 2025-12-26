<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from '$lib/utils/gsap';

	let cursor: HTMLDivElement;
	let isHovering = $state(false);
	let xMove: gsap.QuickTo;
	let yMove: gsap.QuickTo;
	let scaleTween: gsap.core.Tween | null = null;

	onMount(() => {
		if (typeof window === 'undefined') return;

		// Touch device kontrolü - sadece desktop'ta cursor göster
		const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		if (isTouchDevice) {
			return;
		}

		if (!cursor) return;

		// gsap.quickTo ile buttery smooth hareket
		xMove = gsap.quickTo(cursor, 'x', {
			duration: 0.6,
			ease: 'power3.out'
		});

		yMove = gsap.quickTo(cursor, 'y', {
			duration: 0.6,
			ease: 'power3.out'
		});

		const handleMouseMove = (e: MouseEvent) => {
			xMove(e.clientX);
			yMove(e.clientY);
		};

		const handleMouseEnter = () => {
			isHovering = true;
			if (cursor && scaleTween) {
				scaleTween.kill();
			}
			scaleTween = gsap.to(cursor, {
				scale: 3,
				opacity: 0.7,
				duration: 0.3,
				ease: 'power2.out'
			});
		};

		const handleMouseLeave = () => {
			isHovering = false;
			if (cursor && scaleTween) {
				scaleTween.kill();
			}
			scaleTween = gsap.to(cursor, {
				scale: 1,
				opacity: 1,
				duration: 0.3,
				ease: 'power2.out'
			});
		};

		// Interactable elementleri bul ve event listener ekle
		const interactableSelectors = 'a, button, .video-section';

		const addListenersToElements = () => {
			const interactableElements = document.querySelectorAll(interactableSelectors);
			interactableElements.forEach((el) => {
				el.addEventListener('mouseenter', handleMouseEnter);
				el.addEventListener('mouseleave', handleMouseLeave);
			});
			return interactableElements;
		};

		let interactableElements = addListenersToElements();

		// Yeni elementler eklendiğinde listener'ları güncelle
		const observer = new MutationObserver(() => {
			interactableElements.forEach((el) => {
				el.removeEventListener('mouseenter', handleMouseEnter);
				el.removeEventListener('mouseleave', handleMouseLeave);
			});
			interactableElements = addListenersToElements();
		});

		observer.observe(document.body, { childList: true, subtree: true });

		window.addEventListener('mousemove', handleMouseMove);

		// İlk pozisyonu ayarla
		gsap.set(cursor, {
			x: window.innerWidth / 2,
			y: window.innerHeight / 2
		});

		// Cleanup
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			observer.disconnect();
			interactableElements.forEach((el) => {
				el.removeEventListener('mouseenter', handleMouseEnter);
				el.removeEventListener('mouseleave', handleMouseLeave);
			});
			if (scaleTween) {
				scaleTween.kill();
			}
		};
	});

	onDestroy(() => {
		if (scaleTween) {
			scaleTween.kill();
		}
	});
</script>

<div
	bind:this={cursor}
	class="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] w-3 h-3 rounded-full bg-accent-white mix-blend-difference -translate-x-1/2 -translate-y-1/2"
></div>

