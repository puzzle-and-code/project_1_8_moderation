import { apiClient } from "@/api/apiClient";
import type { ArticleDetails, ArticlePayload, MyArticle } from "@/types/article";

export function extraDataToField(extraData: unknown): string {
  if (extraData == null || extraData === "") {
    return "";
  }

  if (typeof extraData === "object") {
    return JSON.stringify(extraData, null, 2);
  }

  if (typeof extraData === "string") {
    try {
      const parsed: unknown = JSON.parse(extraData);
      if (typeof parsed === "string") {
        return parsed;
      }
      if (parsed !== null && typeof parsed === "object") {
        return JSON.stringify(parsed, null, 2);
      }
    } catch {
      return extraData;
    }

    return extraData;
  }

  return String(extraData);
}

export function fieldToExtraData(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    JSON.parse(trimmed);
    return trimmed;
  } catch {
    return JSON.stringify(trimmed);
  }
}

export function getMyArticles(): Promise<MyArticle[]> {
  return apiClient<MyArticle[]>("/articles/mine");
}

export function getArticle(id: string): Promise<ArticleDetails> {
  return apiClient<ArticleDetails>(`/articles/${id}`);
}

export function createArticle(payload: ArticlePayload): Promise<MyArticle> {
  return apiClient<MyArticle>("/articles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateArticle(
  id: string,
  payload: ArticlePayload,
): Promise<ArticleDetails> {
  return apiClient<ArticleDetails>(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function submitArticle(id: string): Promise<ArticleDetails> {
  return apiClient<ArticleDetails>(`/articles/${id}/submit`, {
    method: "POST",
  });
}
