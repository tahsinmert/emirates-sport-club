<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { gsap } from '$lib/utils/gsap';

	let errorContainer: HTMLElement;
	let errorText: HTMLElement;

	onMount(() => {
		if (typeof window === 'undefined' || !errorContainer || !errorText) return;

		gsap.set([errorContainer, errorText], {
			opacity: 0,
			y: 30
		});

		gsap.to([errorContainer, errorText], {
			opacity: 1,
			y: 0,
			duration: 1,
			ease: 'power3.out',
			stagger: 0.2
		});
	});

	$: status = $page.status || 404;
	$: message = status === 404 ? 'PAGE NOT FOUND' : 'SOMETHING WENT WRONG';
	$: description = status === 404
		? 'The page you are looking for does not exist.'
		: 'An unexpected error occurred. Please try again later.';
</script>

<svelte:head>
	<title>{status} - Emirates Sport Club</title>
	<meta name="description" content="Error page - {message}" />
</svelte:head>

<div class="min-h-dvh w-full bg-secondary-black flex items-center justify-center px-6">
	<div bind:this={errorContainer} class="text-center max-w-2xl">
		<div bind:this={errorText} class="headline text-[12rem] sm:text-[16rem] md:text-[20rem] font-bold text-primary-gold/20 mb-8 leading-none">
			{status}
		</div>
		<h1 class="headline text-4xl md:text-5xl lg:text-6xl font-bold text-accent-white uppercase tracking-tight mb-6">
			{message}
		</h1>
		<p class="text-base md:text-lg text-accent-white/70 mb-8 max-w-md mx-auto">
			{description}
		</p>
		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="/"
				class="headline px-8 py-4 border-2 border-primary-gold text-primary-gold uppercase tracking-wider text-sm md:text-base hover:bg-primary-gold hover:text-secondary-black transition-all duration-300"
			>
				GO HOME
			</a>
			<button
				on:click={() => window.history.back()}
				class="headline px-8 py-4 border-2 border-accent-white/20 text-accent-white/70 uppercase tracking-wider text-sm md:text-base hover:border-accent-white/40 hover:text-accent-white transition-all duration-300"
			>
				GO BACK
			</button>
		</div>
	</div>
</div>

