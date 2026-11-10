import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Image,
    ImageSourcePropType,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius } from '../../constants/theme';

type Listing = {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string;
  walk: string;
  tags: string[];
  image?: ImageSourcePropType; // e.g. require('../../../assets/images/room1.jpg')
};

const LISTINGS: Listing[] = [
  {
    id: '1',
    name: 'Katipunan Hearth Residence',
    price: 6500,
    rating: 4.9,
    reviews: 38,
    badge: '2 rooms left',
    walk: '5 min walk to Metro Station',
    tags: ['WiFi', 'Aircon', 'Study Lounge', 'No curfew'],
  },
  {
    id: '2',
    name: 'Casa Acacia Student House',
    price: 4800,
    rating: 4.8,
    reviews: 24,
    badge: 'Available now',
    walk: '8 min walk to City Center',
    tags: ['Backup Generator', 'CCTV', 'Kitchen access'],
  },
  {
    id: '3',
    name: 'Verde Haven Dormitory',
    price: 5200,
    rating: 4.7,
    reviews: 51,
    badge: 'Only 1 slot left',
    walk: '12 min walk or 3 min jeep',
    tags: ['Own Bathroom', 'Study Hall', 'High-speed WiFi'],
  },
];

const AMENITIES = ['WiFi', 'Aircon', 'Own Bathroom', 'Shared Kitchen', 'CCTV', 'Backup Power'];

const MIN_BUDGET = 2500;
const MAX_BUDGET = 15000;
const BUDGET_FROM = 3500;
const BUDGET_TO = 12000;

const GREEN = '#3F5A3A';

