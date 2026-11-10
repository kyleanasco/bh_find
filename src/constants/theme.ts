import { Platform } from 'react-native';
 
export const colors = {
  background: '#FDF9F0',
  card: '#FFFFFF',
  input: '#F5F1E7',
  primary: '#BF5A3A',
  primaryDark: '#7A2E1A',
  text: '#1E1B16',
  textMuted: '#6B6358',
  border: '#E6E0D2',
  tabTrack: '#E8E3D8',
  badgeBg: '#E9EEE2',
  badgeText: '#4A5A3F',
  white: '#FFFFFF',
};
 
export const fonts = {
  heading: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) as string,
};
 
export const radius = {
  input: 14,
  card: 20,
  pill: 999,
};
 