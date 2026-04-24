import TaskBoard from '@/components/TaskBoard';

export default function AmanhaPage() {
  return (
    <div className="main">
      <TaskBoard filter="amanha" />
    </div>
  );
}