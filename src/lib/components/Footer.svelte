<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap, ScrollTrigger } from '$lib/utils/gsap';
	import { Instagram, Twitter, Youtube, Mail, ArrowUp } from 'lucide-svelte';
	import { getLenis } from '$lib/utils/lenis';

	let footer: HTMLElement;
	let scrollToTopButton: HTMLElement;

	function scrollToTop() {
		if (typeof window === 'undefined') return;

		const lenis = getLenis();
		if (!lenis) return;

		lenis.scrollTo(0, {
			duration: 1.5,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
		});
	}

	onMount(() => {
		if (typeof window === 'undefined' || !footer) return;

		// Footer reveal animation
		ScrollTrigger.create({
			trigger: footer,
			start: 'top 80%',
			once: true,
			onEnter: () => {
				gsap.fromTo(
					footer,
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

		// Scroll to top button visibility
		ScrollTrigger.create({
			trigger: 'body',
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: (self) => {
				if (scrollToTopButton) {
					if (self.progress > 0.3) {
						gsap.to(scrollToTopButton, {
							opacity: 1,
							scale: 1,
							duration: 0.3
						});
					} else {
						gsap.to(scrollToTopButton, {
							opacity: 0,
							scale: 0.8,
							duration: 0.3
						});
					}
				}
			}
		});
	});
</script>

<footer bind:this={footer} class="relative w-full bg-secondary-black border-t border-white/10 py-16 px-4 sm:px-8 md:px-16 lg:px-24">
	<div class="container mx-auto">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
			<!-- Brand Section -->
			<div class="space-y-4">
				<h3 class="headline text-2xl font-bold text-accent-white mb-4">
					EMIRATES SPORT CLUB
				</h3>
				<p class="text-sm text-accent-white/60 leading-relaxed max-w-sm">
					Beyond the game. Building champions, creating legacy, inspiring generations.
				</p>
			</div>

			<!-- Quick Links -->
			<div class="space-y-4">
				<h4 class="headline text-sm uppercase tracking-wider text-primary-gold mb-4">
					QUICK LINKS
				</h4>
				<nav class="flex flex-col gap-3">
					<a href="/" class="text-sm text-accent-white/70 hover:text-primary-gold transition-colors duration-300">
						Home
					</a>
					<a href="/squad" class="text-sm text-accent-white/70 hover:text-primary-gold transition-colors duration-300">
						The Squad
					</a>
					<a href="/academy" class="text-sm text-accent-white/70 hover:text-primary-gold transition-colors duration-300">
						Academy
					</a>
					<a href="/news" class="text-sm text-accent-white/70 hover:text-primary-gold transition-colors duration-300">
						News
					</a>
					<a href="/store" class="text-sm text-accent-white/70 hover:text-primary-gold transition-colors duration-300">
						Store
					</a>
				</nav>
			</div>

			<!-- Social & Contact -->
			<div class="space-y-4">
				<h4 class="headline text-sm uppercase tracking-wider text-primary-gold mb-4">
					CONNECT
				</h4>
				<div class="flex items-center gap-4 mb-6">
					<a
						href="https://instagram.com/emiratessportclub"
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-center justify-center w-10 h-10 rounded-full border border-primary-gold/40 hover:border-primary-gold transition-all duration-300 hover:bg-primary-gold/10"
						aria-label="Instagram"
					>
						<Instagram class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300" />
					</a>
					<a
						href="https://twitter.com/emiratessportclub"
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-center justify-center w-10 h-10 rounded-full border border-primary-gold/40 hover:border-primary-gold transition-all duration-300 hover:bg-primary-gold/10"
						aria-label="Twitter"
					>
						<Twitter class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300" />
					</a>
					<a
						href="https://youtube.com/@emiratessportclub"
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-center justify-center w-10 h-10 rounded-full border border-primary-gold/40 hover:border-primary-gold transition-all duration-300 hover:bg-primary-gold/10"
						aria-label="YouTube"
					>
						<Youtube class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300" />
					</a>
					<a
						href="mailto:contact@emiratessportclub.com"
						class="group flex items-center justify-center w-10 h-10 rounded-full border border-primary-gold/40 hover:border-primary-gold transition-all duration-300 hover:bg-primary-gold/10"
						aria-label="Email"
					>
						<Mail class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300" />
					</a>
				</div>
				<a
					href="mailto:contact@emiratessportclub.com"
					class="text-sm text-accent-white/70 hover:text-primary-gold transition-colors duration-300"
				>
					contact@emiratessportclub.com
				</a>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
			<p class="text-xs text-accent-white/50 text-center md:text-left">
				© 2025 Emirates Sport Club. All rights reserved.
			</p>
			<div class="flex items-center gap-6 text-xs text-accent-white/50">
				<a href="#" class="hover:text-primary-gold transition-colors duration-300">Privacy Policy</a>
				<a href="#" class="hover:text-primary-gold transition-colors duration-300">Terms of Service</a>
			</div>
		</div>
	</div>
</footer>

<!-- Scroll to Top Button -->
<button
	bind:this={scrollToTopButton}
	on:click={scrollToTop}
	class="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full border border-primary-gold/40 hover:border-primary-gold bg-black/20 hover:bg-primary-gold/10 backdrop-blur-sm transition-all duration-300 group opacity-0 scale-0 pointer-events-none"
	aria-label="Back to Top"
>
	<ArrowUp class="w-5 h-5 text-primary-gold/70 group-hover:text-primary-gold transition-colors duration-300" />
</button>

