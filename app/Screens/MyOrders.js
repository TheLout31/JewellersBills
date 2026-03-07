import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ActivityIndicator, Card, IconButton } from "react-native-paper";
import { database } from "@/Firebase/FirebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { auth } from "@/Firebase/FirebaseConfig";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const MyOrders = () => {
  const user = auth.currentUser;
  const orderCollection = collection(database, "Orders");
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);

  const printToFile = async (html) => {
    try {
      console.log("Download clicked!!!!");
      // On iOS/android prints the given html. On web prints the HTML from the current page.
      const { uri } = await Print.printToFileAsync({
        html: html,
        base64: false,
      });

      // console.log("File has been saved to:", uri);
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      ToastAndroid.show("Unable to Print PDF!!", ToastAndroid.SHORT);
    }
  };

  const OrderCard = ({ order }) => {
    return (
      <Card style={styles.card}>
        <View style={styles.cardRow}>
          <Card.Content style={styles.content}>
            <Text style={styles.name}>👤 {order.name}</Text>
            <Text style={styles.text}>📞 {order.number}</Text>
            <Text style={styles.text}>🏠 {order.address}</Text>
            <Text style={styles.amount}>
              💰 ₹{order.finalamount.toFixed(2)}
            </Text>
          </Card.Content>
          <IconButton
            icon="file-download-outline"
            iconColor="#2e7d32"
            size={28}
            onPress={() => printToFile(order.billHTML)}
          />
        </View>
      </Card>
    );
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;
        const orderCollection = collection(database, "users", userId, "orders");
        const data = await getDocs(orderCollection);

        const orders = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLoading(false);
        setOrdersList(orders);
      } else {
        setLoading(false);
        console.log("No user logged in!");
      }
    } catch (error) {
      setLoading(false);
      console.log("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <FlatList
      loading={loading}
      data={ordersList}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => <OrderCard order={item} />}
      ListEmptyComponent={() => {
        if (loading) {
          return <ActivityIndicator size="large" color="#8a2be2" />;
        }
        return <Text>No orders found</Text>; // Optional: show a message if list is empty after loading
      }}
    />
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    padding: 10,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#f9f9f9",
    elevation: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 4,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#444",
    marginBottom: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 6,
  },
});
