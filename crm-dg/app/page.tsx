'use client';
import TaskBoard from '@/components/TaskBoard';

export default function VisaoGeral() {
  return (
    <div className="main">
      {/* CABEÇALHO DA VISÃO GERAL - Título na esquerda, Botão na direita */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        width: '100%'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>Visão Geral</h1>
        
        {/* Usamos o TaskBoard aqui sem filtro, apenas para renderizar o botão de criar */}
        <div style={{ minWidth: '160px', display: 'flex', justifyContent: 'flex-end' }}>
          <TaskBoard hideHeader={false} showOnlyButton={true} />
        </div>
      </header>
      
      {/* SEÇÕES ORGANIZADAS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <section>
          <h2 style={{ color: '#7b1fa2', fontSize: '20px', marginBottom: '15px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
            📅 Hoje
          </h2>
          <TaskBoard filter="hoje" hideHeader={true} />
        </section>

        <section>
          <h2 style={{ color: '#7b1fa2', fontSize: '20px', marginBottom: '15px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
            🌅 Amanhã
          </h2>
          <TaskBoard filter="amanha" hideHeader={true} />
        </section>

        <section>
          <h2 style={{ color: '#7b1fa2', fontSize: '20px', marginBottom: '15px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
            🚀 Futuro
          </h2>
          <TaskBoard filter="futuro" hideHeader={true} />
        </section>
      </div>
    </div>
  );
}