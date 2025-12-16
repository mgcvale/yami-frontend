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
};

export const SERVER_ERROR_STR = "SERVER_ERROR";

export const DEFAULT_ERRORS = {
    NETWORK_ERROR: {
        status: NETWORK_ERRORS.NETWORK_ERROR,
        message: "Ocorreu um erro de rede. Verifique sua conexão e tente novamente.",
        type: NETWORK_ERROR_STR
    } as App.Error,

    UNKNOWN: (error: unknown): App.Error => {
      return {
        status: CLIENT_ERRORS.UNKNOWN,
        type: CLIENT_ERROR_STR,
        message: "Ocorreu um erro desconhecido no cliente. Tente novamente mais tarde."
      } as App.Error;
    },

    INVALID_BROWSER: {
        status: CLIENT_ERRORS.INVALID_BROWSER,
        message: "Esta página está sendo renderizada no servidor, mas não deveria.",
        type: CLIENT_ERROR_STR
    } as App.Error,

    INVALID_TOKEN: {
        status: CLIENT_ERRORS.NO_TOKEN,
        message: "Token de acesso inválido.",
        type: CLIENT_ERROR_STR
    } as App.Error,

    BAD_RESPONSE: {
      status: SERVER_ERRORS.BAD_RESPONSE,
      message: "O servidor retornou uma resposta inválida ou inesperada.",
      type: SERVER_ERROR_STR
    } as App.Error,

    USER_NOT_LOADED: {
      status: CLIENT_ERRORS.NOT_AUTHENTICATED,
      message: "Não há nenhum usuário autenticado, portanto esta ação não pode ser realizada.",
      type: CLIENT_ERROR_STR
    } as App.Error,

    INVALID_PAGE_PARAMS: {
      status: CLIENT_ERRORS.PAGE_NOT_FOUND,
      message: "Esta página não foi encontrada ou a URL está malformada.",
      type: CLIENT_ERROR_STR
    } as App.Error
} as const;
