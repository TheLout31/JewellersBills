import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { TextInput, Button, Card, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { printToFileAsync } from "expo-print";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "@/Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { auth } from "@/Firebase/FirebaseConfig";

const AddDetails = ({ route }) => {
  const navigation = useNavigation();
  const { items, finalamount, includeGST, includeSGST, includeCGST } =
    route.params;
  const [name, setName] = useState("");
  const [number, setNumber] = useState("(+91) ");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [billHTML , setBillHTML] = useState("")
  const user = auth.currentUser
  const padNumber = (num, length = 5) => String(num).padStart(length, "0");

  const addOrders = async () => {
    try {
      if (user) {
        const userId = user.uid;
        const orderCollection = collection(database, "users", userId, "orders");
        await addDoc(orderCollection, {
          name: name,
          number: number,
          address: address,
          items: items,
          finalamount: finalamount,
          billHTML: billHTML
        });
      } else {
        console.log("No user logged in!!!!");
      }
      console.log("Item added!!!!");
    } catch (error) {
      console.log("Error adding data!!!");
    }
  };

  const generateBillNumber = async () => {
    const year = new Date().getFullYear(); // e.g. 2025
    const key = `billCount-${year}`;

    try {
      const storedCount = await AsyncStorage.getItem(key);
      const count = storedCount ? parseInt(storedCount) + 1 : 1;

      const billNumber = `${year}${padNumber(count)}`;

      // Save the updated count
      await AsyncStorage.setItem(key, count.toString());

      return billNumber;
    } catch (error) {
      console.error("Error generating bill number:", error);
      return null;
    }
  };

  function percentage(additional, totalValue) {
    let t = (additional / 100) * totalValue;
    return t;
  }

  const TheItemTotal_Amount = () => {
    return items.reduce((acc, item) => {
      return acc + item.totalamount;
    }, 0);
  };

  const generateInvoiceHTML = async () => {
    try {
      const todaydate = new Date();
      // Load the HTML file from assets
      const htmlAsset = Asset.fromModule(
        require("@/assets/templates/invoice.html")
      );
      await htmlAsset.downloadAsync();
      const htmlContent = await FileSystem.readAsStringAsync(
        htmlAsset.localUri
      );
      const itemRows = items
        .map(
          (item, idx) => `
      <tr>
        <td>${idx + 1}</td>
        <td>${item.itemname}</td>
        <td>${item.HUID}</td>
        <td>${item.weight}g</td>
        <td>Rs ${item.rate}</td>
        <td>${item.makingCharges}%</td>
        <td>Rs ${item.totalamount}</td>
      </tr>`
        )
        .join("");
      const billNumber = await generateBillNumber();
      const date = todaydate.getDate();
      const month = todaydate.getMonth();
      const year = todaydate.getFullYear();
      const GST = function () {
        if (includeGST) {
          return percentage(3, finalamount).toFixed(2);
        } else {
          if (includeSGST) return percentage(1.5, finalamount).toFixed(2);
          if (includeCGST) return percentage(1.5, finalamount).toFixed(2);
        }
      };
      const GSTValue = (includeGST ? percentage(3, finalamount) : 0).toFixed(2);
      const CGSTValue = (
        includeCGST || includeSGST ? percentage(1.5, finalamount) : 0
      ).toFixed(2);
      const IGSTValue = (CGSTValue * 2).toFixed(2);
      const TheFinalAmount = finalamount.toFixed(2);
      // Inject form data dynamically
      const populatedHTML = htmlContent
        .replace("{{custName}}", name || "N/A")
        .replace("{{PhoneNumber}}", number || "N/A")
        .replace("{{Address}}", address || "N/A")
        .replace("{{billnumber}}", billNumber || "N/A")
        .replace("{{date}}", date || "N/A")
        .replace("{{month}}", month || "N/A")
        .replace("{{year}}", year || "N/A")
        .replace("{{Paydate}}", date || "N/A")
        .replace("{{Paymonth}}", month || "N/A")
        .replace("{{Payyear}}", year || "N/A")
        .replace("{{items}}", itemRows)
        .replace("{{total_amount}}", TheItemTotal_Amount || 0)
        // .replace("{{CGST}}", CGSTValue || 0)
        // .replace("{{SGST}}", CGSTValue || 0)
        .replace("{{IGST}}", GST)
        .replace("{{finalamount}}", TheFinalAmount || 0);

      return populatedHTML;
    } catch (error) {
      console.error("Error loading HTML file:", error);
      return "<h1>Error loading invoice</h1>";
    }
  };

  const printToFile = async () => {
    try {
      console.log("Next button clicked!!!!");
      const html = await generateInvoiceHTML();
      setBillHTML(html || null)
      // On iOS/android prints the given html. On web prints the HTML from the current page.
      const { uri } = await Print.printToFileAsync({
        html: html,
        base64: false,
      });
      console.log("type of html data",typeof(html))
     
      console.log("File has been saved to:", uri);
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      ToastAndroid.show("Unable to Print PDF!!", ToastAndroid.SHORT);
    }
  };

  const handleGeneratePDF = async () => {
    console.log("Screen adddetails items data ====>>>", items);
    await printToFile();
    console.log("user details in Add detials=====>", user);
    addOrders();
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Add Details</Title>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                text: "#black", // user-typed text color
                primary: "#8a2be2", // active border & label color
                placeholder: "#888", // label color when inactive
              },
            }}
          />
          <TextInput
            label="Phone No."
            value={number}
            onChangeText={setNumber}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                text: "#black", // user-typed text color
                primary: "#8a2be2", // active border & label color
                placeholder: "#888", // label color when inactive
              },
            }}
          />
          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                text: "#black", // user-typed text color
                primary: "#8a2be2", // active border & label color
                placeholder: "#888", // label color when inactive
              },
            }}
          />
          <TextInput
            label="Payment Method"
            value={paymentMethod}
            onChangeText={setPaymentMethod}
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                text: "#black", // user-typed text color
                primary: "#8a2be2", // active border & label color
                placeholder: "#888", // label color when inactive
              },
            }}
          />
          <Button
            mode="contained"
            onPress={handleGeneratePDF}
            style={styles.button}
            buttonColor="#8a2be2"
          >
            Generate PDF
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    padding: 10,
  },
  title: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 10,
    color: "#8a2be2",
  },
});

export default AddDetails;
