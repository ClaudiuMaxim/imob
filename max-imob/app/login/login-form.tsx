"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type LoginResponse = {
  success: boolean;
  data: {
    redirectTo: string;
  } | null;
  error: string | null;
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as LoginResponse;

      if (!response.ok || !payload.success || !payload.data) {
        setError(payload.error ?? "Email sau parolă invalidă.");
        return;
      }

      router.push(payload.data.redirectTo);
    } catch {
      setError("Autentificarea nu este disponibilă momentan.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : null}

      <div className="mb-3">
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="form-control"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          required
          type="email"
          value={email}
        />
      </div>

      <div className="mb-4">
        <label className="form-label" htmlFor="password">
          Parolă
        </label>
        <input
          autoComplete="current-password"
          className="form-control"
          id="password"
          minLength={8}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>

      <button className="btn btn-primary w-100" disabled={isLoading} type="submit">
        {isLoading ? "Se autentifică..." : "Autentificare"}
      </button>
    </form>
  );
}
