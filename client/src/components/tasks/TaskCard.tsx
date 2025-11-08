import React from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { Card } from '../ui/Card';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Card 
      className={`p-4 border-l-4 ${getPriorityColor(task.priority)} cursor-pointer hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <h4 className="font-medium text-gray-900 mb-2">{task.name}</h4>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <FiUser className="w-3 h-3 mr-1" />
          <span>{task.assignee}</span>
        </div>
        <div className="flex items-center">
          <FiCalendar className="w-3 h-3 mr-1" />
          <span>{new Date(task.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    </Card>
  );
};