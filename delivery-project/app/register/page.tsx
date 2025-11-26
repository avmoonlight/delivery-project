'use client'

import { authClient } from "@/lib/auth-client"
import { useState } from "react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function RegisterForm() {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const name = String(formData.get("name"))
    const email = String(formData.get("email"))
    const senha = String(formData.get("senha"))

    authClient.signUp.email(
      { name, email, password: senha },
      {
        onSuccess: () => redirect("/login"),
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: (ctx) => setError(ctx.error.message),
      }
    )
  }

  return (
    <form
      onSubmit={handleRegister}
      className="space-y-4 w-full max-w-sm mx-auto p-6 bg-card rounded-xl shadow-sm border"
    >
      <h1 className="text-2xl font-semibold text-center mb-4">Criar Conta</h1>

      <div className="space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" placeholder="Seu nome" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" placeholder="seu@email.com" required />
      </div>

      <div className="space-y-1">
        <Label htmlFor="senha">Senha</Label>
        <Input id="senha" name="senha" type="password" placeholder="********" required />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Criando conta..." : "Registrar"}
      </Button>
    </form>
  )
}
