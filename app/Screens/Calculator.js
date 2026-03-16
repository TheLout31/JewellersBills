// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   StyleSheet,
//   ToastAndroid,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import {
//   Button,
//   IconButton,
//   Checkbox,
//   Dialog,
//   Portal,
//   Paragraph,
//   Tooltip,
// } from "react-native-paper";
// import { useNavigation } from "@react-navigation/native";
// import itemDetail from "@/components/ItemDetail";
// import ItemDetail from "@/components/ItemDetail";

// export default function Calculator() {
//   const navigation = useNavigation();
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       itemtype: "Gold",
//       itemname: "",
//       HUID: 7113,
//       purity: 916,
//       weight: "",
//       rate: "",
//       makingChargeType: "Percentage",
//       makingCharges: 0.0,
//       totalMakingCharges: 0.0,
//       totalamount: 0.0,
//     },
//   ]);
//   const [beforeMakingCharge, setBeforeMakingCharge] = useState(0);
//   const [beforeGSTCharge, setBeforeGSTCharge] = useState(0);
//   const [makingCharges, setMakingCharges] = useState(0);
//   const [currentGST, setCurrentGST] = useState(0);
//   const [includeGST, setIncludeGST] = useState(false);
//   const [includeCGST, setIncludeCGST] = useState(false);
//   const [includeSGST, setIncludeSGST] = useState(false);
//   const [finalamount, setFinalAmount] = useState(0);
//   const [nextbtndisabled, setnextbtndisabled] = useState(true);
//   const [BillNumber, setBillNUmber] = useState(0);
//   const [errors, setErrors] = useState({});
//   const [visible, setVisible] = useState(false);

//   const hideDialog = () => setVisible(false);

//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         id: (Math.random() + 1).toString(36).substring(7),
//         itemtype: "Gold",
//         itemname: "",
//         HUID: 7113,
//         purity: 916,
//         weight: "",
//         rate: "",
//         makingChargeType: "Percentage",
//         makingCharges: "",
//         totalMakingCharges: 0.0,
//         totalamount: 0,
//       },
//     ]);
//   };

//   const clearItems = () => {
//     setFinalAmount();
//     setIncludeGST(false);
//     setIncludeSGST(false);
//     setItems([]);
//   };

//   const deleteItem = (idx) => {
//     let filteredArray = items.filter((item) => item.id !== idx);
//     setItems(filteredArray);
//   };

//   const handlenextbutton = async () => {
//     navigation.navigate("Details", {
//       items: items,
//       finalamount: finalamount,
//       beforeGSTCharge: beforeGSTCharge,
//       includeGST: includeGST,
//       includeSGST: includeSGST,
//     });
//   };

//   function percentage(additional, totalValue) {
//     let t = (additional / 100) * totalValue;
//     return t;
//   }

//   const handleGetAmount = () => {
//     let hasErrors = false;
//     let totalBeforeGST = 0;
//     let updatedErrors = {};
//     let updatedItems = [];

//     const newItems = items.map((item, idx) => {
//       let newErrors = {};

//       if (!item.itemname?.trim()) {
//         newErrors.itemname = "Item name is required";
//       }

//       if (!item.weight || isNaN(item.weight) || item.weight <= 0) {
//         newErrors.weight = "Invalid weight";
//       }

//       if (!item.rate || isNaN(item.rate) || item.rate <= 0) {
//         newErrors.rate = "Invalid rate";
//       }

//       if (Object.keys(newErrors).length > 0) {
//         updatedErrors[idx] = newErrors;
//         hasErrors = true;
//         return { ...item }; // Return unmodified item
//       }
//       let baseTotal = item.weight * item.rate;
//       let totalMakingCharges = 0;

//       if (item.makingChargeType === "Percentage") {
//         totalMakingCharges = percentage(item.makingCharges, baseTotal);
//       } else if (item.makingChargeType === "Fixed") {
//         totalMakingCharges = item.makingCharges;
//       }

//       const totalamount = baseTotal + totalMakingCharges;
//       totalBeforeGST += totalamount;

