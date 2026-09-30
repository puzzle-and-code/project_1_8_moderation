import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold">404 — Страница не найдена</h2>
      <Link
        href="/"
        className="text-blue-400 hover:underline mt-4 inline-block"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
