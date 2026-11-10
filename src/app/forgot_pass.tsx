import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
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

type Method = 'email' | 'sms';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const goToLogin = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const handleSend = () => {
    // TODO: connect to your backend
    console.log('Reset request', method === 'email' ? { email } : { phone });
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
          <Pressable onPress={goToLogin} hitSlop={10}>
            <Text style={styles.back}>← Return to Login</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              No worries! Enter your {method === 'email' ? 'email or registered username' : 'mobile number'},
              and we'll send you instructions to reset your password.
            </Text>
          </View>

          {/* Email / SMS toggle */}
          <View style={styles.tabTrack}>
            <Pressable
              style={[styles.tab, method === 'email' && styles.tabActive]}
              onPress={() => setMethod('email')}
            >
              <Text style={[styles.tabText, method === 'email' && styles.tabTextActive]}>Email</Text>
            </Pressable>
            <Pressable
              style={[styles.tab, method === 'sms' && styles.tabActive]}
              onPress={() => setMethod('sms')}
            >
              <Text style={[styles.tabText, method === 'sms' && styles.tabTextActive]}>
                SMS / Mobile
              </Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            {method === 'email' ? (
              <>
                <Text style={styles.label}>Email or Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., kyleanasco@email.com"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
                <Text style={styles.hint}>Must be the email linked to your account</Text>
              </>
            ) : (
              <>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 0917 123 4567"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
                <Text style={styles.hint}>Must be the number linked to your account</Text>
              </>
            )}

            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.85 }]}
              onPress={handleSend}
            >
              <Text style={styles.primaryBtnText}>
                {method === 'email' ? 'Send Reset Link' : 'Send Code'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>
            Remember your password?{' '}
            <Text style={styles.footerLink} onPress={goToLogin}>
              Log in
            </Text>
          </Text>

          <Text style={styles.help}>Need help? Contact Customer Support</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingBottom: 32 },

  back: { fontSize: 14, fontWeight: '700', color: colors.text },

  header: { alignItems: 'center', marginTop: 36, marginBottom: 24 },
  title: { fontFamily: fonts.heading, fontSize: 28, fontWeight: '700', color: colors.text },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
    paddingHorizontal: 12,
  },

  tabTrack: {
    flexDirection: 'row',
    backgroundColor: colors.tabTrack,
    borderRadius: radius.pill,
    padding: 5,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

  label: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 },
  input: {
    backgroundColor: colors.input,
    borderRadius: radius.input,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: colors.text,
  },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 6 },

  primaryBtn: {
    marginTop: 20,
    height: 54,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },

  footer: { textAlign: 'center', fontSize: 14, color: colors.textMuted, marginTop: 24 },
  footerLink: { color: colors.primaryDark, fontWeight: '700' },
  help: { textAlign: 'center', fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 14 },
});
