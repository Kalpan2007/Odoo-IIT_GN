export interface Purchase {
  id: string;
  purchase_number: string;
  vendor: string;
  project_id?: string;
  amount: number;
  status: 'draft' | 'ordered' | 'received' | 'paid' | 'cancelled';
  order_date: string;
  delivery_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface CreatePurchaseRequest {
  purchase_number: string;
  vendor: string;
  project_id?: string;
  amount: number;
  status?: 'draft' | 'ordered' | 'received' | 'paid' | 'cancelled';
  order_date: string;
  delivery_date?: string;
  description?: string;
}

export interface UpdatePurchaseRequest extends Partial<CreatePurchaseRequest> {
  status?: 'draft' | 'ordered' | 'received' | 'paid' | 'cancelled';
}