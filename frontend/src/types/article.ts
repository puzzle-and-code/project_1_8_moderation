export interface MyArticle {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
}

export interface ArticleDetails {
  id: string;
  title: string;
  content: string;
  extraData: string | null;
  status: string;
}

export interface ArticlePayload {
  title: string;
  content: string;
  extraData: string | null;
}

export const articleStatusLabel: Record<string, string> = {
  Draft: "Черновик",
  OnModeration: "На модерации",
  Rejected: "Отклонена",
  Published: "Опубликована",
};

export const articleStatusColor: Record<
  string,
  "default" | "warning" | "error" | "success"
> = {
  Draft: "default",
  OnModeration: "warning",
  Rejected: "error",
  Published: "success",
};
