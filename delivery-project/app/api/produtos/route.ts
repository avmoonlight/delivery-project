import prisma from "@/lib/prisma-client"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const produtos = await prisma.produtos.findMany({
      select: {
        id: true,
        nome: true,
        preco: true,
      }
    })

    return NextResponse.json(produtos)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}
