import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { Database } from "../db_types";

const supabaseUrl = Constants?.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants?.expoConfig?.extra?.supabaseAnonKey;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
