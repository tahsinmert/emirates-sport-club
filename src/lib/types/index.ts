// Global type definitions for Emirates Sport Club

export interface VideoAsset {
	src: string;
	poster?: string;
	alt: string;
}

export interface Player {
	id: string;
	name: string;
	position: string;
	number: number;
	image?: string;
}

export interface Match {
	id: string;
	opponent: string;
	date: Date;
	venue: 'home' | 'away';
	score?: {
		home: number;
		away: number;
	};
}

