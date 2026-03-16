// import React, { useState } from "react";
// import { View, StyleSheet, ToastAndroid } from "react-native";
// import { TextInput, Button, Card, Title } from "react-native-paper";
// import { useNavigation } from "@react-navigation/native";
// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system";
// import { printToFileAsync } from "expo-print";
// import * as Print from "expo-print";
// import { shareAsync } from "expo-sharing";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const AddDetails = ({ route }) => {
//   const navigation = useNavigation();
//   const { items, finalamount, includeGST, includeSGST, beforeGSTCharge} =
//     route.params;
//   const [name, setName] = useState("");
//   const [number, setNumber] = useState("(+91) ");
//   const [address, setAddress] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");

//   const padNumber = (num, length = 5) => String(num).padStart(length, "0");

//   const generateBillNumber = async () => {
//     const year = new Date().getFullYear(); // e.g. 2025
//     const key = `billCount-${year}`;

//     try {
//       const storedCount = await AsyncStorage.getItem(key);
//       const count = storedCount ? parseInt(storedCount) + 1 : 1;

//       const billNumber = `${year}${padNumber(count)}`;

//       // Save the updated count
//       await AsyncStorage.setItem(key, count.toString());

//       return billNumber;
//     } catch (error) {
//       console.error("Error generating bill number:", error);
//       return null;
//     }
//   };

//   function percentage(additional, totalValue) {
//     let t = (additional / 100) * totalValue;
//     return t;
//   }

//   const TheItemTotal_Amount = () => {
//     return items.reduce((acc, item) => {
//       return acc + item.totalamount;
//     }, 0);
//   };

//   const generateInvoiceHTML = async () => {
//     try {
//       const todaydate = new Date();
//       // Load the HTML file from assets
//       const htmlAsset = Asset.fromModule(
//         require("@/assets/templates/invoice.html")
//       );
//       await htmlAsset.downloadAsync();
//       const htmlContent = await FileSystem.readAsStringAsync(
//         htmlAsset.localUri
//       );
//       const GST = function () {
//         if (includeGST) {
//           return percentage(3.0, beforeGSTCharge).toFixed(2);
//         } else if (includeSGST) {
//           return percentage(1.5, beforeGSTCharge).toFixed(2);
//         } else {
//           return (0).toFixed(1); // explicitly return 0
//         }
//       };
//       const itemRows = items
//         .map(
//           (item, idx) => `
//       <tr>
//         <td>${idx + 1}</td>
//         <td>${item.itemname}</td>
//         <td>${item.HUID}</td>
//         <td>${item.purity}</td>
//         <td>${item.weight}g</td>
//         <td>Rs ${item.rate}</td>
//         <td>${item.makingCharges}%</td>
//         <td>Rs ${(item.totalamount).toFixed(2)}</td>
//       </tr>`
//         )
//         .join("");

//       // Conditional SGST & CGST rows
//       const SGSTRows = includeSGST
//   ? `
//     <tr>
//       <th>CGST 1.5%</th>
//       <td>Rs ${GST()}</td>
//     </tr>
//     <tr>
//       <th>SGST 1.5%</th>
//       <td>Rs ${GST()}</td>
//     </tr>`
//   : `
//     <tr>
//       <th>IGST</th>
//       <td>Rs ${GST()}</td>
//     </tr>`;

//       const billNumber = await generateBillNumber();
//       const date = todaydate.getDate();
//       const month = todaydate.getMonth()+1;
//       const year = todaydate.getFullYear();
//       const followedYear = year.toString().slice(-2); // "26"
//       const total_amount = TheItemTotal_Amount().toFixed(2);

