import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://piqcmptpwogseeescvac.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcWNtcHRwd29nc2VlZXNjdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTUxMTYsImV4cCI6MjA5MTc3MTExNn0.Mwzn80gTzzVQFAYGWWjqRnvNW2Z7-DHoMeBEZQrhm4w'

export const supabase = createClient(supabaseUrl, supabaseKey)