//       return {
//         ...item,
//         totalamount,
//         totalMakingCharges,
//       };
//     });

//     if (hasErrors) {
//       setErrors(updatedErrors);
//       setVisible(true); // show error modal or tooltip
//       return; // Stop execution if there are errors
//     }

//     setErrors({}); // clear errors
//     setItems(newItems);
//     setBeforeMakingCharge(totalBeforeGST);
//     setBeforeGSTCharge(totalBeforeGST);

//     let finalTotal = totalBeforeGST;

//     if (includeGST || includeSGST) {
//       finalTotal += percentage(3, totalBeforeGST);
//     }

//     setFinalAmount(finalTotal);
//     setnextbtndisabled(false);
//   };

//   // const handleGetAmount = () => {
//   //   let totalAmount = 0;

//   //   const updatedItems = items.map((item) => {
//   //     let newErrors = {};

//   //     if (!item.itemname.trim()) newErrors.itemname = "Item name is required";

//   //     if (!item.weight || isNaN(item.weight) || item.weight <= 0)
//   //       newErrors.weight = "Invalid weight";
//   //     if (!item.rate || isNaN(item.rate) || item.rate <= 0)
//   //       newErrors.rate = "Invalid rate";
//   //     setErrors(newErrors);
//   //     // skip invalid
//   //     if (Object.keys(newErrors).length > 0) {
//   //       setVisible(!visible);
//   //       return;
//   //     }

//   //     let total = item.weight * item.rate;
//   //     setBeforeMakingCharge(total)
//   //     let totalMakingCharges =percentage(item.makingCharges, total)
//   //     if (item.makingChargeType === "Percentage") {
//   //       totalAmount = total + totalMakingCharges;
//   //     } else if (item.makingChargeType === "Fixed") {
//   //       totalAmount = total + item.makingCharges;
//   //     }

//   //     return { ...item, totalamount: totalAmount , totalMakingCharges:totalMakingCharges};
//   //   });

//   //   setItems(updatedItems);
//   //   console.log("Items data after totalamount =====>>", items);

//   //   let totalFinal = updatedItems.reduce(
//   //     (sum, item) => sum + (item.totalamount || 0),
//   //     0
//   //   );

//   //   setBeforeGSTCharge(totalFinal);

//   //   if (includeGST) {
//   //     totalFinal += percentage(3, totalFinal);
//   //   } else {
//   //     if (includeSGST) totalFinal += percentage(3, totalFinal);
//   //     // if (includeCGST) totalFinal += percentage(1.5, totalFinal);
//   //   }

//   //   setFinalAmount(totalFinal);
//   //   setnextbtndisabled(false);
//   // };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Header */}
//       {/* <View style={styles.header}>

//         <Text style={styles.headerTitle}>Calculator with Invoice Creator</Text>
//       </View> */}

//       {/* Buttons */}
//       <View style={styles.buttonContainer}>
//         <Button
//           mode="contained"
//           onPress={addItem}
//           icon="plus"
//           buttonColor="#8a2be2"
//           textColor="white"
//         >
//           Add Items
//         </Button>
//         <Button mode="text" onPress={clearItems} textColor="red" icon="delete">
//           Clear All Items
//         </Button>
//       </View>

//       {/* Items */}
//       {items.map((item, index) => (
//         <View key={item.id} style={styles.itemContainer}>
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <View>
//               <Text style={styles.itemTitle}>Item {index + 1}</Text>
//             </View>
//             <View>
//               <Button
//                 mode="text"
//                 onPress={() => deleteItem(item.id)}
//                 textColor="red"
//                 icon="delete"
//               >
//                 Delete
//               </Button>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={item.itemtype}
//                 style={styles.picker}
//                 onValueChange={(itemValue) => {
//                   const newItems = [...items];
//                   newItems[index].itemtype = itemValue;
//                   setItems(newItems);
//                 }}
//               >
//                 <Picker.Item label="Gold" value="Gold" />
//                 <Picker.Item label="Silver" value="Silver" />
//               </Picker>
//             </View>

