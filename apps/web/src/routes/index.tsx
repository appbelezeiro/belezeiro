import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Bem-vindo ao Belezeiro</h1>
      <p className="mt-2 text-gray-600">Sistema de agendamento para salões de beleza.</p>
    </div>
  )
}
