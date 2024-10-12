import STORAGE_KEYS from "@constants/storage";
import useStorage from "@hooks/storage";
import { News } from "@models/news";

const useNewsStorage = () =>
  useStorage<Pick<News, "title" | "content" | "image_url"> | null>(STORAGE_KEYS.NEWS, null);

export default useNewsStorage;
