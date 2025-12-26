<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getLenis } from '$lib/utils/lenis';

	let header: HTMLElement;
	let isScrolled = $state(false);

	onMount(() => {
		if (typeof window === 'undefined') return;

		const handleScroll = () => {
			const scrollY = window.scrollY || window.pageYOffset;
			const shouldBeScrolled = scrollY > 50;

			if (shouldBeScrolled !== isScrolled) {
				isScrolled = shouldBeScrolled;
			}
		};

		// Lenis scroll event'ini dinle
		const lenis = getLenis();
		if (lenis) {
			lenis.on('scroll', handleScroll);
		} else {
			// Fallback: window scroll event
			window.addEventListener('scroll', handleScroll, { passive: true });
		}

		handleScroll(); // Initial check

		return () => {
			if (lenis) {
				lenis.off('scroll', handleScroll);
			} else {
				window.removeEventListener('scroll', handleScroll);
			}
		};
	});

	onDestroy(() => {
		// Cleanup handled in onMount return
	});
</script>

<header
	bind:this={header}
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-600 {isScrolled
		? 'backdrop-blur-xl bg-secondary-black/80'
		: 'backdrop-blur-0 bg-transparent'}"
>
	<nav class="container mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
		<!-- Logo -->
		<div class="headline text-xl font-bold tracking-wider text-accent-white">
			EMIRATES SPORT CLUB
		</div>

		<!-- Hamburger Menu -->
		<button
			class="w-8 h-8 flex flex-col justify-center items-center gap-1.5 group"
			aria-label="Menu"
		>
			<span
				class="w-6 h-0.5 bg-accent-white transition-all duration-300 group-hover:bg-primary-gold"
			></span>
			<span
				class="w-6 h-0.5 bg-accent-white transition-all duration-300 group-hover:bg-primary-gold"
			></span>
			<span
				class="w-6 h-0.5 bg-accent-white transition-all duration-300 group-hover:bg-primary-gold"
			></span>
		</button>
	</nav>
</header>

