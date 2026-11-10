import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../../constants/theme';

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.sub}>Your conversations with landlords will show up here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontFamily: fonts.heading, fontSize: 28, fontWeight: '700', color: colors.text },
  sub: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
});
