<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { gsap } from '$lib/utils/gsap';
	import { X } from 'lucide-svelte';

	let { isOpen = $bindable(false) }: { isOpen?: boolean } = $props();

	const dispatch = createEventDispatcher();

	let form: HTMLFormElement;
	let overlay: HTMLDivElement;
	let modal: HTMLDivElement;

	let formData = $state({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		age: '',
		position: '',
		experience: '',
		message: ''
	});

	let isSubmitting = $state(false);
	let submitSuccess = $state(false);

	function closeModal() {
		isOpen = false;
		dispatch('close');
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		
		if (isSubmitting) return;

		isSubmitting = true;

		// Simulate form submission
		setTimeout(() => {
			isSubmitting = false;
			submitSuccess = true;

			// Reset form after success
			setTimeout(() => {
				formData = {
					firstName: '',
					lastName: '',
					email: '',
					phone: '',
					dateOfBirth: '',
					age: '',
					position: '',
					experience: '',
					message: ''
				};
				submitSuccess = false;
				closeModal();
			}, 2000);
		}, 1500);
	}

	$effect(() => {
		if (isOpen && overlay && modal) {
			gsap.fromTo(
				overlay,
				{ opacity: 0 },
				{ opacity: 1, duration: 0.3 }
			);
			gsap.fromTo(
				modal,
				{ opacity: 0, y: 50, scale: 0.95 },
				{ opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
			);
		}
	});
</script>

{#if isOpen}
	<div
		bind:this={overlay}
		class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
		on:click={closeModal}
		role="button"
		tabindex="-1"
		aria-label="Close modal"
	>
		<div
			bind:this={modal}
			class="absolute inset-0 flex items-center justify-center p-4"
			on:click|stopPropagation
		>
			<div class="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-secondary-black border border-primary-gold/20 rounded-lg">
				<!-- Header -->
				<div class="sticky top-0 bg-secondary-black/95 backdrop-blur-xl border-b border-primary-gold/20 px-6 py-4 flex items-center justify-between">
					<h2 class="headline text-2xl font-bold text-accent-white uppercase">
						APPLY FOR TRIALS
					</h2>
					<button
						on:click={closeModal}
						class="w-8 h-8 flex items-center justify-center text-accent-white/70 hover:text-primary-gold transition-colors duration-300"
						aria-label="Close"
					>
						<X class="w-5 h-5" />
					</button>
				</div>

				<!-- Form -->
				{#if !submitSuccess}
					<form bind:this={form} on:submit={handleSubmit} class="p-6 space-y-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label for="firstName" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
									First Name *
								</label>
								<input
									id="firstName"
									type="text"
									bind:value={formData.firstName}
									required
									class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white placeholder-accent-white/30 focus:outline-none focus:border-primary-gold transition-colors duration-300"
									placeholder="John"
								/>
							</div>
							<div>
								<label for="lastName" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
									Last Name *
								</label>
								<input
									id="lastName"
									type="text"
									bind:value={formData.lastName}
									required
									class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white placeholder-accent-white/30 focus:outline-none focus:border-primary-gold transition-colors duration-300"
									placeholder="Doe"
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label for="email" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
									Email *
								</label>
								<input
									id="email"
									type="email"
									bind:value={formData.email}
									required
									class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white placeholder-accent-white/30 focus:outline-none focus:border-primary-gold transition-colors duration-300"
									placeholder="john.doe@example.com"
								/>
							</div>
							<div>
								<label for="phone" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
									Phone *
								</label>
								<input
									id="phone"
									type="tel"
									bind:value={formData.phone}
									required
									class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white placeholder-accent-white/30 focus:outline-none focus:border-primary-gold transition-colors duration-300"
									placeholder="+1 234 567 8900"
								/>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label for="dateOfBirth" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
									Date of Birth *
								</label>
								<input
									id="dateOfBirth"
									type="date"
									bind:value={formData.dateOfBirth}
									required
									class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white placeholder-accent-white/30 focus:outline-none focus:border-primary-gold transition-colors duration-300"
								/>
							</div>
							<div>
								<label for="age" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
									Age *
								</label>
								<input
									id="age"
									type="number"
									bind:value={formData.age}
									required
									min="10"
									max="19"
									class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white placeholder-accent-white/30 focus:outline-none focus:border-primary-gold transition-colors duration-300"
									placeholder="15"
								/>
							</div>
						</div>

						<div>
							<label for="position" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
								Preferred Position *
							</label>
							<select
								id="position"
								bind:value={formData.position}
								required
								class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white focus:outline-none focus:border-primary-gold transition-colors duration-300"
							>
								<option value="">Select Position</option>
								<option value="Goalkeeper">Goalkeeper</option>
								<option value="Defender">Defender</option>
								<option value="Midfielder">Midfielder</option>
								<option value="Winger">Winger</option>
								<option value="Striker">Striker</option>
							</select>
						</div>

						<div>
							<label for="experience" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
								Football Experience *
							</label>
							<textarea
								id="experience"
								bind:value={formData.experience}
								required
								rows="4"
								class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white placeholder-accent-white/30 focus:outline-none focus:border-primary-gold transition-colors duration-300 resize-none"
								placeholder="Tell us about your football experience, previous clubs, achievements..."
							></textarea>
						</div>

						<div>
							<label for="message" class="block text-sm uppercase tracking-wider text-accent-white/70 mb-2">
								Additional Message
							</label>
							<textarea
								id="message"
								bind:value={formData.message}
								rows="3"
								class="w-full px-4 py-3 bg-secondary-light/20 border border-white/10 rounded-lg text-accent-white placeholder-accent-white/30 focus:outline-none focus:border-primary-gold transition-colors duration-300 resize-none"
								placeholder="Any additional information you'd like to share..."
							></textarea>
						</div>

						<div class="flex items-center justify-end gap-4 pt-4">
							<button
								type="button"
								on:click={closeModal}
								class="headline px-6 py-3 border border-white/20 text-accent-white/70 uppercase tracking-wider text-sm hover:border-accent-white/40 hover:text-accent-white transition-all duration-300"
							>
								CANCEL
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								class="headline px-6 py-3 border-2 border-primary-gold text-primary-gold uppercase tracking-wider text-sm hover:bg-primary-gold hover:text-secondary-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
							</button>
						</div>
					</form>
				{:else}
					<div class="p-12 text-center">
						<div class="mb-6">
							<div class="w-16 h-16 mx-auto rounded-full bg-primary-gold/20 flex items-center justify-center mb-4">
								<svg class="w-8 h-8 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<h3 class="headline text-2xl font-bold text-accent-white uppercase mb-2">
								APPLICATION SUBMITTED
							</h3>
							<p class="text-accent-white/70">
								Thank you for your interest. We will review your application and get back to you soon.
							</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

