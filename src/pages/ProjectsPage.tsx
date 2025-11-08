import React, { useState } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const { projects, addProject, updateProject } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    startDate: '',
    endDate: '',
    description: '',
    tags: ''
  });

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project.id);
    setFormData({
      name: project.name,
      client: project.client,
      startDate: project.startDate,
      endDate: project.endDate,
      description: project.description,
      tags: project.tags.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...formData,
      progress: editingProject ? projects.find(p => p.id === editingProject)?.progress || 0 : 0,
      revenue: editingProject ? projects.find(p => p.id === editingProject)?.revenue || 0 : 0,
      expenses: editingProject ? projects.find(p => p.id === editingProject)?.expenses || 0 : 0,
      profit: editingProject ? projects.find(p => p.id === editingProject)?.profit || 0 : 0,
      status: editingProject ? projects.find(p => p.id === editingProject)?.status || 'active' : 'active' as const,
      tags: formData.tags ? formData.tags.split(',').filter(t => t.trim()).map(t => t.trim()) : [],
      images: editingProject ? projects.find(p => p.id === editingProject)?.images || [] : [],
      managerImage: editingProject ? projects.find(p => p.id === editingProject)?.managerImage || '' : '',
      deadline: formData.endDate || null,
      tasksCount: editingProject ? projects.find(p => p.id === editingProject)?.tasksCount || 0 : 0
    };

    if (editingProject) {
      updateProject(editingProject, projectData);
      setEditingProject(null);
    } else {
      addProject(projectData);
    }

    setIsModalOpen(false);
    setFormData({
      name: '',
      client: '',
      startDate: '',
      endDate: '',
      description: '',
      tags: ''
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onEdit={handleEditProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Create New Project"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Client"
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Project description..."
            />
          </div>

          <Input
            label="Tags (comma separated)"
            name="tags"
            placeholder="Example: Services, Customer Care"
            value={formData.tags}
            onChange={handleInputChange}
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};