<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';

	// Mock Players Data
	const players = [
		{
			id: 1,
			name: 'ALEX MERCER',
			number: '10',
			position: 'Striker',
			stats: { Goals: 24, Matches: 30 },
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop&q=80'
		},
		{
			id: 2,
			name: 'JONAH BLAKE',
			number: '07',
			position: 'Midfield',
			stats: { Goals: 12, Matches: 28 },
			image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c4c?w=800&h=1200&fit=crop&q=80'
		},
		{
			id: 3,
			name: 'MARCUS REED',
			number: '09',
			position: 'Striker',
			stats: { Goals: 18, Matches: 25 },
			image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=1200&fit=crop&q=80'
		},
		{
			id: 4,
			name: 'ETHAN CROSS',
			number: '04',
			position: 'Defender',
			stats: { Goals: 3, Matches: 32 },
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop&q=80'
		},
		{
			id: 5,
			name: 'NOAH STONE',
			number: '08',
			position: 'Midfield',
			stats: { Goals: 15, Matches: 29 },
			image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop&q=80'
		},
		{
			id: 6,
			name: 'LUKE WILSON',
			number: '11',
			position: 'Winger',
			stats: { Goals: 20, Matches: 27 },
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop&q=80'
		},
		{
			id: 7,
			name: 'JAMES PARKER',
			number: '06',
			position: 'Defender',
			stats: { Goals: 2, Matches: 31 },
			image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c4c?w=800&h=1200&fit=crop&q=80'
		},
		{
			id: 8,
			name: 'RYAN COLE',
			number: '01',
			position: 'Goalkeeper',
			stats: { Goals: 0, Matches: 33 },
			image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=1200&fit=crop&q=80'
		}
	];

	let heroSection: HTMLElement;
	let gallerySection: HTMLElement;
	let galleryTrack: HTMLElement;
	let heroVideo: HTMLVideoElement;
	let playerCards = $state<HTMLElement[]>([]);
	let statsBoxes = $state<HTMLElement[]>([]);
	let scrollTriggerInstance: ScrollTrigger | null = null;

	function setupHorizontalScroll() {
		if (typeof window === 'undefined' || !gallerySection || !galleryTrack) return;

		// ScrollTrigger.matchMedia ile responsive optimizasyon
		ScrollTrigger.matchMedia({
			// Desktop: Horizontal scroll pinning
			"(min-width: 769px)": function() {
				// Horizontal scroll animasyonu
				// Track'i sola kaydır - her player card'ın genişliği kadar
				const trackWidth = galleryTrack.scrollWidth;
				const containerWidth = gallerySection.offsetWidth;
				const scrollDistance = trackWidth - containerWidth;

				const instance = gsap.to(galleryTrack, {
					x: -scrollDistance,
					ease: 'none',
					scrollTrigger: {
						trigger: gallerySection,
						start: 'top top',
						end: '+=3000',
						scrub: 1,
						pin: true,
						pinSpacing: true,
						anticipatePin: 1,
						onEnter: () => {
							// Gallery'e girildiğinde video'yu durdur
							if (heroVideo) {
								heroVideo.pause();
							}
						}
					}
				}).scrollTrigger;
				
				scrollTriggerInstance = instance;
			},
			
			// Mobile: Vertical stack - no horizontal scroll pinning
			"(max-width: 768px)": function() {
				// Mobile'da horizontal scroll'u devre dışı bırak
				// Gallery track'i normal scroll'a dönüştür (flex-direction: column ekle)
				gsap.set(galleryTrack, {
					clearProps: 'transform'
				});
				
				// Gallery'e girildiğinde video'yu durdur (basit ScrollTrigger)
				ScrollTrigger.create({
					trigger: gallerySection,
					start: 'top 80%',
					onEnter: () => {
						if (heroVideo) {
							heroVideo.pause();
						}
					}
				});
			}
		});
	}

	function cleanup() {
		if (typeof window === 'undefined') return;
		
		// ScrollTrigger'ları temizle
		if (scrollTriggerInstance) {
			scrollTriggerInstance.kill();
			scrollTriggerInstance = null;
		}
		
		// Bu sayfaya ait tüm ScrollTrigger'ları temizle (matchMedia ile oluşturulanlar dahil)
		if (gallerySection || galleryTrack) {
			ScrollTrigger.getAll().forEach((trigger) => {
				const triggerElement = trigger.trigger || trigger.vars?.trigger;
				if (triggerElement === gallerySection || triggerElement === galleryTrack) {
					trigger.kill();
				}
			});
		}

		// Pin spacing ve transform'ları temizle
		if (gallerySection) {
			gsap.set(gallerySection, { clearProps: 'all' });
		}
		if (galleryTrack) {
			gsap.set(galleryTrack, { clearProps: 'transform,x' });
		}
		
		// ScrollTrigger refresh yap
		ScrollTrigger.refresh();
	}

	function setupPlayerCardHovers() {
		if (typeof window === 'undefined' || playerCards.length === 0) return;

		playerCards.forEach((card, index) => {
			const statsBox = statsBoxes[index];
			if (!card || !statsBox) return;

			const cardImage = card.querySelector('.player-image');
			if (!cardImage) return;

			// Hover enter
			card.addEventListener('mouseenter', () => {
				gsap.to(cardImage, {
					scale: 1.1,
					duration: 0.4,
					ease: 'power2.out'
				});

				gsap.to(statsBox, {
					y: 0,
					opacity: 1,
					duration: 0.4,
					ease: 'power2.out'
				});
			});

			// Hover leave
			card.addEventListener('mouseleave', () => {
				gsap.to(cardImage, {
					scale: 1,
					duration: 0.4,
					ease: 'power2.out'
				});

				gsap.to(statsBox, {
					y: 20,
					opacity: 0,
					duration: 0.4,
					ease: 'power2.out'
				});
			});
		});
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		// Hero video'yu oynat
		if (heroVideo) {
			heroVideo.play().catch(() => {
				heroVideo.muted = true;
				heroVideo.play();
			});
		}

		// Stats box'ları başlangıç durumuna ayarla
		statsBoxes.forEach((box) => {
			if (box) {
				gsap.set(box, {
					y: 20,
					opacity: 0
				});
			}
		});

		// Horizontal scroll setup
		setTimeout(() => {
			setupHorizontalScroll();
			setupPlayerCardHovers();
		}, 100);

		return () => {
			cleanup();
		};
	});

	// Sayfa değiştiğinde temizlik yap
	beforeNavigate(() => {
		cleanup();
	});

	onDestroy(() => {
		cleanup();
	});
