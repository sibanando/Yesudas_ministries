export interface Ministry {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  imageUrl: string;
  leader: string;
  leaderImageUrl?: string;
  schedule: string;
  contactEmail?: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  email?: string;
}
