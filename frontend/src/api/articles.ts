import { apiClient } from "@/api/apiClient";
import type { MyArticle } from "@/types/article";

export function getMyArticles(): Promise<MyArticle[]> {
  return apiClient<MyArticle[]>("/articles/mine");
}