//       const TheFinalAmount = finalamount.toFixed(2);
//       // Inject form data dynamically
//       const populatedHTML = htmlContent
//         .replace("{{custName}}", name || "N/A")
//         .replace("{{PhoneNumber}}", number || "N/A")
//         .replace("{{Address}}", address || "N/A")
//         .replace("{{billnumber}}", billNumber || "N/A")
//         .replace("{{date}}", date || "N/A")
//         .replace("{{month}}", month || "N/A")
//         .replace("{{year}}", year || "N/A")
//         .replace("{{followedyear}}", Number(followedYear)+1|| "N/A")
//         .replace("{{Paydate}}", date || "N/A")
//         .replace("{{Paymonth}}", month || "N/A")
//         .replace("{{Payyear}}", year || "N/A")
//         .replace("{{items}}", itemRows)
//         .replace("{{total_amount}}", total_amount || "0.00")
//         // .replace("{{CGST}}", CGSTValue || 0)
//         // .replace("{{SGST}}", CGSTValue || 0)
//         .replace("{{IGST}}", SGSTRows)
//         .replace("{{finalamount}}", TheFinalAmount || "0.00");

//       return populatedHTML;
//     } catch (error) {
//       console.error("Error loading HTML file:", error);
//       return "<h1>Error loading invoice</h1>";
//     }
//   };

//   const printToFile = async () => {
//     try {
//       console.log("Next button clicked!!!!");
//       const html = await generateInvoiceHTML();
//       // On iOS/android prints the given html. On web prints the HTML from the current page.
//       const { uri } = await Print.printToFileAsync({
//         html: html,
//         base64: false,
//       });
//       console.log("File has been saved to:", uri);
//       await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
//     } catch (error) {
//       ToastAndroid.show("Unable to Print PDF!!", ToastAndroid.SHORT);
//     }
//   };

//   const handleGeneratePDF = async () => {
//     // Your PDF generation logic goes here
//     console.log("Screen adddetails items data ====>>>", items);
//     await printToFile();
//   };

//   return (
//     <View style={styles.container}>
//       <Card style={styles.card}>
//         <Card.Content>
//           <Title style={styles.title}>Add Details</Title>
//           <TextInput
//             label="Name"
//             value={name}
//             onChangeText={setName}
//             mode="outlined"
//             style={styles.input}
//             theme={{
//               colors: {
//                 text: "#black", // user-typed text color
//                 primary: "#8a2be2", // active border & label color
//                 placeholder: "#888", // label color when inactive
//               },
//             }}
//           />
//           <TextInput
//             label="Phone No."
//             value={number}
//             onChangeText={setNumber}
//             keyboardType="numeric"
//             mode="outlined"
//             style={styles.input}
//             theme={{
//               colors: {
//                 text: "#black", // user-typed text color
//                 primary: "#8a2be2", // active border & label color
//                 placeholder: "#888", // label color when inactive
//               },
//             }}
//           />
//           <TextInput
//             label="Address"
//             value={address}
//             onChangeText={setAddress}
//             mode="outlined"
//             style={styles.input}
//             theme={{
//               colors: {
//                 text: "#black", // user-typed text color
//                 primary: "#8a2be2", // active border & label color
//                 placeholder: "#888", // label color when inactive
//               },
//             }}
//           />
//           <TextInput
//             label="Payment Method"
//             value={paymentMethod}
//             onChangeText={setPaymentMethod}
//             mode="outlined"
//             style={styles.input}
//             theme={{
//               colors: {
//                 text: "#black", // user-typed text color
//                 primary: "#8a2be2", // active border & label color
//                 placeholder: "#888", // label color when inactive
//               },
//             }}
//           />
//           <Button
//             mode="contained"
//             onPress={handleGeneratePDF}
//             style={styles.button}
//             buttonColor="#8a2be2"
//           >
//             Generate PDF
//           </Button>
//         </Card.Content>
//       </Card>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     justifyContent: "center",
//   },
//   card: {
//     padding: 10,
//   },
//   title: {
//     marginBottom: 10,
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   input: {
//     marginBottom: 12,
//   },
//   button: {
//     marginTop: 10,
//     color: "#8a2be2",
//   },
// });

// export default AddDetails;
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

const theme = {
  primary: "#8a2be2",
  primaryDark: "#6A1FBB",
  primaryDeep: "#3D1B6E",
  primaryLight: "#F3EEFF",
  primaryBorder: "rgba(138,43,226,0.2)",
  gold: "#C9A840",
  goldLight: "#F0D060",
  surface: "#FDFBFF",
  bg: "#F7F4FF",
  muted: "#9B84C4",
  white: "#FFFFFF",
};

const PAYMENT_METHODS = [
  { label: "Cash", emoji: "💵" },
  { label: "UPI", emoji: "📲" },
  { label: "Card", emoji: "💳" },
  { label: "NEFT", emoji: "🏦" },
];

// ── Themed labelled input ────────────────────────────────────────
function LabelInput({ label, icon, multiline, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputWrapFocused,
          multiline && {
            minHeight: 72,
            alignItems: "flex-start",
            paddingTop: 10,
          },
        ]}
      >
        {icon && <Text style={styles.inputIcon}>{icon}</Text>}
        <TextInput
          style={[styles.input, multiline && { height: 52 }]}
          placeholderTextColor={theme.muted}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>
    </View>
  );
}

