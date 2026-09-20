export interface Profile {
  id: string;
  full_name: string | null;
  education_level: string | null;
  branch: string | null;
  cgpa: string | null;
  years_of_experience: string | null;
  created_at: string;
  updated_at: string;
}

export interface EligibilityResultRecord {
  id: string;
  user_id: string;
  target_role: string;
  profile: Record<string, unknown>;
  result: Record<string, unknown>;
  created_at: string;
}