</script>

<!-- Section 1: Hero (Vertical) -->
<section bind:this={heroSection} class="relative h-dvh w-full overflow-hidden">
	<!-- Video Background -->
	<video
		bind:this={heroVideo}
		class="absolute inset-0 w-full h-full object-cover"
		muted
		loop
		playsinline
		preload="auto"
	>
		<source src="/squad-hero.mp4" type="video/mp4" />
	</video>

	<!-- Dark Overlay -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

	<!-- Title Overlay -->
	<div class="absolute inset-0 z-20 flex items-center justify-center">
		<h1 class="headline text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold text-accent-white uppercase tracking-tight text-center px-6">
			THE FIRST TEAM
		</h1>
	</div>
</section>

<!-- Section 2: The Gallery (Horizontal Scroll Container) -->
<section bind:this={gallerySection} class="relative min-h-screen md:h-dvh w-full overflow-hidden bg-gradient-to-b from-secondary-black via-secondary-dark to-secondary-black">
	<!-- The Track -->
	<div
		bind:this={galleryTrack}
		class="flex flex-col md:flex-row h-full items-center gap-6 px-4 md:px-8 py-8 md:py-0"
		style="will-change: transform;"
	>
		{#each players as player, index}
			<!-- Player Card -->
			<a
				href="/squad/{player.id}"
				class="block"
			>
			<div
				bind:this={playerCards[index]}
				class="player-card relative flex-shrink-0 w-full md:min-w-[400px] md:w-[30vw] h-[70vh] md:h-[85dvh] bg-secondary-light/20 rounded-lg overflow-hidden group cursor-pointer"
			>
				<!-- Background Number (Gold, Low Opacity) -->
				<div class="absolute inset-0 flex items-center justify-center z-0">
					<span
						class="headline text-[20rem] font-bold text-primary-gold/10 select-none"
						style="line-height: 1;"
					>
						{player.number}
					</span>
				</div>

				<!-- Player Image -->
				<div class="relative z-10 h-full w-full overflow-hidden">
					<img
						src={player.image}
						alt={player.name}
						class="player-image w-full h-full object-cover object-center transition-transform duration-400"
					/>
				</div>

				<!-- Dark Gradient Overlay -->
				<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20"></div>

				<!-- Player Info -->
				<div class="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-8">
					<div class="headline text-4xl font-bold text-accent-white mb-2">
						{player.name}
					</div>
					<div class="text-sm uppercase tracking-wider text-primary-gold/80 mb-4">
						{player.position}
					</div>
					<div class="headline text-6xl font-bold text-primary-gold/60">
						#{player.number}
					</div>
				</div>

				<!-- Stats Box (Slides up on hover) -->
				<div
					bind:this={statsBoxes[index]}
					class="absolute bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-t border-primary-gold/30 p-4 md:p-6"
				>
					<div class="flex items-center justify-between">
						<div class="flex flex-col">
							<span class="text-xs uppercase tracking-wider text-primary-gold/60 mb-1">Goals</span>
							<span class="headline text-3xl font-bold text-accent-white">{player.stats.Goals}</span>
						</div>
						<div class="flex flex-col">
							<span class="text-xs uppercase tracking-wider text-primary-gold/60 mb-1">Matches</span>
							<span class="headline text-3xl font-bold text-accent-white">{player.stats.Matches}</span>
						</div>
					</div>
				</div>
			</div>
			</a>
		{/each}
	</div>
</section>

<style>
	.player-card {
		transition: transform 0.3s ease;
	}

	.player-card:hover {
		transform: translateY(-8px);
	}
</style>

