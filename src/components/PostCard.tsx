import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { downloadAvatar, Post, Profile } from "../lib/api";
import { Card, Text, useThemeColor } from "./Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useUserInfo } from "../lib/userContext";
import { useEffect, useState } from "react";
import Avatar from "./Avatar";

interface Props {
  post: Post;
  onDelete: () => void;
}

export default function PostCard({ post, onDelete }: Props) {
  const color = useThemeColor({}, "primary");
  const profile = post.profile as Profile;
  const user = useUserInfo();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (profile?.avatar_url) {
      downloadAvatar(profile.avatar_url).then(setAvatarUrl);
    }
  }, [profile]);

  return (
    <Card style={styles.container}>
      {/* Header */}
      <Card style={styles.header}>
        <Avatar uri={avatarUrl} />
        <Text style={styles.username}>{profile.username}</Text>
      </Card>
      {/* Image */}
      {post.image && (
        <Card style={styles.imageContainer}>
          <Image source={{ uri: post.image }} style={styles.image} />
        </Card>
      )}
      {/* Content */}
      <Card style={styles.content}>
        <Text style={styles.contentText}>{post.content}</Text>
        {/* Footer */}
        <Card style={styles.footer}>
          <TouchableOpacity>
            <FontAwesome name="heart-o" size={24} color={color} />
          </TouchableOpacity>
          {user?.profile?.id === post.user_id && (
            <TouchableOpacity onPress={onDelete}>
              <FontAwesome name="trash-o" size={24} color={color} />
            </TouchableOpacity>
          )}
        </Card>
      </Card>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 16,
  },

  username: {
    fontWeight: "bold",
    marginLeft: 8,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    marginTop: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 16,
  },
  contentText: {
    fontSize: 16,
  },
  footer: {
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
