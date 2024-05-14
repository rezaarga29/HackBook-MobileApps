import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useQuery, gql, useMutation } from "@apollo/client";

const GET_POST_BY_ID = gql`
  query FindPostById($id: ID) {
    findPostById(_id: $id) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        name
        email
      }
    }
  }
`;

const MUTATION_CREATECOMMENT = gql`
  mutation AddComment($id: ID, $content: String) {
    addComment(_id: $id, content: $content) {
      comments {
        content
        username
      }
    }
  }
`;

export default function DetailPostScreen({ route, navigation }) {
  const [newComment, setNewComment] = useState("");

  const { loading, error, data, refetch } = useQuery(GET_POST_BY_ID, {
    variables: {
      id: route.params.postId,
    },
  });

  const [addComment] = useMutation(MUTATION_CREATECOMMENT);

  const handleComment = () => {
    if (!newComment) {
      alert("Please enter a comment.");
      return;
    }

    addComment({
      variables: { id: route.params.postId, content: newComment },
    })
      .then((result) => {
        // console.log("Comment created:", result.data.addComment);
        // alert("Comment Success");
        refetch();
        // navigation.navigate("Home");
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
        // Handle error
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.postContainer}>
        <Text style={styles.postName}>{data.findPostById.author.name}</Text>
        <Text style={styles.postContent}>{data.findPostById.content}</Text>
        <Text style={styles.postTags}>
          Tags: {data.findPostById.tags.join(", ")}
        </Text>
        <Image
          source={{ uri: data.findPostById.imgUrl }}
          style={styles.postImage}
        />
        <Text style={styles.postLikes}>
          Likes: {data.findPostById.likes.length}
        </Text>
      </View>
      <FlatList
        data={data.findPostById.comments}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <Text style={styles.commentUser}>Comment By: {item.username}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>
          </View>
        )}
        keyExtractor={(item) => item.createdAt}
        style={styles.commentList}
      />
      <TextInput
        style={styles.commentInput}
        placeholder="Add a comment..."
        value={newComment}
        onChangeText={setNewComment}
      />
      <TouchableOpacity style={styles.commentButton} onPress={handleComment}>
        <Text style={styles.commentButtonText}>Comment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  postContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  postName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
  },
  postTags: {
    marginTop: 1,
    color: "gray",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  postLikes: {
    marginTop: 5,
    color: "gray",
  },
  commentList: {
    marginBottom: 20,
  },
  commentContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  commentContent: {
    fontSize: 16,
  },
  commentUser: {
    marginTop: 5,
    color: "gray",
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  commentButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  commentButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
