import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { database, auth } from "@/Firebase/FirebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

const theme = {
  primary: "#8a2be2",
  primaryDark: "#6A1FBB",
  primaryDeep: "#3D1B6E",
  primaryLight: "#F3EEFF",
  primaryBorder: "rgba(138,43,226,0.13)",
  gold: "#C9A840",
  goldLight: "#F0D060",
  surface: "#FDFBFF",
  bg: "#F7F4FF",
  muted: "#9B84C4",
  white: "#FFFFFF",
};

const FILTERS = ["All", "Today", "This Week", "Paid"];

// ── Initials avatar ──────────────────────────────────────────────
function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  const isGold = initials.charCodeAt(0) % 2 === 0;
  return (
    <View
      style={[styles.avatar, isGold ? styles.avatarGold : styles.avatarPurple]}
    >
      <Text
        style={[
          styles.avatarText,
          { color: isGold ? theme.gold : theme.primary },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
}

// ── Single order card ────────────────────────────────────────────
const OrderCard = ({ order, onDownload }) => {
  const date = order.date
    ? new Date(order.date?.seconds * 1000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <View style={styles.orderCard}>
      {/* Left accent bar */}
      <View style={styles.accentBar} />

      {/* Top row */}
      <View style={styles.cardTop}>
        <Avatar name={order.name} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{order.name || "Unknown"}</Text>
          <Text style={styles.cardBillNum}>
            Bill #{order.billNumber || order.id?.slice(0, 8)} · {date}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => onDownload(order.billHTML)}
          activeOpacity={0.8}
        >
          <Text style={styles.downloadIcon}>⬇</Text>
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={styles.cardDetails}>
        {order.number ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📞</Text>
            <Text style={styles.detailText}>{order.number}</Text>
          </View>
        ) : null}
        {order.address ? (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {order.address}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.cardAmount}>
          ₹{order.finalamount?.toFixed(2) ?? "0.00"}
        </Text>
        <View style={styles.cardFooterRight}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Paid</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const MyOrders = () => {
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const printToFile = async (html) => {
    try {
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
    } catch (e) {
      console.error("PDF error:", e);
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const col = collection(database, "users", user.uid, "orders");
        const data = await getDocs(col);
        setOrdersList(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = ordersList.filter(
    (o) =>
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.number?.includes(search),
  );

  const totalRevenue = ordersList
    .reduce((sum, o) => sum + (o.finalamount || 0), 0)
    .toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const ListHeader = () => (
    <View>
      {/* Stats strip */}
      <View style={styles.statsRow}>
        {[
          { label: "This Month", value: `₹${totalRevenue}` },
          { label: "Total Bills", value: String(ordersList.length) },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
          </View>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor={theme.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>
        {filtered.length} ORDER{filtered.length !== 1 ? "S" : ""}
      </Text>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyWrap}>
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <>
          <Text style={styles.emptyEmoji}>🧾</Text>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            Your saved bills will appear here
          </Text>
        </>
      )}
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <OrderCard order={item} onDownload={printToFile} />
        )}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={<ListEmpty />}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingBottom: 40,
    backgroundColor: theme.bg,
  },

  // Stats
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14, marginTop: 16 },
  statCard: {
    flex: 1,
    backgroundColor: theme.primaryDark,
    borderRadius: 14,
    padding: 12,
  },
  statLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "serif",
    fontSize: 18,
    color: theme.goldLight,
    fontWeight: "700",
  },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.primaryLight,
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.18)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: { fontSize: 13 },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: theme.primaryDeep,
    paddingVertical: 9,
    fontWeight: "500",
  },

  // Filters
  filterRow: { flexDirection: "row", gap: 7, marginBottom: 16 },
  filterChip: {
    backgroundColor: theme.primaryLight,
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.15)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  filterChipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  filterText: { fontSize: 11, color: theme.muted, fontWeight: "500" },
  filterTextActive: { color: theme.white },

  sectionLabel: {
    fontSize: 9,
    color: theme.muted,
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  // Order card
  orderCard: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.primaryBorder,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: theme.primary,
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarPurple: { backgroundColor: "rgba(138,43,226,0.1)" },
  avatarGold: { backgroundColor: "rgba(201,168,64,0.12)" },
  avatarText: { fontSize: 13, fontWeight: "700" },
  cardInfo: { flex: 1, marginLeft: 10 },
  cardName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.primaryDeep,
    marginBottom: 2,
  },
  cardBillNum: { fontSize: 9, color: theme.muted, letterSpacing: 0.3 },
  downloadBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadIcon: { fontSize: 14 },

  // Details
  cardDetails: {
    flexDirection: "column",
    gap: 4,
    marginBottom: 10,
    paddingLeft: 2,
  },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailIcon: { fontSize: 11 },
  detailText: { fontSize: 12, color: "#6B5B8C", flex: 1 },

  // Footer
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(138,43,226,0.08)",
    paddingTop: 10,
  },
  cardAmount: {
    fontFamily: "serif",
    fontSize: 17,
    color: theme.primary,
    fontWeight: "700",
  },
  cardFooterRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusBadge: {
    backgroundColor: "rgba(60,180,100,0.1)",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  statusText: { fontSize: 9, color: "#2E7D4F", fontWeight: "700" },

  // Empty
  emptyWrap: { alignItems: "center", paddingTop: 60 },
  emptyEmoji: { fontSize: 36, marginBottom: 12 },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.primaryDeep,
    marginBottom: 6,
  },
  emptyText: { fontSize: 13, color: theme.muted },
});
