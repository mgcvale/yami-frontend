export const CLIENT_ERRORS = {
  NO_TOKEN: 401,
  INVALID_TOKEN: 401,
  NOT_AUTHENTICATED: 401,
  NETWORK_ERROR: 503,
  TIMEOUT: 408,
  OFFLINE: 503,
  INVALID_BROWSER: 400,
  UNKNOWN: 500,
  PAGE_NOT_FOUND: 404
} as const;

export const CLIENT_ERROR_STR = "CLIENT_ERROR";

export const NETWORK_ERRORS = {
  NETWORK_ERROR: 500
} as const;

export const NETWORK_ERROR_STR = "NETWORK_ERROR";

export const SERVER_ERRORS = {
  BAD_RESPONSE: 502
}

export const SERVER_ERROR_STR = "SERVER_ERROR";

export const DEFAULT_ERRORS = {
    NETWORK_ERROR: {
        status: NETWORK_ERRORS.NETWORK_ERROR,
        message: 'Network error occurred. Please check your connection and try again.',
        type: NETWORK_ERROR_STR
    } as App.Error,
    UNKNOWN: (error: unknown): App.Error => { return {
        status: CLIENT_ERRORS.UNKNOWN,
        type: CLIENT_ERROR_STR,
        message: "An unknown error occurred with your client. Try again later."
      } as App.Error;
    },
    INVALID_BROWSER: {
        status: CLIENT_ERRORS.INVALID_BROWSER,
        message: "This page is being server-rendered, but it shouldn't.",
        type: CLIENT_ERROR_STR
    } as App.Error,
    INVALID_TOKEN: {
        status: CLIENT_ERRORS.NO_TOKEN,
        message: "Invalid access token present",
        type: CLIENT_ERROR_STR
    } as App.Error,
    BAD_RESPONSE: {
      status: SERVER_ERRORS.BAD_RESPONSE,
      message: "The server returned an invalid or unexpected response.",
      type: SERVER_ERROR_STR
    } as App.Error,
    USER_NOT_LOADED: {
      status: CLIENT_ERRORS.NOT_AUTHENTICATED,
      message: "There is no user authenticated, so this action can't be performed.",
      type: CLIENT_ERROR_STR
    } as App.Error,
    INVALID_PAGE_PARAMS: {
      status: CLIENT_ERRORS.PAGE_NOT_FOUND,
      message: "This page was not found, or its URL is malformed.",
      type: CLIENT_ERROR_STR
    } as App.Error
} as const;