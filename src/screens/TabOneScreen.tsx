import { FlatList, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import AddPostForm from "../components/AddPostForm";
import { fetchPosts, Posts } from "../lib/api";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [posts, setPosts] = useState<Posts>([]);

  useEffect(() => {
    fetchPosts().then((data) => setPosts(data));
  }, []);

  const handleSubmit = async (content: string) => {
    const { data, error } = await supabase
      .from("posts")
      .insert({ content })
      .select();
    if (error) {
      console.log(error);
    } else {
      setPosts([data[0], ...posts]);
    }
  };

  return (
    <View style={styles.container}>
      <AddPostForm onSubmit={handleSubmit} />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.content}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
