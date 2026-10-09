# Frontend Vite

Клиентская SPA-часть приложения для модерации статей. Собрана на Vite, React и TypeScript. Навигация реализована через `react-router-dom`, компоненты и layout используют `@emotion/styled`, стили формы авторизации вынесены в CSS Module.

## Запуск и команды

Команды выполняются из каталога `frontend-vite`:

```bash
npm install
npm run dev
```

- `npm run dev` — локальный сервер разработки Vite.
- `npm run build` — проверка TypeScript и production-сборка.
- `npm run lint` — проверка ESLint.
- `npm run preview` — локальный просмотр production-сборки.

## Структура

```text
frontend-vite/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── app/
│   │   └── router.tsx
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── AuthStatusModal.tsx
│   │   ├── AuthToast.tsx
│   │   └── Header.tsx
│   ├── hooks/                 # Пока пусто
│   ├── layout/
│   │   └── AppLayout.tsx
│   ├── lib/api/               # Пока пусто
│   ├── pages/
│   │   ├── error/NotFound.tsx
│   │   ├── form/FormPage.tsx
│   │   ├── home/HomePage.tsx
│   │   └── login/AuthorisationPage.tsx
│   ├── store/                 # Пока пусто
│   ├── styles/
│   │   └── styles.module.css
│   ├── api/                   # Пока пусто
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
```

## Назначение файлов

### Точка входа и конфигурация

- `index.html` — HTML-шаблон Vite с корневым элементом `#root`.
- `src/main.tsx` — подключает глобальные стили, создаёт React root и запускает приложение в `StrictMode`.
- `src/App.tsx` — верхний React-компонент; передаёт управление `RouterProvider`.
- `vite.config.ts` — включает React-плагин и алиас `@` для каталога `src`.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — базовая конфигурация TypeScript и отдельные настройки для клиентского кода и Vite-конфига.
- `eslint.config.js` — правила ESLint.
- `package.json` — зависимости и команды npm; `package-lock.json` фиксирует версии зависимостей.
- `.gitignore` — исключения Git.

### Маршрутизация и layout

- `src/app/router.tsx` — таблица маршрутов `createBrowserRouter`: `/` показывает главную страницу, `/login` — авторизацию, `/forms` — список форм. Для ошибок маршрутизации используется `NotFound`.
- `src/layout/AppLayout.tsx` — общий каркас страниц: верхняя навигация, контейнер содержимого и `Outlet` для активного дочернего маршрута.
- `src/components/Header.tsx` — шапка и ссылки между основными страницами.
- `src/pages/error/NotFound.tsx` — экран 404 с возвратом на главную.

### Страницы и компоненты

- `src/pages/home/HomePage.tsx` — стартовая страница приложения.
- `src/pages/form/FormPage.tsx` — заглушка страницы списка форм.
- `src/pages/login/AuthorisationPage.tsx` — форма входа и регистрации, локальная валидация, отображение загрузки и статусной модалки. Сейчас вход имитируется задержкой в одну секунду; идентификатор `server-error` воспроизводит ошибку сервера.
- `src/components/AuthStatusModal.tsx` — модальное окно результата авторизации.
- `src/components/AuthToast.tsx` — toast-уведомление с автоматическим закрытием; компонент существует отдельно от текущей логики формы.

### Стили

- `src/index.css` — глобальные переменные темы, базовые стили `html`, `body` и `#root`, типографика и reset для страницы.
- `src/styles/styles.module.css` — локальные стили формы авторизации и её фоновых декоративных элементов.

## Текущее состояние интеграций

Маршрут `/login` пока передаёт форме callback, который только выводит данные в консоль. Авторизация на сервер не подключена. Каталоги `src/store/`, `src/hooks/`, `src/types/`, `src/api/` и `src/lib/api/` сейчас пусты.

Псевдоним `@/` настроен в `vite.config.ts` и `tsconfig.app.json`; для корректного разрешения импортов настройки следует поддерживать согласованными.
