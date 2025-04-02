import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "@/components/CustomButton";

export default function Calculator() {
  const navigation = useNavigation();
  const [items, setItems] = useState([
    { id: 1, itemType: "Gold", makingChargeType: "Per Gram" },
  ]);
  const [includeGST, setIncludeGST] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, itemType: "Gold", makingChargeType: "Per Gram" },
    ]);
  };

  const clearItems = () => {
    setItems([]);
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
              <Picker selectedValue={item.itemType} style={styles.picker} >
                <Picker.Item label="Gold" value="Gold" />
                <Picker.Item label="Silver" value="Silver" />
              </Picker>
            </View>

            <TextInput style={styles.input} placeholder="Item Name" />
            <TextInput style={styles.input} placeholder="HUID Num" />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Weight (g)"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Rate (₹/g)"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={item.makingChargeType}
                style={styles.picker}
              >
                <Picker.Item label="Per Gram" value="Per Gram" />
                <Picker.Item label="Fixed" value="Fixed" />
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Making Charges"
              keyboardType="numeric"
            />
          </View>
        </View>
      ))}

      {/* GST Checkbox */}
      <View style={styles.gstContainer}>
        <Text>Include GST</Text>
        {/* <CheckBox value={includeGST} onValueChange={setIncludeGST} /> */}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button mode="contained" icon="calculator">
          Get Amount
        </Button>
        <Button mode="contained" icon="arrow-right">
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
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
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
  itemTitle: { fontWeight: "bold", marginBottom: 5 },
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
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
