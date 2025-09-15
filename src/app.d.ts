// See https://svelte.dev/docs/kit/types#app.d.ts

import type { SyncState } from "$lib/core/model/sync-state";

// for information about these interfaces
declare global {
	namespace App {
		interface Error extends globalThis.Error {
			message: string;
			status: number;
			type: string;
		}
		interface PageParentData {
			user: CurrentUser;
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
