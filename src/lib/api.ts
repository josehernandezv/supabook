import { supabase } from "./supabase";

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.log(error);
    return [];
  } else {
    return data;
  }
};

export type Posts = Awaited<ReturnType<typeof fetchPosts>>;
