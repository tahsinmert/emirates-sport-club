<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';
	import { ArrowLeft } from 'lucide-svelte';

	// Mock players data - In production, this would come from a CMS or API
	const playersData: Record<string, any> = {
		'1': {
			id: 1,
			name: 'ALEX MERCER',
			number: '10',
			position: 'Striker',
			age: 28,
			nationality: 'England',
			height: '185 cm',
			weight: '78 kg',
			joined: '2020',
			stats: {
				Goals: 24,
				Assists: 8,
				Matches: 30,
				'Minutes Played': 2650
			},
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop&q=80',
			bio: 'Alex Mercer joined Emirates Sport Club in 2020 and has since become one of the most prolific strikers in the league. Known for his clinical finishing and exceptional positioning, Mercer has been instrumental in the club\'s recent successes. His leadership on and off the pitch has made him a fan favorite and a key figure in the team\'s attacking play.'
		}
	};

	$: playerId = $page.params.id;
	$: player = playersData[playerId] || null;

	let heroSection: HTMLElement;
	let statsSection: HTMLElement;

	function setupAnimations() {
		if (typeof window === 'undefined' || !heroSection || !statsSection) return;

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
			trigger: statsSection,
			start: 'top 80%',
			once: true,
			onEnter: () => {
				gsap.fromTo(
					statsSection,
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
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<svelte:head>
	<title>{player ? `${player.name} - Player Profile` : 'Player Profile'} - Emirates Sport Club</title>
	<meta name="description" content={player ? `Player profile for ${player.name}, ${player.position} at Emirates Sport Club` : 'Player profile from Emirates Sport Club'} />
</svelte:head>

{#if !player}
	<div class="min-h-dvh w-full bg-secondary-black flex items-center justify-center px-6">
		<div class="text-center">
			<h1 class="headline text-4xl md:text-5xl font-bold text-accent-white uppercase mb-4">
				PLAYER NOT FOUND
			</h1>
			<p class="text-accent-white/70 mb-8">The player you are looking for does not exist.</p>
			<a
				href="/squad"
				class="headline inline-block px-8 py-4 border-2 border-primary-gold text-primary-gold uppercase tracking-wider text-sm md:text-base hover:bg-primary-gold hover:text-secondary-black transition-all duration-300"
			>
				BACK TO SQUAD
			</a>
		</div>
	</div>
{:else}
	<!-- Hero Section -->
	<section bind:this={heroSection} class="relative h-dvh w-full overflow-hidden">
		<img
			src={player.image}
			alt={player.name}
			class="absolute inset-0 w-full h-full object-cover object-center"
			loading="eager"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
		
		<div class="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-16 lg:p-24">
			<div class="max-w-4xl">
				<div class="headline text-[12rem] md:text-[16rem] lg:text-[20rem] font-bold text-primary-gold/10 absolute -top-20 -left-10 select-none leading-none">
					{player.number}
				</div>
				<h1 class="headline text-5xl md:text-6xl lg:text-7xl font-bold text-accent-white uppercase leading-tight mb-4 relative z-10">
					{player.name}
				</h1>
				<div class="flex flex-wrap items-center gap-6 text-lg mb-8">
					<span class="text-primary-gold uppercase tracking-wider">{player.position}</span>
					<span class="text-accent-white/70">#{player.number}</span>
					<span class="text-accent-white/70">{player.nationality}</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Back Button -->
	<div class="sticky top-0 z-30 bg-secondary-black/80 backdrop-blur-xl border-b border-white/10">
		<div class="container mx-auto px-6 lg:px-12 py-4">
			<a
				href="/squad"
				class="inline-flex items-center gap-2 text-sm text-accent-white/70 hover:text-primary-gold transition-colors duration-300"
			>
				<ArrowLeft class="w-4 h-4" />
				<span class="headline uppercase tracking-wider">BACK TO SQUAD</span>
			</a>
		</div>
	</div>

	<!-- Stats & Info Section -->
	<section bind:this={statsSection} class="w-full bg-secondary-black py-16 px-4 sm:px-8 md:px-16 lg:px-24">
		<div class="container mx-auto max-w-6xl">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
				<!-- Player Info -->
				<div class="lg:col-span-1 space-y-8">
					<div>
						<h2 class="headline text-2xl font-bold text-accent-white uppercase mb-6">PLAYER INFO</h2>
						<div class="space-y-4">
							<div class="flex justify-between border-b border-white/10 pb-3">
								<span class="text-accent-white/60">Age</span>
								<span class="text-accent-white font-semibold">{player.age}</span>
							</div>
							<div class="flex justify-between border-b border-white/10 pb-3">
								<span class="text-accent-white/60">Height</span>
								<span class="text-accent-white font-semibold">{player.height}</span>
							</div>
							<div class="flex justify-between border-b border-white/10 pb-3">
								<span class="text-accent-white/60">Weight</span>
								<span class="text-accent-white font-semibold">{player.weight}</span>
							</div>
							<div class="flex justify-between border-b border-white/10 pb-3">
								<span class="text-accent-white/60">Joined</span>
								<span class="text-accent-white font-semibold">{player.joined}</span>
							</div>
							<div class="flex justify-between border-b border-white/10 pb-3">
								<span class="text-accent-white/60">Nationality</span>
								<span class="text-accent-white font-semibold">{player.nationality}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Stats -->
				<div class="lg:col-span-1 space-y-8">
					<div>
						<h2 class="headline text-2xl font-bold text-accent-white uppercase mb-6">SEASON STATS</h2>
						<div class="space-y-4">
							{#each Object.entries(player.stats) as [key, value]}
								<div class="flex justify-between border-b border-white/10 pb-3">
									<span class="text-accent-white/60">{key}</span>
									<span class="headline text-xl font-bold text-primary-gold">{value}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Bio -->
				<div class="lg:col-span-1 space-y-8">
					<div>
						<h2 class="headline text-2xl font-bold text-accent-white uppercase mb-6">BIOGRAPHY</h2>
						<p class="text-accent-white/80 leading-relaxed">
							{player.bio}
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
{/if}

