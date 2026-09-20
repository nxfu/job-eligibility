import { supabase } from '../lib/supabase';
import { Profile } from '../types/database';
import { CandidateProfile, EligibilityAnalysisResult } from '../types/eligibility';

export class DatabaseService {
  // ─── Profile Operations ───

  /**
   * Fetch the authenticated user's profile.
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = "Row not found" — not a real error
      console.error('Failed to fetch profile:', error.message);
    }
    return data;
  }

  /**
   * Create or update the authenticated user's profile via upsert.
   * Profile ID always matches auth.users.id.
   */
  static async upsertProfile(
    userId: string,
    updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('profiles')
      .upsert(
        { id: userId, ...updates, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  }

  // ─── Eligibility Results Operations ───

  /**
   * Save an eligibility analysis result for the authenticated user.
   */
  static async saveResult(
    userId: string,
    targetRole: string,
    profile: CandidateProfile,
    result: EligibilityAnalysisResult
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('eligibility_results')
      .insert({
        user_id: userId,
        target_role: targetRole,
        profile: profile as unknown as Record<string, unknown>,
        result: result as unknown as Record<string, unknown>,
      });

    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  }

  /**
   * Fetch all eligibility results for the authenticated user, newest first.
   */
  static async getResults(userId: string): Promise<{
    data: Array<{
      id: string;
      target_role: string;
      profile: CandidateProfile;
      result: EligibilityAnalysisResult;
      created_at: string;
    }>;
    error: Error | null;
  }> {
    const { data, error } = await supabase
      .from('eligibility_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: new Error(error.message) };
    }

    return {
      data: (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        target_role: row.target_role as string,
        profile: row.profile as CandidateProfile,
        result: row.result as EligibilityAnalysisResult,
        created_at: row.created_at as string,
      })),
      error: null,
    };
  }

  /**
   * Delete a single eligibility result by ID (RLS ensures ownership).
   */
  static async deleteResult(resultId: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('eligibility_results')
      .delete()
      .eq('id', resultId);

    if (error) {
      return { error: new Error(error.message) };
    }
    return { error: null };
  }
}
