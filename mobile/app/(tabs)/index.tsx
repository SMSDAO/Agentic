import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NeoGlowCard } from '../../components/ui/NeoGlowCard';

const stats = [
  { label: 'Total Balance', value: '$0.00', color: '#00d4ff' },
  { label: 'Active Positions', value: '0', color: '#b026ff' },
  { label: 'NFT Holdings', value: '0', color: '#ff006e' },
  { label: 'Transactions', value: '0', color: '#00ff88' },
];

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Dashboard</Text>
      <View style={styles.grid}>
        {stats.map((stat) => (
          <NeoGlowCard key={stat.label} style={styles.statCard} glowColor={stat.color}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </NeoGlowCard>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { padding: 16 },
  heading: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%' },
  statValue: { fontSize: 22, fontWeight: 'bold' },
  statLabel: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
});
