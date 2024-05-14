import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery, gql, useMutation } from "@apollo/client";

const GET_USER_BYNAME = gql`
  query FindUserByName($name: String) {
    findUserByName(name: $name) {
      _id
      name
      username
    }
  }
`;

const MUTATION_FOLLOWING = gql`
  mutation AddFollowing($followingId: String) {
    addFollowing(followingId: $followingId) {
      following {
        name
      }
      follower {
        name
      }
    }
  }
`;

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_USER_BYNAME, {
    variables: { name: searchQuery },
  });

  const [addFollow] = useMutation(MUTATION_FOLLOWING);

  // Fungsi untuk melakukan pencarian
  const handleSearch = () => {
    refetch();
  };

  useEffect(() => {
    if (data && data.findUserByName) {
      setSearchResults(data.findUserByName);
    }
  }, [data]);

  const handleFollow = (userId) => {
    addFollow({
      variables: { followingId: userId },
    })
      .then(() => {
        alert("Follow Success");
        // Setelah follow berhasil, update searchResults
        const updatedResults = searchResults.map((user) => {
          if (user._id === userId) {
            // Jika ID user sama dengan user yang di-follow, ubah status follow-nya
            return { ...user, isFollowed: true };
          }
          return user;
        });
        setSearchResults(updatedResults);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

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
      <TextInput
        style={styles.searchInput}
        placeholder="Search user..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        disabled={!searchQuery.trim()} // Disable button if there's no input
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text>Error: {error.message}</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.userInfo}>
                <Text>Name: {item.name}</Text>
                <Text>Username: {item.username}</Text>
              </View>
              {!item.isFollowed ? ( // Tampilkan tombol follow hanya jika user belum di-follow
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleFollow(item._id)}
                >
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              ) : (
                <Text>Already followed</Text> // Tampilkan teks jika user sudah di-follow
              )}
            </View>
          )}
          keyExtractor={(item) => item._id} // Gunakan _id sebagai kunci karena unik
          style={styles.resultList}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text>No results found</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  resultList: {
    marginTop: 20,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  followButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  followButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
