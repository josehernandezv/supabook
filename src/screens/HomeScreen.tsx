import { Alert, FlatList, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AddPostForm from "../components/AddPostForm";
import { fetchPosts, Posts } from "../lib/api";
import PostCard from "../components/PostCard";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const [posts, setPosts] = useState<Posts>([]);

  useEffect(() => {
    fetchPosts().then((data) => setPosts(data));
  }, []);

  const handleSubmit = async (content: string, image: string) => {
    try {
      let publicUrl = "";
      if (image) {
        const fileExt = image.split(".").pop();
        const fileName = image.replace(/^.*[\\\/]/, "");
        const filePath = `${Date.now()}.${fileExt}`;

        const formData = new FormData();
        const photo = {
          uri: image,
          name: fileName,
          type: `image/${fileExt}`,
        } as unknown as Blob;
        formData.append("file", photo);

        const { error } = await supabase.storage
          .from("posts")
          .upload(filePath, formData);
        if (error) throw error;

        const { data } = supabase.storage.from("posts").getPublicUrl(filePath);
        publicUrl = data.publicUrl;
      }
      const { data, error } = await supabase
        .from("posts")
        .insert({ content, image: publicUrl })
        .select("*, profile: profiles(username, avatar_url)");
      if (error) {
        throw error;
      } else {
        setPosts([data[0], ...posts]);
      }
    } catch (error: any) {
      Alert.alert("Server Error", error.message);
    }
  };

  const handleDeletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      console.log(error);
      Alert.alert("Server Error", error.message);
    } else {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  return (
    <View style={styles.container}>
      <AddPostForm onSubmit={handleSubmit} />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8 }}
        renderItem={({ item }) => (
          <PostCard post={item} onDelete={() => handleDeletePost(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
