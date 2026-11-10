import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
    ImageSourcePropType,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../../constants/theme';

const GREEN = '#3F5A3A';
const GOLD = '#9A6B00';
const YELLOW = '#F2B63C';
const RED = '#B3261E';

type Tag = { label: string; tone?: 'green' | 'yellow' };

type Saved = {
  id: string;
  name: string;
  price: number;
  badge: string;
  badgeColor: string;
  walk: string;
  walkMins: number;
  solo: boolean;
  noCurfew: boolean;
  details: string;
  tags: Tag[];
  actions: 'booking' | 'tour' | 'details';
  image?: ImageSourcePropType; // e.g. require('../../../assets/images/room1.jpg')
};

const SAVED: Saved[] = [
  {
    id: '1',
    name: 'Katipunan Hearth Residence',
    price: 6500,
    badge: '2 rooms left',
    badgeColor: '#8E3B1F',
    walk: '5 min walk to Central Plaza',
    walkMins: 5,
    solo: false,
    noCurfew: true,
    details: 'Bgy. Loyola Heights • 2-Bed Shared • Semi-furnished',
    tags: [
      { label: 'No Curfew', tone: 'green' },
      { label: 'Backup Generator' },
      { label: 'Study Lounge', tone: 'yellow' },
    ],
    actions: 'booking',
  },
  {
    id: '2',
    name: 'Casa Acacia Student House',
    price: 4800,
    badge: 'Available now',
    badgeColor: GREEN,
    walk: '8 min walk to Metro Station',
    walkMins: 8,
    solo: true,
    noCurfew: false,
    details: 'Esteban Abada St. • Solo Room • Quiet Wing • Inclusive',
    tags: [
      { label: 'Solo Privacy', tone: 'yellow' },
      { label: '10 PM Curfew' },
      { label: 'Free Purified Water', tone: 'green' },
    ],
    actions: 'tour',
  },
  {
    id: '3',
    name: 'Verde Haven Dormitory',
    price: 5200,
    badge: '1 room left',
    badgeColor: '#7A6A12',
    walk: '12 min walk to Downtown Bus Stop',
    walkMins: 12,
    solo: false,
    noCurfew: true,
    details: 'Xavierville Ave • 2-Bed Shared • Solar Powered • Rooftop',
    tags: [
      { label: 'Solar Backup', tone: 'green' },
      { label: 'No Curfew' },
      { label: 'Biometric Entry' },
    ],
    actions: 'details',
  },
];

/* ---------- Comparison matrix data ---------- */

type Cell = { text: string; tone?: 'good' | 'warn' | 'bad' | 'price' };

const MATRIX_COLS = [
  { name: 'Katipunan', sub: 'Fastest walk', color: colors.primary },
  { name: 'Casa Acacia', sub: 'Solo budget', color: GOLD },
  { name: 'Verde Haven', sub: 'Eco-friendly', color: GREEN },
];

const MATRIX_ROWS: { label: string; icon: keyof typeof Ionicons.glyphMap; cells: Cell[] }[] = [
  {
    label: 'Rent',
    icon: 'cash-outline',
    cells: [
      { text: '₱6,500/mo', tone: 'price' },
      { text: '₱4,800/mo', tone: 'price' },
      { text: '₱5,200/mo', tone: 'price' },
    ],
  },
  {
    label: 'Walk',
    icon: 'walk',
    cells: [{ text: '5 mins', tone: 'good' }, { text: '8 mins' }, { text: '12 mins' }],
  },
  {
    label: 'Room',
    icon: 'bed-outline',
    cells: [{ text: '2-Bed Shared' }, { text: 'Solo Pod', tone: 'warn' }, { text: '2-Bed Shared' }],
  },
  {
    label: 'Curfew',
    icon: 'lock-closed-outline',
    cells: [{ text: 'No curfew', tone: 'good' }, { text: '10:00 PM', tone: 'bad' }, { text: 'No curfew', tone: 'good' }],
  },
  {
    label: 'Power',
    icon: 'flash-outline',
    cells: [{ text: 'GenSet (Full)' }, { text: 'GenSet (Lights)' }, { text: 'Solar Inverter' }],
  },
  {
    label: 'Deposit',
    icon: 'wallet-outline',
    cells: [{ text: '1 mo adv' }, { text: '2 mos adv' }, { text: '1 mo adv' }],
  },
];

