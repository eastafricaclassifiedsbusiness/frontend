export interface Job {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary: string;
  type: string;
  sector: string;
  requirements?: string[];
  createdAt: string;
  applicationDeadline?: string;
  experienceLevel?: string;
  education?: string;
  benefits?: string[];
  updatedAt?: string;
} 