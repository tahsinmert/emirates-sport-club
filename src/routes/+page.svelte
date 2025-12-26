<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import { get } from 'svelte/store';
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';
	import { getLenis } from '$lib/utils/lenis';
	import { isPreloaderLoaded } from '$lib/stores/preloader';
	import { Instagram, Twitter, Youtube, Mail, ArrowUp } from 'lucide-svelte';

	// Mock data array for sections
	const sections = [
		{
			id: 1,
			videoSrc: '/hero-video.mp4',
			title: 'EMIRATES LEGACY',
			subtitle: 'BEYOND THE GAME',
			textPosition: 'center' as const
		},
		{
			id: 2,
			videoSrc: '/macro-shot.mp4',
			title: 'PRECISION',
			subtitle: 'ATTENTION TO EVERY DETAIL',
			textPosition: 'bottom-right' as const
		},
		{
			id: 3,
			videoSrc: '/locker-room.mp4',
			title: 'THE PREPARATION',
			subtitle: 'FOCUS BEFORE GLORY',
			textPosition: 'bottom-left' as const
		},
		{
			id: 4,
			videoSrc: '/high-energy.mp4',
			title: 'UNLEASHED',
			subtitle: 'THE SPIRIT OF CHAMPIONS',
			textPosition: 'bottom-left' as const
		},
		{
			id: 5,
			videoSrc: '/passion.mp4',
			title: 'THE FAITHFUL',
			subtitle: 'HEART OF THE CLUB',
			textPosition: 'center' as const
		},
		{
			id: 6,
			videoSrc: '/texture.mp4',
			title: 'CONNECT',
			subtitle: 'EMIRATES SPORT CLUB © 2025',
			textPosition: 'center' as const
		}
	];

	let activeSection = $state(0);
	let sectionElements = $state<HTMLElement[]>([]);
	let navDots = $state<HTMLElement[]>([]);
	let sectionVideos = $state<HTMLVideoElement[]>([]);
	let sectionTexts = $state<HTMLElement[]>([]);
	let scrollTriggerInstances: ScrollTrigger[] = [];

	function scrollToSection(index: number) {
		if (typeof window === 'undefined') return;
		
		const lenis = getLenis();
		if (!lenis || !sectionElements[index]) return;

		lenis.scrollTo(sectionElements[index], { 
			duration: 1.2, 
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
		});
	}

	function scrollToTop() {
		if (typeof window === 'undefined') return;
		
		const lenis = getLenis();
		if (!lenis) return;

		lenis.scrollTo(0, { 
			duration: 1.5, 
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
		});
	}

	function setupHeroReveal() {
		if (typeof window === 'undefined' || sectionVideos.length === 0 || sectionTexts.length === 0) return;

		const firstVideo = sectionVideos[0];
		const firstText = sectionTexts[0];

		if (!firstVideo || !firstText) return;

		// İlk video için başlangıç durumu: scale 1.2 (zoomed in) ve hafif brightness düşür
		gsap.set(firstVideo, {
			scale: 1.2,
			filter: 'brightness(0.7)'
		});

		// İlk text için başlangıç durumu: yukarıda ve görünmez
		gsap.set(firstText, {
			y: 100,
			opacity: 0
		});

		// Hero reveal timeline oluştur
		const heroTimeline = gsap.timeline({
			delay: 0.3 // Preloader exit animasyonundan biraz sonra başla
		});

		// Video animasyonu: scale 1.2'den 1.0'a, brightness normale dön
		heroTimeline.to(firstVideo, {
			scale: 1.0,
			filter: 'brightness(1)',
			duration: 1.8,
			ease: 'power3.out'
		});

		// Text animasyonu: yukarıdan aşağıya ve fade in (video animasyonu başladıktan sonra)
		heroTimeline.to(
			firstText,
			{
				y: 0,
				opacity: 1,
				duration: 1.2,
				ease: 'expo.out'
			},
			'-=1.0' // Video animasyonundan 1 saniye önce başla (overlap)
		);
	}

	function setupStackedPinning() {
		if (typeof window === 'undefined' || sectionElements.length === 0) return;

		// Tüm video'ları başlangıçta durdur
		sectionVideos.forEach((video) => {
			if (video) {
				video.pause();
				video.currentTime = 0;
			}
		});

		// İlk section hariç diğer text elementlerini başlangıç durumuna ayarla
		// (İlk text için reveal animasyonu ayrı yapılacak)
		sectionTexts.forEach((text, index) => {
			if (index !== 0 && text) {
				gsap.set(text, {
					y: 100,
					opacity: 0
				});
			}
		});

		// ScrollTrigger.matchMedia ile responsive optimizasyon
		ScrollTrigger.matchMedia({
			// Desktop: Full stacked pinning effect
			"(min-width: 769px)": function() {
				// Her section için ScrollTrigger ile pin efekti oluştur
				sectionElements.forEach((section, index) => {
					const video = sectionVideos[index];
					const text = sectionTexts[index];

					if (!section || !video || !text) return;

					// ScrollTrigger ile pin efekti - Stacked Pinning
					const scrollTrigger = ScrollTrigger.create({
						trigger: section,
						start: 'top top',
						end: '+=100%', // Section yüksekliği kadar scroll
						pin: true,
						pinSpacing: true,
						scrub: true,
						anticipatePin: 1,
						onEnter: () => {
							// Section viewport'a girdiğinde video'yu oynat
							activeSection = index;
							updateNavDots();
							
							if (video.readyState >= 2) {
								video.play().catch(() => {
									video.muted = true;
									video.play();
								});
							} else {
								video.addEventListener('loadedmetadata', () => {
									video.play().catch(() => {
										video.muted = true;
										video.play();
									});
								}, { once: true });
							}

							// Diğer video'ları durdur
							sectionVideos.forEach((otherVideo, otherIndex) => {
								if (otherIndex !== index && otherVideo) {
									otherVideo.pause();
								}
							});
						},
						onLeave: () => {
							// Section'tan çıkarken video'yu durdur
							if (video) {
								video.pause();
							}
						},
						onEnterBack: () => {
							// Geri dönüşte video'yu oynat
							activeSection = index;
							updateNavDots();
							
							if (video.readyState >= 2) {
								video.play().catch(() => {
									video.muted = true;
									video.play();
								});
							}

							// Diğer video'ları durdur
							sectionVideos.forEach((otherVideo, otherIndex) => {
								if (otherIndex !== index && otherVideo) {
									otherVideo.pause();
								}
							});
						},
						onLeaveBack: () => {
							// Geri yukarı çıkarken video'yu durdur
							if (video) {
								video.pause();
							}
						},
						onUpdate: (self) => {
							const progress = self.progress;
							
							// Text parallax ve fade in animasyonu
							// Text y ekseninde daha yavaş hareket eder (parallax)
							const parallaxY = progress * -50; // Yavaşça yukarı hareket
							const opacity = Math.min(1, progress * 2); // Fade in

							gsap.to(text, {
								y: parallaxY,
								opacity: opacity,
								duration: 0.1,
								ease: 'none'
							});
						}
					});
					
					scrollTriggerInstances.push(scrollTrigger);
				});

				// Snap özelliği ekle (yumuşak snap) - kullanıcının section'lar arasında takılıp kalmaması için
				if (sectionElements.length > 0) {
					const snapTrigger = ScrollTrigger.create({
						trigger: sectionElements[0],
						start: 'top top',
						end: `+=${sectionElements.length * 100}%`,
						snap: {
							snapTo: 1 / sectionElements.length, // Her section'a snap
							duration: { min: 0.2, max: 0.6 },
							delay: 0.1,
							ease: 'power1.inOut'
						}
					});
					scrollTriggerInstances.push(snapTrigger);
				}
			},
			
			// Mobile: Simplified scroll - no pinning, just video playback on enter
			"(max-width: 768px)": function() {
				// Mobile'da native scroll, pin efektini kaldır
				// Video'ları section görünür olduğunda oynat
				sectionElements.forEach((section, index) => {
					const video = sectionVideos[index];
					const text = sectionTexts[index];

					if (!section || !video || !text) return;

					// Basit ScrollTrigger - sadece video playback kontrolü
					const scrollTrigger = ScrollTrigger.create({
						trigger: section,
						start: 'top 80%',
						end: 'bottom 20%',
						onEnter: () => {
							activeSection = index;
							updateNavDots();
							
							if (video.readyState >= 2) {
								video.play().catch(() => {
									video.muted = true;
									video.play();
								});
							}

							// Diğer video'ları durdur
							sectionVideos.forEach((otherVideo, otherIndex) => {
								if (otherIndex !== index && otherVideo) {
									otherVideo.pause();
								}
							});
						},
						onLeave: () => {
							if (video) {
								video.pause();
							}
						},
						onEnterBack: () => {
							activeSection = index;
							updateNavDots();
							
							if (video.readyState >= 2) {
								video.play().catch(() => {
									video.muted = true;
									video.play();
								});
							}

							sectionVideos.forEach((otherVideo, otherIndex) => {
								if (otherIndex !== index && otherVideo) {
									otherVideo.pause();
								}
							});
						},
						onLeaveBack: () => {
							if (video) {
								video.pause();
							}
						},
						onUpdate: (self) => {
							const progress = self.progress;
							
							// Mobile'da daha hafif text animasyonu
							const parallaxY = progress * -20; // Daha az parallax
							const opacity = Math.min(1, progress * 1.5); // Daha hızlı fade in

							gsap.to(text, {
								y: parallaxY,
								opacity: opacity,
								duration: 0.1,
								ease: 'none'
							});
						}
					});
					
					scrollTriggerInstances.push(scrollTrigger);
				});

				// Mobile'da text'leri başlangıçta görünür yap (daha az animasyon)
				sectionTexts.forEach((text, index) => {
					if (index !== 0 && text) {
						gsap.set(text, {
							y: 30,
							opacity: 0.8
						});
					}
				});
			}
		});
	}

	function cleanup() {
		if (typeof window === 'undefined') return;
		
		// Tüm ScrollTrigger instance'larını temizle
		scrollTriggerInstances.forEach((trigger) => {
			if (trigger) {
				trigger.kill();
			}
		});
		scrollTriggerInstances = [];
		
		// Section elementlerindeki pin spacing'i temizle
		sectionElements.forEach((section) => {
			if (section) {
				gsap.set(section, { clearProps: 'all' });
			}
		});
		
		// Text elementlerindeki transform'ları temizle
		sectionTexts.forEach((text) => {
			if (text) {
				gsap.set(text, { clearProps: 'transform,opacity,y' });
			}
		});
		
		// Video'ları durdur
		sectionVideos.forEach((video) => {
			if (video) {
				video.pause();
				video.currentTime = 0;
			}
		});
		
		// ScrollTrigger refresh yap
		ScrollTrigger.refresh();
	}

	function updateNavDots() {
		if (navDots.length === 0) return;
		
		navDots.forEach((dot, index) => {
			if (index === activeSection) {
				dot.classList.add('scale-150', 'bg-primary-gold', 'shadow-[0_0_20px_rgba(212,175,55,0.8)]');
				dot.classList.remove('bg-white/40');
			} else {
				dot.classList.remove('scale-150', 'bg-primary-gold', 'shadow-[0_0_20px_rgba(212,175,55,0.8)]');
				dot.classList.add('bg-white/40');
			}
		});
	}

	function initPage() {
		if (typeof window === 'undefined' || sectionElements.length === 0) return;
		
		setTimeout(() => {
			// Önce Hero reveal animasyonunu başlat
			setupHeroReveal();
			// Sonra stacked pinning'i kur
			setupStackedPinning();
			// İlk section'ı aktif olarak işaretle
			activeSection = 0;
			setTimeout(() => updateNavDots(), 300);
		}, 200);
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		// Section elementlerini topla (.section class'ına sahip elementler)
		const sectionNodes = document.querySelectorAll('.section');
		sectionElements = Array.from(sectionNodes) as HTMLElement[];

		// Preloader durumunu kontrol et - eğer zaten yüklenmişse direkt başlat
		const currentPreloaderState = get(isPreloaderLoaded);
		if (currentPreloaderState && sectionElements.length > 0) {
			initPage();
		} else {
			// Preloader'dan sonra setup'ı başlat
			const unsubscribe = isPreloaderLoaded.subscribe((loaded) => {
				if (loaded && sectionElements.length > 0) {
					initPage();
					unsubscribe();
				}
			});

			return () => {
				unsubscribe();
				cleanup();
			};
		}

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

{#each sections as section, index}
	<section class="section video-section relative h-dvh w-full overflow-hidden">
		<!-- Video Background -->
		<video
			bind:this={sectionVideos[index]}
			class="absolute inset-0 w-full h-full object-cover"
			muted
			loop
			playsinline
			preload="metadata"
		>
			<source src={section.videoSrc} type="video/mp4" />
		</video>

		<!-- Dark Overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/95 {index === 1 ? 'via-black/50' : index === 2 ? 'via-black/85' : index === 3 ? 'via-black/70' : 'via-black/40'} to-transparent z-10"></div>
		{#if index === 2}
			<!-- Additional gradient overlay for locker-room section - serious and quiet mood -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10"></div>
		{/if}
		{#if index === 3}
			<!-- Additional gradient overlay for high-energy section for better text readability -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
		{/if}

		<!-- Text Overlay Container -->
		<div
			bind:this={sectionTexts[index]}
			class="absolute z-20 {section.textPosition === 'center'
				? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4 sm:px-6'
				: section.textPosition === 'bottom-right'
				? 'bottom-6 sm:bottom-16 right-6 sm:right-16 text-right'
				: 'bottom-6 sm:bottom-16 left-6 sm:left-16 text-left'} w-full max-w-4xl"
		>
			<h2 class="headline text-6xl sm:text-7xl md:text-8xl lg:text-9xl {index === 2 ? 'font-light' : 'font-bold'} text-accent-white mb-4 leading-none uppercase {index === 2 ? 'drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-tight' : index === 3 ? 'drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]' : ''} {index === 3 ? 'xl:text-[10rem]' : ''}">
				{section.title}
			</h2>
			<p class="headline text-xs tracking-widest uppercase text-primary-gold {index === 2 ? 'drop-shadow-[0_0_20px_rgba(0,0,0,0.9)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-sm sm:text-base font-light tracking-[0.2em] opacity-90' : index === 3 ? 'drop-shadow-[0_0_20px_rgba(0,0,0,0.9)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-sm sm:text-base font-semibold' : ''}">
				{section.subtitle}
			</p>
			{#if index === 4}
				<a href="#" class="inline-block mt-8 text-sm tracking-widest uppercase text-accent-white hover:text-primary-gold transition-colors duration-300 underline decoration-primary-gold/50 hover:decoration-primary-gold">
					Join the Club
				</a>
			{/if}
			{#if index === sections.length - 1}
				<!-- Footer Content: Social Links & Contact -->
				<div class="mt-12 flex flex-col items-center gap-8">
					<!-- Social Media Links -->
					<div class="flex items-center gap-6">
						<a
							href="https://instagram.com/emiratessportclub"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center justify-center w-12 h-12 rounded-full border border-primary-gold/40 hover:border-primary-gold transition-all duration-300 hover:bg-primary-gold/10"
							aria-label="Instagram"
						>
							<Instagram
								class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300"
							/>
						</a>
						<a
							href="https://twitter.com/emiratessportclub"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center justify-center w-12 h-12 rounded-full border border-primary-gold/40 hover:border-primary-gold transition-all duration-300 hover:bg-primary-gold/10"
							aria-label="Twitter"
						>
							<Twitter
								class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300"
							/>
						</a>
						<a
							href="https://youtube.com/@emiratessportclub"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center justify-center w-12 h-12 rounded-full border border-primary-gold/40 hover:border-primary-gold transition-all duration-300 hover:bg-primary-gold/10"
							aria-label="YouTube"
						>
							<Youtube
								class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300"
							/>
						</a>
					</div>

					<!-- Contact Us Button -->
					<a
						href="mailto:contact@emiratessportclub.com"
						class="group flex items-center gap-2 px-6 py-3 border border-primary-gold/40 hover:border-primary-gold bg-transparent hover:bg-primary-gold/10 transition-all duration-300 text-sm tracking-widest uppercase text-primary-gold/70 hover:text-primary-gold"
					>
						<Mail class="w-4 h-4" />
						Contact Us
					</a>
				</div>

				<!-- Back to Top Button -->
				<button
					on:click={scrollToTop}
					class="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center w-12 h-12 rounded-full border border-primary-gold/40 hover:border-primary-gold bg-black/20 hover:bg-primary-gold/10 backdrop-blur-sm transition-all duration-300 group"
					aria-label="Back to Top"
				>
					<ArrowUp
						class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300"
					/>
				</button>
			{/if}
		</div>
	</section>
{/each}

<!-- Navigation Dots -->
<div class="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
	{#each sections as _, index}
		<button
			bind:this={navDots[index]}
			on:click={() => scrollToSection(index)}
			class="w-3 h-3 rounded-full bg-white/40 transition-all duration-300 hover:scale-125 {index === activeSection ? 'scale-150 bg-primary-gold shadow-[0_0_20px_rgba(212,175,55,0.8)]' : ''}"
			aria-label="Navigate to section {index + 1}"
		></button>
	{/each}
</div>
