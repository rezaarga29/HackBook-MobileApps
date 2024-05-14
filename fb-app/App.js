import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ApolloProvider } from "@apollo/client";
import client from "./src/config/apolloConnection";
import HomeStack from "./src/components/homeStack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home1"
            component={HomeStack}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
}
