import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { Button, IconButton, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "@/components/CustomButton";
import { printToFileAsync } from "expo-print";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

export default function Calculator() {
  const navigation = useNavigation();
  const [items, setItems] = useState([
    {
      id: 1,
      itemtype: "Gold",
      itemname: "",
      HUID: "",
      weight: 0,
      rate: 0,
      makingChargeType: "Percentage",
      makingCharges: 0,
      finalamount: 0,
    },
  ]);
  const [itemtype, setItemType] = useState("Gold");
  const [itemname, setItemname] = useState("");
  const [HUIDname, setHUIDname] = useState("");
  const [Weight, setWeight] = useState(0);
  const [rate, setRate] = useState(0);
  const [makingChargeType, setMakingChargesType] = useState("Per%");
  const [makingCharges, setMakingCharges] = useState(0);
  const [includeGST, setIncludeGST] = useState(false);
  const [includeCGST, setIncludeCGST] = useState(false);
  const [finalamount, setFinalAmount] = useState(0);
  const [nextbtndisabled, setnextbtndisabled] = useState(true);
  const [BillNumber, setBillNUmber] = useState(0);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!itemname.trim()) newErrors.itemname = "Item name is required";
    if (!HUIDname.trim() || HUIDname.length > 6 || HUIDname.length < 6)
      newErrors.HUIDname = "HUID is required";
    if (!Weight || isNaN(Weight) || Number(Weight) <= 0)
      newErrors.Weight = "Enter valid weight";
    if (!rate || isNaN(rate) || Number(rate) <= 0)
      newErrors.rate = "Enter valid rate";
    if (!makingCharges || isNaN(makingCharges) || Number(makingCharges) < 0)
      newErrors.makingCharges = "Enter valid making charges";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        itemtype: "Gold",
        itemname: "",
        HUID: "",
        weight: 0,
        rate: 0,
        makingChargeType: "Percentage",
        makingCharges: 0,
        finalamount: 0,
      },
    ]);
  };

  const clearItems = () => {
    setFinalAmount();
    setIncludeGST(false);
    setIncludeCGST(false);
    setItems([]);
  };

  const formdata = {
    itemtype: itemtype,
    itemname: itemname,
    HUID: HUIDname,
    weight: Weight,
    rate: rate,
    makingChargeType: makingChargeType,
    makingCharges: makingCharges,
    finalamount: finalamount,
  };

  const generateInvoiceHTML = async (formdata) => {
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
      const billnum = (Math.random() + 1).toString(36).substring(3);
      const date = todaydate.getDate();
      const month = todaydate.getMonth();
      const year = todaydate.getFullYear();
      // Inject form data dynamically
      const populatedHTML = htmlContent
        .replace("{{billnumber}}", billnum || "N/A")
        .replace("{{date}}", date || "N/A")
        .replace("{{month}}", month || "N/A")
        .replace("{{year}}", year || "N/A")
        .replace("{{itemname}}", formdata.itemname || "N/A")
        .replace("{{HUID}}", formdata.HUID || "N/A")
        .replace("{{weight}}", formdata.weight || "0")
        .replace("{{rate}}", formdata.rate || "0")
        .replace("{{makingCharges}}", formdata.makingCharges || "0")
        .replace("{{finalamount}}", formdata.finalamount || "0");

      return populatedHTML;
    } catch (error) {
      console.error("Error loading HTML file:", error);
      return "<h1>Error loading invoice</h1>";
    }
  };

  const printToFile = async () => {
    try {
      console.log("Next button clicked!!!!");
      const html = await generateInvoiceHTML(formdata);
      // On iOS/android prints the given html. On web prints the HTML from the current page.
      const { uri } = await Print.printToFileAsync({
        html: html,
        base64: false,
      });
      console.log("File has been saved to:", uri);
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (error) {
      ToastAndroid.show("Unable to Print PDF!!", ToastAndroid.SHORT);
    }
  };

  const handlenextbutton = async () => {
    console.log("Items added details ======>>>>", items);

    // await printToFile();
    // console.log(
    //   "The form data =====>>>" + formdata.HUID,
    //   formdata.rate,
    //   formdata.weight,
    //   formdata.makingChargeType,
    //   formdata.itemtype
    // );
  };

  function percentage(additional, totalValue) {
    let t = (additional / 100) * totalValue;
    return t;
  }

  const handleGetAmount = () => {
    let totalAmount=0
    const updatedItems = items.map((item) => {
      let newErrors = {};

      if (!item.itemname.trim()) newErrors.itemname = "Item name is required";
      if (!item.HUID.trim() || item.HUID.length !== 6)
        newErrors.HUID = "Invalid HUID";
      if (!item.weight || isNaN(item.weight) || item.weight <= 0)
        newErrors.weight = "Invalid weight";
      if (!item.rate || isNaN(item.rate) || item.rate <= 0)
        newErrors.rate = "Invalid rate";

      // skip invalid
      if (Object.keys(newErrors).length > 0) return item;

      let total = item.weight * item.rate;
      
      if (item.makingChargeType === "Percentage") {
        totalAmount = total + percentage(item.makingCharges, total);
      } else if (item.makingChargeType === "Fixed") {
        totalAmount = total + item.makingCharges;
      }

      return { ...item, finalamount: totalAmount };
    });

    setItems(updatedItems);
    console.log("Items data after totalamount =====>>", items);
    const totalFinal = updatedItems.reduce(
      (sum, item) => sum + (item.finalamount || 0),
      0
    );

    if (includeCGST && includeGST) {
      totalAmount = totalAmount + percentage(3, totalAmount); // Add 3%
    } else if (includeCGST || includeGST) {
      totalAmount = totalAmount + percentage(1.5, totalAmount); // Add 1.5%
    }

    setFinalAmount(totalFinal);
    setnextbtndisabled(false);
  };

  
  return (
    <ScrollView  contentContainerStyle={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Calculator with Invoice Creator</Text>
      </View> */}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={addItem}
          icon="plus"
          buttonColor="#8a2be2"
          textColor="white"
        >
          Add Items
        </Button>
        <Button mode="text" onPress={clearItems} textColor="red" icon="delete">
          Clear All Items
        </Button>
      </View>

      {/* Items */}
      {items.map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Item {index + 1}</Text>

          <View style={styles.row}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={item.itemtype}
                style={styles.picker}
                // onValueChange={(itemValue) => setItemType(itemValue)}
                onValueChange={(itemValue) => {
                  const newItems = [...items];
                  newItems[index].itemtype = itemValue;
                  setItems(newItems);
                }}
              >
                <Picker.Item label="Gold" value="Gold" />
                <Picker.Item label="Silver" value="Silver" />
              </Picker>
            </View>

            <TextInput
              style={[
                styles.input,
                { borderColor: errors.itemname ? "red" : "black" },
              ]}
              placeholder="Item Name"
              // onChangeText={(newText) => setItemname(newText)}
              onChangeText={(text) => {
                const newItems = [...items];
                newItems[index].itemname = text;
                setItems(newItems);
              }}
            />
            {/* {errors.itemname && <Text style={styles.errorText}>{errors.itemname}</Text>} */}
            <TextInput
              style={[
                styles.input,
                { borderColor: errors.HUIDname ? "red" : "black" },
              ]}
              placeholder="HUID Num"
              // onChangeText={(huid) => setHUIDname(huid)}
              onChangeText={(text) => {
                const newItems = [...items];
                newItems[index].HUID = text;
                setItems(newItems);
              }}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              style={[
                styles.input,
                { borderColor: errors.Weight ? "red" : "black" },
              ]}
              placeholder="Weight (g)"
              keyboardType="numeric"
              // onChangeText={(weight) => setWeight(parseInt(weight) || 0)}
              onChangeText={(text) => {
                const newItems = [...items];
                newItems[index].weight = parseInt(text) || 0;
                setItems(newItems);
              }}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: errors.rate ? "red" : "black" },
              ]}
              placeholder="Rate (₹/g)"
              keyboardType="numeric"
              // onChangeText={(rate) => setRate(parseInt(rate) || 0)}
              onChangeText={(text) => {
                const newItems = [...items];
                newItems[index].rate = parseInt(text) || 0;
                setItems(newItems);
              }}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={item.makingChargeType}
                style={styles.picker}
                // onValueChange={(itemValue) => setMakingChargesType(itemValue)}
                onValueChange={(itemValue) => {
                  const newItems = [...items];
                  newItems[index].makingChargeType = itemValue;
                  setItems(newItems);
                }}
              >
                <Picker.Item label="Percentage" value="Percentage" />
                <Picker.Item label="Per Gram" value="PerGram" />
                <Picker.Item label="Fixed" value="Fixed" />
              </Picker>
            </View>
            <TextInput
              style={[
                styles.input,
                { borderColor: errors.rate ? "red" : "black" },
              ]}
              placeholder="Making Charges"
              keyboardType="numeric"
              // onChangeText={(charges) =>
              //   setMakingCharges(parseInt(charges) || 0)
              // }
              onChangeText={(text) => {
                const newItems = [...items];
                newItems[index].makingCharges = parseInt(text) || 0;
                setItems(newItems);
              }}
            />
          </View>
        </View>
      ))}

      {/* GST CGST Checkbox */}
      <View style={styles.checkboxContainer}>
        <View style={styles.gstContainer}>
          <Text style={styles.headerTitle}>
            Include GST{" "}
            <Text
              style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }}
            >
              (3.0%)
            </Text>
          </Text>
          <Checkbox
            status={includeGST ? "checked" : "unchecked"}
            onPress={() => {
              setIncludeGST(!includeGST);
            }}
          />
        </View>

        <View style={styles.gstContainer}>
          <Text style={styles.headerTitle}>
            Include SGST{" "}
            <Text
              style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }}
            >
              (1.5%)
            </Text>
          </Text>
          <Checkbox
            status={includeCGST ? "checked" : "unchecked"}
            onPress={() => {
              setIncludeCGST(!includeCGST);
            }}
          />
        </View>

        <View style={styles.gstContainer}>
          <Text style={styles.headerTitle}>
            Include CGST{" "}
            <Text
              style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }}
            >
              (1.5%)
            </Text>
          </Text>
          <Checkbox
            status={includeCGST ? "checked" : "unchecked"}
            onPress={() => {
              setIncludeCGST(!includeCGST);
            }}
          />
        </View>
      </View>

      <View style={styles.line} />

      {finalamount ? (
        <View
          style={{
            marginBottom: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={styles.totalTitle}>Total Amount:</Text>
          </View>

          <View>
            <Text style={styles.totalTitle}>₹{finalamount.toFixed(1)}</Text>
          </View>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="calculator"
          onPress={handleGetAmount}
          buttonColor="#8a2be2"
          textColor="white"
        >
          Get Amount
        </Button>
        <Button
          mode="contained"
          icon="arrow-right"
          onPress={handlenextbutton}
          // disabled={nextbtndisabled}
          buttonColor="#8a2be2"
          textColor="white"
        >
          Next
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10, paddingBottom:50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8a2be2",
    padding: 15,
  },
  headerTitle: { color: "black", fontSize: 16, fontWeight: "600" },
  totalTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "800",
    fontFamily: "SpaceMono-Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  itemContainer: {
    justifyContent: "space-around",
    height: 250,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  itemTitle: { fontWeight: "bold", marginBottom: 5, fontSize: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "600",
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  picker: { width: "100%", height: 50 },
  gstContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  line: {
    height: 1, // Thin line
    backgroundColor: "black", // Line color
    width: "100%", // Full width
    marginVertical: 10, // Space above and below the line
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  checkboxContainer: {
    justifyContent: "space-between",
    marginTop: 20,
  },
});