const AddDetails = ({ route }) => {
  const navigation = useNavigation();
  const { items, finalamount, includeGST, includeSGST, beforeGSTCharge } =
    route.params;

  const [name, setName] = useState("");
  const [number, setNumber] = useState("(+91) ");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const pct = (p, v) => (p / 100) * v;
  const padNumber = (num, len = 5) => String(num).padStart(len, "0");

  const generateBillNumber = async () => {
    const year = new Date().getFullYear();
    const key = `billCount-${year}`;
    try {
      const stored = await AsyncStorage.getItem(key);
      const count = stored ? parseInt(stored) + 1 : 1;
      await AsyncStorage.setItem(key, count.toString());
      return `${year}${padNumber(count)}`;
    } catch {
      return null;
    }
  };

  const TheItemTotal = () => items.reduce((acc, i) => acc + i.totalamount, 0);

  const generateInvoiceHTML = async () => {
    try {
      const today = new Date();
      const htmlAsset = Asset.fromModule(
        require("@/assets/templates/invoice.html"),
      );
      await htmlAsset.downloadAsync();
      const htmlContent = await FileSystem.readAsStringAsync(
        htmlAsset.localUri,
      );

      const GST = () =>
        includeGST
          ? pct(3.0, beforeGSTCharge).toFixed(2)
          : includeSGST
            ? pct(1.5, beforeGSTCharge).toFixed(2)
            : "0.00";

      const itemRows = items
        .map(
          (item, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${item.itemname}</td>
          <td>${item.HUID}</td>
          <td>${item.purity}</td>
          <td>${item.weight}g</td>
          <td>Rs ${item.rate}</td>
          <td>${item.makingCharges}%</td>
          <td>Rs ${item.totalamount.toFixed(2)}</td>
        </tr>`,
        )
        .join("");

      const SGSTRows = includeSGST
        ? `<tr><th>CGST 1.5%</th><td>Rs ${GST()}</td></tr>
           <tr><th>SGST 1.5%</th><td>Rs ${GST()}</td></tr>`
        : `<tr><th>IGST</th><td>Rs ${GST()}</td></tr>`;

      const billNumber = await generateBillNumber();
      const d = today.getDate(),
        m = today.getMonth() + 1,
        y = today.getFullYear();

      return htmlContent
        .replace("{{custName}}", name || "N/A")
        .replace("{{PhoneNumber}}", number || "N/A")
        .replace("{{Address}}", address || "N/A")
        .replace("{{PaymentMethod}}", paymentMethod)

        .replace("{{date}}", d)
        .replace("{{month}}", m)
        .replace("{{year}}", y)
        .replace("{{followedyear}}", Number(y.toString().slice(-2)) + 1)
        .replace("{{Paydate}}", d)
        .replace("{{Paymonth}}", m)
        .replace("{{Payyear}}", y)
        .replace("{{items}}", itemRows)
        .replace("{{total_amount}}", TheItemTotal().toFixed(2))
        .replace("{{IGST}}", SGSTRows)
        .replace("{{finalamount}}", finalamount.toFixed(2));
    } catch {
      return "<h1>Error loading invoice</h1>";
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const html = await generateInvoiceHTML();
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (e) {
      console.error("PDF error:", e);
    }
  };

  const itemCount = items.length;
  const gstLabel = includeGST
    ? "IGST 3%"
    : includeSGST
      ? "SGST 1.5%"
      : "No GST";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />

      {/* ── Bill summary strip ── */}
      <View style={styles.summaryStrip}>
        <View>
          <Text style={styles.stripLabel}>BILL TOTAL</Text>
          <Text style={styles.stripValue}>₹{finalamount.toFixed(2)}</Text>
          <Text style={styles.stripSub}>
            {itemCount} item{itemCount !== 1 ? "s" : ""} · {gstLabel}
          </Text>
        </View>
        <View style={styles.stripBadge}>
          <Text style={styles.stripBadgeText}>✦ Draft</Text>
        </View>
      </View>

      {/* ── Customer info ── */}
      <Text style={styles.sectionTitle}>CUSTOMER INFORMATION</Text>

      <LabelInput
        label="Full Name"
        icon="👤"
        placeholder="Customer name"
        value={name}
        onChangeText={setName}
      />
      <LabelInput
        label="Phone Number"
        icon="📞"
        placeholder="(+91) XXXXX XXXXX"
        value={number}
        onChangeText={setNumber}
        keyboardType="phone-pad"
      />
      <LabelInput
        label="Address"
        icon="📍"
        placeholder="Street, City, State..."
        value={address}
        onChangeText={setAddress}
        multiline
      />

      {/* ── Payment method ── */}
      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>

      <View style={styles.payGrid}>
        {PAYMENT_METHODS.map((method) => {
          const selected = paymentMethod === method.label;
          return (
            <TouchableOpacity
              key={method.label}
              style={[styles.payOption, selected && styles.payOptionSelected]}
              onPress={() => setPaymentMethod(method.label)}
              activeOpacity={0.8}
            >
              <View style={[styles.payDot, selected && styles.payDotSelected]}>
                {selected && <View style={styles.payDotInner} />}
              </View>
              <Text
                style={[styles.payLabel, selected && styles.payLabelSelected]}
              >
                {method.emoji} {method.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Actions ── */}
      <TouchableOpacity
        style={styles.pdfBtn}
        onPress={handleGeneratePDF}
        activeOpacity={0.85}
      >
        <Text style={styles.pdfBtnText}>⬇ Generate PDF & Print</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}>
        <Text style={styles.saveBtnText}>✓ Save Bill</Text>
      </TouchableOpacity> */}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default AddDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 14 },

  // Summary strip
  summaryStrip: {
    backgroundColor: theme.primaryDark,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 4,
    overflow: "hidden",
  },
  stripLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  stripValue: {
    fontFamily: "serif",
    fontSize: 26,
    color: theme.goldLight,
    fontWeight: "700",
  },
  stripSub: { fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 3 },
  stripBadge: {
    backgroundColor: "rgba(240,208,96,0.15)",
    borderWidth: 1,
    borderColor: "rgba(240,208,96,0.3)",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  stripBadgeText: { fontSize: 11, color: theme.goldLight, fontWeight: "500" },

  sectionTitle: {
    fontSize: 10,
    color: theme.muted,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: "rgba(138,43,226,0.12)",
    marginVertical: 16,
  },

  // Input
  inputGroup: { marginBottom: 12 },
  inputLabel: {
    fontSize: 9,
    color: theme.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.primaryLight,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    gap: 8,
  },
  inputWrapFocused: { borderColor: theme.primary, backgroundColor: "#EDE0FF" },
  inputIcon: { fontSize: 15 },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: theme.primaryDeep,
    paddingVertical: 9,
  },

  // Payment
  payGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  payOption: {
    width: "48%",
    backgroundColor: theme.primaryLight,
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.15)",
    borderRadius: 12,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  payOptionSelected: {
    backgroundColor: "rgba(138,43,226,0.1)",
    borderColor: theme.primary,
  },
  payDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(138,43,226,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  payDotSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  payDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.white,
  },
  payLabel: { fontSize: 12, color: theme.primaryDeep, fontWeight: "500" },
  payLabelSelected: { color: theme.primary },

  // Buttons
  pdfBtn: {
    backgroundColor: theme.gold,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  pdfBtnText: { fontSize: 14, fontWeight: "700", color: "#3D2000" },
  saveBtn: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: { fontSize: 14, fontWeight: "500", color: theme.white },
});
