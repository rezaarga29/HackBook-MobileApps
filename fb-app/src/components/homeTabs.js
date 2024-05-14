import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import HomeScreen from "../screens/homeScreen";
import CreatePostScreen from "../screens/createPostScreen";
import ProfileScreen from "../screens/profileScreen";
import SearchScreen from "../screens/searchScreen";
import DetailPostScreen from "../screens/detailPostScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="create" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="DetailPost"
        component={DetailPostScreen}
        options={{
          headerShown: false,
          tabBarButton: () => null, // Menyembunyikan tab dari bottom tab
        }}
      />
    </Tab.Navigator>
  );
}
