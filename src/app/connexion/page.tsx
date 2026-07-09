import { AuthForm } from "@/components/auth-form";

type ConnexionPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
    error?: string;
  }>;
};

function safeRedirect(value?: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export default async function ConnexionPage({ searchParams }: ConnexionPageProps) {
  const params = await searchParams;

  return (
    <div className="grid min-h-[calc(100vh-72px)] place-items-center bg-[linear-gradient(180deg,#ecfeff,#f8fafc)] px-4 py-12">
      <AuthForm
        mode="login"
        redirectTo={safeRedirect(params.redirectTo)}
        configError={params.error === "config"}
      />
    </div>
  );
}
