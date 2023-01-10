import { useState } from "react";
import { Alert } from "react-native";
import ProfileForm from "../components/ProfileForm";
import { Profile } from "../lib/api";
import { supabase } from "../lib/supabase";
import { useUserInfo } from "../lib/userContext";

export default function ProfileScreen() {
  const { profile, loading, saveProfile } = useUserInfo();

  return (
    <ProfileForm
      profile={profile}
      loading={loading!}
      onSave={saveProfile!}
      onLogout={() => supabase.auth.signOut()}
    />
  );
}
