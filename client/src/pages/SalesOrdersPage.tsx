import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useApp } from '../context/AppContext';
import { salesAPI } from '../services/api';

interface SalesOrder {
  id: string;
  order_number: string;
  client: string;
  project_id?: string;
  amount: number;
  status: 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled';
  order_date: string;
  delivery_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const SalesOrdersPage: React.FC = () => {
  const { projects } = useApp();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSalesOrder, setEditingSalesOrder] = useState<SalesOrder | null>(null);
  const [formData, setFormData] = useState({
    order_number: '',
    client: '',
    project_id: '',
    amount: 0,
    status: 'draft' as 'draft' | 'sent' | 'accepted' | 'completed' | 'cancelled',
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    description: ''
  });

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      const response = await salesAPI.getAll();
      if (response.success) {
        setSalesOrders(response.sales_orders || []);
      }
    } catch (error) {
      console.error('Failed to fetch sales orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSalesOrder) {
        const response = await salesAPI.update(editingSalesOrder.id, formData);
        if (response.success) {
          await fetchSalesOrders();
          setIsModalOpen(false);
          setEditingSalesOrder(null);
          resetForm();
        } else {
          alert(response.message || 'Failed to update sales order');
        }
      } else {
        const response = await salesAPI.create(formData);
        if (response.success) {
          await fetchSalesOrders();
          setIsModalOpen(false);
          resetForm();
        } else {
          alert(response.message || 'Failed to create sales order');
        }
      }
    } catch (error) {
      console.error('Failed to save sales order:', error);
      alert('Failed to save sales order. Please try again.');
    }
  };

  const handleEdit = (salesOrder: SalesOrder) => {
    setEditingSalesOrder(salesOrder);
    setFormData({
      order_number: salesOrder.order_number,
      client: salesOrder.client,
      project_id: salesOrder.project_id || '',
      amount: salesOrder.amount,
      status: salesOrder.status,
      order_date: salesOrder.order_date,
      delivery_date: salesOrder.delivery_date || '',
      description: salesOrder.description || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sales order?')) {
      try {
        const response = await salesAPI.delete(id);
        if (response.success) {
          await fetchSalesOrders();
        } else {
          alert(response.message || 'Failed to delete sales order');
        }
      } catch (error) {
        console.error('Failed to delete sales order:', error);
        alert('Failed to delete sales order. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      order_number: '',
      client: '',
      project_id: '',
      amount: 0,
      status: 'draft',
      order_date: new Date().toISOString().split('T')[0],
      delivery_date: '',
      description: ''
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
            <p className="text-gray-600 mt-1">Manage customer sales orders and quotations</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            New Sales Order
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
                    Order Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.project_id ? projects.find(p => p.id === order.project_id)?.name || 'N/A' : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {salesOrders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No sales orders found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSalesOrder(null);
          resetForm();
        }}
        title={editingSalesOrder ? "Edit Sales Order" : "Create New Sales Order"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Order Number"
            name="order_number"
            value={formData.order_number}
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
          
          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <Input
            label="Order Date"
            name="order_date"
            type="date"
            value={formData.order_date}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Delivery Date"
            name="delivery_date"
            type="date"
            value={formData.delivery_date}
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
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingSalesOrder(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingSalesOrder ? 'Update Sales Order' : 'Create Sales Order'}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};