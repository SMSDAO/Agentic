import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const features = [
    { id: 1, title: 'Wallet', color: '#00d4ff' },
    { id: 2, title: 'Tokens', color: '#b026ff' },
    { id: 3, title: 'NFTs', color: '#ff006e' },
    { id: 4, title: 'DeFi', color: '#00ff88' },
    { id: 5, title: 'Market', color: '#ffea00' },
    { id: 6, title: 'AI Agent', color: '#00d4ff' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Agentic</Text>
          <Text style={styles.subtitle}>Solana AI Web3 Platform</Text>
        </View>

        <View style={styles.grid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.card, { borderColor: feature.color }]}
            >
              <Text style={[styles.cardTitle, { color: feature.color }]}>
                {feature.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00d4ff',
    textShadowColor: 'rgba(0, 212, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: 'rgba(20, 20, 32, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});
