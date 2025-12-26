<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';

	type NewsCategory = 'MATCH REPORT' | 'TRANSFER' | 'CLUB STATEMENT' | 'INTERVIEW';
	type NewsSize = 'featured' | 'large' | 'regular';
	type FilterType = 'ALL' | 'MATCHES' | 'TEAM' | 'CLUB';

	interface NewsItem {
		id: number;
		title: string;
		category: NewsCategory;
		date: string;
		image: string;
		size: NewsSize;
	}

	// Mock News Data
	const newsItems: NewsItem[] = [
		{
			id: 1,
			title: 'EMIRATES SECURES VICTORY IN CHAMPIONSHIP FINAL',
			category: 'MATCH REPORT',
			date: 'DEC 28, 2025',
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop&q=80',
			size: 'featured'
		},
		{
			id: 2,
			title: 'NEW SIGNING ANNOUNCED: STAR MIDFIELDER JOINS THE SQUAD',
			category: 'TRANSFER',
			date: 'DEC 27, 2025',
			image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c4c?w=800&h=1200&fit=crop&q=80',
			size: 'large'
		},
		{
			id: 3,
			title: 'CLUB STATEMENT ON YOUTH DEVELOPMENT PROGRAM',
			category: 'CLUB STATEMENT',
			date: 'DEC 26, 2025',
			image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop&q=80',
			size: 'regular'
		},
		{
			id: 4,
			title: 'EXCLUSIVE INTERVIEW WITH CAPTAIN ALEX MERCER',
			category: 'INTERVIEW',
			date: 'DEC 25, 2025',
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop&q=80',
			size: 'regular'
		},
		{
			id: 5,
			title: 'MATCH REPORT: EMIRATES DOMINATES RIVAL CLUB',
			category: 'MATCH REPORT',
			date: 'DEC 24, 2025',
			image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80',
			size: 'large'
		},
		{
			id: 6,
			title: 'TRANSFER WINDOW: THREE NEW PLAYERS JOIN ACADEMY',
			category: 'TRANSFER',
			date: 'DEC 23, 2025',
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&q=80',
			size: 'regular'
		},
		{
			id: 7,
			title: 'CLUB STATEMENT: COMMITMENT TO COMMUNITY OUTREACH',
			category: 'CLUB STATEMENT',
			date: 'DEC 22, 2025',
			image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c4c?w=800&h=1200&fit=crop&q=80',
			size: 'regular'
		},
		{
			id: 8,
			title: 'INTERVIEW: COACH DISCUSSES TACTICAL EVOLUTION',
			category: 'INTERVIEW',
			date: 'DEC 21, 2025',
			image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop&q=80',
			size: 'regular'
		},
		{
			id: 9,
			title: 'MATCH REPORT: EMIRATES ADVANCES TO SEMI-FINALS',
			category: 'MATCH REPORT',
			date: 'DEC 20, 2025',
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&q=80',
			size: 'regular'
		},
		{
			id: 10,
			title: 'TRANSFER NEWS: YOUNG TALENT EXTENDS CONTRACT',
			category: 'TRANSFER',
			date: 'DEC 19, 2025',
			image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop&q=80',
			size: 'large'
		},
		{
			id: 11,
			title: 'CLUB STATEMENT: STADIUM RENOVATION PROJECT',
			category: 'CLUB STATEMENT',
			date: 'DEC 18, 2025',
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&q=80',
			size: 'regular'
		},
		{
			id: 12,
			title: 'INTERVIEW: GOALKEEPER ON SEASON HIGHLIGHTS',
			category: 'INTERVIEW',
			date: 'DEC 17, 2025',
			image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c4c?w=800&h=600&fit=crop&q=80',
			size: 'regular'
		}
	];

	let activeFilter: FilterType = $state('ALL');
	let heroVideo: HTMLVideoElement;
	let newsCards = $state<HTMLElement[]>([]);

	// Filter mapping
	const filterMap: Record<FilterType, NewsCategory[]> = {
		ALL: [],
		MATCHES: ['MATCH REPORT'],
		TEAM: ['TRANSFER', 'INTERVIEW'],
		CLUB: ['CLUB STATEMENT']
	};

	// Filtered news items
	const filteredNews = $derived(activeFilter === 'ALL'
		? newsItems
		: newsItems.filter((item) => filterMap[activeFilter].includes(item.category)));

	function handleFilterClick(filter: FilterType) {
		if (activeFilter === filter) return;
		activeFilter = filter;

		// Animate grid items shuffle
		if (typeof window !== 'undefined' && newsCards.length > 0) {
			newsCards.forEach((card, index) => {
				if (card) {
					gsap.fromTo(
						card,
						{
							opacity: 0,
							y: 20
						},
						{
							opacity: 1,
							y: 0,
							duration: 0.6,
							ease: 'power2.out',
							delay: index * 0.05
						}
					);
				}
			});
		}
	}

	function setupScrollReveal() {
		if (typeof window === 'undefined' || newsCards.length === 0) return;

		// Use ScrollTrigger.batch for better performance
		ScrollTrigger.batch('.news-card', {
			onEnter: (elements) => {
				gsap.fromTo(
					elements,
					{
						y: 50,
						opacity: 0
					},
					{
						y: 0,
						opacity: 1,
						duration: 1,
						ease: 'power3.out',
						stagger: 0.1
					}
				);
			},
			once: true
		});
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		// Hero video setup
		if (heroVideo) {
			heroVideo.play().catch(() => {
				heroVideo.muted = true;
				heroVideo.play();
			});
		}

		// Setup scroll reveal after a short delay
		setTimeout(() => {
			setupScrollReveal();
		}, 200);

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<!-- Section 1: Hero (Editorial Header) -->
<section class="relative h-[70dvh] w-full overflow-hidden">
	<!-- Video Background -->
	<video
		bind:this={heroVideo}
		class="absolute inset-0 w-full h-full object-cover"
		muted
		loop
		autoplay
		playsinline
		preload="auto"
	>
		<source src="/news-hero.mp4" type="video/mp4" />
	</video>

	<!-- Heavy Dark Overlay -->
	<div class="absolute inset-0 bg-black/60 z-10"></div>

	<!-- Content -->
	<div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
		<h1 class="headline text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold text-accent-white uppercase tracking-tight mb-6">
			PRESS ROOM
		</h1>
		<p class="text-sm md:text-base uppercase tracking-widest text-accent-white/80">
			LATEST UPDATES FROM THE CLUB
		</p>
	</div>
</section>

<!-- Section 2: Filter Bar -->
<section class="sticky top-0 z-40 bg-secondary-black/95 backdrop-blur-xl border-b border-white/10">
	<div class="container mx-auto px-6 lg:px-12">
		<div class="flex items-center justify-center gap-8 py-6">
			{#each ['ALL', 'MATCHES', 'TEAM', 'CLUB'] as filter}
				{@const filterType = filter as FilterType}
				<button
					on:click={() => handleFilterClick(filterType)}
					class="headline text-sm md:text-base uppercase tracking-wider transition-all duration-300 {activeFilter === filterType
						? 'text-primary-gold border-b-2 border-primary-gold pb-1'
						: 'text-accent-white/60 hover:text-accent-white hover:border-b-2 hover:border-accent-white/40 pb-1'}"
				>
					{filter}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Section 3: The Masonry Grid -->
<section class="w-full bg-secondary-black py-16 px-4 sm:px-8 md:px-16 lg:px-24">
	<div class="container mx-auto">
		<!-- Featured Item (Full Width) -->
		{#each filteredNews as item, index}
			{#if item.size === 'featured'}
				<article
					bind:this={newsCards[index]}
					class="news-card mb-8 group cursor-pointer"
				>
					<a href="/news/{item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}" class="block">
					<div class="relative overflow-hidden">
						<!-- Image Container -->
						<div class="aspect-[21/9] w-full overflow-hidden">
							<img
								src={item.image}
								alt={item.title}
								loading="lazy"
								class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
							/>
						</div>

						<!-- Content Overlay -->
						<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12">
							<div class="flex items-center gap-4 mb-4">
								<span class="text-xs uppercase tracking-wider text-primary-gold">
									{item.category}
								</span>
								<span class="text-xs text-accent-white/50">
									{item.date}
								</span>
							</div>
							<h2 class="headline text-3xl md:text-4xl lg:text-5xl font-bold text-accent-white uppercase leading-tight group-hover:text-primary-gold transition-colors duration-300">
								{item.title}
							</h2>
						</div>
					</div>
					</a>
				</article>
			{/if}
		{/each}

		<!-- Masonry Grid (CSS Columns) -->
		<div class="columns-1 md:columns-2 lg:columns-3 gap-8">
			{#each filteredNews as item, index}
				{#if item.size !== 'featured'}
					<article
						bind:this={newsCards[index]}
						class="news-card break-inside-avoid mb-8 group cursor-pointer"
					>
						<a href="/news/{item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}" class="block">
						<div class="relative overflow-hidden bg-secondary-light/20 rounded-lg">
							<!-- Image Container -->
							<div class="aspect-video w-full overflow-hidden">
								<img
									src={item.image}
									alt={item.title}
									loading="lazy"
									class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
								/>
							</div>

							<!-- Content -->
							<div class="p-6 space-y-3">
								<div class="flex items-center gap-3 text-xs">
									<span class="uppercase tracking-wider text-primary-gold">
										{item.category}
									</span>
									<span class="text-accent-white/50">
										{item.date}
									</span>
								</div>
								<h3 class="headline text-xl md:text-2xl font-bold text-accent-white uppercase leading-snug group-hover:text-primary-gold transition-colors duration-300">
									{item.title}
								</h3>
							</div>
						</div>
						</a>
					</article>
				{/if}
			{/each}
		</div>
	</div>
</section>

<style>
	.news-card {
		will-change: transform, opacity;
	}
</style>

