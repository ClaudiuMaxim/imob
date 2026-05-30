export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
};

export type AgentsResponse = {
  success: boolean;
  data: {
    agents?: Agent[];
    agent?: Agent;
  } | null;
  error: string | null;
};
