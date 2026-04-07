<script setup>
import courseImage from '../assets/image.png'

defineProps({
  cursos: {
    type: Array,
    default: () => [],
  },
  carregando: {
    type: Boolean,
    default: false,
  },
  erro: {
    type: String,
    default: '',
  },
  formatarData: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <section class="table-section">
    <p v-if="carregando" class="feedback">Carregando cursos...</p>
    <p v-else-if="erro" class="feedback feedback-error">{{ erro }}</p>
    <p v-else-if="!cursos.length" class="feedback">Nenhum curso encontrado.</p>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Professor</th>
            <th>Status</th>
            <th>Criado em</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="curso in cursos" :key="curso.id">
            <td>{{ curso.name }}</td>
            <td>{{ curso.category || '-' }}</td>
            <td>{{ curso.professor || '-' }}</td>
            <td>
              <span class="status-badge" :class="curso.active ? 'is-active' : 'is-inactive'">
                {{ curso.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td>{{ formatarData(curso.created_at) }}</td>
            <td>
              <RouterLink :to="`/curso/editar/${curso.id}`">
                <img class="course-image" :src="courseImage" alt="Editar curso" />
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.table-section {
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  background: #fff;
  padding: 16px;
}

.feedback {
  margin: 0;
  color: #555;
}

.feedback-error {
  color: #c62828;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ededed;
}

thead th {
  font-size: 0.85rem;
  color: #666;
}

.status-badge {
  display: inline-block;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.8rem;
}

.status-badge.is-active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.is-inactive {
  background: #ffebee;
  color: #c62828;
}

.course-edit-link {
  display: inline-flex;
}

.course-image {
  display: block;
  width: 25px;
  height: 25px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}
</style>
