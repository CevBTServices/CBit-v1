const enum API_ROUTES {
  AUTH = '/auth',
  HABER = '/news',
  MESSAGE = '/messages',
  PROJE = '/projects',
  AYARLAR = '/ayarlar',
  ISORTAKLARI = '/isortaklari',
}


const enum API_VERSION {
  V1 = '/v1',
}

const enum HTTP_STATUS_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNSUPPORTED_MEDIA_TYPE = 415,
  INTERNAL_SERVER_ERROR = 500,
}

const enum HASH_PREFIX {
  USER_SESSION = 'todo:session',
  VERIFY_PROCESS = 'todo:verify',
}

export { API_ROUTES, API_VERSION, HTTP_STATUS_CODE, HASH_PREFIX };
