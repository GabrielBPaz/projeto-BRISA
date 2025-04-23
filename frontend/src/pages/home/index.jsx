import '../../index.css';

function Home() {
  
  return (
<div class="app">
<aside class="sidebar">
  <div class="logo">Gestão de Licitações</div>
  <a href="#" class="active">Dashboard</a>
  <a href="#">Licitações</a>
  <a href="#">Kanban</a>
  <a href="#">Relatórios</a>
  <a href="../login">Sair</a>
</aside>
<main class="content">
  <h1>Dashboard</h1>
  <p>Visão geral das suas licitações e atividades</p>
  <div class="cards">
    <div class="card">
      <div>Ligações Ativas</div><div>0 </div>
    </div>
    <div class="card small">
      <div>Próximos Prazos</div><div>0 esta semana</div>
    </div>
    <div class="card small">
      <div>Em Atraso</div><div>0</div>
    </div>
    <div class="card small">
      <div>Concluídas</div><div>0</div>
    </div>
  </div>
  <section>
    <h2>Licitações em Andamento</h2>
    <div class="cards">
      <div class="card">Pendente</div>
      <div class="card">Em Andamento</div>
      <div class="card">Concluído</div>
    </div>
  </section>
</main>
<button class="btn-add">+</button>
</div>
  )
}

export default Home
