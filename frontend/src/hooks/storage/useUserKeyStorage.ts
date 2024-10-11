import STORAGE_KEYS from "@constants/storage";
import useStorage from "@hooks/storage";

const useUserKeyStorage = () => useStorage<number | null>(STORAGE_KEYS.USER_KEY, null);

export default useUserKeyStorage;
