import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://thefyprxynfxnqlxnsdo.supabase.co";
const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZWZ5cHJ4eW5meG5xbHhuc2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzU5MzksImV4cCI6MjA4NjUxMTkzOX0.VpT5NLA6TiHPYJJ6HU05lFFcbdIYB7wzxXG2vMPsyok";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
