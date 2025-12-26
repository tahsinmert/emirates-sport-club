<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';
	import { ArrowLeft, Calendar, Tag } from 'lucide-svelte';

	// Mock news data - In production, this would come from a CMS or API
	const newsData: Record<string, any> = {
		'emirates-secures-victory-in-championship-final': {
			id: 1,
			title: 'EMIRATES SECURES VICTORY IN CHAMPIONSHIP FINAL',
			category: 'MATCH REPORT',
			date: 'DEC 28, 2025',
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop&q=80',
			content: `
				<p class="mb-6">In a thrilling display of skill and determination, Emirates Sport Club secured a historic victory in the championship final, defeating their rivals 3-1 in front of a packed stadium.</p>
				<p class="mb-6">The match started with intense pressure from both sides, but Emirates broke through in the 23rd minute with a stunning goal from captain Alex Mercer. The team maintained their composure throughout the first half, going into the break with a 2-0 lead.</p>
				<p class="mb-6">The second half saw a resurgence from the opposition, but Emirates' defense held strong. A late goal from Marcus Reed sealed the victory, sending the Emirates faithful into celebration.</p>
				<p class="mb-6">This victory marks the club's third championship title in five years, cementing their status as one of the premier teams in the league. The players and coaching staff have worked tirelessly throughout the season, and this triumph is a testament to their dedication and hard work.</p>
			`
		}
	};

	$: slug = $page.params.slug;
	$: article = newsData[slug] || null;

	let heroSection: HTMLElement;
	let contentSection: HTMLElement;

	function setupAnimations() {
		if (typeof window === 'undefined' || !heroSection || !contentSection || typeof ScrollTrigger === 'undefined') return;

		gsap.fromTo(
			heroSection,
			{
				opacity: 0,
				scale: 1.1
			},
			{
				opacity: 1,
				scale: 1,
				duration: 1.2,
				ease: 'power3.out'
			}
		);

		ScrollTrigger.create({
			trigger: contentSection,
			start: 'top 80%',
			once: true,
			onEnter: () => {
				gsap.fromTo(
					contentSection,
					{
						opacity: 0,
						y: 50
					},
					{
						opacity: 1,
						y: 0,
						duration: 1,
						ease: 'power3.out'
					}
				);
			}
		});
	}

	onMount(() => {
		setTimeout(() => {
			setupAnimations();
		}, 100);

		return () => {
			if (typeof ScrollTrigger !== 'undefined') {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			}
		};
	});
</script>

<svelte:head>
	<title>{article ? article.title : 'News Article'} - Emirates Sport Club</title>
	<meta name="description" content={article ? `Read about ${article.title.toLowerCase()}` : 'News article from Emirates Sport Club'} />
</svelte:head>

{#if !article}
	<div class="min-h-dvh w-full bg-secondary-black flex items-center justify-center px-6">
		<div class="text-center">
			<h1 class="headline text-4xl md:text-5xl font-bold text-accent-white uppercase mb-4">
				ARTICLE NOT FOUND
			</h1>
			<p class="text-accent-white/70 mb-8">The article you are looking for does not exist.</p>
			<a
				href="/news"
				class="headline inline-block px-8 py-4 border-2 border-primary-gold text-primary-gold uppercase tracking-wider text-sm md:text-base hover:bg-primary-gold hover:text-secondary-black transition-all duration-300"
			>
				BACK TO NEWS
			</a>
		</div>
	</div>
{:else}
	<!-- Hero Section -->
	<section bind:this={heroSection} class="relative h-[70dvh] w-full overflow-hidden">
		<img
			src={article.image}
			alt={article.title}
			class="absolute inset-0 w-full h-full object-cover"
			loading="eager"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
		
		<div class="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 lg:p-24">
			<div class="max-w-4xl">
				<div class="flex items-center gap-4 mb-4 text-sm">
					<span class="flex items-center gap-2 text-primary-gold uppercase tracking-wider">
						<Tag class="w-4 h-4" />
						{article.category}
					</span>
					<span class="flex items-center gap-2 text-accent-white/60">
						<Calendar class="w-4 h-4" />
						{article.date}
					</span>
				</div>
				<h1 class="headline text-4xl md:text-5xl lg:text-6xl font-bold text-accent-white uppercase leading-tight mb-6">
					{article.title}
				</h1>
			</div>
		</div>
	</section>

	<!-- Back Button -->
	<div class="sticky top-0 z-30 bg-secondary-black/80 backdrop-blur-xl border-b border-white/10">
		<div class="container mx-auto px-6 lg:px-12 py-4">
			<a
				href="/news"
				class="inline-flex items-center gap-2 text-sm text-accent-white/70 hover:text-primary-gold transition-colors duration-300"
			>
				<ArrowLeft class="w-4 h-4" />
				<span class="headline uppercase tracking-wider">BACK TO NEWS</span>
			</a>
		</div>
	</div>

	<!-- Content Section -->
	<article bind:this={contentSection} class="w-full bg-secondary-black py-16 px-4 sm:px-8 md:px-16 lg:px-24">
		<div class="container mx-auto max-w-4xl">
			<div class="prose prose-invert prose-lg max-w-none">
				<div class="text-accent-white/90 leading-relaxed">
					{@html article.content}
				</div>
			</div>
		</div>
	</article>
{/if}

