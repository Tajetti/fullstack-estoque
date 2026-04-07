<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const enviando = ref(false)
const carregando = ref(true)
const sucesso = ref('')
const erro = ref('')

const curso = reactive({
  name: '',
  category: '',
  professor: '',
  active: true,
})

async function carregarCurso() {
  carregando.value = true
  erro.value = ''

  try {
    const resposta = await fetch(`/curso/${route.params.id}`)

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar os dados do curso.')
    }

    const dados = await resposta.json()
    curso.name = dados.name ?? ''
    curso.category = dados.category ?? ''
    curso.professor = dados.professor ?? ''
    curso.active = dados.active ?? true
  } catch (error) {
    erro.value = error instanceof Error ? error.message : 'Erro inesperado ao carregar o curso.'
  } finally {
    carregando.value = false
  }
}

async function salvarCurso() {
  enviando.value = true
  sucesso.value = ''
  erro.value = ''

  try {
    const resposta = await fetch(`/curso/${route.params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(curso),
    })

    if (!resposta.ok) {
      const mensagem = await resposta.text()
      throw new Error(mensagem || 'Não foi possível salvar o curso.')
    }

    sucesso.value = 'Curso atualizado com sucesso.'
  } catch (error) {
    erro.value = error instanceof Error ? error.message : 'Erro inesperado ao salvar o curso.'
  } finally {
    enviando.value = false
  }
}

onMounted(carregarCurso)
</script>

<template>
  <main class="page">
    <section class="page-header">
      <div>
        <p class="eyebrow">Editar curso</p>
        <h1>Atualizar dados</h1>
        <p class="subtitle">Altere os campos desejados e salve as mudanças.</p>
      </div>

      <RouterLink class="back-link" to="/home">Voltar para a lista</RouterLink>
    </section>

    <section class="layout">
      <div v-if="carregando" class="card form-card loading-state">
        <p>Carregando dados do curso...</p>
      </div>

      <form v-else class="card form-card" @submit.prevent="salvarCurso">
        <div class="field-grid">
          <label>
            <span>Nome</span>
            <input v-model.trim="curso.name" type="text" placeholder="Ex.: Angular" required />
          </label>

          <label>
            <span>Categoria</span>
            <input v-model.trim="curso.category" type="text" placeholder="Ex.: Frontend" />
          </label>

          <label>
            <span>Professor</span>
            <input v-model.trim="curso.professor" type="text" placeholder="Ex.: Ciclano" required />
          </label>

          <label class="checkbox-row">
            <input v-model="curso.active" type="checkbox" />
            <span>Curso ativo</span>
          </label>
        </div>

        <div class="feedback-group">
          <p v-if="sucesso" class="success">{{ sucesso }}</p>
          <p v-if="erro" class="error">{{ erro }}</p>
        </div>

        <div class="actions">
          <button type="submit" :disabled="enviando">
            {{ enviando ? 'Salvando...' : 'Salvar alterações' }}
          </button>
          <button type="button" class="ghost" @click="router.push('/home')">Cancelar</button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.page {
  display: grid;
  gap: 24px;
  max-width: 980px;
  margin: 0 auto;
  padding: 10px 24px 32px 56px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #1d4ed8;
  font-family: 'Trebuchet MS', 'Segoe UI', sans-serif;
}

h1 {
  margin: 0;
  color: #1e293b;
}

.subtitle {
  margin: 6px 0 0;
  color: #5b6577;
}

.layout {
  display: block;
}

.card {
  border: 1px solid #e3e3e3;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
}

.form-card {
  padding: 24px;
}

.loading-state {
  color: #5b6577;
  font-style: italic;
}

.field-grid {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
}

label span {
  font-weight: 600;
  color: #334155;
}

input[type='text'] {
  width: 100%;
  border: 1px solid #d6dde7;
  border-radius: 10px;
  padding: 12px 14px;
  background: #fff;
  font-family: inherit;
  font-size: inherit;
  box-sizing: border-box;
}

input[type='text']:focus {
  outline: none;
  border-color: #1d4ed8;
  box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.12);
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}

.checkbox-row input {
  width: 18px;
  height: 18px;
}

.feedback-group {
  min-height: 28px;
  margin: 16px 0 4px;
}

.success,
.error {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
}

.success {
  background: #ecfdf3;
  color: #166534;
}

.error {
  background: #fef2f2;
  color: #b91c1c;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

button,
.back-link {
  border-radius: 10px;
  padding: 12px 16px;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
}

button[type='submit'] {
  background: #1d4ed8;
  color: #fff;
}

button.ghost {
  background: #fff;
  border-color: #d6dde7;
  color: #1f2937;
}

.back-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-color: #d6dde7;
  color: #1f2937;
  background: #fff;
}

@media (max-width: 720px) {
  .page {
    padding: 8px 16px 24px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
