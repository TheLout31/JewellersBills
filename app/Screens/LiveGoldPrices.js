import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

const theme = {
  primary: "#8a2be2",
  primaryDark: "#6A1FBB",
  primaryDeep: "#3D1B6E",
  primaryLight: "#F3EEFF",
  gold: "#C9A840",
  goldLight: "#F0D060",
  surface: "#FDFBFF",
  bg: "#F7F4FF",
  muted: "#9B84C4",
  white: "#FFFFFF",
};

// Per-tola = weight × 11.6638g
const toTola = (pricePerGram) => (pricePerGram * 11.6638).toFixed(0);

const KaratCard = ({ karat, purity, pricePerGram, change, featured }) => {
  const per10g = (pricePerGram * 10).toFixed(0);
  const perTola = toTola(pricePerGram);
  const isUp = parseFloat(change) >= 0;

  if (featured) {
    return (
      <View style={styles.karatCardFeatured}>
        <View style={styles.kCardDecor} />
        <View style={styles.kCardTop}>
          <View style={styles.kBadgeGold}>
            <Text style={styles.kBadgeGoldText}>
              {karat} Karat · {purity}
            </Text>
          </View>
          <View
            style={[styles.kChange, isUp ? styles.changeUp : styles.changeDown]}
          >
            <Text
              style={[styles.kChangeText, { color: isUp ? "#3DB871" : "#D44" }]}
            >
              {isUp ? "▲" : "▼"} {Math.abs(change)}%
            </Text>
          </View>
        </View>
        <Text style={styles.kLabelWhite}>PRICE PER GRAM</Text>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={styles.kPriceGold}>
            ₹
            {Number(pricePerGram).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text style={styles.kUnitWhite}> / g</Text>
        </View>
        <View style={styles.kDividerWhite} />
        <View style={styles.kMetaRow}>
          <Text style={styles.kMetaWhite}>
            Per 10g: ₹{Number(per10g).toLocaleString("en-IN")}
          </Text>
          <Text style={styles.kMetaWhite}>
            Per tola: ₹{Number(perTola).toLocaleString("en-IN")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.karatCard}>
      <View style={styles.kCardDecorLight} />
      <View style={styles.kCardTop}>
        <View style={styles.kBadgePurple}>
          <Text style={styles.kBadgePurpleText}>
            {karat} Karat · {purity}
          </Text>
        </View>
        <View
          style={[styles.kChange, isUp ? styles.changeUp : styles.changeDown]}
        >
          <Text
            style={[styles.kChangeText, { color: isUp ? "#3DB871" : "#D44" }]}
          >
            {isUp ? "▲" : "▼"} {Math.abs(change)}%
          </Text>
        </View>
      </View>
      <Text style={styles.kLabelMuted}>PRICE PER GRAM</Text>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <Text style={styles.kPricePurple}>
          ₹
          {Number(pricePerGram).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}
        </Text>
        <Text style={styles.kUnitMuted}> / g</Text>
      </View>
      <View style={styles.kDividerPurple} />
      <View style={styles.kMetaRow}>
        <Text style={styles.kMetaMuted}>
          Per 10g: ₹{Number(per10g).toLocaleString("en-IN")}
        </Text>
        <Text style={styles.kMetaMuted}>
          Per tola: ₹{Number(perTola).toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );
};

const LiveGoldPrices = () => {
  const [goldData, setGoldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchGoldPrice = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.goldapi.io/api/XAU/INR/20250407",
        {
          method: "GET",
          headers: {
            "x-access-token": "goldapi-9jjwsm98lvxd5-io",
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      setGoldData(data);
      const now = new Date();
      setLastUpdated(
        `${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`,
      );
    } catch (error) {
      console.error("Error fetching gold price:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice();
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    fetchGoldPrice();
  };

  const changePercent = goldData?.ch
    ? ((goldData.ch / goldData.prev_close_price) * 100).toFixed(2)
    : "0.39";
  const price18k = goldData
    ? ((goldData.price_gram_24k * 18) / 24).toFixed(2)
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
    >
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />

      {/* ── Hero header ── */}
      <View style={styles.hero}>
        <View style={styles.heroDecor1} />
        <View style={styles.heroDecor2} />

        <View style={styles.liveRow}>
          <Text style={styles.heroTitle}>Live Gold Rate</Text>
          <View style={styles.liveChip}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            color={theme.goldLight}
            size="small"
            style={{ marginTop: 12 }}
          />
        ) : goldData ? (
          <View style={styles.heroStats}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroStatLabel}>XAU / INR · 24K</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text style={styles.heroStatValue}>
                  ₹
                  {Number(goldData.price_gram_24k).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </Text>
                <Text style={styles.heroStatUnit}>/g</Text>
              </View>
              <Text style={styles.heroStatSub}>▲ +{changePercent}% today</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={{ flex: 1 }}>
              <Text style={styles.heroStatLabel}>Per Troy Oz</Text>
              <Text style={[styles.heroStatValue, { fontSize: 17 }]}>
                ₹
                {Number(goldData.price).toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
              </Text>
              <Text style={styles.heroStatSub}>XAU/INR</Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        {/* ── Open / High / Low ── */}
        {goldData && (
          <View style={styles.infoRow}>
            {[
              { label: "Open", val: goldData.open_price },
              { label: "High", val: goldData.high_price },
              { label: "Low", val: goldData.low_price },
            ].map(({ label, val }) => (
              <View key={label} style={styles.infoCard}>
                <Text style={styles.infoVal}>
                  ₹
                  {val
                    ? Number(val / 31.1035).toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                      })
                    : "--"}
                </Text>
                <Text style={styles.infoLabel}>{label}</Text>
              </View>
            ))}
          </View>
        )}

        {loading ? (
          <ActivityIndicator
            size="large"
            color={theme.primary}
            style={{ marginTop: 40 }}
          />
        ) : goldData ? (
          <>
            <KaratCard
              karat="24"
              purity="999.9"
              featured
              pricePerGram={goldData.price_gram_24k}
              change={changePercent}
            />
            <KaratCard
              karat="22"
              purity="916"
              pricePerGram={goldData.price_gram_22k}
              change={changePercent}
            />
            <KaratCard
              karat="18"
              purity="750"
              pricePerGram={price18k}
              change={changePercent}
            />

            {/* Trend chart placeholder */}
            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>TODAY'S TREND · 24K</Text>
              {/* Drop in a Victory or Gifted Charts component here */}
              <View style={styles.chartPlaceholder}>
                <Text style={{ color: theme.muted, fontSize: 11 }}>
                  📈 Connect a chart library here
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={fetchGoldPrice}
              activeOpacity={0.85}
            >
              <Text style={styles.refreshBtnText}>↻ Refresh Rates</Text>
            </TouchableOpacity>

            {lastUpdated ? (
              <Text style={styles.timestamp}>
                Last updated: {lastUpdated} · Pull down to refresh
              </Text>
            ) : null}
          </>
        ) : (
          <View style={styles.errorWrap}>
            <Text style={styles.errorEmoji}>⚠</Text>
            <Text style={styles.errorText}>Could not fetch gold prices.</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={fetchGoldPrice}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default LiveGoldPrices;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },

  // Hero
  hero: {
    backgroundColor: theme.primary,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 28,
    overflow: "hidden",
  },
  heroDecor1: {
    position: "absolute",
    top: -40,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(212,175,55,0.13)",
  },
  heroDecor2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heroTitle: {
    fontFamily: "serif",
    fontSize: 20,
    color: theme.white,
    fontWeight: "700",
  },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(127,255,160,0.15)",
    borderWidth: 1,
    borderColor: "rgba(127,255,160,0.35)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#7FFFA0" },
  liveText: {
    fontSize: 9,
    color: "#7FFFA0",
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  heroStats: { flexDirection: "row", gap: 12 },
  heroDivider: {
    width: 0.5,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 2,
  },
  heroStatLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  heroStatValue: {
    fontFamily: "serif",
    fontSize: 22,
    color: theme.goldLight,
    fontWeight: "700",
  },
  heroStatUnit: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
    marginLeft: 2,
  },
  heroStatSub: { fontSize: 9, color: "rgba(255,255,255,0.45)", marginTop: 3 },

  body: { paddingHorizontal: 14, paddingTop: 0 },

  // Open/High/Low
  infoRow: { flexDirection: "row", gap: 8, marginTop: 18, marginBottom: 14 },
  infoCard: {
    flex: 1,
    backgroundColor: "rgba(138,43,226,0.06)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  infoVal: {
    fontFamily: "serif",
    fontSize: 13,
    color: theme.primaryDeep,
    fontWeight: "600",
  },
  infoLabel: {
    fontSize: 8,
    color: theme.muted,
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Karat cards — featured (24K)
  karatCardFeatured: {
    backgroundColor: theme.primaryDark,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    overflow: "hidden",
  },
  // Karat cards — standard
  karatCard: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.15)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    overflow: "hidden",
  },
  kCardDecor: {
    position: "absolute",
    top: -18,
    right: -18,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(212,175,55,0.1)",
  },
  kCardDecorLight: {
    position: "absolute",
    top: -18,
    right: -18,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(138,43,226,0.05)",
  },
  kCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },
  kBadgeGold: {
    backgroundColor: "rgba(212,175,55,0.2)",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  kBadgeGoldText: { fontSize: 10, fontWeight: "600", color: theme.goldLight },
  kBadgePurple: {
    backgroundColor: "rgba(138,43,226,0.1)",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  kBadgePurpleText: { fontSize: 10, fontWeight: "600", color: theme.primary },
  kChange: { borderRadius: 8, paddingVertical: 3, paddingHorizontal: 8 },
  changeUp: { backgroundColor: "rgba(80,220,120,0.12)" },
  changeDown: { backgroundColor: "rgba(220,60,60,0.1)" },
  kChangeText: { fontSize: 9, fontWeight: "700" },
  kLabelWhite: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  kLabelMuted: {
    fontSize: 9,
    color: theme.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  kPriceGold: {
    fontFamily: "serif",
    fontSize: 26,
    color: theme.goldLight,
    fontWeight: "700",
  },
  kPricePurple: {
    fontFamily: "serif",
    fontSize: 26,
    color: theme.primaryDeep,
    fontWeight: "700",
  },
  kUnitWhite: { fontSize: 12, color: "rgba(255,255,255,0.35)" },
  kUnitMuted: { fontSize: 12, color: theme.muted },
  kDividerWhite: {
    height: 0.5,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 9,
  },
  kDividerPurple: {
    height: 0.5,
    backgroundColor: "rgba(138,43,226,0.1)",
    marginVertical: 9,
  },
  kMetaRow: { flexDirection: "row", justifyContent: "space-between" },
  kMetaWhite: { fontSize: 9, color: "rgba(255,255,255,0.4)" },
  kMetaMuted: { fontSize: 9, color: theme.muted },

  // Chart
  chartCard: {
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.1)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 10,
    color: theme.muted,
    letterSpacing: 1,
    marginBottom: 10,
  },
  chartPlaceholder: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(138,43,226,0.04)",
    borderRadius: 10,
  },

  // Buttons
  refreshBtn: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  refreshBtnText: { color: theme.white, fontSize: 14, fontWeight: "500" },
  timestamp: {
    textAlign: "center",
    fontSize: 10,
    color: theme.muted,
    marginTop: 10,
    letterSpacing: 0.5,
  },

  // Error
  errorWrap: { alignItems: "center", paddingTop: 60 },
  errorEmoji: { fontSize: 32, marginBottom: 12 },
  errorText: { fontSize: 14, color: theme.muted, marginBottom: 16 },
  retryBtn: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  retryText: { color: theme.white, fontWeight: "500" },
});
