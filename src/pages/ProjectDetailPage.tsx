import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiCalendar, FiUser, FiDollarSign } from 'react-icons/fi';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, tasks } = useApp();

  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Project not found.</p>
          <Link to="/projects" className="text-purple-600 hover:text-purple-500 mt-2 inline-block">
            Back to Projects
          </Link>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/projects"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-1" />
              Back to Projects
            </Link>
          </div>
          <Button variant="outline">
            <FiEdit className="w-4 h-4 mr-2" />
            Edit Project
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {project.name}
                  </h1>
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                {project.thumbnail && (
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <FiUser className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium">{project.client}</p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">
                      {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Project Tasks</h3>
                <Link to="/tasks">
                  <Button variant="outline" size="sm">
                    View All Tasks
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {projectTasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{task.name}</p>
                      <p className="text-sm text-gray-500">Assigned to {task.assignee}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      task.status === 'done' 
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}

                {projectTasks.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No tasks assigned to this project yet.</p>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiDollarSign className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                  <span className="font-medium text-green-600">
                    ${project.revenue.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiDollarSign className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">Expenses</span>
                  </div>
                  <span className="font-medium text-red-600">
                    ${project.expenses.toLocaleString()}
                  </span>
                </div>

                <div className="border-t pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiDollarSign className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Profit</span>
                    </div>
                    <span className="font-bold text-purple-600">
                      ${project.profit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  Create Sales Order
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Add Expense
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Generate Invoice
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  View Reports
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};