import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authStore } from "@/store/AuthStore";
import {
  createArticle,
  extraDataToField,
  fieldToExtraData,
  getArticle,
  submitArticle,
  updateArticle,
} from "@/api/articles";
import {
  articleStatusColor,
  articleStatusLabel,
  type ArticleDetails,
} from "@/types/article";

interface ArticleFormState {
  title: string;
  content: string;
  extraData: string;
}

const emptyForm: ArticleFormState = {
  title: "",
  content: "",
  extraData: "",
};

function articlePayload(form: ArticleFormState) {
  return {
    title: form.title,
    content: form.content,
    extraData: fieldToExtraData(form.extraData),
  };
}

function publicArticleUrl(articleId: string): string {
  return `${window.location.origin}/a/${articleId}`;
}

function PublishPanel({ articleId }: { articleId?: string }) {
  const [isPublished, setIsPublished] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const link = articleId ? publicArticleUrl(articleId) : "";

  const copyLink = async () => {
    if (!link) {
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      setCopyMessage("Ссылка скопирована");
    } catch {
      setCopyMessage("Не удалось скопировать ссылку");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, width: { xs: "100%", md: 260 } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Публикация
      </Typography>
      {isPublished ? (
        <Box>
          <Typography sx={{ mb: 1, fontWeight: 600 }}>Опубликовано</Typography>
          {link && (
            <Typography
              component="a"
              href={link}
              target="_blank"
              rel="noreferrer"
              sx={{ display: "block", mb: 1, wordBreak: "break-all" }}
            >
              {link}
            </Typography>
          )}
          <Button type="button" variant="outlined" onClick={copyLink} disabled={!link}>
            Копировать
          </Button>
          {copyMessage && (
            <Typography variant="body2" sx={{ mt: 1 }} role="status">
              {copyMessage}
            </Typography>
          )}
        </Box>
      ) : (
        <Button
          type="button"
          variant="contained"
          onClick={() => setIsPublished(true)}
          disabled={!articleId}
        >
          Опубликовать
        </Button>
      )}
    </Paper>
  );
}

function formFromArticle(article: ArticleDetails): ArticleFormState {
  return {
    title: article.title ?? "",
    content: article.content ?? "",
    extraData: extraDataToField(article.extraData),
  };
}

export default function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [form, setForm] = useState<ArticleFormState>(emptyForm);
  const [status, setStatus] = useState<string>(isNew ? "Draft" : "");
  const [loadError, setLoadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const isOnModeration = status === "OnModeration";
  const canEdit = isNew || (!isLoading && !loadError && !isOnModeration);

  useEffect(() => {
    if (!id) {
      return;
    }

    let active = true;
    setIsLoading(true);
    setLoadError("");
    setSaveError("");

    getArticle(id)
      .then((article) => {
        if (!active) {
          return;
        }

        setForm(formFromArticle(article));
        setStatus(article.status);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setLoadError(
          error instanceof Error ? error.message : "Не удалось загрузить статью.",
        );
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleChange =
    (field: keyof ArticleFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit || isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      if (isNew || !id) {
        await createArticle(articlePayload(form));
      } else {
        await updateArticle(id, articlePayload(form));
      }
      navigate("/");
    } catch (error: unknown) {
      setSaveError(
        error instanceof Error ? error.message : "Не удалось сохранить статью.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleModeration = async () => {
    if (!canEdit || isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      if (!id) {
        return;
      }

      await updateArticle(id, articlePayload(form));
      await submitArticle(id);
      navigate("/");
    } catch (error: unknown) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Не удалось отправить статью на модерацию.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const canSubmit = canEdit && !isNew && status === "Draft";
  const showPublishPanel = authStore.user?.role === "Moderator" && !isLoading && !loadError;

  return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: "left" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, flex: 1, width: "100%" }}>
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
            {isNew ? "Новая статья" : "Статья"}
          </Typography>
          {status && !isLoading && !loadError && (
            <Chip
              size="small"
              label={articleStatusLabel[status] ?? status}
              color={articleStatusColor[status] ?? "default"}
            />
          )}
        </Box>

        <Button component={Link} to="/" sx={{ mb: 2 }}>
          К списку статей
        </Button>

        {isLoading && (
          <Box role="status" sx={{ display: "flex", alignItems: "center", gap: 2, py: 4 }}>
            <CircularProgress size={24} />
            <Typography color="text.secondary">Загрузка статьи…</Typography>
          </Box>
        )}

        {loadError && <Alert severity="error">{loadError}</Alert>}

        {!isLoading && !loadError && (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {status === "Published" && (
              <Alert severity="info" sx={{ mb: 2 }}>
                После сохранения статья станет черновиком и потребуется новая
                модерация.
              </Alert>
            )}

            {isOnModeration && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Статья на модерации. Содержание можно просмотреть, но изменить его
                нельзя.
              </Alert>
            )}

            {saveError && (
              <Alert severity="error" sx={{ mb: 2 }} role="alert">
                {saveError}
              </Alert>
            )}

            <TextField
              label="Название"
              value={form.title}
              onChange={handleChange("title")}
              fullWidth
              margin="normal"
              slotProps={{ input: { readOnly: !canEdit } }}
              disabled={isSaving}
            />
            <TextField
              label="Содержание"
              value={form.content}
              onChange={handleChange("content")}
              fullWidth
              margin="normal"
              multiline
              minRows={8}
              slotProps={{ input: { readOnly: !canEdit } }}
              disabled={isSaving}
            />
            <TextField
              label="Дополнительные данные"
              value={form.extraData}
              onChange={handleChange("extraData")}
              fullWidth
              margin="normal"
              multiline
              minRows={3}
              slotProps={{ input: { readOnly: !canEdit } }}
              disabled={isSaving}
            />

            {canEdit && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                <Button type="submit" variant="contained" disabled={isSaving}>
                  {isSaving ? "Сохранение…" : "Сохранить"}
                </Button>
                {canSubmit && (
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleModeration}
                    disabled={isSaving}
                  >
                    На модерацию
                  </Button>
                )}
              </Box>
            )}
          </Box>
        )}
        </Paper>
        {showPublishPanel && <PublishPanel articleId={id} />}
      </Box>
    </Container>
  );
}
