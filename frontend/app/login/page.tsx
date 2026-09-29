import Authorisation from "./Authorisation";

export default function LoginPage() {
  // return <h1>Страница входа (Login)</h1>;
  const handleSubmit = (data: any) => {
    console.log("Данные формы:", data);
    // Логика отправки на бэкенд
  };
  return <Authorisation onSubmit={handleSubmit} />;
}
