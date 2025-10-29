'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarInput } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import React, { useState } from "react";


export default function LoginForm() {

  const [loading, setloading] = useState(false)
  const [error, setError] = useState("")

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const senha = formData.get("senha") as string;

    authClient.signIn.email({
      email: email,
      password: senha
    },
    {
      onSuccess: () => redirect("/dashboard"),
      onRequest: () => setloading(true),
      onResponse:() => setloading(false),
      onError: (ctx) => setError(ctx.error.message)
    }

  )
  }

  return (
  <form onSubmit={handleLogin}>
    <Input name="email" />
    <Input name="senha" />
    <Button disabled={loading}>
      {loading ? "loginmaneiro" : "Login"}
    </Button>
    {error && error}
  </form>
  )

}