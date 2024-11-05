import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default supabase;
