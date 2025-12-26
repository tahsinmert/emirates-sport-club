<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';

	interface Product {
		id: number;
		name: string;
		price: string;
		category: 'KITS' | 'TRAINING' | 'ACCESSORIES';
		image: string;
		tag?: 'NEW SEASON' | 'LIMITED';
		featured?: boolean;
	}

	// Mock Products Data - İlk ürün '24/25 HOME KIT' ve featured olmalı
	const products: Product[] = [
		{
			id: 1,
			name: '24/25 HOME KIT',
			price: '$120.00',
			category: 'KITS',
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop&q=80',
			tag: 'NEW SEASON',
			featured: true
		},
		{
			id: 2,
			name: 'TRAINING JACKET',
			price: '$145.00',
			category: 'TRAINING',
			image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c4c?w=800&h=1200&fit=crop&q=80',
			tag: 'LIMITED'
		},
		{
			id: 3,
			name: 'AWAY KIT 24/25',
			price: '$120.00',
			category: 'KITS',
			image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop&q=80',
			tag: 'NEW SEASON'
		},
		{
			id: 4,
			name: 'ELITE TRAINING SHORTS',
			price: '$85.00',
			category: 'TRAINING',
			image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=1200&fit=crop&q=80'
		},
		{
			id: 5,
			name: 'MATCH SCARF',
			price: '$65.00',
			category: 'ACCESSORIES',
			image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=1200&fit=crop&q=80',
			tag: 'LIMITED'
		},
		{
			id: 6,
			name: 'PREMIUM CAP',
			price: '$55.00',
			category: 'ACCESSORIES',
			image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=1200&fit=crop&q=80'
		}
	];

	let heroSection: HTMLElement;
	let heroVideo: HTMLVideoElement;
	let featuredSection: HTMLElement;
	let featuredImage: HTMLElement;
	let featuredTitle: HTMLElement;
	let shopButton: HTMLElement;
	let productCards = $state<HTMLElement[]>([]);
	let productImages = $state<HTMLElement[]>([]);
	let productPrices = $state<HTMLElement[]>([]);
	let quickBuyButtons = $state<HTMLElement[]>([]);

	// Magnetic button effect
	function setupMagneticButton(button: HTMLElement) {
		if (!button) return;

		const handleMouseMove = (e: MouseEvent) => {
			const rect = button.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			gsap.to(button, {
				x: x * 0.3,
				y: y * 0.3,
				duration: 0.6,
				ease: 'power2.out'
			});
		};

		const handleMouseLeave = () => {
			gsap.to(button, {
				x: 0,
				y: 0,
				duration: 0.6,
				ease: 'power2.out'
			});
		};

		button.addEventListener('mousemove', handleMouseMove);
		button.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			button.removeEventListener('mousemove', handleMouseMove);
			button.removeEventListener('mouseleave', handleMouseLeave);
		};
	}

	// Product hover interactions
	function setupProductHovers() {
		if (typeof window === 'undefined' || productCards.length === 0) return;

		productCards.forEach((card, index) => {
			if (!card) return;

			const image = productImages[index];
			const price = productPrices[index];
			const quickBuy = quickBuyButtons[index];

			if (!image) return;

			// Hover enter
			card.addEventListener('mouseenter', () => {
				// Image scale
				gsap.to(image, {
					scale: 1.05,
					duration: 0.4,
					ease: 'power2.out'
				});

				// Quick buy button slide up
				if (quickBuy) {
					gsap.to(quickBuy, {
						y: 0,
						opacity: 1,
						duration: 0.4,
						ease: 'power2.out'
					});
				}

				// Price flash/color change
				if (price) {
					gsap.to(price, {
						color: '#E5C866', // primary-light (daha parlak altın)
						duration: 0.3,
						ease: 'power2.out'
					});
				}
			});

			// Hover leave
			card.addEventListener('mouseleave', () => {
				// Reset image scale
				gsap.to(image, {
					scale: 1,
					duration: 0.4,
					ease: 'power2.out'
				});

				// Reset quick buy button
				if (quickBuy) {
					gsap.to(quickBuy, {
						y: 20,
						opacity: 0,
						duration: 0.4,
						ease: 'power2.out'
					});
				}

				// Reset price color
				if (price) {
					gsap.to(price, {
						color: '#D4AF37', // primary-gold
						duration: 0.3,
						ease: 'power2.out'
					});
				}
			});
		});
	}

	// Featured section parallax
	function setupFeaturedParallax() {
		if (typeof window === 'undefined' || !featuredSection || !featuredImage) return;

		ScrollTrigger.matchMedia({
			// Desktop: Full parallax effect
			"(min-width: 769px)": function() {
				ScrollTrigger.create({
					trigger: featuredSection,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true,
					onUpdate: (self) => {
						const progress = self.progress;
						// Rotate ve scale animasyonu
						gsap.to(featuredImage, {
							rotation: progress * 10,
							scale: 1 + progress * 0.1,
							duration: 0.1,
							ease: 'none'
						});
					}
				});
			},
			
			// Mobile: Reduced or no parallax
			"(max-width: 768px)": function() {
				// Mobile'da parallax efektini kaldır veya çok hafif tut
				// Sadece görünür olduğunda fade in yap
				ScrollTrigger.create({
					trigger: featuredSection,
					start: 'top 80%',
					once: true,
					onEnter: () => {
						gsap.to(featuredImage, {
							opacity: 1,
							duration: 0.8,
							ease: 'power2.out'
						});
					}
				});
			}
		});
	}

	// Product grid stagger animation
	function setupProductGridReveal() {
		if (typeof window === 'undefined' || productCards.length === 0) return;

		ScrollTrigger.matchMedia({
			// Desktop: Full animations with parallax
			"(min-width: 769px)": function() {
				ScrollTrigger.batch('.product-card', {
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
								stagger: 0.2
							}
						);
					},
					once: true
				});

				// Parallax effect for product images (desktop only)
				productImages.forEach((image, index) => {
					if (!image) return;

					ScrollTrigger.create({
						trigger: image.closest('.product-card'),
						start: 'top bottom',
						end: 'bottom top',
						scrub: true,
						onUpdate: (self) => {
							const progress = self.progress;
							const parallaxY = progress * -30; // Yavaşça yukarı hareket
							gsap.to(image, {
								y: parallaxY,
								duration: 0.1,
								ease: 'none'
							});
						}
					});
				});
			},
			
			// Mobile: Simplified animations, no parallax
			"(max-width: 768px)": function() {
				ScrollTrigger.batch('.product-card', {
					onEnter: (elements) => {
						gsap.fromTo(
							elements,
							{
								y: 30,
								opacity: 0
							},
							{
								y: 0,
								opacity: 1,
								duration: 0.6,
								ease: 'power2.out',
								stagger: 0.1
							}
						);
					},
					once: true
				});
				// Mobile'da parallax efektini kaldır
			}
		});
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		// Hero video oynat
		if (heroVideo) {
			heroVideo.play().catch(() => {
				heroVideo.muted = true;
				heroVideo.play();
			});
		}

		// Magnetic button setup
		if (shopButton) {
			setupMagneticButton(shopButton);
		}

		// Quick buy buttons'ı başlangıç durumuna ayarla
		quickBuyButtons.forEach((button) => {
			if (button) {
				gsap.set(button, {
					y: 20,
					opacity: 0
				});
			}
		});

		setTimeout(() => {
			setupFeaturedParallax();
			setupProductHovers();
			setupProductGridReveal();
		}, 300);

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<svelte:head>
	<title>Store - Emirates Sport Club</title>
	<meta name="description" content="Official Emirates Sport Club merchandise. The 24/25 Collection." />
