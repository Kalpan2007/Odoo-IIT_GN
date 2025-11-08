import React, { useState } from 'react';
import { FiPlus, FiMoreVertical } from 'react-icons/fi';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task } from '../types';

export const TasksPage: React.FC = () => {
  const { tasks, projects, addTask, updateTask, deleteTask, isLoading } = useApp();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    assignee: '',
    projectId: '',
    description: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in-progress' | 'done'
  });

  const taskColumns = {
    todo: tasks.filter((t) => t.status === 'todo'),
    'in-progress': tasks.filter((t) => t.status === 'in-progress'),
    done: tasks.filter((t) => t.status === 'done')
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateTask(editingTask.id, formData);
      } else {
        await addTask({ ...formData });
      }
      setIsModalOpen(false);
      setEditingTask(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      assignee: '',
      projectId: '',
      description: '',
      deadline: '',
      priority: 'medium',
      status: 'todo'
    });
  };

  const openEditModal = (task: Task) => {
    setFormData({
      name: task.name,
      assignee: task.assignee,
      projectId: task.projectId,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status
    });
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Only admins and project managers can delete tasks
      if (user?.role !== 'admin' && user?.role !== 'project_manager') {
        alert('Only admins and project managers can delete tasks.');
        return;
      }
      
      await deleteTask(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    
    try {
      await updateTask(draggableId, { status: destination.droppableId as 'todo' | 'in-progress' | 'done' });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const renderPriorityStars = (priority: string) => {
    const starCount = priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
    return (
      <div className="flex space-x-0.5">
        {[...Array(starCount)].map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks View</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <FiPlus className="mr-2" /> New
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading tasks...</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(taskColumns).map(([status, columnTasks]) => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-50 rounded-lg p-4 flex flex-col"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                      {status === 'todo' ? 'New' : status.replace('-', ' ')}
                    </h3>

                    {columnTasks
                      .sort((a, b) => {
                        const priorityOrder = { high: 1, medium: 2, low: 3 };
                        return (
                          priorityOrder[a.priority] - priorityOrder[b.priority] ||
                          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
                        );
                      })
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded-xl shadow-sm border p-3 mb-3 hover:shadow-md transition"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-gray-700 font-semibold">
                                    Project: {projects.find((p) => p.id === task.projectId)?.name || 'N/A'}
                                  </p>
                                  <p className="text-gray-800 font-bold mt-1">{task.name}</p>
                                </div>

                                <div className="flex flex-col items-end">
                                  {renderPriorityStars(task.priority)}
                                  <div className="relative group">
                                    <FiMoreVertical className="cursor-pointer mt-1 text-gray-500" />
                                    <div className="hidden group-hover:block absolute right-0 mt-1 bg-white border rounded shadow-lg w-28 z-10">
                                      <button
                                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                                        onClick={() => openEditModal(task)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100"
                                        onClick={() => handleDelete(task.id)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                                <div className="flex items-center space-x-1">
                                  <img
                                    src="/default-avatar.png"
                                    alt="assignee"
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span>{task.assignee}</span>
                                </div>
                                <span>{task.deadline}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder} 
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Task Name" name="name" value={formData.name} onChange={handleInputChange} required />
          <Input label="Assignee" name="assignee" value={formData.assignee} onChange={handleInputChange} required />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="date" label="Deadline" name="deadline" value={formData.deadline} onChange={handleInputChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md p-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <textarea
            name="description"
            placeholder="Task description..."
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border-gray-300 rounded-md p-2"
          />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">{editingTask ? 'Update Task' : 'Create Task'}</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};