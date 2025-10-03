import { browser } from "$app/environment";
import config from "$lib/config";
import type { CurrentUser } from "$lib/core/model/current-user"
import { isCurrentUser } from "$lib/core/model/current-user";
import { DEFAULT_ERRORS, SERVER_ERROR_STR } from "$lib/core/types/error-codes";
import type { SyncState } from "$lib/core/model/sync-state";
import Cookies from 'js-cookie';
import { syncError, syncSuccess } from "../util";

export async function loadUserFromToken(): Promise<SyncState<CurrentUser>> {
  if (!browser) return {
    data: null,
    error: DEFAULT_ERRORS.INVALID_BROWSER
  };

  const accessToken = Cookies.get("accessToken");
  if (!accessToken) {
    localStorage.removeItem("currentUser");
    return {
      data: null,
      error: DEFAULT_ERRORS.INVALID_TOKEN
    }
  }

  const cachedUser = localStorage.getItem("currentUser");
  if (cachedUser) {
    try {
      console.log("Recovered user from localStorage");
      const cachedUserJson = JSON.parse(cachedUser);
      if (isCurrentUser(cachedUserJson)) {
        return syncSuccess(cachedUserJson);
      }
    } catch (e) {
      localStorage.removeItem("currentUser");
    }
  }

  try {
    console.log("Fetching user");
    const response = await fetch(config.apiPaths.login(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const json = await response.json();
      throw {
        status: response.status,
        message: json.message ?? 'Server error',
        type: SERVER_ERROR_STR
      } as App.Error;
    }

    const data = await response.json();
    localStorage.setItem("currentUser", JSON.stringify(data));
    
    return syncSuccess(data as CurrentUser);

  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      // regular error we threw above
      Cookies.remove("accessToken");
      localStorage.removeItem("currentUser");
      return {
        data: null,
        error: error as App.Error
      };
    }

    // handle network errors (fetch failures, timeouts, etc.)
    console.error('Network error during authentication:', error);
    Cookies.remove("accessToken");
    localStorage.removeItem("currentUser");
    
    return syncError(DEFAULT_ERRORS.NETWORK_ERROR);
  }
}