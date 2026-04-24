'use client';
import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

let globalTasks: any[] = [];

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="menu-bar">
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }}><b>B</b></button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().setColor('#7b1fa2').run(); }} style={{color: '#7b1fa2'}}>Roxo</button>
      <button onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHighlight().run(); }}>Grifar</button>
    </div>
  );
};

export default function TaskBoard({ filter, hideHeader, showOnlyButton }: { filter?: string, hideHeader?: boolean, showOnlyButton?: boolean }) {
  const [tasks, setTasks] = useState<any[]>(globalTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState('');
  const [taskDateTime, setTaskDateTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTasks(globalTasks);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color, Highlight.configure({ multicolor: true })],
    content: '',
    immediatelyRender: false,
  });

  // Função para abrir o modal (Nova ou Edição)
  const openModal = (task?: any) => {
    if (task) {
      setEditingTaskId(task.id);
      setNewTaskText(task.text);
      setTaskDateTime(task.date);
      editor?.commands.setContent(task.notes || '');
    } else {
      setEditingTaskId(null);
      setNewTaskText('');
      // DATA PRE-DEFINIDA PARA HOJE E AGORA
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setTaskDateTime(now.toISOString().slice(0, 16));
      editor?.commands.setContent('');
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!newTaskText || !taskDateTime) return;

    if (editingTaskId) {
      globalTasks = globalTasks.map(t => t.id === editingTaskId ? {
        ...t,
        text: newTaskText,
        date: taskDateTime,
        notes: editor?.getHTML() || ''
      } : t);
    } else {
      const newEntry = {
        id: `task-${Date.now()}`,
        text: newTaskText,
        priority: false,
        notes: editor?.getHTML() || '',
        completed: false,
        date: taskDateTime
      };
      globalTasks = [newEntry, ...globalTasks];
    }
    
    setTasks([...globalTasks]);
    setIsModalOpen(false);
  };

  const updateTaskInline = (id: string, field: string, value: string) => {
    globalTasks = globalTasks.map(t => t.id === id ? { ...t, [field]: value } : t);
    setTasks([...globalTasks]);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    globalTasks = items;
    setTasks(items);
  };

  if (!mounted) return null;

  const filteredTasks = tasks.filter(task => {
    const tDate = new Date(task.date).toLocaleDateString('pt-BR');
    const today = new Date().toLocaleDateString('pt-BR');
    const tom = new Date(); tom.setDate(tom.getDate() + 1);
    const tomorrow = tom.toLocaleDateString('pt-BR');

    if (filter === 'hoje') return tDate === today;
    if (filter === 'amanha') return tDate === tomorrow;
    if (filter === 'futuro') {
      const checkDate = new Date(task.date);
      const limit = new Date(); limit.setDate(limit.getDate() + 1); limit.setHours(23,59,59);
      return checkDate > limit;
    }
    return true;
  });

  if (showOnlyButton) {
    return (
      <>
        <button className="add-task-btn" onClick={() => openModal()}>+ Nova Tarefa</button>
        {isModalOpen && renderModal()}
      </>
    );
  }

  function renderModal() {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2 style={{color: '#7b1fa2', marginBottom: '20px'}}>
            {editingTaskId ? 'Editar Tarefa' : 'Nova Tarefa DG HUB'}
          </h2>
          <label>Título</label>
          <input type="text" className="modal-input" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
          <label>Data e Hora</label>
          <input type="datetime-local" className="modal-input" value={taskDateTime} onChange={(e) => setTaskDateTime(e.target.value)} />
          <label>Anotações</label>
          <div className="editor-container">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
          </div>
          <div className="modal-actions" style={{marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
            <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancelar</button>
            <button onClick={handleSave} className="add-task-btn">Salvar Alterações</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {!hideHeader && (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{textTransform: 'capitalize'}}>{filter || 'Visão Geral'}</h1>
          <button className="add-task-btn" onClick={() => openModal()}>+ Nova Tarefa</button>
        </header>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="task-list">
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task-item"
                      style={{
                        ...provided.draggableProps.style,
                        background: 'white',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        borderLeft: task.priority ? '6px solid #7b1fa2' : '6px solid #eee',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'grab'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="checkbox" checked={task.completed} onChange={() => {
                          task.completed = !task.completed;
                          setTasks([...globalTasks]);
                        }} style={{width: '18px', height: '18px', accentColor: '#7b1fa2'}} />
                        
                        <button 
                          onClick={() => { task.priority = !task.priority; setTasks([...globalTasks]); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: task.priority ? '#7b1fa2' : '#ccc' }}
                        >
                          {task.priority ? '★' : '☆'}
                        </button>

                        <span 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateTaskInline(task.id, 'text', e.currentTarget.innerText)}
                          style={{ 
                            flex: 1, 
                            fontWeight: '600', 
                            textDecoration: task.completed ? 'line-through' : 'none', 
                            color: task.completed ? '#aaa' : '#333',
                            outline: 'none'
                          }}
                        >
                          {task.text}
                        </span>

                        <div style={{ textAlign: 'right', fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div>
                            <div>{new Date(task.date).toLocaleDateString('pt-BR')}</div>
                            <div style={{ fontWeight: 'bold', color: '#7b1fa2' }}>{new Date(task.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                          
                          {/* BOTÃO DE EDITAR (LÁPIS) */}
                          <button onClick={() => openModal(task)} style={{background:'none', border:'none', cursor:'pointer', fontSize: '16px'}}>✏️</button>
                          
                          <button onClick={() => {
                            globalTasks = globalTasks.filter(t => t.id !== task.id);
                            setTasks([...globalTasks]);
                          }} style={{background:'none', border:'none', cursor:'pointer'}}>🗑️</button>
                        </div>
                      </div>
                      
                      {task.notes && !task.completed && (
                        <div 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateTaskInline(task.id, 'notes', e.currentTarget.innerHTML)}
                          style={{ 
                            fontSize: '13px', 
                            color: '#666', 
                            marginTop: '10px', 
                            paddingLeft: '40px', 
                            borderTop: '1px solid #f9f9f9', 
                            paddingTop: '8px',
                            outline: 'none'
                          }} 
                          dangerouslySetInnerHTML={{ __html: task.notes }} 
                        />
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isModalOpen && renderModal()}
    </div>
  );
}