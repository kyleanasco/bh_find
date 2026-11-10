import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../constants/theme';

type Mode = 'login' | 'signup';

const CITIES = [
  'Lapasan, Cagayan De Oro',
  'Carmen, Cagayan De Oro',
  'Nazareth, Cagayan De Oro',
  'Bonbon, Cagayan De Oro',
  'Manolo Fortich, Bukidnon',
  'Malaybalay City, Bukidnon',
];

export default function AuthScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const handleLogin = () => {
  // TODO: check credentials with your backend first
  console.log('Login', { identifier, password, keepLoggedIn });
  router.replace('/tabs/search');
};

const handleSignup = () => {
  // TODO: create the account with your backend first
  console.log('Signup', { fullName, city, email, newPassword, confirmPassword, agree });
  router.replace('/tabs/search');
};
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}
          <View style={styles.brand}>
            <View style={styles.logoBox}>
              <Ionicons name="home" size={34} color={colors.primary} />
            </View>
            <Text style={styles.title}>BeeHaws Finder</Text>
            <Text style={styles.tagline}>Find your next room, faster!</Text>
            <Text style={styles.subtitle}>
              Connect with verified rooms, private pads, and boarding houses.
            </Text>
          </View>

          {/* Log in / Sign up toggle */}
          <View style={styles.tabTrack}>
            <Pressable
              style={[styles.tab, mode === 'login' && styles.tabActive]}
              onPress={() => setMode('login')}
            >
              <Ionicons
                name="log-in-outline"
                size={18}
                color={mode === 'login' ? colors.text : colors.textMuted}
              />
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                Log in
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, mode === 'signup' && styles.tabActive]}
              onPress={() => setMode('signup')}
            >
              <Ionicons
                name="person-add-outline"
                size={18}
                color={mode === 'signup' ? colors.text : colors.textMuted}
              />
              <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                Sign up
              </Text>
            </Pressable>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            {mode === 'login' ? (
              <>
                <Label icon="mail-outline" text="Email or Username" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., kyleanasco@email.com"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={identifier}
                  onChangeText={setIdentifier}
                />

                <View style={styles.labelRow}>
                  <Label icon="lock-closed-outline" text="Password" />
                  <Pressable onPress={() => router.push('/forgot_pass')}>
                    <Text style={styles.link}>Forgot password?</Text>
                  </Pressable>
                </View>
                <PasswordInput
                  value={password}
                  onChangeText={setPassword}
                  visible={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                  placeholder="Password"
                />

                <Checkbox
                  checked={keepLoggedIn}
                  onToggle={() => setKeepLoggedIn((v) => !v)}
                  style={{ marginTop: 16 }}
                >
                  <Text style={styles.checkText}>Keep me logged in on this device</Text>
                </Checkbox>

                <PrimaryButton title="Log in" onPress={handleLogin} />
              </>
            ) : (
              <>
                <Label icon="person-outline" text="Full Name" />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Kyle Anasco"
                  placeholderTextColor={colors.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Label icon="location-outline" text="City / Area" style={{ marginTop: 16 }} />
                <Pressable style={[styles.input, styles.select]} onPress={() => setCityOpen(true)}>
                  <Text style={{ color: city ? colors.text : colors.textMuted, fontSize: 15 }}>
                    {city || 'e.g., Cagayan De Oro, Misamis Oriental'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
                </Pressable>

                <Label icon="mail-outline" text="Email Address" style={{ marginTop: 16 }} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., kyleanasco@email.com"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <Text style={styles.hint}>Enter your personal email address</Text>

                <Label icon="lock-closed-outline" text="Create Password" style={{ marginTop: 16 }} />
                <PasswordInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  visible={showNew}
                  onToggle={() => setShowNew((v) => !v)}
                  placeholder="At least 8 characters"
                />
                <Text style={styles.hint}>Must be 8+ characters with numbers or symbols</Text>

                <Label icon="refresh-circle-outline" text="Confirm Password" style={{ marginTop: 16 }} />
                <PasswordInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  visible={showConfirm}
                  onToggle={() => setShowConfirm((v) => !v)}
                  placeholder="Confirm your password"
                />

                <Checkbox checked={agree} onToggle={() => setAgree((v) => !v)} style={{ marginTop: 16 }}>
                  <Text style={styles.checkText}>
                    I agree to the <Text style={styles.underline}>Terms of Service</Text> &{' '}
                    <Text style={styles.underline}>Safety Guidelines</Text>
                  </Text>
                </Checkbox>

                <PrimaryButton title="Create account" onPress={handleSignup} />
              </>
            )}

            {/* Social login */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            <Pressable style={styles.socialBtn} onPress={() => console.log('Google')}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialText}>Continue with Google</Text>
            </Pressable>
            <Pressable style={styles.socialBtn} onPress={() => console.log('Facebook')}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text style={styles.socialText}>Continue with Facebook</Text>
            </Pressable>
          </View>

          {/* Trust badge */}
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.badgeText} />
            <Text style={styles.badgeText}>
              Verified tenant community with accredited landlord listings
            </Text>
          </View>

          <Text style={styles.footer}>
            By continuing, you agree to our <Text style={styles.underline}>Terms</Text> and{' '}
            <Text style={styles.underline}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* City picker */}
      <Modal visible={cityOpen} transparent animationType="fade" onRequestClose={() => setCityOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setCityOpen(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select your city / area</Text>
            {CITIES.map((c) => (
              <Pressable
                key={c}
                style={styles.modalItem}
                onPress={() => {
                  setCity(c);
                  setCityOpen(false);
                }}
              >
                <Text style={styles.modalItemText}>{c}</Text>
                {city === c && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}



function Label({
  icon,
  text,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  style?: object;
}) {
  return (
    <View style={[styles.label, style]}>
      <Ionicons name={icon} size={14} color={colors.primaryDark} />
      <Text style={styles.labelText}>{text}</Text>
    </View>
  );
}

function PasswordInput({
  value,
  onChangeText,
  visible,
  onToggle,
  placeholder,
}: {
  value: string;
  onChangeText: (t: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
}) {
  return (
    <View style={[styles.input, styles.passwordWrap]}>
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={!visible}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
      />
      <Pressable onPress={onToggle} hitSlop={10}>
        <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

function Checkbox({
  checked,
  onToggle,
  children,
  style,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <Pressable style={[styles.checkRow, style]} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color={colors.white} />}
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </Pressable>
  );
}

function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]} onPress={onPress}>
      <Text style={styles.primaryBtnText}>{title}</Text>
      <Ionicons name="arrow-forward" size={18} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingBottom: 32 },

  brand: { alignItems: 'center', marginTop: 8, marginBottom: 20 },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: { fontFamily: fonts.heading, fontSize: 28, fontWeight: '700', color: colors.text, marginTop: 12 },
  tagline: { color: colors.primary, fontWeight: '700', fontSize: 16, marginTop: 8 },
  subtitle: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: 6, paddingHorizontal: 12 },

  tabTrack: {
    flexDirection: 'row',
    backgroundColor: colors.tabTrack,
    borderRadius: radius.pill,
    padding: 5,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  tabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabText: { color: colors.textMuted, fontSize: 14, fontWeight: '500' },
  tabTextActive: { color: colors.text, fontWeight: '700' },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  label: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  labelText: { fontSize: 13, fontWeight: '700', color: colors.text },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  link: { color: colors.primaryDark, fontSize: 12, fontWeight: '700', marginBottom: 8 },

  input: {
    backgroundColor: colors.input,
    borderRadius: radius.input,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: colors.text,
  },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  passwordWrap: { flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, fontSize: 15, color: colors.text, height: '100%' },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 6 },

  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.primaryDark },
  checkText: { fontSize: 13, color: colors.text },
  underline: { textDecorationLine: 'underline' },

  primaryBtn: {
    marginTop: 20,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5 },

  socialBtn: {
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.input,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  socialText: { fontSize: 14, fontWeight: '700', color: colors.text },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.badgeBg,
    borderRadius: radius.input,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  badgeText: { flex: 1, fontSize: 12, fontWeight: '700', color: colors.badgeText, textAlign: 'center' },

  footer: { textAlign: 'center', fontSize: 13, color: colors.textMuted, marginTop: 14, lineHeight: 20 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalSheet: { backgroundColor: colors.white, borderRadius: radius.card, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  modalItem: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: { fontSize: 15, color: colors.text },
});
