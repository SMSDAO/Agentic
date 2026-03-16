import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NeoGlowCard } from '../../components/ui/NeoGlowCard';

export default function TokensScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Tokens</Text>
      <NeoGlowCard glowColor="#b026ff">
        <Text style={styles.emptyText}>
          Connect your wallet to view token balances.
        </Text>
      </NeoGlowCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { padding: 16 },
  heading: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  emptyText: { color: '#9ca3af', textAlign: 'center', paddingVertical: 24 },
});
