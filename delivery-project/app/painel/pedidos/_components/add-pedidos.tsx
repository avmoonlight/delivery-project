'use client'

import { useState, useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { criarPedido } from '../actions'
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox"

const pedidoSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  endereco: z.string().min(3, 'Endereço inválido'),
  numero: z.string().regex(/^[0-9]+$/, 'Número inválido'),
  telefone: z.string().min(9, 'Telefone inválido'),
  produtos: z.array(z.string()).min(1, 'Selecione ao menos um produto'),
})

type PedidoForm = z.infer<typeof pedidoSchema>

export default function AddPedido() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [produtos, setProdutos] = useState<{ id: string; nome: string }[]>([])
  const [selectedProdutos, setSelectedProdutos] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors }, setValue, trigger, reset } = useForm<PedidoForm>({
    resolver: zodResolver(pedidoSchema),
  })

  // Registrar campo produtos no RHF
  useEffect(() => {
    register('produtos')
  }, [register])

  // Atualizar o RHF quando o usuário seleciona produtos
  useEffect(() => {
    setValue('produtos', selectedProdutos)
    trigger('produtos') // validação instantânea
  }, [selectedProdutos, setValue, trigger])

  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((p: any) => ({
          id: p.id,
          nome: `${p.nome} — R$ ${Number(p.preco || 0).toFixed(2)}`
        }))
        setProdutos(formatted)
      })
  }, [])

  function onSubmit(data: PedidoForm) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('nome', data.nome)
      formData.append('endereco', data.endereco)
      formData.append('numero', data.numero)
      formData.append('telefone', data.telefone)
      formData.append('produtos', data.produtos.join(','))

      const result = await criarPedido(formData)

      if (result.error) {
        // Se houver erro do servidor, pode exibir global ou mapear para campos específicos
        alert(result.error)
        return
      }

      reset()
      setSelectedProdutos([])
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Pedido</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Pedido</DialogTitle>
          <DialogDescription>
            Preencha as informações e selecione os produtos do pedido.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">

            <div>
              <Label htmlFor="nome">Nome do Cliente</Label>
              <Input id="nome" {...register('nome')} disabled={isPending} />
              {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endereco">Endereço (Rua)</Label>
                <Input id="endereco" {...register('endereco')} disabled={isPending} />
                {errors.endereco && <p className="text-sm text-red-500">{errors.endereco.message}</p>}
              </div>

              <div>
                <Label htmlFor="numero">Número</Label>
                <Input id="numero" type="number" {...register('numero')} disabled={isPending} />
                {errors.numero && <p className="text-sm text-red-500">{errors.numero.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" {...register('telefone')} disabled={isPending} />
              {errors.telefone && <p className="text-sm text-red-500">{errors.telefone.message}</p>}
            </div>

            <div>
              <Label>Produtos</Label>
              <MultiSelectCombobox
                items={produtos}
                value={selectedProdutos}
                onChange={setSelectedProdutos}
                placeholder="Selecione os produtos"
              />
              {errors.produtos && <p className="text-sm text-red-500">{errors.produtos.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isPending}>
              Criar Pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}