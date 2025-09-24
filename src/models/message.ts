export interface Message {
  id: number;
  sender: number;
  sender_name: string;
  text: string;
  is_read: boolean;
  timestamp: string;
  vehicle?: {
    id: number;
    brand: string;
    model: string;
    year: number;
  };
}

export interface Conversation {
  id: number;
  vehicle: number;
  vehicle_title: string;
  other_user: string;
  last_message: Message;
  unread_count: number;
}

export interface CreateMessageRequest {
  receiver?: number;
  vehicle?: number;
  conversation?: number;
  text: string;
}
