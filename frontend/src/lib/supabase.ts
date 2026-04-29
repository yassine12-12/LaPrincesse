import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL ?? '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = url && key ? createClient(url, key) : null;

// ── Types ─────────────────────────────────────────────────────

export type Design = {
  id: string;
  user_id: string;
  name: string;
  shape: string;
  length: string;
  material: string;
  gems: Record<string, unknown>;
  created_at: string;
};

export type Artist = {
  id: string;
  name: string;
  studio: string;
  rating: number;
  bio: string;
  avatar_url: string | null;
  location: string;
  specialties: string[];
  available: boolean;
};

export type Appointment = {
  id: string;
  user_id: string;
  artist_id: string;
  design_id: string | null;
  date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes: string | null;
  created_at: string;
  artist?: Artist;
  design?: Design;
};

// ── DB helpers ────────────────────────────────────────────────

export async function saveDesign(design: Omit<Design, 'id' | 'created_at'>) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase.from('designs').insert(design).select().single();
}

export async function getUserDesigns(userId: string) {
  if (!supabase) return { data: [], error: null };
  return supabase
    .from('designs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
}

export async function deleteDesign(id: string) {
  if (!supabase) return { error: null };
  return supabase.from('designs').delete().eq('id', id);
}

export async function getArtists() {
  if (!supabase) return { data: MOCK_ARTISTS, error: null };
  const res = await supabase.from('artists').select('*').eq('available', true);
  if (!res.data?.length) return { data: MOCK_ARTISTS, error: null };
  return res;
}

export async function createAppointment(appt: Omit<Appointment, 'id' | 'created_at' | 'artist' | 'design'>) {
  if (!supabase) return { data: null, error: new Error('Supabase not configured') };
  return supabase.from('appointments').insert(appt).select().single();
}

export async function getUserAppointments(userId: string) {
  if (!supabase) return { data: [], error: null };
  return supabase
    .from('appointments')
    .select('*, artist:artists(*), design:designs(*)')
    .eq('user_id', userId)
    .order('date', { ascending: true });
}

export async function getAllAppointments() {
  if (!supabase) return { data: [], error: null };
  return supabase
    .from('appointments')
    .select('*, artist:artists(*), design:designs(*)')
    .order('date', { ascending: true });
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']) {
  if (!supabase) return { error: null };
  return supabase.from('appointments').update({ status }).eq('id', id);
}

// ── Mock data (used when Supabase is not configured) ─────────

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'artist-1',
    name: 'Ines M.',
    studio: 'Studio Marais',
    rating: 4.96,
    bio: 'Specialist in chrome finishes and gel extensions. 8 years in luxury nail art across Paris and Milan.',
    avatar_url: null,
    location: 'Paris · 4e',
    specialties: ['Chrome', 'Gel Extensions', 'Nail Art'],
    available: true,
  },
  {
    id: 'artist-2',
    name: 'Sofia R.',
    studio: 'Atelier Pigalle',
    rating: 4.89,
    bio: 'Master of minimalist design and gem placement. Trained at École de Beauté Paris.',
    avatar_url: null,
    location: 'Paris · 9e',
    specialties: ['Minimalist', 'Gems', 'Pastels'],
    available: true,
  },
  {
    id: 'artist-3',
    name: 'Camille V.',
    studio: 'Nail Bar Bastille',
    rating: 4.92,
    bio: '3D nail art and glass effect specialist. Known for avant-garde editorial work.',
    avatar_url: null,
    location: 'Paris · 11e',
    specialties: ['3D Art', 'Glass Effect', 'Ombré'],
    available: true,
  },
  {
    id: 'artist-4',
    name: 'Léa D.',
    studio: 'La Princesse Studio',
    rating: 5.00,
    bio: 'Head artist at LaPrincesse. Expert in all techniques, specialising in bridal and editorial.',
    avatar_url: null,
    location: 'Paris · 2e',
    specialties: ['Bridal', 'Editorial', 'All Techniques'],
    available: true,
  },
];
