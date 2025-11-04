import { currentUserStore, type CurrentUser } from "$lib"
import { loadUserFromToken } from "$lib/core/actions/account/auth-from-token"
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";
import type { SyncState } from "$lib/core/model/sync-state";
import { asyncSuccess } from "$lib/core/actions/util";
import { get } from "svelte/store";

export const ssr = false;
export const prerender = false;


export const load: LayoutLoad = async (event) => {
  const { depends } = event;
  depends('user:current');

  const userFromStore = get(currentUserStore);
  if (!userFromStore.loading && userFromStore.data !== null) {
    return { user: userFromStore.data };
  }

  const userState: SyncState<CurrentUser> = await loadUserFromToken();
  
  if (userState.data == null && userState.error != null) {
    console.log("ERROR LOADING USER: ", userState.error.status);
    if (userState.error.status !== 401) {
      throw error(userState.error.status, userState.error);
    }
  }

  currentUserStore.set(asyncSuccess(userState.data));
  
  // at this point, we know userState.data is not null
  return { user: userState.data };
}