export type Message = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  messageContent: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type MessagesResponse = {
  success: boolean;
  data: {
    messages?: Message[];
  } | null;
  error: string | null;
};
