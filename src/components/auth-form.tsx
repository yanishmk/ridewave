"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Phone, ShieldAlert, UserRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { ProfileRow } from "@/lib/supabase/types";

type AuthMode = "login" | "signup";

export function AuthForm({
  mode,
  redirectTo,
  configError,
}: {
  mode: AuthMode;
  redirectTo: string;
  configError?: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => {
    try {
      return createSupabaseBrowserClient();
    } catch {
      return null;
    }
  }, []);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<ProfileRow["role"]>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(
    configError ? "Supabase n'est pas configuré sur cet environnement." : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!supabase) {
      setMessage("Supabase n'est pas configuré sur cet environnement.");
      return;
    }

    setIsSubmitting(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setIsSubmitting(false);

      if (error) {
        setMessage("Connexion impossible. Vérifiez votre courriel et votre mot de passe.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    if (error) {
      setIsSubmitting(false);
      setMessage("Création impossible. Vérifiez les champs et réessayez.");
      return;
    }

    if (data.user && data.session) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName || email.split("@")[0],
        phone: phone || null,
        role,
        boating_card: null,
        preference: role === "owner" ? "Gestion propriétaire" : "Livraison au quai",
      });

      setIsSubmitting(false);
      router.push(role === "owner" ? "/proprietaire" : redirectTo);
      router.refresh();
      return;
    }

    setIsSubmitting(false);
    setMessage("Compte créé. Vérifiez votre courriel si Supabase demande une confirmation.");
  }

  return (
    <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-cyan-900/10">
      <p className="text-sm font-bold text-cyan-700">RideWave</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">
        {mode === "login" ? "Connexion" : "Créer un compte"}
      </h1>

      {message ? (
        <p className="mt-5 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-900">
          <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          {message}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        {mode === "signup" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nom complet"
              icon={<UserRound size={18} className="text-cyan-700" />}
              value={fullName}
              onChange={setFullName}
              placeholder="Alex Martin"
              required
            />
            <label className="grid gap-2 text-sm font-bold text-slate-800">
              Type de compte
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as ProfileRow["role"])}
                className="h-12 rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none focus:border-cyan-500"
              >
                <option value="client">Client</option>
                <option value="owner">Propriétaire</option>
                <option value="both">Client et propriétaire</option>
              </select>
            </label>
          </div>
        ) : null}

        <Field
          label="Courriel"
          type="email"
          icon={<Mail size={18} className="text-cyan-700" />}
          value={email}
          onChange={setEmail}
          placeholder="alex@exemple.ca"
          required
        />

        {mode === "signup" ? (
          <Field
            label="Téléphone"
            type="tel"
            icon={<Phone size={18} className="text-cyan-700" />}
            value={phone}
            onChange={setPhone}
            placeholder="+1 613 555 0101"
          />
        ) : null}

        <Field
          label="Mot de passe"
          type="password"
          icon={<LockKeyhole size={18} className="text-cyan-700" />}
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting || configError}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#073b5d] text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#052f4c] disabled:translate-y-0 disabled:opacity-50"
        >
          {isSubmitting ? "Veuillez patienter..." : mode === "login" ? "Entrer" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        {mode === "login" ? "Nouveau sur RideWave? " : "Déjà un compte? "}
        <Link
          href={mode === "login" ? "/inscription" : "/connexion"}
          className="font-bold text-cyan-700"
        >
          {mode === "login" ? "Créer un compte" : "Se connecter"}
        </Link>
      </p>
    </section>
  );
}

function Field({
  label,
  icon,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  minLength,
}: {
  label: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-800">
      {label}
      <span className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3 focus-within:border-cyan-500">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="min-w-0 flex-1 bg-transparent outline-none"
        />
      </span>
    </label>
  );
}
