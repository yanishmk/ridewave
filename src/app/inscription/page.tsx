import { AuthForm } from "@/components/auth-form";

export default function InscriptionPage() {
  return (
    <div className="grid min-h-[calc(100vh-72px)] place-items-center bg-[linear-gradient(180deg,#f0fdf4,#f8fafc)] px-4 py-12">
      <AuthForm mode="signup" redirectTo="/dashboard" />
    </div>
  );
}
