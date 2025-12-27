<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { gsap } from '$lib/utils/gsap';
	import { createEventDispatcher } from 'svelte';
	import { isPreloaderLoaded } from '$lib/stores/preloader';

	const dispatch = createEventDispatcher();

	let preloader: HTMLDivElement;
	let progress = $state(0);

	onMount(() => {
		if (!browser || typeof window === 'undefined') return;
		
		// Store'u başlangıçta false yap (her sayfa yüklemesinde)
		isPreloaderLoaded.set(false);
		
		// Use gsap.context for proper cleanup
		const ctx = gsap.context(() => {
			// Create a proxy object for the counter
			const counterObj = { val: 0 };
			
			// Simulated GSAP counter: 0 to 100 over 2 seconds
			const counterTween = gsap.to(counterObj, {
				val: 100,
				duration: 2,
				ease: 'power2.out',
				onUpdate: function () {
					// Update the displayed progress text
					progress = Math.round(counterObj.val);
				},
				onComplete: () => {
					// Counter complete, now exit animation
					if (preloader) {
						gsap.to(preloader, {
							yPercent: -100,
							duration: 1.2,
							ease: 'power4.inOut',
							onComplete: () => {
								// Store'u güncelle
								isPreloaderLoaded.set(true);
								// Dispatch 'loaded' event
								dispatch('loaded');
							}
						});
					}
				}
			});
		});

		return () => {
			// Cleanup all animations in the context
			ctx.revert();
		};
	});
</script>

<div
	bind:this={preloader}
	class="fixed inset-0 z-[9999] bg-secondary-black flex items-center justify-center"
>
	<div
		class="headline text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-primary-gold leading-none"
		style="font-family: 'Oswald', sans-serif;"
	>
		{progress}
	</div>
</div>

