<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { gsap } from '$lib/utils/gsap';
	import { getLenis } from '$lib/utils/lenis';
	import { isPreloaderLoaded } from '$lib/stores/preloader';
	import { get } from 'svelte/store';

	const navLinks = [
		{ name: 'HOME', path: '/' },
		{ name: 'THE SQUAD', path: '/squad' },
		{ name: 'ACADEMY', path: '/academy' },
		{ name: 'NEWS', path: '/news' },
		{ name: 'STORE', path: '/store' }
	];

	let navbar: HTMLElement;
	let isScrolled = $state(false);
	let isMobileMenuOpen = $state(false);
	let handleScroll: (() => void) | null = null;
	let preloaderLoaded = $state(false);
	let scrollListenersSetup = $state(false);
	let lastScrollY = 0;

	function isActive(path: string): boolean {
		return $page.url.pathname === path;
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
		// Lock/unlock body scroll
		if (typeof document !== 'undefined') {
			if (isMobileMenuOpen) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		}
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
		// Unlock body scroll
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	}

	function handleOverlayKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			closeMobileMenu();
		}
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		// Preloader durumunu kontrol et
		const unsubscribe = isPreloaderLoaded.subscribe((loaded) => {
			preloaderLoaded = loaded;
			
			// Preloader tamamlandıktan sonra scroll event'lerini başlat
			if (loaded && navbar) {
				// Navbar'ı görünür yap
				gsap.set(navbar, { yPercent: 0, opacity: 1 });
				
				// Scroll event listener'larını başlat
				setupScrollListeners();
			}
		});

		// Eğer preloader zaten yüklenmişse direkt başlat
		const currentState = get(isPreloaderLoaded);
		if (currentState) {
			preloaderLoaded = true;
			// Navbar'ı görünür yap
			if (navbar) {
				gsap.set(navbar, { yPercent: 0, opacity: 1 });
			}
			setupScrollListeners();
		}

		function setupScrollListeners() {
			if (!navbar || scrollListenersSetup) return; // Zaten kurulmuşsa tekrar kurma

			scrollListenersSetup = true;

			handleScroll = (e?: any) => {
				if (!preloaderLoaded) return; // Preloader tamamlanmadan scroll dinleme

				const lenis = getLenis();
				const currentScrollY = e?.scroll || (lenis ? lenis.scroll : window.scrollY || window.pageYOffset);
				const direction = currentScrollY > lastScrollY ? 1 : -1;

				// Show navbar when scrolling up, hide when scrolling down
				if (direction === -1 && currentScrollY > 100) {
					gsap.to(navbar, {
						yPercent: 0,
						duration: 0.5,
						ease: 'power3.out'
					});
				} else if (direction === 1 && currentScrollY > 100) {
					gsap.to(navbar, {
						yPercent: -100,
						duration: 0.5,
						ease: 'power3.out'
					});
				}

				// Glassmorphism effect on scroll
				if (currentScrollY > 50) {
					isScrolled = true;
				} else {
					isScrolled = false;
				}

				lastScrollY = currentScrollY;
			};

			// Listen to Lenis scroll events
			const lenis = getLenis();
			if (lenis) {
				lenis.on('scroll', handleScroll);
			} else {
				window.addEventListener('scroll', handleScroll, { passive: true });
			}

			// Initial check
			handleScroll();
		}

		return () => {
			unsubscribe();
		};
	});

	onDestroy(() => {
		if (handleScroll) {
			const lenis = getLenis();
			if (lenis) {
				lenis.off('scroll', handleScroll);
			} else {
				window.removeEventListener('scroll', handleScroll);
			}
		}
		// Ensure body scroll is unlocked on destroy
		if (typeof document !== 'undefined') {
			document.body.style.overflow = '';
		}
	});
</script>

<nav
	bind:this={navbar}
	class="fixed top-0 left-0 w-full z-[100] flex items-center px-8 py-6 transition-all duration-500 mix-blend-difference text-white {isScrolled
		? 'backdrop-blur-md bg-gradient-to-b from-black/50 to-transparent'
		: ''} {!preloaderLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}"
