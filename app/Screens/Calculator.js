import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  Button,
  IconButton,
  Checkbox,
  Dialog,
  Portal,
  Paragraph,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import itemDetail from "@/components/ItemDetail"
import ItemDetail from "@/components/ItemDetail";

export default function Calculator() {
  const navigation = useNavigation();
  const [items, setItems] = useState([
    {
      id: 1,
      itemtype: "Gold",
      itemname: "",
      HUID: "",
      weight: 0.0,
      rate: 0.0,
      makingChargeType: "Percentage",
      makingCharges: 0.0,
      totalamount: 0.0,
      includeGST:false,
      includeSGST:false,
      includeCGST:false
    },
  ]);
  const [beforeMakingCharge, setBeforeMakingCharge] = useState(0)
  const [makingCharges, setMakingCharges] = useState(0)
  const [currentGST, setCurrentGST] = useState(0)
  const [includeGST, setIncludeGST] = useState(false);
  const [includeCGST, setIncludeCGST] = useState(false);
  const [includeSGST, setIncludeSGST] = useState(false);
  const [finalamount, setFinalAmount] = useState(0);
  const [nextbtndisabled, setnextbtndisabled] = useState(true);
  const [BillNumber, setBillNUmber] = useState(0);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);

  const hideDialog = () => setVisible(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: (Math.random() + 1).toString(36).substring(7),
        itemtype: "Gold",
        itemname: "",
        HUID: "",
        weight: 0,
        rate: 0,
        makingChargeType: "Percentage",
        makingCharges: 0,
        totalamount: 0,
        
      },
    ]);
  };

  const clearItems = () => {
    setFinalAmount();
    setIncludeGST(false);
    setIncludeCGST(false);
    setItems([]);
  };

  const deleteItem = (idx) => {
    let filteredArray = items.filter((item) => item.id !== idx);
    setItems(filteredArray);
  };

  const handlenextbutton = async () => {
    navigation.navigate("Details", {
      items: items,
      finalamount: finalamount,
      includeGST:includeGST,
      includeSGST:includeSGST,
      includeCGST:includeCGST
    });
  };

  function percentage(additional, totalValue) {
    let t = (additional / 100) * totalValue;
    return t;
  }

  const handleGetAmount = () => {
    let totalAmount = 0;
    const updatedItems = items.map((item) => {
      let newErrors = {};

      if (!item.itemname.trim()) newErrors.itemname = "Item name is required";
      if (!item.HUID.trim() || item.HUID.length !== 6)
        newErrors.HUID = "Invalid HUID";
      if (!item.weight || isNaN(item.weight) || item.weight <= 0)
        newErrors.weight = "Invalid weight";
      if (!item.rate || isNaN(item.rate) || item.rate <= 0)
        newErrors.rate = "Invalid rate";
      setErrors(newErrors);
      // skip invalid
      if (Object.keys(newErrors).length > 0) {
        setVisible(!visible);
        return;
      }

      let total = item.weight * item.rate;
      setBeforeMakingCharge(total)
      setMakingCharges(percentage(item.makingCharges, total))
      if (item.makingChargeType === "Percentage") {
        totalAmount = total + percentage(item.makingCharges, total);
      } else if (item.makingChargeType === "Fixed") {
        totalAmount = total + item.makingCharges;
      }
      // if (includeGST) {
      //   setCurrentGST(percentage(3,totalAmount))
      // } else if (includeCGST || includeSGST) {
      //   setCurrentGST(percentage(1.5,totalAmount))
      // }
      // else{
      //   setCurrentGST(0)
      // }
      
      
      return { ...item, totalamount: totalAmount };
    });

    setItems(updatedItems);
    console.log("Items data after totalamount =====>>", items);

    let totalFinal = updatedItems.reduce(
      (sum, item) => sum + (item.totalamount || 0),
      0
    );

    if (includeGST) {
      totalFinal += percentage(3, totalFinal);
    } else {
      if (includeSGST) totalFinal += percentage(1.5, totalFinal);
      if (includeCGST) totalFinal += percentage(1.5, totalFinal);
    }

    setFinalAmount(totalFinal);
    setnextbtndisabled(false);
  };

  return (
    <ScrollView style={styles.container}>
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.itemTitle}>Item {index + 1}</Text>
            </View>
            <View>
              <Button
                mode="text"
                onPress={() => deleteItem(item.id)}
                textColor="red"
                icon="delete"
              >
                Delete
              </Button>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={item.itemtype}
                style={styles.picker}
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
          
            <TextInput
              style={[
                styles.input,
                { borderColor: errors.HUIDname ? "red" : "black" },
              ]}
              placeholder="HUID Num"
              maxLength={6}
              minLength={6}
              autoCapitalize="characters"
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
              (Includes CGST & SGST 3.0%)
            </Text>
          </Text>
          <Checkbox
            status={includeGST ? "checked" : "unchecked"}
            onPress={() => {
              setIncludeGST(!includeGST)
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
            status={includeSGST ? "checked" : "unchecked"}
            onPress={() => {
              setIncludeSGST(!includeSGST);
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
        <View>
          {items.map((item, index) => (
            ItemDetail(index, item.itemname ,item.weight, item.rate ,makingCharges , item.totalamount)
          ))}

          {/* total amount */}
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
          disabled={nextbtndisabled}
          buttonColor="#8a2be2"
          textColor="white"
        >
          Next
        </Button>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.title}>Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.message}>
              Please fill all required fields correctly.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    marginBottom: 20,
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
  picker: { width: 150, height: 50, fontWeight: "600" },
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
    paddingBottom: 50,
  },
  checkboxContainer: {
    justifyContent: "space-between",
    marginTop: 20,
  },

  dialog: {
    marginHorizontal: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  title: {
    fontWeight: "bold",
    color: "#D32F2F", // red tone for error
  },
  message: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  screenContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
});
