import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Sobre</h1>
      <p className="mt-2 text-gray-600">Belezeiro - Sistema de agendamento.</p>
    </div>
  )
}