const peso = (n: number) => `₱${n.toLocaleString('en-US')}`;

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [amenities, setAmenities] = useState<string[]>(['WiFi', 'Aircon', 'Own Bathroom']);
  const [saved, setSaved] = useState<string[]>(['1']);

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const toggleSaved = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const q = query.trim().toLowerCase();
  const results = LISTINGS.filter(
    (l) =>
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.walk.toLowerCase().includes(q) ||
      l.tags.some((t) => t.toLowerCase().includes(q)),
  );

  const leftPct = ((BUDGET_FROM - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;
  const rightPct = 100 - ((BUDGET_TO - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
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

        {/* Location + List/Map */}
        <View style={styles.locRow}>
          <Pressable style={styles.locPill}>
            <Ionicons name="location" size={16} color={colors.primaryDark} />
            <Text style={styles.locText} numberOfLines={1}>
              Loyola Heights & Diliman Area
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.text} />
          </Pressable>

          <View style={styles.viewToggle}>
            <Pressable
              style={[styles.viewBtn, view === 'list' && styles.viewBtnActive]}
              onPress={() => setView('list')}
            >
              <Ionicons name="list" size={14} color={colors.text} />
              <Text style={[styles.viewText, view === 'list' && styles.viewTextActive]}>List</Text>
            </Pressable>
            <Pressable
              style={[styles.viewBtn, view === 'map' && styles.viewBtnActive]}
              onPress={() => setView('map')}
            >
              <Ionicons name="map-outline" size={14} color={colors.text} />
              <Text style={[styles.viewText, view === 'map' && styles.viewTextActive]}>Map (42)</Text>
            </Pressable>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.title}>Find your next place</Text>
        <View style={styles.countRow}>
          <View style={styles.dot} />
          <Text style={styles.countText}>42 verified rooms and residences available</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.text} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search area, school or landmark"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <Ionicons name="close-circle-outline" size={20} color={colors.text} />
            </Pressable>
          )}
        </View>

        {/* Quick filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          <Pressable style={[styles.chip, styles.chipActive]}>
            <Ionicons name="options-outline" size={16} color={colors.text} />
            <Text style={[styles.chipText, { fontWeight: '700' }]}>Filters ({amenities.length})</Text>
          </Pressable>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>Under ₱6,000/mo</Text>
          </Pressable>
          <Pressable style={styles.chip}>
            <Text style={styles.chipText}>{'< 10 mins walk'}</Text>
          </Pressable>
        </ScrollView>

        {/* Active filter parameters */}
        <View style={styles.filterPanel}>
          <View style={styles.filterHeader}>
            <View style={styles.filterTitleRow}>
              <Ionicons name="options-outline" size={18} color={colors.text} />
              <Text style={styles.filterTitle}>Active Filter Parameters</Text>
            </View>
            <Pressable onPress={() => setAmenities([])} hitSlop={10}>
              <Text style={styles.resetText}>Reset all</Text>
            </Pressable>
          </View>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Monthly Budget</Text>
            <Text style={styles.budgetValue}>
              {peso(BUDGET_FROM)} – {peso(BUDGET_TO)}
            </Text>
          </View>

          <View style={styles.track}>
            <View style={[styles.trackFill, { left: `${leftPct}%`, right: `${rightPct}%` }]} />
          </View>
          <View style={styles.trackLabels}>
            <Text style={styles.trackLabel}>{peso(MIN_BUDGET)}</Text>
            <Text style={styles.trackLabel}>₱8,000</Text>
            <Text style={styles.trackLabel}>{peso(MAX_BUDGET)}+</Text>
          </View>

          <Text style={styles.amenitiesTitle}>Must-Have Amenities</Text>
          <View style={styles.amenityWrap}>
            {AMENITIES.map((a) => {
              const on = amenities.includes(a);
              return (
                <Pressable
                  key={a}
                  style={[styles.amenity, on ? styles.amenityOn : styles.amenityOff]}
                  onPress={() => toggleAmenity(a)}
                >
                  <Ionicons
                    name={on ? 'checkmark' : 'add'}
                    size={14}
                    color={on ? colors.primaryDark : colors.textMuted}
                  />
                  <Text style={[styles.amenityText, on && { color: colors.primaryDark }]}>{a}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Listings */}
        {results.map((item) => {
          const isSaved = saved.includes(item.id);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.imageWrap}>
                {item.image ? (
                  <Image source={item.image} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={[styles.image, styles.imagePlaceholder]}>
                    <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                  </View>
                )}

                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{item.badge}</Text>
                </View>

                <Pressable style={styles.heartBtn} onPress={() => toggleSaved(item.id)}>
                  <Ionicons
                    name={isSaved ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isSaved ? '#B3261E' : colors.text}
                  />
                </Pressable>

                <View style={styles.walkPill}>
                  <Ionicons name="walk" size={14} color={colors.primaryDark} />
                  <Text style={styles.walkText}>{item.walk}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.nameRow}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={12} color={colors.primaryDark} />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewText}>({item.reviews})</Text>
                  </View>
                </View>

                <Text style={styles.price}>
                  {peso(item.price)} <Text style={styles.perMonth}>/ month</Text>
                </Text>

                <View style={styles.tagWrap}>
                  {item.tags.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={({ pressed }) => [styles.availBtn, pressed && { opacity: 0.85 }]}
                    onPress={() => console.log('Check availability', item.id)}
                  >
                    <Text style={styles.availText}>Check Availability</Text>
                  </Pressable>
                  <Pressable style={styles.chatBtn} onPress={() => console.log('Message', item.id)}>
                    <Ionicons name="chatbox-ellipses-outline" size={20} color={colors.text} />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}

        {results.length === 0 && (
          <Text style={styles.empty}>No places match "{query}".</Text>
        )}

        {/* Footer */}
        <View style={styles.standards}>
          <Ionicons name="shield-checkmark-outline" size={22} color={colors.primaryDark} />
          <Text style={styles.standardsTitle}>Verified Living Standards</Text>
          <Text style={styles.standardsText}>
            All local listings are ocular-inspected for safety, clear utility billing, and reliable
            connectivity.
          </Text>
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

  locRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  locPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.tabTrack,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    height: 40,
  },
  locText: { flex: 1, fontSize: 12, fontWeight: '700', color: colors.text },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.tabTrack,
    borderRadius: radius.pill,
    padding: 3,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: radius.pill,
  },
  viewBtnActive: { backgroundColor: colors.white },
  viewText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  viewTextActive: { color: colors.text, fontWeight: '700' },

  title: {
    fontFamily: fonts.heading,
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 18,
  },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN },
  countText: { fontSize: 12, color: colors.textMuted },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.text, height: '100%' },

  chipRow: { gap: 8, paddingVertical: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: '#F2B63C', borderColor: '#F2B63C' },
  chipText: { fontSize: 13, color: colors.text, fontWeight: '500' },

  filterPanel: {
    backgroundColor: colors.input,
    borderRadius: radius.card,
    padding: 16,
    marginBottom: 16,
  },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  filterTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    textDecorationLine: 'underline',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  budgetLabel: { fontSize: 12, color: colors.textMuted },
  budgetValue: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2D9C8',
    marginTop: 10,
    overflow: 'hidden',
  },
  trackFill: { position: 'absolute', top: 0, bottom: 0, backgroundColor: colors.primary },
  trackLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  trackLabel: { fontSize: 11, color: colors.textMuted },
  amenitiesTitle: { fontSize: 12, color: colors.textMuted, marginTop: 14, marginBottom: 8 },
  amenityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: radius.pill,
  },
  amenityOn: { backgroundColor: colors.white },
  amenityOff: { backgroundColor: colors.tabTrack },
  amenityText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },

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
  imageWrap: { height: 190 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { backgroundColor: '#E8DCC8', alignItems: 'center', justifyContent: 'center' },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: GREEN,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    height: 26,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#9BE08F' },
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

  cardBody: { padding: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardName: {
    flex: 1,
    fontFamily: fonts.heading,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.input,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    height: 24,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: colors.text },
  reviewText: { fontSize: 11, color: colors.textMuted },
  price: { fontFamily: fonts.heading, fontSize: 20, fontWeight: '700', color: colors.primary, marginTop: 6 },
  perMonth: { fontFamily: undefined, fontSize: 13, fontWeight: '400', color: colors.textMuted },

  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { backgroundColor: colors.input, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { fontSize: 11, fontWeight: '500', color: colors.textMuted },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  availBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  chatBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.input,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: { textAlign: 'center', color: colors.textMuted, marginVertical: 24 },

  standards: { alignItems: 'center', paddingHorizontal: 20, marginTop: 12, gap: 6 },
  standardsTitle: { fontFamily: fonts.heading, fontSize: 16, fontWeight: '700', color: colors.text },
  standardsText: { fontSize: 12, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