//             <TextInput
//               style={[
//                 styles.input,
//                 { borderColor: errors.itemname ? "red" : "black" },
//               ]}
//               placeholder="Item Name"
//               // onChangeText={(newText) => setItemname(newText)}
//               onChangeText={(text) => {
//                 const newItems = [...items];
//                 newItems[index].itemname = text;
//                 setItems(newItems);
//               }}
//             />
//           </View>

//           <View style={styles.row}>
//             <View style={styles.input}>
//               <Text style={styles.fixedTitle}>7113</Text>
//             </View>

//             <View style={styles.input}>
//               <Text style={styles.fixedTitle}>916</Text>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <TextInput
//               style={[
//                 styles.input,
//                 { borderColor: errors.Weight ? "red" : "black" },
//               ]}
//               placeholder="Weight (g)"
//               keyboardType="numeric"
//               // onChangeText={(weight) => setWeight(parseInt(weight) || 0)}
//               onChangeText={(text) => {
//                 const newItems = [...items];
//                 newItems[index].weight = parseFloat(text) || 0;
//                 setItems(newItems);
//               }}
//             />
//             <TextInput
//               style={[
//                 styles.input,
//                 { borderColor: errors.rate ? "red" : "black" },
//               ]}
//               placeholder="Rate (₹/g)"
//               keyboardType="numeric"
//               onChangeText={(text) => {
//                 const newItems = [...items];
//                 newItems[index].rate = parseFloat(text) || 0;
//                 setItems(newItems);
//               }}
//             />
//           </View>
//           <View style={styles.row}>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={item.makingChargeType}
//                 style={styles.picker}
//                 onValueChange={(itemValue) => {
//                   const newItems = [...items];
//                   newItems[index].makingChargeType = itemValue;
//                   setItems(newItems);
//                 }}
//               >
//                 <Picker.Item label="Percentage" value="Percentage" />

//                 <Picker.Item label="Fixed" value="Fixed" />
//               </Picker>
//             </View>
//             <TextInput
//               style={[
//                 styles.input,
//                 { borderColor: errors.rate ? "red" : "black" },
//               ]}
//               placeholder="Making Charges"
//               keyboardType="numeric"
//               // onChangeText={(charges) =>
//               //   setMakingCharges(parseInt(charges) || 0)
//               // }
//               onChangeText={(text) => {
//                 const newItems = [...items];
//                 newItems[index].makingCharges = parseFloat(text) || 0;
//                 setItems(newItems);
//               }}
//             />
//           </View>
//         </View>
//       ))}

//       {/* GST CGST Checkbox */}
//       <View style={styles.checkboxContainer}>
//         <View style={styles.gstContainer}>
//           <Text style={styles.headerTitle}>
//             Include IGST{" "}
//             <Text
//               style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }}
//             >
//               (Includes CGST & SGST 3.0%)
//             </Text>
//           </Text>
//           <Checkbox
//             status={includeGST ? "checked" : "unchecked"}
//             onPress={() => {
//               setIncludeGST(!includeGST);
//             }}
//           />
//         </View>

//         <View style={styles.gstContainer}>
//           <Text style={styles.headerTitle}>
//             Include SGST{" "}
//             <Text
//               style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }}
//             >
//               (1.5%)
//             </Text>
//           </Text>
//           <Checkbox
//             status={includeSGST ? "checked" : "unchecked"}
//             onPress={() => {
//               setIncludeSGST(!includeSGST);
//             }}
//           />
//         </View>

//         <View style={styles.gstContainer}>
//           <Text style={styles.headerTitle}>
//             Include CGST{" "}
//             <Text
//               style={{ fontSize: 12, fontWeight: "400", textAlign: "center" }}
//             >
//               (1.5%)
//             </Text>
//           </Text>
//           <Checkbox
//             status={includeSGST ? "checked" : "unchecked"}
//             onPress={() => {
//               setIncludeSGST(!includeSGST);
//             }}
//           />
//         </View>
//       </View>

