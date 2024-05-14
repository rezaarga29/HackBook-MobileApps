import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery, gql, useMutation } from "@apollo/client";

const GET_POST = gql`
  query FindPostsNewest {
    findPostsNewest {
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

const MUTATION_ADDLIKE = gql`
  mutation AddLike($id: ID) {
    addLike(_id: $id) {
      likes {
        username
      }
    }
  }
`;

const HomeScreen = ({ navigation }) => {
  const { loading, error, data, refetch } = useQuery(GET_POST);
  const [addLike] = useMutation(MUTATION_ADDLIKE);

  const handleLike = (postId) => {
    addLike({
      variables: { id: postId },
    })
      .then(() => {
        // alert("Like Success");

        refetch();
      })
      .catch((error) => {
        alert("Failed to add like: " + error.message);
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Panggil refetch ketika layar Home difokuskan
      refetch();
    });

    // Hapus listener ketika komponen dibongkar
    return unsubscribe;
  }, [navigation, refetch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Something went wrong</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.findPostsNewest}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DetailPost", { postId: item._id });
            }}
          >
            <PostCard
              postData={item}
              onLike={() => handleLike(item._id)}
              onPressComment={() =>
                navigation.navigate("DetailPost", { postId: item._id })
              }
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const PostCard = ({ postData, onLike, onPressComment }) => {
  const { author, content, imgUrl, likes, comments, tags } = postData;
  const DEFAULT_PROFILE_IMAGE_URL =
    "https://img.freepik.com/free-psd/3d-icon-social-media-app_23-2150049569.jpg";
  return (
    <View style={styles.postCard}>
      <View style={styles.cardHeader}>
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: DEFAULT_PROFILE_IMAGE_URL }} // Ubah ke URL gambar profil pengguna
            style={styles.profileImage}
          />
          <Text style={styles.authorName}>{author.name}</Text>
        </View>
      </View>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.tags}>{tags.join(", ")}</Text>
      <Image source={{ uri: imgUrl }} style={styles.image} />
      <View style={styles.interactionContainer}>
        <TouchableOpacity style={styles.interactionButton} onPress={onLike}>
          <FontAwesome name="thumbs-up" size={20} color="#4267B2" />
          <Text style={styles.buttonText}> Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.interactionButton}
          onPress={onPressComment}
        >
          <FontAwesome name="comment" size={20} color="#4267B2" />
          <Text style={styles.buttonText}> Comment</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.socialCounts}>
        <Text style={styles.countText}>{likes.length} Likes</Text>
        <Text style={styles.countText}>{comments.length} Comments</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  postCard: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 30, // Sesuaikan ukuran sesuai kebutuhan
    height: 30, // Sesuaikan ukuran sesuai kebutuhan
    borderRadius: 15, // Setengah dari lebar atau tinggi untuk membuat bentuk lingkaran
    marginRight: 10, // Spasi antara foto profil dan nama
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postTime: {
    color: "#888",
  },
  content: {
    fontSize: 14,
    marginBottom: 2,
  },
  tags: {
    fontSize: 10,
    marginBottom: 10,
    fontStyle: "italic",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  interactionContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  buttonText: {
    color: "#4267B2",
    marginLeft: 5,
  },
  socialCounts: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  countText: {
    color: "#888",
  },
});

export default HomeScreen;
