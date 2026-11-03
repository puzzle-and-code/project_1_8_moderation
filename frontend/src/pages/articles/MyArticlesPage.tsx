import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { getMyArticles } from "@/api/articles";
import type { MyArticle } from "@/types/article";

type ArticlesView =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "ready"; articles: MyArticle[] };

const statusLabel: Record<string, string> = {
  Draft: "Черновик",
  OnModeration: "На модерации",
  Rejected: "Отклонена",
  Published: "Опубликована",
};

const statusColor: Record<string, "default" | "warning" | "error" | "success"> = {
  Draft: "default",
  OnModeration: "warning",
  Rejected: "error",
  Published: "success",
};

function formatUpdatedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function CreateArticleButton() {
  return (
    <Button variant="contained" type="button">
      Создать статью
    </Button>
  );
}

function ArticleStatus({ status }: { status: string }) {
  return (
    <Chip
      size="small"
      label={statusLabel[status] ?? status}
      color={statusColor[status] ?? "default"}
    />
  );
}

function UpdatedAt({ value }: { value: string }) {
  return <time dateTime={value}>{formatUpdatedAt(value)}</time>;
}

export default function MyArticlesPage() {
  const [view, setView] = useState<ArticlesView>({ status: "loading" });

  useEffect(() => {
    let active = true;

    getMyArticles()
      .then((articles) => {
        if (!active) {
          return;
        }

        if (!Array.isArray(articles)) {
          setView({ status: "error", message: "Не удалось загрузить статьи." });
          return;
        }

        setView(
          articles.length === 0 ? { status: "empty" } : { status: "ready", articles },
        );
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setView({
          status: "error",
          message:
            error instanceof Error ? error.message : "Не удалось загрузить статьи.",
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: "left" }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ m: 0, fontWeight: 500, color: "text.primary" }}
          >
            Мои статьи
          </Typography>
          {view.status !== "empty" && <CreateArticleButton />}
        </Box>

        {view.status === "loading" && (
          <Box role="status" sx={{ display: "flex", alignItems: "center", gap: 2, py: 4 }}>
            <CircularProgress size={24} />
            <Typography color="text.secondary">Загрузка статей…</Typography>
          </Box>
        )}

        {view.status === "error" && <Alert severity="error">{view.message}</Alert>}

        {view.status === "empty" && (
          <Box role="status" sx={{ py: 6, textAlign: "center" }}>
            <Typography sx={{ mb: 2 }}>У вас пока нет статей</Typography>
            <CreateArticleButton />
          </Box>
        )}

        {view.status === "ready" && (
          <>
            <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 2 }}>
              {view.articles.map((article) => (
                <Box
                  key={article.id}
                  sx={{
                    display: "grid",
                    gap: 1,
                    pb: 2,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Typography>{article.title}</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ArticleStatus status={article.status} />
                    <Typography variant="body2" color="text.secondary">
                      <UpdatedAt value={article.updatedAt} />
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: { xs: "none", md: "block" }, overflowX: "auto" }}>
              <Table aria-label="Список своих статей">
                <TableHead>
                  <TableRow>
                    <TableCell scope="col">Название</TableCell>
                    <TableCell scope="col">Статус</TableCell>
                    <TableCell scope="col">Дата последнего изменения</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {view.articles.map((article) => (
                    <TableRow key={article.id} hover>
                      <TableCell>{article.title}</TableCell>
                      <TableCell>
                        <ArticleStatus status={article.status} />
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <UpdatedAt value={article.updatedAt} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}
