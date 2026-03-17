import { Text, ScrollView, StyleSheet } from 'react-native';
import { NeoGlowCard } from '../../components/ui/NeoGlowCard';

const protocols = [
  { name: 'Jupiter', description: 'Best-price token swaps', color: '#00d4ff' },
  { name: 'Raydium', description: 'AMM liquidity pools', color: '#b026ff' },
  { name: 'Kamino', description: 'Lending & borrowing', color: '#ff006e' },
  { name: 'Drift', description: 'Perpetuals & vaults', color: '#00ff88' },
];

export default function DeFiScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>DeFi</Text>
      {protocols.map((p) => (
        <NeoGlowCard key={p.name} style={styles.card} glowColor={p.color}>
          <Text style={[styles.protocolName, { color: p.color }]}>{p.name}</Text>
          <Text style={styles.protocolDesc}>{p.description}</Text>
        </NeoGlowCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { padding: 16 },
  heading: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  card: { marginBottom: 12 },
  protocolName: { fontSize: 18, fontWeight: '700' },
  protocolDesc: { color: '#9ca3af', marginTop: 4 },
});