//       <View style={styles.line} />

//       {finalamount ? (
//         <View>
//           {items.map((item, index) => {
//             const makingCharge =
//               item.makingChargeType === "Percentage"
//                 ? item.totalMakingCharges
//                 : item.makingCharges;

//             return ItemDetail(
//               index,
//               item.itemname,
//               item.weight,
//               item.rate,
//               makingCharge,
//               item.totalamount
//             );
//           })}

//           {/* total amount */}
//           <View
//             style={{
//               marginBottom: 20,
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <Text style={styles.totalTitle}>Total Amount:</Text>
//             <Text style={styles.totalTitle}>₹{finalamount.toFixed(2)}</Text>
//           </View>
//         </View>
//       ) : null}

//       {/* Action Buttons */}
//       <View style={styles.actionButtons}>
//         <Button
//           mode="contained"
//           icon="calculator"
//           onPress={handleGetAmount}
//           buttonColor="#8a2be2"
//           textColor="white"
//         >
//           Get Amount
//         </Button>
//         <Button
//           mode="contained"
//           icon="arrow-right"
//           onPress={handlenextbutton}
//           disabled={nextbtndisabled}
//           buttonColor="#8a2be2"
//           textColor="white"
//         >
//           Next
//         </Button>
//       </View>
//       <Portal>
//         <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
//           <Dialog.Title style={styles.title}>Error</Dialog.Title>
//           <Dialog.Content>
//             <Paragraph style={styles.message}>
//               Please fill all required fields correctly.
//             </Paragraph>
//           </Dialog.Content>
//           <Dialog.Actions>
//             <Button onPress={hideDialog}>OK</Button>
//           </Dialog.Actions>
//         </Dialog>
//       </Portal>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 10 },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#8a2be2",
//     padding: 15,
//   },
//   headerTitle: { color: "black", fontSize: 16, fontWeight: "600" },
//   fixedTitle: { color: "#71797E", fontSize: 16, fontWeight: "600" },
//   totalTitle: {
//     color: "black",
//     fontSize: 18,
//     fontWeight: "800",
//     fontFamily: "SpaceMono-Regular",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 10,
//     marginBottom: 20,
//   },
//   itemContainer: {
//     justifyContent: "space-around",

//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   itemTitle: { fontWeight: "bold", marginBottom: 5, fontSize: 15 },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     marginBottom: 4,
//     color: "#333",
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     padding: 8,
//     marginHorizontal: 5,
//     borderRadius: 5,
//     fontSize: 16,
//     fontWeight: "600",
//     justifyContent: "center",
//   },
//   pickerContainer: {
//     flex: 1,
//     borderWidth: 1,
//     borderRadius: 5,
//     overflow: "hidden",
//     marginHorizontal: 5,
//   },
//   picker: { height: 50, fontWeight: "600" },
//   gstContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginVertical: 10,
//   },
//   line: {
//     height: 1, // Thin line
//     backgroundColor: "black", // Line color
//     width: "100%", // Full width
//     marginVertical: 10, // Space above and below the line
//   },
//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//     paddingBottom: 50,
//   },
//   checkboxContainer: {
//     justifyContent: "space-between",
//     marginTop: 20,
//   },

//   dialog: {
//     marginHorizontal: 20,
//     borderRadius: 30,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontWeight: "bold",
//     color: "#D32F2F", // red tone for error
//   },
//   message: {
//     fontSize: 16,
//     color: "#333",
//     fontWeight: "500",
//   },
//   screenContent: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//   },
// });
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button, Dialog, Portal, Paragraph } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ItemDetail from "@/components/ItemDetail";

const theme = {
  primary: "#8a2be2",
  primaryDark: "#6A1FBB",
  primaryDeep: "#3D1B6E",
  primaryLight: "#F3EEFF",
  primaryBorder: "rgba(138,43,226,0.18)",
  gold: "#C9A840",
  goldLight: "#F0D060",
  goldBg: "rgba(201,168,64,0.12)",
  surface: "#FDFBFF",
  bg: "#F7F4FF",
  muted: "#9B84C4",
  danger: "#D43535",
  dangerBg: "rgba(220,50,50,0.07)",
};

