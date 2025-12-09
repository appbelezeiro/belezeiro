import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

beforeAll(() => {
  console.log('🧪 Iniciando suíte de testes')
})

afterAll(() => {
  console.log('✅ Testes finalizados')
})

beforeEach(() => {
  // Configurações que rodam antes de cada teste
})

afterEach(() => {
  // Limpeza que roda depois de cada teste
})
