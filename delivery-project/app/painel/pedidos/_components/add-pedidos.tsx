'use client'

import { useState, useEffect, useTransition } from 'react'
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
import { toast } from 'sonner'
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox"

export default function AddPedido() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [produtos, setProdutos] = useState<{ id: string; nome: string }[]>([])
  const [selectedProdutos, setSelectedProdutos] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/produtos')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p: any) => ({
          id: p.id,
          nome: `${p.nome} — R$ ${Number(p.preco || 0).toFixed(2)}`
        }))
        setProdutos(formatted)
      })
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault() // ❗ Impede envio automático — AGORA funciona no cliente

    const formData = new FormData(e.currentTarget)
    formData.append("produtos", selectedProdutos.join(","))

    startTransition(async () => {
      const result = await criarPedido(formData)

      if (result.error) {
        toast.error(result.error) // 🔥 AGORA O POP-UP APARECE
        return
      }

      toast.success("Pedido criado com sucesso!")
      setOpen(false)
      setSelectedProdutos([])
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

        {/* USANDO onSubmit (NÃO action) */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">

            <div>
              <Label htmlFor="nome">Nome do Cliente</Label>
              <Input id="nome" name="nome" required disabled={isPending} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endereco">Endereço (Rua)</Label>
                <Input id="endereco" name="endereco" required disabled={isPending} />
              </div>

              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  name="numero"
                  required
                  disabled={isPending}
                  type="number"
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" name="telefone" required disabled={isPending} />
            </div>

            <div>
              <Label>Produtos</Label>
              <MultiSelectCombobox
                items={produtos}
                value={selectedProdutos}
                onChange={setSelectedProdutos}
                placeholder="Selecione os produtos"
              />
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