// ── Reusable labelled input ──────────────────────────────────────
function LabelInput({ label, ...props }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={theme.muted}
        {...props}
      />
    </View>
  );
}

// ── Reusable labelled picker ─────────────────────────────────────
function LabelPicker({ label, children, ...props }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.pickerWrap}>
        <Picker style={styles.picker} {...props}>
          {children}
        </Picker>
      </View>
    </View>
  );
}

// ── Toggle row for GST ───────────────────────────────────────────
function TaxToggle({ label, sub, value, onToggle }) {
  return (
    <View style={styles.taxRow}>
      <View>
        <Text style={styles.taxLabel}>{label}</Text>
        <Text style={styles.taxSub}>{sub}</Text>
      </View>
      <TouchableOpacity
        onPress={onToggle}
        style={[styles.toggle, value && styles.toggleOn]}
        activeOpacity={0.8}
      >
        <View style={[styles.knob, value && styles.knobOn]} />
      </TouchableOpacity>
    </View>
  );
}

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
      makingCharges: 0,
      totalMakingCharges: 0,
      totalamount: 0,
    },
  ]);

  const [beforeGSTCharge, setBeforeGSTCharge] = useState(0);
  const [includeGST, setIncludeGST] = useState(false);
  const [includeSGST, setIncludeSGST] = useState(false);
  const [includeCGST, setIncludeCGST] = useState(false);
  const [finalamount, setFinalAmount] = useState(0);
  const [nextDisabled, setNextDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);

  const pct = (p, v) => (p / 100) * v;

  const addItem = () =>
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
        totalMakingCharges: 0,
        totalamount: 0,
      },
    ]);

  const clearItems = () => {
    setItems([]);
    setFinalAmount(0);
    setIncludeGST(false);
    setIncludeSGST(false);
    setIncludeCGST(false);
  };

  const deleteItem = (id) => setItems(items.filter((i) => i.id !== id));

  const updateItem = (index, key, value) => {
    const next = [...items];
    next[index][key] = value;
    setItems(next);
  };

  const handleGetAmount = () => {
    let hasErrors = false;
    let totalBeforeGST = 0;
    let updatedErrors = {};

    const newItems = items.map((item, idx) => {
      const e = {};
      if (!item.itemname?.trim()) e.itemname = true;
      if (!item.weight || isNaN(item.weight) || item.weight <= 0)
        e.weight = true;
      if (!item.rate || isNaN(item.rate) || item.rate <= 0) e.rate = true;
      if (Object.keys(e).length) {
        updatedErrors[idx] = e;
        hasErrors = true;
        return item;
      }

      const base = item.weight * item.rate;
      const totalMakingCharges =
        item.makingChargeType === "Percentage"
          ? pct(item.makingCharges, base)
          : parseFloat(item.makingCharges) || 0;
      const totalamount = base + totalMakingCharges;
      totalBeforeGST += totalamount;
      return { ...item, totalamount, totalMakingCharges };
    });

    if (hasErrors) {
      setErrors(updatedErrors);
      setVisible(true);
      return;
    }

    setErrors({});
    setItems(newItems);
    setBeforeGSTCharge(totalBeforeGST);

    let final = totalBeforeGST;
    if (includeGST || includeSGST || includeCGST)
      final += pct(3, totalBeforeGST);
    setFinalAmount(final);
    setNextDisabled(false);
  };

  const handleNext = () =>
    navigation.navigate("Details", {
      items,
      finalamount,
      beforeGSTCharge,
      includeGST,
      includeSGST,
    });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={addItem}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>＋ Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={clearItems}
          activeOpacity={0.8}
        >
          <Text style={styles.clearBtnText}>🗑 Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* ── Items ── */}
      {items.map((item, index) => (
        <View key={item.id} style={styles.itemCard}>
          {/* Card header */}
          <View style={styles.cardHeader}>
            <View style={styles.itemBadge}>
              <Text style={styles.itemBadgeText}>✦ Item {index + 1}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>

          {/* Row 1 — type + name */}
          <View style={styles.row}>
            <LabelPicker
              label="Type"
              selectedValue={item.itemtype}
              onValueChange={(v) => updateItem(index, "itemtype", v)}
            >
              <Picker.Item label="Gold" value="Gold" />
              <Picker.Item label="Silver" value="Silver" />
            </LabelPicker>
            <View style={{ width: 8 }} />
            <LabelInput
              label="Item Name"
              placeholder="e.g. Necklace"
              value={item.itemname}
              onChangeText={(t) => updateItem(index, "itemname", t)}
              style={errors[index]?.itemname ? styles.inputError : {}}
            />
          </View>

          {/* Row 2 — HUID + Purity (fixed) */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>HUID</Text>
              <View style={styles.fixedField}>
                <Text style={styles.fixedText}>7113</Text>
              </View>
            </View>
            <View style={{ width: 8 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>Purity</Text>
              <View style={styles.fixedField}>
                <Text style={styles.fixedText}>916</Text>
              </View>
            </View>
          </View>

          {/* Row 3 — weight + rate */}
          <View style={styles.row}>
            <LabelInput
              label="Weight (g)"
              placeholder="0.000"
              keyboardType="numeric"
              value={String(item.weight)}
              onChangeText={(t) =>
                updateItem(index, "weight", parseFloat(t) || 0)
              }
              style={errors[index]?.weight ? styles.inputError : {}}
            />
            <View style={{ width: 8 }} />
            <LabelInput
              label="Rate (₹/g)"
              placeholder="0.00"
              keyboardType="numeric"
              value={String(item.rate)}
              onChangeText={(t) =>
                updateItem(index, "rate", parseFloat(t) || 0)
              }
              style={errors[index]?.rate ? styles.inputError : {}}
            />
          </View>

          {/* Row 4 — making type + charges */}
          <View style={styles.row}>
            <LabelPicker
              label="Charge Type"
              selectedValue={item.makingChargeType}
              onValueChange={(v) => updateItem(index, "makingChargeType", v)}
            >
              <Picker.Item label="Percentage" value="Percentage" />
              <Picker.Item label="Fixed" value="Fixed" />
            </LabelPicker>
            <View style={{ width: 8 }} />
            <LabelInput
              label={
                item.makingChargeType === "Percentage"
                  ? "Making (%)"
                  : "Making (₹)"
              }
              placeholder="0"
              keyboardType="numeric"
              value={String(item.makingCharges)}
              onChangeText={(t) =>
                updateItem(index, "makingCharges", parseFloat(t) || 0)
              }
            />
          </View>
        </View>
      ))}

      {/* ── Tax toggles ── */}
      <View style={styles.taxCard}>
        <Text style={styles.sectionTitle}>TAX OPTIONS</Text>
        <TaxToggle
          label="Include IGST"
          sub="CGST + SGST combined (3.0%)"
          value={includeGST}
          onToggle={() => {
            setIncludeGST(!includeGST);
            setIncludeSGST(false);
            setIncludeCGST(false);
          }}
        />
        <TaxToggle
          label="Include SGST"
          sub="State GST (1.5%)"
          value={includeSGST}
          onToggle={() => {
            setIncludeSGST(!includeSGST);
            setIncludeGST(false);
          }}
        />
        <TaxToggle
          label="Include CGST"
          sub="Central GST (1.5%)"
          value={includeCGST}
          onToggle={() => {
            setIncludeCGST(!includeCGST);
            setIncludeGST(false);
          }}
        />
      </View>

      {/* ── Results ── */}
      {finalamount > 0 && (
        <View>
          {items.map((item, index) => {
            const mc =
              item.makingChargeType === "Percentage"
                ? item.totalMakingCharges
                : item.makingCharges;
            return ItemDetail(
              index,
              item.itemname,
              item.weight,
              item.rate,
              mc,
              item.totalamount,
            );
          })}

          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalSub}>Before GST</Text>
              <Text style={styles.totalSub}>₹{beforeGSTCharge.toFixed(2)}</Text>
            </View>
            {(includeGST || includeSGST || includeCGST) && (
              <View style={styles.totalRow}>
                <Text style={styles.totalSub}>GST (3%)</Text>
                <Text style={styles.totalSub}>
                  + ₹{pct(3, beforeGSTCharge).toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandLabel}>Grand Total</Text>
              <Text style={styles.grandValue}>₹{finalamount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* ── Action buttons ── */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.calcBtn}
          onPress={handleGetAmount}
          activeOpacity={0.85}
        >
          <Text style={styles.calcBtnText}>🧮 Get Amount</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextBtn, nextDisabled && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={nextDisabled}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.nextBtnText,
              nextDisabled && styles.nextBtnTextDisabled,
            ]}
          >
            Next ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Error dialog ── */}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={() => setVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            ⚠ Missing Fields
          </Dialog.Title>
          <Dialog.Content>
            <Paragraph style={styles.dialogMessage}>
              Please fill in all required fields (item name, weight, and rate)
              correctly.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)} textColor={theme.primary}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 14 },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 4,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  addBtnText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.dangerBg,
    borderWidth: 1,
    borderColor: "rgba(212,53,53,0.2)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  clearBtnText: { color: theme.danger, fontSize: 13, fontWeight: "500" },

  // Item card
  itemCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.primaryBorder,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  itemBadge: {
    backgroundColor: theme.primaryLight,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  itemBadgeText: { fontSize: 11, fontWeight: "600", color: theme.primary },
  deleteText: { fontSize: 11, color: theme.danger, fontWeight: "500" },
  row: { flexDirection: "row", marginBottom: 10 },

  // Inputs
  inputLabel: {
    fontSize: 9,
    color: theme.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  input: {
    backgroundColor: theme.primaryLight,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 13,
    fontWeight: "500",
    color: theme.primaryDeep,
  },
  inputError: { borderColor: theme.danger },
  fixedField: {
    backgroundColor: "rgba(138,43,226,0.04)",
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.08)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
  },
  fixedText: { fontSize: 13, fontWeight: "500", color: theme.muted },
  pickerWrap: {
    backgroundColor: theme.primaryLight,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: { height: 44, color: theme.primaryDeep },

  // Tax
  taxCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.primaryBorder,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    color: theme.muted,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  taxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(138,43,226,0.07)",
  },
  taxLabel: { fontSize: 13, fontWeight: "500", color: theme.primaryDeep },
  taxSub: { fontSize: 10, color: theme.muted, marginTop: 1 },
  toggle: {
    width: 38,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(138,43,226,0.12)",
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.2)",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 2,
  },
  toggleOn: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
    justifyContent: "flex-end",
  },
  knob: { width: 17, height: 17, borderRadius: 9, backgroundColor: "#fff" },
  knobOn: { backgroundColor: "#fff" },

  // Total
  totalCard: {
    backgroundColor: theme.primaryDark,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalSub: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  totalDivider: {
    height: 0.5,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 10,
  },
  grandLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  grandValue: {
    fontFamily: "serif",
    fontSize: 24,
    color: theme.goldLight,
    fontWeight: "700",
  },

  // Action buttons
  actionRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  calcBtn: {
    flex: 1,
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  calcBtnText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  nextBtn: {
    flex: 1,
    backgroundColor: theme.gold,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  nextBtnText: { color: "#3D2000", fontSize: 13, fontWeight: "700" },
  nextBtnDisabled: { backgroundColor: "rgba(138,43,226,0.1)" },
  nextBtnTextDisabled: { color: theme.muted },

  // Dialog
  dialog: { borderRadius: 20, backgroundColor: "#fff", marginHorizontal: 20 },
  dialogTitle: { fontWeight: "700", color: theme.danger },
  dialogMessage: { fontSize: 14, color: theme.primaryDeep },
});
