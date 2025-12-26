<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';
	import AcademyForm from '$lib/components/AcademyForm.svelte';

	let isFormOpen = $state(false);

	// Timeline Steps Data
	const timelineSteps = [
		{
			title: 'SCOUTING & DISCOVERY',
			age: 'Age 10-12',
			desc: 'Finding raw talent across the nation.',
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&q=80'
		},
		{
			title: 'DEVELOPMENT SQUAD',
			age: 'Age 13-16',
			desc: 'Forging technical skills and mental resilience.',
			image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c4c?w=800&h=600&fit=crop&q=80'
		},
		{
			title: 'ELITE PERFORMANCE',
			age: 'Age 17-19',
			desc: 'Tactical mastery and physical conditioning.',
			image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop&q=80'
		},
		{
			title: 'PROFESSIONAL DEBUT',
			age: '',
			desc: 'Stepping onto the main stage.',
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&q=80'
		}
	];

	let heroSection: HTMLElement;
	let heroVideo: HTMLVideoElement;
	let heroText: HTMLElement;
	let timelineSection: HTMLElement;
	let timelineLine: HTMLElement;
	let progressLine: HTMLElement;
	let timelineNodes = $state<HTMLElement[]>([]);
	let timelineDots = $state<HTMLElement[]>([]);

	function setupHeroReveal() {
		if (typeof window === 'undefined' || !heroText) return;

		// Split text into words for stagger effect
		const words = heroText.querySelectorAll('.word');
		if (words.length === 0) return;

		// Set initial state
		gsap.set(words, {
			y: 50,
			opacity: 0
		});

		// Stagger animation
		gsap.to(words, {
			y: 0,
			opacity: 1,
			duration: 1.2,
			ease: 'power3.out',
			stagger: 0.1,
			delay: 0.3
		});
	}

	function setupTimelineAnimations() {
		if (typeof window === 'undefined' || !timelineSection || !progressLine || typeof ScrollTrigger === 'undefined') return;

		// Progress line animation
		gsap.set(progressLine, {
			height: '0%'
		});

		ScrollTrigger.create({
			trigger: timelineSection,
			start: 'top center',
			end: 'bottom center',
			scrub: true,
			onUpdate: (self) => {
				const progress = self.progress;
				gsap.set(progressLine, {
					height: `${progress * 100}%`
				});

				// Animate dots based on progress
				timelineDots.forEach((dot, index) => {
					const dotProgress = (index + 1) / timelineSteps.length;
					if (progress >= dotProgress - 0.1) {
						gsap.to(dot, {
							scale: 1,
							duration: 0.3,
							ease: 'power2.out'
						});
					}
				});
			}
		});

		// Node reveal animations
		timelineNodes.forEach((node, index) => {
			if (!node) return;

			const isLeft = index % 2 === 0;
			const initialX = isLeft ? -50 : 50;

			gsap.set(node, {
				x: initialX,
				opacity: 0
			});

			ScrollTrigger.create({
				trigger: node,
				start: 'top 80%',
				once: true,
				onEnter: () => {
					gsap.to(node, {
						x: 0,
						opacity: 1,
						duration: 1,
						ease: 'power3.out'
					});
				}
			});
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

		// Setup animations
		setTimeout(() => {
			setupHeroReveal();
			setupTimelineAnimations();
		}, 100);

		return () => {
			if (typeof ScrollTrigger !== 'undefined') {
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			}
		};
	});
</script>

<!-- Section 1: Hero (Inspiration) -->
<section bind:this={heroSection} class="relative h-dvh w-full overflow-hidden">
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
		<source src="/academy-hero.mp4" type="video/mp4" />
	</video>

	<!-- Dark Overlay -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

	<!-- Overlay Text -->
	<div class="absolute inset-0 z-20 flex items-center justify-center">
		<h1 bind:this={heroText} class="headline text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-accent-white uppercase tracking-tight text-center px-6">
			<span class="word inline-block">THE</span>
			<span class="word inline-block ml-4">FUTURE</span>
			<span class="word inline-block ml-4">IS</span>
			<span class="word inline-block ml-4">HERE</span>
		</h1>
	</div>
</section>

<!-- Section 2: The Timeline (Scroll Interaction) -->
<section bind:this={timelineSection} class="relative w-full bg-zinc-900 py-32 px-4 sm:px-8 md:px-16 lg:px-24">
	<div class="max-w-7xl mx-auto relative">
		<!-- The Central Line Container -->
		<div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]">
			<!-- Background Line -->
			<div bind:this={timelineLine} class="absolute inset-0 w-full bg-white/20"></div>
			<!-- Progress Line -->
			<div
				bind:this={progressLine}
				class="absolute top-0 left-0 w-full bg-primary-gold origin-top"
				style="height: 0%;"
			></div>
		</div>

		<!-- Timeline Nodes -->
		<div class="relative space-y-32 md:space-y-48">
			{#each timelineSteps as step, index}
				{@const isLeft = index % 2 === 0}
				<div
					bind:this={timelineNodes[index]}
					class="relative flex items-center {isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8 md:gap-12"
				>
					<!-- Content Container -->
					<div class="flex-1 {isLeft ? 'pr-0 md:pr-24' : 'pl-0 md:pl-24'}">
						<!-- Photo -->
						<div class="aspect-video w-full overflow-hidden rounded-lg mb-6">
							<img
								src={step.image}
								alt={step.title}
								loading="lazy"
								class="w-full h-full object-cover"
							/>
						</div>

						<!-- Text Block -->
						<div class="space-y-3">
							<div class="flex items-baseline gap-3">
								<h2 class="headline text-3xl md:text-4xl lg:text-5xl font-bold text-accent-white">
									{step.title}
								</h2>
								{#if step.age}
									<span class="text-sm md:text-base uppercase tracking-wider text-primary-gold/70">
										({step.age})
									</span>
								{/if}
							</div>
							<p class="text-base md:text-lg text-accent-white/70 font-light max-w-2xl">
								{step.desc}
							</p>
						</div>
					</div>

					<!-- Connector Dot -->
					<div class="absolute left-1/2 -translate-x-1/2 z-10">
						<div
							bind:this={timelineDots[index]}
							class="w-4 h-4 rounded-full bg-primary-gold shadow-[0_0_20px_rgba(212,175,55,0.6)]"
							style="transform: scale(0);"
						></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Section 3: CTA (Registration) -->
<section class="relative w-full bg-zinc-900 py-32 px-4 sm:px-8 md:px-16 lg:px-24">
	<div class="max-w-4xl mx-auto text-center space-y-8">
		<h2 class="headline text-4xl md:text-5xl lg:text-6xl font-bold text-accent-white uppercase tracking-tight">
			DO YOU HAVE WHAT IT TAKES?
		</h2>
		<button
			onclick={() => isFormOpen = true}
			class="headline px-8 py-4 border-2 border-primary-gold text-primary-gold uppercase tracking-wider text-sm md:text-base hover:bg-primary-gold hover:text-secondary-black transition-all duration-300"
		>
			APPLY FOR TRIALS
		</button>
	</div>
</section>

<AcademyForm bind:isOpen={isFormOpen} on:close={() => isFormOpen = false} />

