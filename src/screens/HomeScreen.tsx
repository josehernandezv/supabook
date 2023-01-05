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

  const handleSubmit = async (content: string) => {
    const { data, error } = await supabase
      .from("posts")
      .insert({ content })
      .select("*, profile: profiles(username)");
    if (error) {
      console.log(error);
      Alert.alert("Server Error", error.message);
    } else {
      setPosts([data[0], ...posts]);
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
