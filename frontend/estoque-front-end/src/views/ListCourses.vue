<script setup>
import { onMounted, ref } from 'vue'
import CoursesTable from '../components/CoursesTable.vue'

const cursos = ref([])
const carregando = ref(true)
const excluindoId = ref('')
const erro = ref('')

function formatarData(valor) {
  if (!valor) return '-'

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) return valor

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data)
}

async function carregarCursos() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await fetch('/curso/cursos')

    if (!resposta.ok) {
      throw new Error('Nao foi possivel carregar os cursos.')
    }

    const dados = await resposta.json()
    cursos.value = Array.isArray(dados) ? dados : []
  } catch (error) {
    erro.value = error instanceof Error ? error.message : 'Erro inesperado ao carregar cursos.'
  } finally {
    carregando.value = false
  }
}

async function excluirCurso(id) {
  const confirmar = window.confirm('Tem certeza que deseja excluir este curso?')

  if (!confirmar) return

  excluindoId.value = id
  erro.value = ''

  try {
    const resposta = await fetch(`/curso/delete/${id}`, {
      method: 'DELETE',
    })

    if (!resposta.ok) {
      const mensagem = await resposta.text()
      throw new Error(mensagem || 'Nao foi possivel excluir o curso.')
    }

    cursos.value = cursos.value.filter((curso) => curso.id !== id)
  } catch (error) {
    erro.value = error instanceof Error ? error.message : 'Erro inesperado ao excluir o curso.'
  } finally {
    excluindoId.value = ''
  }
}

onMounted(carregarCursos)
</script>

<template>
  <main class="page">
    <section class="page-header">
      <div>
        <h1>Cursos</h1>
      </div>

      <div class="buttons">
        <button type="button" @click="carregarCursos" :disabled="carregando">
          {{ carregando ? 'Carregando...' : 'Atualizar' }}
        </button>
        <RouterLink class="create-link" to="/create">Criar curso</RouterLink>
      </div>
    </section>

    <CoursesTable
      :cursos="cursos"
      :carregando="carregando"
      :excluindo-id="excluindoId"
      :erro="erro"
      :formatar-data="formatarData"
      @excluir-curso="excluirCurso"
    />
  </main>
</template>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

h1 {
  margin: 0 0 4px;
  font-size: 2rem;
}

p {
  margin: 0;
  color: #555;
}

.buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 10px 16px;
  background: #fff;
  cursor: pointer;
}

.create-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #1d4ed8;
  border-radius: 6px;
  padding: 10px 16px;
  background: #1d4ed8;
  color: #fff;
  text-decoration: none;
}

button:disabled {
  opacity: 0.7;
  cursor: default;
}

code {
  background: #f3f3f3;
  padding: 2px 6px;
  border-radius: 4px;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
