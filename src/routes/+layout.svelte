<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { browser } from '$app/environment';
	import '../app.css';
	import { initLenis, destroyLenis, getLenis, pauseLenis, resumeLenis } from '$lib/utils/lenis';
	import { ScrollTrigger } from '$lib/utils/gsap';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';

	let { children, data } = $props();

	let isLoaded = $state(false);
	let mounted = $state(false);

	// SEO Meta Tags
	const pageTitle = $derived($page.url.pathname === '/'
		? 'Emirates Sport Club - Beyond The Game'
		: $page.url.pathname === '/squad'
		? 'The Squad - Emirates Sport Club'
		: $page.url.pathname === '/academy'
		? 'Academy - Emirates Sport Club'
		: $page.url.pathname === '/news'
		? 'Press Room - Emirates Sport Club'
		: $page.url.pathname === '/store'
		? 'Store - Emirates Sport Club'
		: 'Emirates Sport Club');

	const pageDescription = $derived($page.url.pathname === '/'
		? 'Official website of Emirates Sport Club. Experience the legacy, passion, and excellence of our football club.'
		: $page.url.pathname === '/squad'
		? 'Meet the first team players of Emirates Sport Club. Discover our squad, player profiles, and statistics.'
		: $page.url.pathname === '/academy'
		? 'Emirates Sport Club Academy - Developing the next generation of football talent. Join our youth development program.'
		: $page.url.pathname === '/news'
		? 'Latest news, match reports, transfers, and club statements from Emirates Sport Club.'
		: $page.url.pathname === '/store'
		? 'Official Emirates Sport Club merchandise. Jerseys, training gear, accessories, and collectibles.'
		: 'Emirates Sport Club - Beyond The Game');

	const pageImage = $derived('https://emiratessportclub.com/og-image.jpg');

	onMount(() => {
		mounted = true;
		
		if (!browser) return;

		// Preloader sırasında Lenis'i pause et
		pauseLenis();

		// Lenis'i initialize et (ama pause durumunda)
		const lenis = initLenis();

		// ScrollTrigger'ı Lenis ile senkronize et
		if (lenis && typeof ScrollTrigger !== 'undefined') {
			lenis.on('scroll', ScrollTrigger.update);
		}

		return () => {
			destroyLenis();
		};
	});

	onDestroy(() => {
		destroyLenis();
	});

	// Preloader tamamlandığında
	function handlePreloaderLoaded() {
		isLoaded = true;
		// Lenis'i resume et
		resumeLenis();
	}

	// Page navigation sonrası işlemler
	afterNavigate(() => {
		if (!browser || typeof ScrollTrigger === 'undefined') return;
		
		// ScrollTrigger'ı güncelle
		ScrollTrigger.refresh();

		// Lenis scroll pozisyonunu güncelle
		const lenis = getLenis();
		if (lenis) {
			lenis.scrollTo(0, { immediate: true });
		}
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://emiratessportclub.com{$page.url.pathname}" />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:image" content={pageImage} />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://emiratessportclub.com{$page.url.pathname}" />
	<meta property="twitter:title" content={pageTitle} />
	<meta property="twitter:description" content={pageDescription} />
	<meta property="twitter:image" content={pageImage} />
	
	<!-- Additional Meta -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="theme-color" content="#0A0A0A" />
	<link rel="icon" href="/Al_Emirate.png" type="image/png" />
	<link rel="canonical" content="https://emiratessportclub.com{$page.url.pathname}" />
</svelte:head>

{#if !isLoaded}
	<Preloader on:loaded={handlePreloaderLoaded} />
{/if}

{#if mounted}
	<CustomCursor />
	<Navbar />
{/if}
<PageTransition />

<main class="relative">
	{@render children()}
</main>

<Footer />
