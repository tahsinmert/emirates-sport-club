<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from '$lib/utils/gsap';

	export let src: string;
	export let title: string;
	export let category: string;
	export let size: 'small' | 'medium' | 'large' | 'tall' = 'medium';

	let cardElement: HTMLElement;
	let videoElement: HTMLVideoElement;
	let isPlaying = false;

	const sizeClasses = {
		small: 'col-span-1 row-span-1 min-h-[200px]',
		medium: 'col-span-1 row-span-1 min-h-[250px]',
		large: 'col-span-2 row-span-2 min-h-[400px] md:min-h-[500px]',
		tall: 'col-span-1 row-span-2 min-h-[400px] md:min-h-[500px]'
	};

	function handleMouseEnter() {
		if (!cardElement || !videoElement) return;

		// Scale up ve color transition
		gsap.to(cardElement, {
			scale: 1.05,
			duration: 0.4,
			ease: 'power2.out',
			zIndex: 10
		});

		// Grayscale'i kaldır ve opacity'yi artır
		gsap.to(videoElement, {
			filter: 'grayscale(0%) brightness(1)',
			opacity: 1,
			duration: 0.4,
			ease: 'power2.out'
		});

		// Video oynat
		if (videoElement) {
			videoElement.currentTime = 0;
			videoElement.play().catch(() => {
				// Autoplay policy hatası durumunda sessiz oynat
				videoElement.muted = true;
				videoElement.play();
			});
			isPlaying = true;
		}
	}

	function handleMouseLeave() {
		if (!cardElement || !videoElement) return;

		// Scale'i geri al
		gsap.to(cardElement, {
			scale: 1,
			duration: 0.4,
			ease: 'power2.out',
			zIndex: 1
		});

		// Grayscale'e dön
		gsap.to(videoElement, {
			filter: 'grayscale(100%) brightness(0.6)',
			opacity: 0.8,
			duration: 0.4,
			ease: 'power2.out'
		});

		// Video'yu durdur
		if (videoElement && isPlaying) {
			videoElement.pause();
			isPlaying = false;
		}
	}

	function initVideoStyle() {
		if (videoElement) {
			gsap.set(videoElement, {
				filter: 'grayscale(100%) brightness(0.6)',
				opacity: 0.8
			});
		}
	}

	onMount(() => {
		// Video element'inin yüklenmesini bekle
		if (videoElement) {
			if (videoElement.readyState >= 2) {
				// Video metadata zaten yüklendi
				initVideoStyle();
			} else {
				// Metadata yüklenmesini bekle
				videoElement.addEventListener('loadedmetadata', initVideoStyle, { once: true });
				// Fallback olarak timeout
				setTimeout(initVideoStyle, 100);
			}
		} else {
			// Element henüz hazır değilse bekle
			setTimeout(initVideoStyle, 100);
		}
	});
</script>

<div
	bind:this={cardElement}
	class="relative {sizeClasses[size]} w-full h-full overflow-hidden rounded-lg cursor-pointer group"
	on:mouseenter={handleMouseEnter}
	on:mouseleave={handleMouseLeave}
	role="button"
	tabindex="0"
	style="transform-origin: center center;"
>
	<!-- Video Container -->
	<div class="absolute inset-0 w-full h-full">
		<video
			bind:this={videoElement}
			class="absolute inset-0 w-full h-full object-cover"
			muted
			loop
			playsinline
			preload="metadata"
		>
			<source src={src} type="video/mp4" />
		</video>
		<!-- Dark Overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
	</div>

	<!-- Content Overlay -->
	<div class="absolute inset-0 flex flex-col justify-end p-6 z-10">
		<!-- Category Badge -->
		<div class="mb-2">
			<span class="headline text-xs tracking-widest uppercase text-primary-gold">
				{category.toUpperCase()}
			</span>
		</div>
		<!-- Title -->
		<h3 class="headline text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-accent-white leading-none uppercase">
			{title}
		</h3>
	</div>

	<!-- Hover indicator (play icon appears on hover) -->
	<div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
		<div class="w-16 h-16 rounded-full bg-primary-gold/20 backdrop-blur-sm flex items-center justify-center border-2 border-primary-gold">
			<svg
				class="w-8 h-8 text-primary-gold ml-1"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M8 5v14l11-7z" />
			</svg>
		</div>
	</div>
</div>

<style>
	video {
		transition: filter 0.4s ease, opacity 0.4s ease;
	}
</style>

