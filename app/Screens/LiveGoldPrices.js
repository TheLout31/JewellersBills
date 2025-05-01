import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";
// import GOLD_API_KEY  from '@env';

const LiveGoldPrices = () => {
  const [goldData, setGoldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGoldPrice = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.goldapi.io/api/XAU/INR/20250407",
        {
          method: "GET",
          headers: {
            "x-access-token": "goldapi-9jjwsm98lvxd5-io",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setGoldData(data);
    } catch (error) {
      console.error("Error fetching gold price:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGoldPrice();
  };

//   const getPrices = () => {
//     if (!goldData || !goldData.price) return null;

//     const pricePerOunce = goldData.price;
//     const perGram24k = pricePerOunce / 31.1035;
//     const perGram22k = (perGram24k * 22) / 24;

//     return {
//       perGram24k: perGram24k.toFixed(2),
//       perGram22k: perGram22k.toFixed(2),
//     };
//   };

//   const prices = getPrices();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.header}>Live Gold Price (INR)</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#8a2be2" style={{ marginTop: 30 }} />
      ) : goldData ? (
        <>
          <Card style={styles.card}>
            <Card.Title title="24 Karat Gold" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Text style={styles.price}>₹ {goldData.price_gram_24k} / gram</Text>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Title title="22 Karat Gold" titleStyle={styles.cardTitle} />
            <Card.Content>
              <Text style={styles.price}>₹ {goldData.price_gram_22k} / gram</Text>
            </Card.Content>
          </Card>

          <Button
            icon="refresh"
            mode="contained"
            onPress={fetchGoldPrice}
            style={styles.refreshBtn}
            textColor="white"
            buttonColor="#8a2be2"
          >
            Refresh
          </Button>
        </>
      ) : (
        <Text style={styles.error}>Failed to fetch gold prices. Please try again.</Text>
      )}
    </ScrollView>
  );
};

export default LiveGoldPrices;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor:"white",
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8a2be2",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginTop: 10,
  },
  refreshBtn: {
    marginTop: 10,
    alignSelf: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