>
	<!-- Logo -->
	<a href="/" class="flex-shrink-0 flex items-center">
		<img 
			src="/Al_Emirate.png" 
			alt="Emirates Club Logo" 
			class="h-10 md:h-12 w-auto object-contain transition-opacity duration-300 hover:opacity-80"
		/>
	</a>

	<!-- Signature - Next to Logo (Desktop only) -->
	<div class="hidden md:flex items-center ml-4 flex-shrink-0">
		<div class="signature-container">
			<span class="signature-text">Emirates Sport Club</span>
		</div>
	</div>

	<!-- Desktop Navigation - Right Side -->
	<div class="hidden md:flex items-center gap-8 lg:gap-12 ml-auto">
		{#each navLinks as link}
			<a
				href={link.path}
				class="nav-link relative text-sm lg:text-base font-bold uppercase tracking-widest text-white transition-colors duration-300 {isActive(link.path)
					? 'text-primary-gold'
					: ''}"
			>
				{link.name}
			</a>
		{/each}
	</div>

	<!-- Mobile Menu Button -->
	<button
		onclick={toggleMobileMenu}
		class="md:hidden relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 z-[101] ml-auto"
		aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
	>
		<span
			class="block w-6 h-0.5 bg-white transition-all duration-300 {isMobileMenuOpen
				? 'rotate-45 translate-y-2'
				: ''}"
		></span>
		<span
			class="block w-6 h-0.5 bg-white transition-all duration-300 {isMobileMenuOpen ? 'opacity-0' : ''}"
		></span>
		<span
			class="block w-6 h-0.5 bg-white transition-all duration-300 {isMobileMenuOpen
				? '-rotate-45 -translate-y-2'
				: ''}"
		></span>
	</button>
</nav>

<!-- Mobile Menu Overlay -->
{#if isMobileMenuOpen}
	<div
		class="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-md md:hidden"
		onclick={closeMobileMenu}
		onkeydown={handleOverlayKeyDown}
		role="button"
		tabindex="0"
		aria-label="Close menu"
	>
		<!-- Close Button - Top Right -->
		<button
			onclick={closeMobileMenu}
			class="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-white hover:text-primary-gold transition-colors duration-300 z-[2001]"
			aria-label="Close menu"
		>
			<svg
				class="w-8 h-8"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				></path>
			</svg>
		</button>

		<!-- Navigation Links -->
		<div
			class="h-full flex flex-col items-center justify-center gap-8 px-8"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			{#each navLinks as link}
				<a
					href={link.path}
					onclick={closeMobileMenu}
					class="headline text-5xl font-bold uppercase tracking-widest text-white transition-colors duration-300 hover:text-primary-gold {isActive(link.path)
						? 'text-primary-gold'
						: ''}"
				>
					{link.name}
				</a>
			{/each}
		</div>
	</div>
{/if}

<style>
	.nav-link {
		position: relative;
		overflow: hidden;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: #d4af37; /* primary-gold */
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s ease;
	}

	.nav-link:hover::after {
		transform: scaleX(1);
	}

	.nav-link:hover {
		color: #d4af37; /* primary-gold on hover */
	}

	.signature-container {
		position: relative;
		padding: 0.5rem 0;
		cursor: default;
	}

	.signature-text {
		font-family: 'Playfair Display', 'Georgia', serif;
		font-style: italic;
		font-weight: 500;
		font-size: 0.8125rem;
		letter-spacing: 0.2em;
		color: rgba(255, 255, 255, 0.85);
		position: relative;
		display: inline-block;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		text-transform: none;
		line-height: 1.2;
	}

	.signature-text::before {
		content: '';
		position: absolute;
		left: -1rem;
		top: 50%;
		transform: translateY(-50%) scaleY(0);
		width: 1px;
		height: 1.25rem;
		background: linear-gradient(to bottom, transparent, #d4af37 50%, transparent);
		opacity: 0;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: center;
	}

	.signature-text::after {
		content: '';
		position: absolute;
		bottom: -0.375rem;
		left: 0;
		width: 0;
		height: 1px;
		background: linear-gradient(to right, #d4af37, rgba(212, 175, 55, 0.3));
		transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.signature-container:hover .signature-text {
		color: #d4af37;
		letter-spacing: 0.25em;
		transform: translateX(2px);
	}

	.signature-container:hover .signature-text::before {
		opacity: 1;
		transform: translateY(-50%) scaleY(1);
		height: 1.75rem;
	}

	.signature-container:hover .signature-text::after {
		width: 100%;
	}
</style>