</svelte:head>

<!-- Section 1: The Campaign (Hero) -->
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
		<source src="/store-hero.mp4" type="video/mp4" />
	</video>

	<!-- Dark Overlay -->
	<div class="absolute inset-0 bg-black/40 z-10"></div>

	<!-- Content Overlay -->
	<div class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
		<h1 class="headline text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-accent-white uppercase tracking-tight mb-6">
			ARMOUR OF GOLD
		</h1>
		<p class="text-sm sm:text-base md:text-lg uppercase tracking-[0.3em] text-accent-white/90 mb-12 font-light">
			THE 24/25 COLLECTION IS HERE
		</p>
		<button
			bind:this={shopButton}
			class="relative px-12 py-4 border-2 border-accent-white text-accent-white uppercase tracking-widest text-sm font-light transition-all duration-300 hover:bg-accent-white hover:text-secondary-black overflow-hidden"
		>
			<span class="relative z-10">SHOP THE DROP</span>
		</button>
	</div>
</section>

<!-- Section 2: Featured Spotlight (The Kit) -->
<section bind:this={featuredSection} class="relative min-h-screen md:h-dvh w-full overflow-hidden bg-secondary-black flex flex-col md:flex-row items-center">
	<!-- Left: Typography -->
	<div class="absolute md:relative left-0 top-0 md:top-auto bottom-auto md:bottom-auto w-full md:w-1/2 h-auto md:h-full flex items-center justify-center z-10 px-4 md:px-8 lg:px-16 py-8 md:py-0">
		<h2
			bind:this={featuredTitle}
			class="headline text-[4rem] sm:text-[6rem] md:text-[12rem] lg:text-[16rem] xl:text-[20rem] font-bold text-primary-gold/10 select-none uppercase leading-none"
			style="writing-mode: vertical-rl; text-orientation: mixed;"
		>
			HOME KIT
		</h2>
	</div>

	<!-- Right: Featured Jersey Image -->
	<div class="absolute md:relative right-0 top-auto md:top-auto bottom-0 md:bottom-auto w-full md:w-1/2 h-[60vh] md:h-full flex items-center justify-center z-20 px-4 md:px-8 lg:px-16 py-8 md:py-0">
		<div class="relative w-full max-w-md h-full md:h-[80dvh] flex items-center justify-center">
			<img
				bind:this={featuredImage}
				src={products[0].image}
				alt={products[0].name}
				class="w-full h-full object-contain"
			/>
		</div>
	</div>
