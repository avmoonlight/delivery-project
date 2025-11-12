'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const pedidoSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  endereco: z.string().min(5, 'Endereço obrigatório'),
  telefone: z.string().min(8, 'Telefone inválido'),
  produtos: z.array(z.string().uuid()).min(1, 'Selecione ao menos um produto'),
})

export async function criarPedido(formData: FormData) {
  const produtos = formData.getAll('produtos') as string[]
  const data = { ...Object.fromEntries(formData), produtos }
  const result = pedidoSchema.safeParse(data)

  if (!result.success) {
    // Correção: usar result.error.issues em vez de result.error.errors
    const firstError = result.error.issues[0]?.message || 'Dados inválidos'
    return { error: firstError }
  }

  try {
    await prisma.pedidos.create({
      data: {
        nome: result.data.nome,
        endereco: result.data.endereco,
        telefone: result.data.telefone,
        produtos: {
          connect: result.data.produtos.map((id) => ({ id })),
        },
      },
    })
    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao criar pedido' }
  }
}