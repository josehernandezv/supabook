import { StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Button, Card, TextInput, useThemeColor } from "./Themed";
import { Feather } from "@expo/vector-icons";

interface Props {
  onSubmit: (content: string) => void;
}

export default function AddPostForm({ onSubmit }: Props) {
  const [content, setContent] = useState("");
  const color = useThemeColor({}, "primary");
  return (
    <Card style={styles.container}>
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="¿Qué estás pensando?"
      />
      <Card style={styles.row}>
        <TouchableOpacity>
          <Feather name="image" size={24} color={color} />
        </TouchableOpacity>
        <Button
          title="Publicar"
          onPress={() => {
            onSubmit(content);
            setContent("");
          }}
        />
      </Card>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
