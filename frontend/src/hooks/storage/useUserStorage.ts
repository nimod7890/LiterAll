import STORAGE_KEYS from "@constants/storage";
import useStorage from "@hooks/storage";
import { User } from "@models/user";

const useUserStorage = () => useStorage<User | null>(STORAGE_KEYS.USER, null);

export default useUserStorage;
