'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"

export default function LoginForm() {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const senha = formData.get("senha") as string

    authClient.signIn.email(
      { email, password: senha },
      {
        onSuccess: () => redirect("/painel"),
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (ctx) => setError(ctx.error.message),
      }
    )
  }

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4 w-full max-w-sm mx-auto p-6 bg-card rounded-xl shadow-sm border"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">Entrar</h1>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          placeholder="seu@email.com"
          type="email"
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          name="senha"
          type="password"
          placeholder="********"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Entrando..." : "Login"}
      </Button>
    </form>
  )
}
