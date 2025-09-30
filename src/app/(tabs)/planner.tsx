import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen, Title, Subtitle, Card, Button, Input } from '../../ui/components';
import { Colors } from '../../ui/colors';
import { searchWikipediaNearby, fetchWikipediaSummary } from '../../services/wiki';
import * as Location from 'expo-location';

type PlanItem = { title: string; type: 'landmark' | 'restaurant' | 'museum' | 'other'; address?: string; url?: string };

export default function PlannerScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('Day exploring landmarks and food near me');
  const [results, setResults] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(false);

  const planTrip = async () => {
    try {
      setLoading(true);
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== 'granted') {
        setResults([]);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest });
      const pois = await searchWikipediaNearby(loc.coords.latitude, loc.coords.longitude);
      const top = pois.slice(0, 10);
      const summaries = await Promise.all(
        top.map(p => fetchWikipediaSummary(p.title).catch(() => null))
      );
      const enriched: PlanItem[] = top.map((poi, idx) => {
        const sum = summaries[idx] as any;
        return {
          title: poi.title,
          type: 'landmark',
          address: sum?.description,
          url: sum?.content_urls?.desktop?.page || sum?.content_urls?.mobile?.page,
        };
      });
      setResults(enriched.filter(Boolean));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Title>Planner</Title>
      <Subtitle>Find nearby points of interest</Subtitle>
      <Input value={query} onChangeText={setQuery} placeholder="Describe your plan (optional)" />
      <Button title={loading ? 'Planning…' : 'Plan Near Me'} onPress={planTrip} disabled={loading} />
      <ScrollView style={{ marginTop: 16 }} contentContainerStyle={{ paddingBottom: 60 }}>
        {results.map((r, i) => (
          <Card key={i} style={{ marginBottom: 12 }}>
            <Text style={{ color: Colors.text, fontSize: 16, fontWeight: '600' }}>{r.title}</Text>
            <Text style={{ color: Colors.textMuted, marginTop: 2 }}>{r.type.toUpperCase()}</Text>
            {!!r.address && <Text style={{ color: Colors.text, marginTop: 6 }}>{r.address}</Text>}
            {!!r.url && <Text style={{ color: '#58a6ff', marginTop: 8 }}>{r.url}</Text>}
          </Card>
        ))}
        {results.length === 0 && <Text style={{ color: Colors.textMuted, textAlign: 'center', marginTop: 40 }}>No results yet.</Text>}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({});


