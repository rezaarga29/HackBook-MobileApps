import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import { useFocusEffect } from "@react-navigation/native";

const GET_USER_BYID = gql`
  query FindUserById {
    findUserById {
      _id
      name
      username
      email
      password
    }
    findFollowing {
      following {
        name
      }
    }
    findFollower {
      follower {
        name
      }
    }
  }
`;

// URL gambar default
const DEFAULT_PROFILE_IMAGE_URL =
  "https://img.freepik.com/free-psd/3d-icon-social-media-app_23-2150049569.jpg";

export default function ProfileScreen({ navigation }) {
  const { loading, error, data, refetch } = useQuery(GET_USER_BYID);

  // Menggunakan useFocusEffect untuk mereload data saat layar fokus
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

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

  // Mengambil nama-nama following dan follower
  const followingNames = data.findFollowing.map((item) => item.following.name);
  const followerNames = data.findFollower.map((item) => item.follower.name);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>User Profile</Text>
        <Image
          source={{ uri: DEFAULT_PROFILE_IMAGE_URL }}
          style={styles.profileImage}
        />
        <Text style={styles.profileDetail}>Name: {data.findUserById.name}</Text>
        <Text style={styles.profileDetail}>
          Username: {data.findUserById.username}
        </Text>
        <Text style={styles.profileDetail}>
          Email: {data.findUserById.email}
        </Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.followContainer}>
        <Text style={styles.sectionTitle}>
          Following {followingNames.length}
        </Text>
        <View style={styles.followDetail}>
          {followingNames.map((name, index) => (
            <Text key={index} style={styles.followName}>
              {name}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.followContainer}>
        <Text style={styles.sectionTitle}>
          Followers {followerNames.length}
        </Text>
        <View style={styles.followDetail}>
          {followerNames.map((name, index) => (
            <Text key={index} style={styles.followName}>
              {name}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    alignItems: "center",
    marginBottom: 20,
  },
  profileText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 20,
  },
  followContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  followDetail: {
    marginBottom: 10,
  },
  followName: {
    fontSize: 16,
  },
  followCount: {
    fontSize: 16,
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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});
