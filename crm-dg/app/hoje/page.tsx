import TaskBoard from '@/components/TaskBoard';

export default function HojePage() {
  return (
    <div className="main">
      <TaskBoard filter="hoje" />
    </div>
  );
}