import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

const theme = {
  primary: "#8a2be2",
  primaryDark: "#6A1FBB",
  primaryDeep: "#3D1B6E",
  primaryLight: "#EDE0FF",
  gold: "#C9A840",
  goldLight: "#FFF3D0",
  goldDark: "#7A5010",
  surface: "#FDFBFF",
  bg: "#F7F4FF",
  muted: "#9B84C4",
  white: "#FFFFFF",
};

export default function Home({ navigation }) {
  const todayStats = [
    { value: "12", label: "Bills Today" },
    { value: "₹4.2L", label: "Revenue" },
    { value: "8", label: "Customers" },
  ];

  const smallCards = [
    {
      label: "My Bills",
      sub: "View history",
      screen: "Orders",
      icon: (
        <View style={styles.scIcon}>
          <Text style={{ fontSize: 16 }}>🧾</Text>
        </View>
      ),
    },
    // {
    //   label: "Customers",
    //   sub: "Manage records",
    //   screen: null,
    //   icon: (
    //     <View style={styles.scIcon}>
    //       <Text style={{ fontSize: 16 }}>👤</Text>
    //     </View>
    //   ),
    // },
  ];

  const currentTime = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) {
      return "Good Morning";
    } else if (hours >= 12 && hours < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          {/* Decorative circles */}
          <View style={styles.headerCircle1} />
          <View style={styles.headerCircle2} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetingSub}>WELCOME BACK</Text>
              <Text style={styles.greetingMain}>{currentTime()}! ✦</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
          </View>

          {/* Gold divider */}
          <View style={styles.goldDivider} />

          {/* Live rate pill */}
          <View style={styles.ratePill}>
            <View style={styles.rateDot} />
            <Text style={styles.rateLabel}>24K Live </Text>
            <Text style={styles.rateValue}>₹7,240/g</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>

          {/* Calculator Card — purple gradient */}
          <TouchableOpacity
            style={[styles.card, styles.cardPrimary]}
            onPress={() => navigation.navigate("Calculator")}
            activeOpacity={0.85}
          >
            <View style={styles.cardIconBox}>
              <Text style={{ fontSize: 20 }}>🧮</Text>
            </View>
            <Text style={[styles.cardLabel, { color: theme.white }]}>
              Calculator & Bill
            </Text>
            <Text style={[styles.cardSub, { color: "rgba(255,255,255,0.6)" }]}>
              Gold, silver & making charges
            </Text>
            <View style={[styles.cardArrow, styles.arrowWhite]}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                ›
              </Text>
            </View>
          </TouchableOpacity>

          {/* Live Rate Card — gold gradient */}
          <TouchableOpacity
            style={[styles.card, styles.cardGold]}
            onPress={() => navigation.navigate("LiveRate")}
            activeOpacity={0.85}
          >
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
            <View style={styles.cardIconBox}>
              <Text style={{ fontSize: 20 }}>📈</Text>
            </View>
            <Text style={[styles.cardLabel, { color: theme.white }]}>
              Live Gold Rate
            </Text>
            <Text style={[styles.cardSub, { color: "rgba(255,255,255,0.6)" }]}>
              Real-time 22K · 24K · Silver
            </Text>
            <View style={[styles.cardArrow, styles.arrowWhite]}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                ›
              </Text>
            </View>
          </TouchableOpacity>

          {/* Small cards row */}
          <View style={styles.rowCards}>
            {smallCards.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.smallCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.scIcon}>
                  <Text style={{ fontSize: 18 }}>{i === 0 ? "🧾" : "👤"}</Text>
                </View>
                <Text style={styles.scLabel}>{item.label}</Text>
                <Text style={styles.scSub}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today's stats */}
          {/* <Text style={[styles.sectionTitle, { marginTop: 4 }]}>
            TODAY'S OVERVIEW
          </Text>
          <View style={styles.statsRow}>
            {todayStats.map((s, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  scroll: { flex: 1 },

  // Header
  header: {
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    overflow: "hidden",
  },
  headerCircle1: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(212,175,55,0.12)",
  },
  headerCircle2: {
    position: "absolute",
    bottom: -25,
    left: -20,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 1,
  },
  greetingSub: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  greetingMain: { fontSize: 20, color: theme.white, fontWeight: "600" },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(212,175,55,0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(212,175,55,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "600", color: "#F0D060" },
  goldDivider: {
    width: 36,
    height: 2,
    backgroundColor: theme.gold,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 14,
  },
  ratePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(212,175,55,0.15)",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.3)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 6,
  },
  rateDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#7FFFA0",
  },
  rateLabel: { fontSize: 11, color: "#F0D060", fontWeight: "500" },
  rateValue: { fontSize: 13, color: "#F0D060", fontWeight: "700" },

  // Body
  body: { paddingHorizontal: 16, paddingTop: 20 },
  sectionTitle: {
    fontSize: 10,
    color: theme.muted,
    letterSpacing: 1.5,
    marginBottom: 14,
  },

  // Big cards
  card: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  cardPrimary: { backgroundColor: theme.primaryDark }, // use a gradient lib for actual gradient
  cardGold: { backgroundColor: theme.goldDark },
  cardIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardLabel: { fontSize: 17, fontWeight: "600", marginBottom: 4 },
  cardSub: { fontSize: 12 },
  cardArrow: {
    position: "absolute",
    right: 16,
    top: "50%",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowWhite: { backgroundColor: "rgba(255,255,255,0.15)" },
  liveBadge: {
    position: "absolute",
    top: 14,
    right: 54,
    backgroundColor: "rgba(127,255,160,0.2)",
    borderWidth: 1,
    borderColor: "rgba(127,255,160,0.4)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  liveBadgeText: {
    fontSize: 9,
    color: "#7FFFA0",
    fontWeight: "600",
    letterSpacing: 1,
  },

  // Small cards
  rowCards: { flexDirection: "row", gap: 10, marginBottom: 20 },
  smallCard: {
    flex: 1,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.13)",
    borderRadius: 16,
    padding: 14,
  },
  scIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: theme.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  scLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.primaryDeep,
    marginBottom: 2,
  },
  scSub: { fontSize: 10, color: theme.muted },

  // Stats
  statsRow: { flexDirection: "row", gap: 8 },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(138,43,226,0.07)",
    borderRadius: 14,
    padding: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.primaryDeep,
    marginBottom: 2,
  },
  statLabel: { fontSize: 9, color: theme.muted },
});
