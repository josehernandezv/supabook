import { Database } from "../db_types";
import { supabase } from "./supabase";

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profile: profiles(username, avatar_url)")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.log(error);
    return [];
  } else {
    console.log(data);
    return data;
  }
};

export const downloadAvatar = async (path: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) throw error;
    const fr = new FileReader();
    fr.readAsDataURL(data);
    return new Promise((resolve) => {
      fr.onload = () => {
        resolve(fr.result as string);
      };
    });
  } catch (err) {
    console.log("error", err);
    return "";
  }
};

export type Posts = Awaited<ReturnType<typeof fetchPosts>>;
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Post = Posts[number];

export const fetchLikes = async (postId: string) => {
  const { data, error } = await supabase
    .from("post_likes")
    .select("user_id, id")
    .eq("post_id", postId);

  if (error) {
    console.log("error", error);
    return [];
  } else {
    return data;
  }
};

export type Likes = Awaited<ReturnType<typeof fetchLikes>>;
export type Like = Likes[number];

export const fetchContacts = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, avatar_url, id")
    .neq("id", userId);
  if (error) {
    console.log("error", error);
    return [];
  } else {
    return data;
  }
};

export type Contacts = Awaited<ReturnType<typeof fetchContacts>>;
export type Contact = Contacts[number];

export const fetchMessages = async (userId: string, contactId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .or(`sender_id.eq.${contactId},receiver_id.eq.${contactId}`)
    .order("created_at", { ascending: false });
  if (error) {
    console.log("error", error.message);
    return [];
  } else {
    return data;
  }
};

export type Messages = Awaited<ReturnType<typeof fetchMessages>>;
export type Message = Messages[number];
