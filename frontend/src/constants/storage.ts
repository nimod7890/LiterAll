const STORAGE_KEY_PREFIX = "hackathon";

const STORAGE_KEYS = {
  USER: `${STORAGE_KEY_PREFIX}-user`,
  USER_KEY: `${STORAGE_KEY_PREFIX}-user-key`,
} as const;

export default STORAGE_KEYS;
