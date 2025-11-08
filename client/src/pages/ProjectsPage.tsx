import React, { useState } from 'react';
import { FiPlus, FiSearch, FiChevronRight } from 'react-icons/fi';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProjectCard } from '../components/projects/ProjectCard';
import { Modal } from '../components/ui/Modal';
import { MultiSelect } from '../components/ui/MultiSelect';
import { RadioGroup } from '../components/ui/RadioGroup';
import { ImageUpload } from '../components/ui/ImageUpload';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const { projects, addProject, updateProject, isLoading } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    projectManager: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    images: [] as string[],
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
      description: project.description,
      tags: project.tags || [],
      projectManager: project.managerImage || '',
      deadline: project.deadline || '',
      priority: project.priority || 'medium',
      images: project.images || [],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const projectData = {
        name: formData.name,
        description: formData.description,
        client: '', // This would need to be added to the form
        startDate: new Date().toISOString().split('T')[0],
        endDate: formData.deadline,
        status: 'active' as const,
        priority: formData.priority,
        tags: formData.tags,
        images: formData.images,
        managerImage: formData.projectManager,
        deadline: formData.deadline || null,
        tasksCount: 0,
        progress: 0,
        revenue: 0,
        expenses: 0,
        profit: 0
      };

      if (editingProject) {
        await updateProject(editingProject, projectData);
        setEditingProject(null);
      } else {
        await addProject(projectData);
      }

      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        tags: [],
        projectManager: '',
        deadline: '',
        priority: 'medium',
        images: []
      });
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  // Only show create button for admins and project managers
  const canCreateProjects = user?.role === 'admin' || user?.role === 'project_manager';

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your projects and track progress</p>
          </div>
          {canCreateProjects && (
            <Button onClick={() => setIsModalOpen(true)}>
              <FiPlus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          )}
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

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onEdit={handleEditProject}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Create New Project"}
        size="2xl"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Projects</span>
          <FiChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">
            {editingProject ? 'Edit Project' : 'New Project'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <MultiSelect
              label="Tags"
              options={[
                { value: 'development', label: 'Development' },
                { value: 'design', label: 'Design' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'research', label: 'Research' }
              ]}
              value={formData.tags}
              onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
            />
            
            <Input
              type="date"
              label="Deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-4">
            <MultiSelect
              label="Project Manager"
              options={[
                { value: '/avatars/user1.jpg', label: 'John Doe' },
                { value: '/avatars/user2.jpg', label: 'Jane Smith' },
                { value: '/avatars/user3.jpg', label: 'Mike Johnson' }
              ]}
              value={[formData.projectManager]}
              onChange={(managers) => setFormData(prev => ({ ...prev, projectManager: managers[0] }))}
            />
            
            <RadioGroup
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' }
              ]}
              value={formData.priority}
              onChange={(priority) => setFormData(prev => ({ ...prev, priority: priority as 'low' | 'medium' | 'high' }))}
              horizontal
            />

            <ImageUpload
              label="Project Images"
              images={formData.images}
              onChange={(images) => setFormData(prev => ({ ...prev, images }))}
            />
          </div>

          <div className="md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Project description..."
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Discard
            </Button>
            <Button type="submit">
              {editingProject ? 'Save Changes' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};