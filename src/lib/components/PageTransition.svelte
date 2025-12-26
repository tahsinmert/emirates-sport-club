<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import { gsap } from '$lib/utils/gsap';

	let overlay: HTMLDivElement;
	let isVisible = $state(false);

	onMount(() => {
		if (!browser || !overlay) return;
		// Sayfa yüklendiğinde overlay'i gizle
		gsap.set(overlay, { xPercent: -100 });
	});

	beforeNavigate(() => {
		if (!browser || !overlay) return;
		isVisible = true;
		gsap.fromTo(
			overlay,
			{ xPercent: -100 },
			{
				xPercent: 0,
				duration: 0.8,
				ease: 'power3.inOut'
			}
		);
	});

	afterNavigate(async () => {
		if (!browser || !overlay) return;
		// Sayfa içeriğinin render edilmesini bekle
		await tick();
		
		// DOM'un güncellenmesi için bir frame bekle
		if (typeof requestAnimationFrame !== 'undefined') {
			await new Promise((resolve) => requestAnimationFrame(resolve));
		}
		
		// Ek bir kısa gecikme ekle (içerik yüklemesi için)
		await new Promise((resolve) => setTimeout(resolve, 50));

		gsap.to(overlay, {
			xPercent: 100,
			duration: 0.8,
			ease: 'power3.inOut',
			onComplete: () => {
				isVisible = false;
			}
		});
	});
</script>

<div
	bind:this={overlay}
	class="fixed inset-0 z-[9999] bg-secondary-black pointer-events-none {!isVisible ? 'invisible' : ''}"
	aria-hidden="true"
></div>

