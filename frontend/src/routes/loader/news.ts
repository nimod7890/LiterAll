import STORAGE_KEYS from "@constants/storage";
import RoutePath from "@routes/routePath";
import { redirect } from "react-router-dom";

export default function news() {
  try {
    const text = localStorage.getItem(STORAGE_KEYS.NEWS);
    if (!text) {
      throw new Response("Data not found", {
        status: 404,
        statusText: "불러올 뉴스 데이터가 선택되지 않았습니다",
      });
    }
    return text;
  } catch (error) {
    return redirect(RoutePath.Index);
  }
}
