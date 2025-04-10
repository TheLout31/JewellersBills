import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { auth } from "../../Firebase/FirebaseConfig";
import React from "react";

export default function Home({ navigation }) {
  const Calculatorhandler = () => {
    navigation.navigate("Calculator");
  };

  const dummyHandler = (title) => {
    console.log(`${title} pressed`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome!</Text>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={Calculatorhandler}>
            <Text style={styles.cardText}>Calculator and Bill Generator</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => dummyHandler('Live Gold Rate')}>
            <Text style={styles.cardText}>Live Gold Rate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => dummyHandler('My Orders')}>
            <Text style={styles.cardText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => dummyHandler('Offers')}>
            <Text style={styles.cardText}>Offers</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#8a2be2",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    height:100,
    flex: 0.48,
    backgroundColor: "#F8F6FF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#6F5AAA",
    borderWidth: 1,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
});
