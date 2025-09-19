import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';

export default function ResultScreen() {
  const params = useLocalSearchParams<{ analysis?: string, place?: string }>();
  const router = useRouter();
  const analysis = params.analysis ?? 'No analysis available';
  const place = params.place;

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Analysis</Text>
        {place ? <Text style={styles.subtitle}>{place}</Text> : null}
        <Text style={styles.body}>{analysis}</Text>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable onPress={() => router.back()}>
          <View style={styles.closeBtn} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  handle: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
    marginTop: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9aa0a6',
    fontSize: 14,
    marginBottom: 12,
  },
  body: {
    color: '#ddd',
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  closeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
});