const FEATURE_W = 92;
const COL_W = 96;

const toneColor = (tone?: Cell['tone']) => {
  switch (tone) {
    case 'good':
      return GREEN;
    case 'warn':
      return GOLD;
    case 'bad':
      return RED;
    case 'price':
      return colors.primaryDark;
    default:
      return colors.text;
  }
};

const FILTERS = [
  { key: 'all', label: 'All Saved' },
  { key: 'walk', label: 'Walking < 10 mins' },
  { key: 'solo', label: 'Solo Room' },
  { key: 'curfew', label: 'No Curfew' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

const peso = (n: number) => `₱${n.toLocaleString('en-US')}`;

export default function SavedScreen() {
  const [savedIds, setSavedIds] = useState<string[]>(SAVED.map((s) => s.id));
  const [filter, setFilter] = useState<FilterKey>('all');

  const savedItems = SAVED.filter((s) => savedIds.includes(s.id));
  const visible = savedItems.filter((s) => {
    if (filter === 'walk') return s.walkMins < 10;
    if (filter === 'solo') return s.solo;
    if (filter === 'curfew') return s.noCurfew;
    return true;
  });

  const unsave = (id: string) => setSavedIds((prev) => prev.filter((x) => x !== id));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <Ionicons name="home" size={22} color={colors.primary} />
            <Text style={styles.brandText}>BeeHaws</Text>
          </View>
          <View style={styles.topRight}>
            <Pressable hitSlop={10}>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
            </Pressable>
            <View style={styles.avatar}>
              <Ionicons name="person" size={18} color={colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Title + Compare */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.title}>Saved Places</Text>
            <View style={styles.countBubble}>
              <Text style={styles.countBubbleText}>{savedItems.length}</Text>
            </View>
          </View>
          <Pressable
            style={styles.compareBtn}
            onPress={() => console.log('Compare', savedIds)}
          >
            <Ionicons name="git-compare-outline" size={16} color={colors.text} />
            <Text style={styles.compareText}>Compare ({savedItems.length})</Text>
          </Pressable>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <Pressable
                key={f.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilter(f.key)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f.label}
                  {f.key === 'all' ? ` (${savedItems.length})` : ''}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Side-by-side matrix */}
        <View style={styles.matrixPanel}>
          <View style={styles.matrixHeader}>
            <View style={styles.matrixIcon}>
              <Ionicons name="scale-outline" size={18} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.matrixTitle}>Side-by-Side Matrix</Text>
              <Text style={styles.matrixSub}>Swipe horizontally to evaluate differences</Text>
            </View>
            <View style={styles.liveRow}>
              <Text style={styles.liveText}>Live{'\n'}Match</Text>
              <Ionicons name="flash" size={12} color={colors.primary} />
            </View>
          </View>

          <View style={styles.matrixCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                {/* Column headers */}
                <View style={styles.mRow}>
                  <View style={[styles.mFeature, { justifyContent: 'center' }]}>
                    <Text style={styles.mFeatureHead}>Feature</Text>
                  </View>
                  {MATRIX_COLS.map((c) => (
                    <View key={c.name} style={styles.mCol}>
                      <Text style={[styles.mColName, { color: c.color }]} numberOfLines={1}>
                        {c.name}
                      </Text>
                      <Text style={styles.mColSub}>{c.sub}</Text>
                    </View>
                  ))}
                </View>

                {MATRIX_ROWS.map((row) => (
                  <View key={row.label} style={[styles.mRow, styles.mRowBorder]}>
                    <View style={[styles.mFeature, styles.mFeatureRow]}>
                      <Ionicons name={row.icon} size={14} color={colors.textMuted} />
                      <Text style={styles.mFeatureText}>{row.label}</Text>
                    </View>
                    {row.cells.map((cell, i) => (
                      <View key={i} style={styles.mCol}>
                        <Text
                          style={[
                            styles.mCell,
                            cell.tone && { color: toneColor(cell.tone), fontWeight: '700' },
                          ]}
                        >
                          {cell.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.matrixFooter}>
            <Text style={styles.matrixHint}>Swipe card right to pin column</Text>
            <Pressable style={styles.exportRow} onPress={() => console.log('Export PDF')}>
              <Text style={styles.exportText}>Export PDF</Text>
              <Ionicons name="share-social-outline" size={13} color={colors.primaryDark} />
            </Pressable>
          </View>
        </View>

        {/* Saved residences */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Saved Residences</Text>
          <Text style={styles.listCount}>
            Showing {visible.length} of {savedItems.length}
          </Text>
        </View>

        {visible.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.imageWrap}>
              {item.image ? (
                <Image source={item.image} style={styles.image} resizeMode="cover" />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                </View>
              )}

              <View style={[styles.statusBadge, { backgroundColor: item.badgeColor }]}>
                <Text style={styles.statusText}>{item.badge}</Text>
              </View>

              <Pressable style={styles.heartBtn} onPress={() => unsave(item.id)}>
                <Ionicons name="heart" size={20} color={RED} />
              </Pressable>

              <View style={styles.walkPill}>
                <Ionicons name="walk" size={14} color={colors.primaryDark} />
                <Text style={styles.walkText}>{item.walk}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.nameRow}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.price}>
                  {peso(item.price)}
                  <Text style={styles.perMonth}>/mo</Text>
                </Text>
              </View>

              <Text style={styles.details} numberOfLines={1}>
                {item.details}
              </Text>

              <View style={styles.tagWrap}>
                {item.tags.map((t) => (
                  <View
                    key={t.label}
                    style={[
                      styles.tag,
                      t.tone === 'green' && { backgroundColor: '#DCE8D3' },
                      t.tone === 'yellow' && { backgroundColor: '#FBE3A3' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        t.tone === 'green' && { color: GREEN },
                        t.tone === 'yellow' && { color: '#6B4E00' },
                      ]}
                    >
                      {t.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Actions */}
              <View style={styles.actionRow}>
                {item.actions === 'tour' ? (
                  <>
                    <Pressable
                      style={[styles.btn, styles.btnSecondary]}
                      onPress={() => console.log('Message owner', item.id)}
                    >
                      <Ionicons name="chatbox-outline" size={16} color={colors.text} />
                      <Text style={[styles.btnText, { color: colors.text }]}>Message Owner</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.btn, styles.btnTour]}
                      onPress={() => console.log('Book tour', item.id)}
                    >
                      <Text style={[styles.btnText, { color: colors.primaryDark }]}>Book Tour</Text>
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      style={({ pressed }) => [
                        styles.btn,
                        styles.btnPrimary,
                        pressed && { opacity: 0.85 },
                      ]}
                      onPress={() => console.log(item.actions, item.id)}
                    >
                      <Ionicons
                        name={item.actions === 'booking' ? 'calendar-outline' : 'eye-outline'}
                        size={16}
                        color={colors.white}
                      />
                      <Text style={[styles.btnText, { color: colors.white }]}>
                        {item.actions === 'booking' ? 'Request Booking' : 'Check Details'}
                      </Text>
                    </Pressable>
                    <Pressable
                      style={styles.chatBtn}
                      onPress={() => console.log('Message', item.id)}
                    >
                      <Ionicons name="chatbox-ellipses-outline" size={20} color={colors.text} />
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          </View>
        ))}

        {visible.length === 0 && (
          <Text style={styles.empty}>
            {savedItems.length === 0
              ? 'No saved places yet. Tap the heart on a listing to save it.'
              : 'No saved places match this filter.'}
          </Text>
        )}

        {/* Tip */}
        <View style={styles.tip}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb-outline" size={20} color={colors.text} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipLabel}>
              LOCAL RENTAL TIP <Text style={styles.tipLabelMuted}>• Peak Moving Season</Text>
            </Text>
            <Text style={styles.tipTitle}>
              Popular rentals near transit fill up 3 weeks before peak moving season.
            </Text>
            <Text style={styles.tipBody}>
              Katipunan Hearth allows a ₱1,000 refundable holding fee to lock in your lease rate
              early.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 16, paddingBottom: 24 },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandText: { fontFamily: fonts.heading, fontSize: 18, fontWeight: '700', color: colors.text },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.tabTrack,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  titleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontFamily: fonts.heading, fontSize: 26, fontWeight: '700', color: colors.text },
  countBubble: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F6D9D1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBubbleText: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
  compareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: YELLOW,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    height: 38,
  },
  compareText: { fontSize: 13, fontWeight: '700', color: colors.text },

  chipRow: { gap: 8, paddingVertical: 14 },
  chip: {
    backgroundColor: colors.tabTrack,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primaryDark },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.text },
  chipTextActive: { color: colors.white, fontWeight: '700' },

  matrixPanel: {
    backgroundColor: colors.input,
    borderRadius: radius.card,
    padding: 14,
    marginBottom: 20,
  },
  matrixHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  matrixIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBE3A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixTitle: { fontFamily: fonts.heading, fontSize: 17, fontWeight: '700', color: colors.text },
  matrixSub: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  liveText: { fontSize: 11, fontWeight: '700', color: colors.primary, textAlign: 'right' },

  matrixCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    marginTop: 12,
    overflow: 'hidden',
  },
  mRow: { flexDirection: 'row', alignItems: 'stretch' },
  mRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  mFeature: { width: FEATURE_W, paddingHorizontal: 10, paddingVertical: 12 },
  mFeatureRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mFeatureHead: { fontSize: 12, color: colors.textMuted },
  mFeatureText: { fontSize: 12, fontWeight: '700', color: colors.text },
  mCol: {
    width: COL_W,
    paddingHorizontal: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mColName: { fontSize: 12, fontWeight: '700' },
  mColSub: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  mCell: { fontSize: 12, color: colors.text, textAlign: 'center' },

  matrixFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  matrixHint: { fontSize: 11, color: colors.textMuted },
  exportRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  exportText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    textDecorationLine: 'underline',
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: { fontFamily: fonts.heading, fontSize: 17, fontWeight: '700', color: colors.text },
  listCount: { fontSize: 12, fontWeight: '700', color: colors.textMuted },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  imageWrap: { height: 170 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { backgroundColor: '#E8DCC8', alignItems: 'center', justifyContent: 'center' },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontSize: 11, fontWeight: '700', color: colors.white },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walkPill: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    height: 28,
  },
  walkText: { fontSize: 11, fontWeight: '700', color: colors.text },

  cardBody: { padding: 14 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  cardName: {
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  price: { fontFamily: fonts.heading, fontSize: 20, fontWeight: '700', color: colors.primary },
  perMonth: { fontFamily: undefined, fontSize: 12, fontWeight: '400', color: colors.textMuted },
  details: { fontSize: 12, color: colors.textMuted, marginTop: 4 },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  tag: { backgroundColor: colors.input, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 11, fontWeight: '700', color: colors.textMuted },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnSecondary: { backgroundColor: colors.tabTrack },
  btnTour: { backgroundColor: '#F8E1DC' },
  btnText: { fontSize: 14, fontWeight: '700' },
  chatBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { textAlign: 'center', color: colors.textMuted, marginVertical: 24, lineHeight: 20 },

  tip: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.input,
    borderRadius: radius.card,
    padding: 16,
    marginTop: 4,
  },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FBE3A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipLabel: { fontSize: 10, fontWeight: '700', color: GOLD, letterSpacing: 0.4 },
  tipLabelMuted: { fontWeight: '400', color: colors.textMuted },
  tipTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 4, lineHeight: 20 },
  tipBody: { fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
});
