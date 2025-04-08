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
  Tooltip,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import itemDetail from "@/components/ItemDetail";
import ItemDetail from "@/components/ItemDetail";

export default function Calculator() {
  const navigation = useNavigation();
  const [items, setItems] = useState([
    {
      id: 1,
      itemtype: "Gold",
      itemname: "",
      HUID: 7113,
      purity: 916,
      weight: "",
      rate: "",
      makingChargeType: "Percentage",
      makingCharges: 0.0,
      totalMakingCharges: 0.0,
      totalamount: 0.0,
    },
  ]);
  const [beforeMakingCharge, setBeforeMakingCharge] = useState(0);
  const [beforeGSTCharge, setBeforeGSTCharge] = useState(0);
  const [makingCharges, setMakingCharges] = useState(0);
  const [currentGST, setCurrentGST] = useState(0);
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
        HUID: 7113,
        purity: 916,
        weight: "",
        rate: "",
        makingChargeType: "Percentage",
        makingCharges: "",
        totalMakingCharges: 0.0,
        totalamount: 0,
      },
    ]);
  };

  const clearItems = () => {
    setFinalAmount();
    setIncludeGST(false);
    setIncludeSGST(false);
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
      beforeGSTCharge: beforeGSTCharge,
      includeGST: includeGST,
      includeSGST: includeSGST,
    });
  };

  function percentage(additional, totalValue) {
    let t = (additional / 100) * totalValue;
    return t;
  }

  const handleGetAmount = () => {
    let hasErrors = false;
    let totalBeforeGST = 0;
    let updatedErrors = {};
    let updatedItems = [];

    const newItems = items.map((item, idx) => {
      let newErrors = {};

      if (!item.itemname?.trim()) {
        newErrors.itemname = "Item name is required";
      }

      if (!item.weight || isNaN(item.weight) || item.weight <= 0) {
        newErrors.weight = "Invalid weight";
      }

      if (!item.rate || isNaN(item.rate) || item.rate <= 0) {
        newErrors.rate = "Invalid rate";
      }

      if (Object.keys(newErrors).length > 0) {
        updatedErrors[idx] = newErrors;
        hasErrors = true;
        return { ...item }; // Return unmodified item
      }
      let baseTotal = item.weight * item.rate;
      let totalMakingCharges = 0;

      if (item.makingChargeType === "Percentage") {
        totalMakingCharges = percentage(item.makingCharges, baseTotal);
      } else if (item.makingChargeType === "Fixed") {
        totalMakingCharges = item.makingCharges;
      }

      const totalamount = baseTotal + totalMakingCharges;
      totalBeforeGST += totalamount;

      return {
        ...item,
        totalamount,
        totalMakingCharges,
      };
    });

    if (hasErrors) {
      setErrors(updatedErrors);
      setVisible(true); // show error modal or tooltip
      return; // Stop execution if there are errors
    }

    setErrors({}); // clear errors
    setItems(newItems);
    setBeforeMakingCharge(totalBeforeGST);
    setBeforeGSTCharge(totalBeforeGST);

    let finalTotal = totalBeforeGST;

    if (includeGST || includeSGST) {
      finalTotal += percentage(3, totalBeforeGST);
    }

    setFinalAmount(finalTotal);
    setnextbtndisabled(false);
  };

  // const handleGetAmount = () => {
  //   let totalAmount = 0;

  //   const updatedItems = items.map((item) => {
  //     let newErrors = {};

  //     if (!item.itemname.trim()) newErrors.itemname = "Item name is required";

  //     if (!item.weight || isNaN(item.weight) || item.weight <= 0)
  //       newErrors.weight = "Invalid weight";
  //     if (!item.rate || isNaN(item.rate) || item.rate <= 0)
  //       newErrors.rate = "Invalid rate";
  //     setErrors(newErrors);
  //     // skip invalid
  //     if (Object.keys(newErrors).length > 0) {
  //       setVisible(!visible);
  //       return;
  //     }

  //     let total = item.weight * item.rate;
  //     setBeforeMakingCharge(total)
  //     let totalMakingCharges =percentage(item.makingCharges, total)
  //     if (item.makingChargeType === "Percentage") {
  //       totalAmount = total + totalMakingCharges;
  //     } else if (item.makingChargeType === "Fixed") {
  //       totalAmount = total + item.makingCharges;
  //     }

  //     return { ...item, totalamount: totalAmount , totalMakingCharges:totalMakingCharges};
  //   });

  //   setItems(updatedItems);
  //   console.log("Items data after totalamount =====>>", items);

  //   let totalFinal = updatedItems.reduce(
  //     (sum, item) => sum + (item.totalamount || 0),
  //     0
  //   );

  //   setBeforeGSTCharge(totalFinal);

  //   if (includeGST) {
  //     totalFinal += percentage(3, totalFinal);
  //   } else {
  //     if (includeSGST) totalFinal += percentage(3, totalFinal);
  //     // if (includeCGST) totalFinal += percentage(1.5, totalFinal);
  //   }

  //   setFinalAmount(totalFinal);
  //   setnextbtndisabled(false);
  // };

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
          </View>

          <View style={styles.row}>
            <View style={styles.input}>
              <Text style={styles.fixedTitle}>7113</Text>
            </View>

            <View style={styles.input}>
              <Text style={styles.fixedTitle}>916</Text>
            </View>
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
                newItems[index].weight = parseFloat(text) || 0;
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
                newItems[index].rate = parseFloat(text) || 0;
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
                newItems[index].makingCharges = parseFloat(text) || 0;
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
            Include IGST{" "}
            <Text
              style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }}
            >
              (Includes CGST & SGST 3.0%)
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
            status={includeSGST ? "checked" : "unchecked"}
            onPress={() => {
              setIncludeSGST(!includeSGST);
            }}
          />
        </View>
      </View>

      <View style={styles.line} />

      {finalamount ? (
        <View>
          {items.map((item, index) => {
            const makingCharge =
              item.makingChargeType === "Percentage"
                ? item.totalMakingCharges
                : item.makingCharges;

            return ItemDetail(
              index,
              item.itemname,
              item.weight,
              item.rate,
              makingCharge,
              item.totalamount
            );
          })}

          {/* total amount */}
          <View
            style={{
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.totalTitle}>Total Amount:</Text>
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
  fixedTitle: { color: "#71797E", fontSize: 16, fontWeight: "600" },
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: "600",
    justifyContent: "center",
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  picker: { height: 50, fontWeight: "600" },
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
