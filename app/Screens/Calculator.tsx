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
import { Button, IconButton, Checkbox } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "@/components/CustomButton";

export default function Calculator() {
  const navigation = useNavigation();
  const [items, setItems] = useState([{ id: 1 }]);
  const [itemtype, setItemType] = useState("Gold");
  const [itemname, setItemname] = useState("");
  const [HUIDname, setHUIDname] = useState("");
  const [Weight, setWeight] = useState(0);
  const [rate, setRate] = useState(0);
  const [makingChargeType, setMakingChargesType] = useState("Per Gram");
  const [makingCharges, setMakingCharges] = useState(0);
  const [includeGST, setIncludeGST] = useState(false);
  const [includeCGST, setIncludeCGST] = useState(false);
  const [finalamount, setFinalAmount] = useState(0);

  const addItem = () => {
    setItems([...items, { id: items.length + 1 }]);
  };

  const clearItems = () => {
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

  const handlenextbutton = () => {
    console.log(
      "The form data =====>>>" + formdata.HUID,
      formdata.rate,
      formdata.weight,
      formdata.makingChargeType,
      formdata.itemtype
    );
  };

  // const handleGetAmount = () => {
  //   let totalamountpergram = 0;
  //   let totalmakingpergram = 0;
  //   totalamountpergram = Weight * rate;
  //   totalmakingpergram = Weight * makingCharges;
  //   let finalamount =
  //     totalamountpergram +
  //     (makingChargeType == "Fixed" ? makingCharges : totalmakingpergram)

  //   setFinalAmount(finalamount);
  //   console.log("The total amount" + finalamount);
  //   ToastAndroid.show("A pikachu appeared nearby !", ToastAndroid.SHORT);
  // };

  const handleGetAmount = () => {
    if (!Weight || !rate || !makingCharges) {
      ToastAndroid.show("Please enter valid values!", ToastAndroid.SHORT);
      return;
    }

    let totalAmountPerGram = Weight * rate;
    let totalMakingPerGram = Weight * makingCharges;

    let finalAmount =
      totalAmountPerGram +
      (makingChargeType === "Fixed" ? makingCharges : totalMakingPerGram);

    // Add CGST & GST if applicable
    if (includeCGST && includeGST) {
      finalAmount *= 1.03; // Add 3%
    } else if (includeCGST || includeGST) {
      finalAmount *= 1.015; // Add 1.5%
    }

    setFinalAmount(finalAmount);
    console.log("The total amount: ₹" + finalAmount.toFixed(2));

    ToastAndroid.show(
      "Total Amount: ₹" + finalAmount.toFixed(2),
      ToastAndroid.SHORT
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Calculator with Invoice Creator</Text>
      </View> */}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={addItem} icon="plus">
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
                selectedValue={itemtype}
                style={styles.picker}
                onValueChange={(itemValue) => setItemType(itemValue)}
              >
                <Picker.Item label="Gold" value="Gold" />
                <Picker.Item label="Silver" value="Silver" />
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Item Name"
              onChangeText={(newText) => setItemname(newText)}
            />
            <TextInput
              style={styles.input}
              placeholder="HUID Num"
              onChangeText={(huid) => setHUIDname(huid)}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Weight (g)"
              keyboardType="numeric"
              onChangeText={(weight) => setWeight(parseInt(weight) || 0)}
            />
            <TextInput
              style={styles.input}
              placeholder="Rate (₹/g)"
              keyboardType="numeric"
              onChangeText={(rate) => setRate(parseInt(rate) || 0)}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={makingChargeType}
                style={styles.picker}
                onValueChange={(itemValue) => setMakingChargesType(itemValue)}
              >
                <Picker.Item label="Per Gram" value="Per Gram" />
                <Picker.Item label="Fixed" value="Fixed" />
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Making Charges"
              keyboardType="numeric"
              onChangeText={(charges) =>
                setMakingCharges(parseInt(charges) || 0)
              }
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
              (1.5%)
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
        <View style={{marginBottom:20, flexDirection:'row', justifyContent:'space-between'}}>
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
        <Button mode="contained" icon="calculator" onPress={handleGetAmount}>
          Get Amount
        </Button>
        <Button mode="contained" icon="arrow-right" onPress={handlenextbutton}>
          Next
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8a2be2",
    padding: 15,
  },
  headerTitle: { color: "black", fontSize: 16, fontWeight: "500" },
  totalTitle: { color: "black", fontSize: 18, fontWeight: "800" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  itemContainer: {
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