</section>

<!-- Section 3: The Collection (Product Grid) -->
<section class="relative w-full bg-secondary-black py-16 md:py-32 px-4 sm:px-8 md:px-16 lg:px-24">
	<div class="container mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 md:gap-y-20 gap-x-6 md:gap-x-10">
			{#each products as product, index}
				<article
					bind:this={productCards[index]}
					class="product-card group cursor-pointer"
				>
					<!-- Image Container -->
					<div class="relative aspect-[3/4] w-full bg-zinc-900/20 overflow-hidden">
						<img
							bind:this={productImages[index]}
							src={product.image}
							alt={product.name}
							loading="lazy"
							class="w-full h-full object-cover object-center"
						/>

						<!-- Tag Badge -->
						{#if product.tag}
							<div class="absolute top-4 left-4 z-10">
								<span class="inline-block px-3 py-1 bg-secondary-black/80 backdrop-blur-sm text-xs uppercase tracking-wider text-primary-gold border border-primary-gold/30">
									{product.tag}
								</span>
							</div>
						{/if}

						<!-- Quick Buy Button (Slides up on hover) -->
						<div
							bind:this={quickBuyButtons[index]}
							class="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6"
						>
							<button
								class="w-full px-6 py-4 bg-accent-white text-secondary-black uppercase tracking-widest text-xs font-bold transition-all duration-300 hover:bg-primary-gold hover:text-secondary-black"
							>
								QUICK BUY
							</button>
						</div>
					</div>

					<!-- Product Info -->
					<div class="mt-6 space-y-2">
						<p class="text-xs uppercase tracking-widest text-accent-white/40 font-light">
							{product.category}
						</p>
						<h3 class="headline text-xl md:text-2xl font-bold text-accent-white uppercase leading-tight">
							{product.name}
						</h3>
						<p
							bind:this={productPrices[index]}
							class="headline text-2xl font-light text-primary-gold mt-2"
						>
							{product.price}
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.product-card {
		will-change: transform, opacity;
	}

	.product-card img {
		will-change: transform;
	}

	#shop-button {
		transform-style: preserve-3d;
	}
</style>
