import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { ToastAndroid } from "react-native";

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

// ── Labelled input ───────────────────────────────────────────────
function AuthInput({ label, icon, secureTextEntry, ...props }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <Text style={styles.inputIconEmoji}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.muted}
          secureTextEntry={secureTextEntry && !showPass}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Text style={styles.eyeIcon}>{showPass ? "🙈" : "👁"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const auth = getAuth();

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        ToastAndroid.show(
          "Account created! Please sign in.",
          ToastAndroid.SHORT,
        );
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate("Home");
      }
    } catch (error) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor={theme.primary} barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Purple hero top ── */}
        <View style={styles.topHalf}>
          <View style={styles.decor1} />
          <View style={styles.decor2} />
          <View style={styles.decor3} />

          <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <Text style={{ fontSize: 26 }}>💎</Text>
            </View>
            <Text style={styles.brandName}>JewelBill</Text>
            <Text style={styles.brandSub}>JEWELLER'S SUITE</Text>
            <View style={styles.goldLine} />
          </View>
        </View>

        {/* ── White card body ── */}
        <View style={styles.cardBody}>
          {/* Tab switcher */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, !isSignUp && styles.tabActive]}
              onPress={() => setIsSignUp(false)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, isSignUp && styles.tabActive]}
              onPress={() => setIsSignUp(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>
            {isSignUp ? "Create your account" : "Welcome back ✦"}
          </Text>
          <Text style={styles.welcomeSub}>
            {isSignUp
              ? "Start managing your jewellery bills"
              : "Sign in to continue to your dashboard"}
          </Text>

          {/* Inputs */}
          <View style={{ marginTop: 20 }}>
            <AuthInput
              label="Email Address"
              icon="✉️"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <AuthInput
              label="Password"
              icon="🔒"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Forgot password — only on sign in */}
          {!isSignUp && (
            <TouchableOpacity style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Main CTA */}
          <TouchableOpacity
            style={styles.authBtn}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading ? (
              <ActivityIndicator color={theme.white} />
            ) : (
              <Text style={styles.authBtnText}>
                {isSignUp ? "Create Account  →" : "Sign In  →"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          {/* <View style={styles.dividerRow}>
            <View style={styles.divLine} />
            <Text style={styles.divText}>or continue with</Text>
            <View style={styles.divLine} />
          </View> */}

          {/* Google button */}
          {/* <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
            <Text style={{ fontSize: 18 }}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity> */}

          {/* Toggle */}
          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
            <Text style={styles.toggleText}>
              {isSignUp
                ? "Already have an account?  "
                : "Don't have an account?  "}
              <Text style={styles.toggleLink}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.primary },

  // Hero top
  topHalf: {
    backgroundColor: theme.primary,
    paddingTop: 56,
    paddingBottom: 52,
    alignItems: "center",
    overflow: "hidden",
  },
  decor1: {
    position: "absolute",
    top: -50,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(212,175,55,0.14)",
  },
  decor2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  decor3: {
    position: "absolute",
    top: 20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(212,175,55,0.07)",
  },
  brand: { alignItems: "center" },
  brandIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  brandName: {
    fontFamily: "serif",
    fontSize: 26,
    color: theme.white,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  brandSub: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 2.5,
    marginTop: 4,
  },
  goldLine: {
    width: 40,
    height: 2,
    backgroundColor: theme.gold,
    borderRadius: 2,
    marginTop: 12,
  },

  // Card
  cardBody: {
    backgroundColor: theme.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 36,
    flex: 1,
  },

  // Tab switcher
  tabRow: {
    flexDirection: "row",
    backgroundColor: "rgba(138,43,226,0.07)",
    borderRadius: 14,
    padding: 3,
    marginBottom: 22,
  },
  tab: { flex: 1, borderRadius: 11, paddingVertical: 10, alignItems: "center" },
  tabActive: { backgroundColor: theme.primary },
  tabText: { fontSize: 13, fontWeight: "500", color: theme.muted },
  tabTextActive: { color: theme.white },

  // Welcome text
  welcomeText: {
    fontFamily: "serif",
    fontSize: 20,
    color: theme.primaryDeep,
    fontWeight: "700",
    marginBottom: 4,
  },
  welcomeSub: { fontSize: 12, color: theme.muted },

  // Inputs
  inputGroup: { marginBottom: 13 },
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
    gap: 8,
  },
  inputWrapFocused: { borderColor: theme.primary, backgroundColor: "#EDE0FF" },
  inputIconEmoji: { fontSize: 15 },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: theme.primaryDeep,
    paddingVertical: 11,
  },
  eyeIcon: { fontSize: 15, paddingLeft: 4 },

  // Forgot
  forgotWrap: { alignItems: "flex-end", marginTop: -4, marginBottom: 18 },
  forgotText: { fontSize: 11, color: theme.primary, fontWeight: "500" },

  // Auth button
  authBtn: {
    backgroundColor: theme.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 18,
  },
  authBtnText: {
    color: theme.white,
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  divLine: { flex: 1, height: 0.5, backgroundColor: "rgba(138,43,226,0.12)" },
  divText: { fontSize: 10, color: theme.muted },

  // Google
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: "rgba(138,43,226,0.18)",
    borderRadius: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  googleBtnText: { fontSize: 13, fontWeight: "500", color: theme.primaryDeep },

  // Toggle
  toggleText: {
    textAlign: "center",
    fontSize: 12,
    color: theme.muted,
  },
  toggleLink: { color: theme.primary, fontWeight: "600" },
});
