# Frontend (Next.js + App Router)

Приложение инициализировано на **Next.js** с использованием **App Router** и **TypeScript**.

## Структура проекта

- `app/` — Страницы и маршрутизация приложения (App Router)
  - `login/` — Страница авторизации (/login)
  - `forms/` — Список форм (/forms)
- `components/` — Переиспользуемые UI-компоненты
- `lib/api/` — Клиентские модули для работы с API и сервером
- `hooks/` — Кастомные React-хуки
- `styles/` — Стили и файлы конфигурации CSS/Tailwind

## Команды для разработки

```bash
# Запуск в режиме разработки (localhost:3000)
npm next dev --webpack

# Проверка сборки проекта
npm run build

# Запуск собранного приложения
npm start
```
