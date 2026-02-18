export const env = {
  port: Number(process.env.PORT) || 3001,
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  adminJwtSecret: process.env.ADMIN_JWT_SECRET || 'htb-admin-secret-change-me',
  nodeEnv: process.env.NODE_ENV || 'development',
};
