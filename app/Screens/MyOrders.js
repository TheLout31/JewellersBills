import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { database } from "@/Firebase/FirebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import { auth } from "@/Firebase/FirebaseConfig";

const orders = [
  {
    id: "1",
    name: "John Doe",
    number: "+1234567890",
    address: "123 Main St, Cityville",
    items: ["Shampoo", "Conditioner"],
    finalamount: 1299,
  },
  {
    id: "2",
    name: "Jane Smith",
    number: "+0987654321",
    address: "456 Elm St, Townburg",
    items: ["Face Wash", "Moisturizer"],
    finalamount: 799,
  },
  // Add more orders here
];



const MyOrders = () => {
  const user = auth.currentUser;
  const orderCollection = collection(database, "Orders");
  const [ordersList, setOrdersList] = useState([]);

  const OrderCard = ({ order }) => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.name}>{order.name}</Text>
          <Text style={styles.text}>📞 {order.number}</Text>
          <Text style={styles.text}>🏠 {order.address}</Text>
          {/* <Text style={styles.text}>🛍️ Items: {order.items.join(',')}</Text> */}
          <Text style={styles.amount}>💰 ₹{order.finalamount}</Text>
        </Card.Content>
      </Card>
    );
  };

  const fetchOrders = async () => {
     try {
          if(user){
            const q = query(orderCollection, where("userId" , "==", user.uid))
            const data = await getDocs(q)
            const orders = data.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
      
            setOrdersList(orders);
            console.log("Orders fetched:", user.uid);
          }
          else{
            console.log("No user logged in!!!!")
          }
          console.log("Item added!!!!")
        } catch (error) {
          console.log("Error adding data!!!");
        }
  };

  useEffect(()=>{
    fetchOrders()
  },[])
  return (
    <FlatList
      data={ordersList}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => <OrderCard order={item} />}
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
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#f9f9f9",
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: "black",
  },
  amount: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});
