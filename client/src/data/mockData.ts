import { Project, Task, SalesOrder, PurchaseOrder, Expense, Invoice, DashboardStats } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    client: 'TechCorp Inc.',
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    description: 'Complete e-commerce platform development',
    progress: 75,
    revenue: 125000,
    expenses: 78000,
    profit: 47000,
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['E-commerce', 'Web Development'],
    images: [
      "data:image/jpeg;base64,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",
      "/img/sample2.png",
      "/img/sample3.png",
      "/img/sample4.png"
    ],
    managerImage: "/avatars/user1.png",
    deadline: '2024-06-15',
    tasksCount: 5
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    client: 'FinanceFirst',
    startDate: '2024-02-01',
    endDate: '2024-08-01',
    description: 'Secure mobile banking application',
    progress: 45,
    revenue: 200000,
    expenses: 95000,
    profit: 105000,
    status: 'active',
    thumbnail: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-147413.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Finance', 'Mobile App'],
    images: [
      "/img/sample1.png",
      "/img/sample2.png",
      "/img/sample3.png",
      "/img/sample4.png"
    ],
    managerImage: "/avatars/user1.png",
    deadline: '2024-08-01',
    tasksCount: 8
  },
  {
    id: '3',
    name: 'Corporate Website',
    client: 'GlobalTech',
    startDate: '2023-11-01',
    endDate: '2024-01-15',
    description: 'Modern corporate website redesign',
    progress: 100,
    revenue: 45000,
    expenses: 25000,
    profit: 20000,
    status: 'completed',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
    tags: ['Web Development', 'Corporate'],
    images: [
      "/img/sample1.png",
      "/img/sample2.png",
      "/img/sample3.png",
      "/img/sample4.png"
    ],
    managerImage: "/avatars/user1.png",
    deadline: '2024-01-15',
    tasksCount: 3
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Design System Setup',
    assignee: 'Sarah Johnson',
    projectId: '1',
    description: 'Create comprehensive design system',
    deadline: '2024-03-15',
    status: 'done',
    priority: 'high',
    coverImage: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400',
    placeholder: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Authentication Module',
    assignee: 'Mike Chen',
    projectId: '1',
    description: 'Implement user authentication',
    deadline: '2024-03-20',
    status: 'in-progress',
    priority: 'high',
    coverImage: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400',
    placeholder: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Payment Integration',
    assignee: 'Alex Rodriguez',
    projectId: '1',
    description: 'Integrate payment gateway',
    deadline: '2024-04-01',
    status: 'todo',
    priority: 'medium',
    coverImage: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400',
    placeholder: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Security Audit',
    assignee: 'Emma Wilson',
    projectId: '2',
    description: 'Comprehensive security review',
    deadline: '2024-03-30',
    status: 'in-progress',
    priority: 'high',
    coverImage: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400',
    placeholder: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalProjects: 12,
  totalRevenue: 485000,
  totalExpenses: 298000,
  totalProfit: 187000
};

export const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 25000 },
  { month: 'Feb', revenue: 52000, expenses: 28000 },
  { month: 'Mar', revenue: 48000, expenses: 31000 },
  { month: 'Apr', revenue: 61000, expenses: 35000 },
  { month: 'May', revenue: 55000, expenses: 32000 },
  { month: 'Jun', revenue: 67000, expenses: 38000 }
];