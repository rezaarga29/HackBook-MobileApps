import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const MUTATION_CREATEPOST = gql`
  mutation CreatePost($newPost: NewPost) {
    createPost(newPost: $newPost) {
      _id
      content
      tags
      imgUrl
      author {
        _id
        name
        email
      }
    }
  }
`;

export default function CreatePostScreen({ navigation }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [imgUrl, setimgUrl] = useState("");

  const [createPost, { loading, error, data }] =
    useMutation(MUTATION_CREATEPOST);

  const handleCreatePost = () => {
    // Lakukan validasi input
    if (!content) {
      alert("Mohon isi konten posting.");
      return;
    }

    // Buat objek newPost
    const newPost = {
      content: content,
      tags: tags, // Pisahkan tag dengan koma, dan hapus spasi di awal dan akhir
      imgUrl: imgUrl,
    };

    // Panggil createPost
    createPost({
      variables: { newPost: newPost },
    })
      .then((result) => {
        // Setelah berhasil, kosongkan form
        setContent("");
        setTags("");
        setimgUrl("");
        // Anda dapat mengarahkan pengguna ke layar beranda
        // misalnya dengan menggunakan navigation
        alert("Create Post Success");
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        // Handle error
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Post</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Content"
        multiline
        numberOfLines={8} // Memperbesar jumlah baris
        textAlignVertical="top" // Mulai input dari atas
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma separated)"
        value={tags}
        onChangeText={setTags}
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imgUrl}
        onChangeText={setimgUrl}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  contentInput: {
    height: 160, // Tinggi input diperbesar
    textAlignVertical: "top", // Mulai input dari atas
    paddingTop: 10, // Ruang atas agar teks tidak menyentuh border
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
