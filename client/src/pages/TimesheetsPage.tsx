import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { timesheetsAPI } from '../services/api';

interface Timesheet {
  id: string;
  user_id: string;
  project_id?: string;
  task_id?: string;
  description: string;
  hours: number;
  rate?: number;
  date: string;
  billable: boolean;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export const TimesheetsPage: React.FC = () => {
  const { projects, tasks, user } = useApp();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState<Timesheet | null>(null);
  const [formData, setFormData] = useState({
    user_id: user?.id || '',
    project_id: '',
    task_id: '',
    description: '',
    hours: 0,
    rate: 0,
    date: new Date().toISOString().split('T')[0],
    billable: true,
    approved: false
  });

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const response = await timesheetsAPI.getAll();
      if (response.success) {
        setTimesheets(response.timesheets || []);
      }
    } catch (error) {
      console.error('Failed to fetch timesheets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTimesheet) {
        const response = await timesheetsAPI.update(editingTimesheet.id, formData);
        if (response.success) {
          await fetchTimesheets();
          setIsModalOpen(false);
          setEditingTimesheet(null);
          resetForm();
        } else {
          alert(response.message || 'Failed to update timesheet');
        }
      } else {
        const response = await timesheetsAPI.create(formData);
        if (response.success) {
          await fetchTimesheets();
          setIsModalOpen(false);
          resetForm();
        } else {
          alert(response.message || 'Failed to create timesheet');
        }
      }
    } catch (error) {
      console.error('Failed to save timesheet:', error);
      alert('Failed to save timesheet. Please try again.');
    }
  };

  const handleEdit = (timesheet: Timesheet) => {
    setEditingTimesheet(timesheet);
    setFormData({
      user_id: timesheet.user_id,
      project_id: timesheet.project_id || '',
      task_id: timesheet.task_id || '',
      description: timesheet.description,
      hours: timesheet.hours,
      rate: timesheet.rate || 0,
      date: timesheet.date,
      billable: timesheet.billable,
      approved: timesheet.approved
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this timesheet entry?')) {
      try {
        const response = await timesheetsAPI.delete(id);
        if (response.success) {
          await fetchTimesheets();
        } else {
          alert(response.message || 'Failed to delete timesheet');
        }
      } catch (error) {
        console.error('Failed to delete timesheet:', error);
        alert('Failed to delete timesheet. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: user?.id || '',
      project_id: '',
      task_id: '',
      description: '',
      hours: 0,
      rate: 0,
      date: new Date().toISOString().split('T')[0],
      billable: true,
      approved: false
    });
  };

  const getStatusBadgeClass = (approved: boolean) => {
    return approved 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  // Filter tasks based on selected project
  const filteredTasks = formData.project_id 
    ? tasks.filter(task => task.projectId === formData.project_id)
    : tasks;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
            <p className="text-gray-600 mt-1">Track work hours and productivity</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            New Timesheet Entry
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timesheets.map((timesheet) => (
                  <tr key={timesheet.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {timesheet.project_id ? projects.find(p => p.id === timesheet.project_id)?.name || 'N/A' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {timesheet.task_id ? tasks.find(t => t.id === timesheet.task_id)?.name || 'N/A' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(timesheet.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {timesheet.hours}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {timesheet.rate ? `$${timesheet.rate.toFixed(2)}/h` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {timesheet.rate ? `$${(timesheet.hours * timesheet.rate).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(timesheet.approved)}`}>
                        {timesheet.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(timesheet)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(timesheet.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {timesheets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No timesheet entries found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTimesheet(null);
          resetForm();
        }}
        title={editingTimesheet ? "Edit Timesheet Entry" : "Create New Timesheet Entry"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              name="project_id"
              value={formData.project_id}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task
            </label>
            <select
              name="task_id"
              value={formData.task_id}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              disabled={!formData.project_id}
            >
              <option value="">Select Task</option>
              {filteredTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Hours"
            name="hours"
            type="number"
            step="0.25"
            min="0"
            value={formData.hours}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Rate (per hour)"
            name="rate"
            type="number"
            step="0.01"
            min="0"
            value={formData.rate}
            onChange={handleInputChange}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="billable"
              name="billable"
              type="checkbox"
              checked={formData.billable}
              onChange={handleInputChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="billable" className="ml-2 block text-sm text-gray-900">
              Billable
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="approved"
              name="approved"
              type="checkbox"
              checked={formData.approved}
              onChange={handleInputChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="approved" className="ml-2 block text-sm text-gray-900">
              Approved
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingTimesheet(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingTimesheet ? 'Update Timesheet' : 'Create Timesheet'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};