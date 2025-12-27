<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { gsap } from '$lib/utils/gsap';
	import { createEventDispatcher } from 'svelte';
	import { isPreloaderLoaded } from '$lib/stores/preloader';

	const dispatch = createEventDispatcher();

	let preloader: HTMLDivElement;
	let progress = $state(0);
	let mounted = $state(false);

	onMount(() => {
		if (!browser || typeof window === 'undefined') return;
		
		mounted = true;
		
		// Store'u başlangıçta false yap (her sayfa yüklemesinde)
		isPreloaderLoaded.set(false);
		
		let counterTween: gsap.core.Tween | null = null;
		
		// Kısa bir gecikme ile animasyonu başlat (hydration tamamlansın)
		const timeoutId = setTimeout(() => {
			// Counter animasyonu: 0'dan 10'a 2.5 saniyede
			counterTween = gsap.to(
				{ value: 0 },
				{
					value: 10,
					duration: 2.5,
					ease: 'power2.out',
					onUpdate: function () {
						progress = Math.round(this.targets()[0].value);
					},
					onComplete: () => {
						// 10'a ulaşınca, preloader'ı yukarı kaydır
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
		}, 100);

		return () => {
			clearTimeout(timeoutId);
			if (counterTween) {
				counterTween.kill();
			}
		};
	});
</script>

{#if browser}
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
{/if}

