<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from '$lib/utils/gsap';
	import { createEventDispatcher } from 'svelte';
	import { isPreloaderLoaded } from '$lib/stores/preloader';

	const dispatch = createEventDispatcher();

	let preloader: HTMLDivElement;
	let progress = $state(0);

	onMount(() => {
		if (typeof window === 'undefined') return;

		// Counter animasyonu: 0'dan 100'e 2.5 saniyede
		const counterTween = gsap.to(
			{ value: 0 },
			{
				value: 100,
				duration: 2.5,
				ease: 'power2.out',
				onUpdate: function () {
					progress = Math.round(this.targets()[0].value);
				},
				onComplete: () => {
					// 100%'e ulaşınca, preloader'ı yukarı kaydır
					if (preloader) {
						gsap.to(preloader, {
							yPercent: -100,
							duration: 1.2,
							ease: 'power4.inOut',
							onComplete: () => {
								// Store'u güncelle
								isPreloaderLoaded.set(true);
								// Animasyon tamamlandığında 'loaded' event'ini dispatch et
								dispatch('loaded');
							}
						});
					}
				}
			}
		);

		return () => {
			counterTween.kill();
		};
	});
</script>

<div
	bind:this={preloader}
	class="fixed inset-0 z-[100] bg-secondary-black flex items-center justify-center"
>
	<div
		class="headline text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-primary-gold leading-none"
		style="font-family: 'Oswald', sans-serif;"
	>
		{progress}%
	</div>
</div>

