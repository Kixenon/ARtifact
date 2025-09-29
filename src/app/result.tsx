import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable, ScrollView, Linking } from 'react-native';
import { Colors } from '../ui/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import Markdown from 'react-native-markdown-display';

export default function ResultScreen() {
  const params = useLocalSearchParams<{ analysis?: string, place?: string }>();
  const router = useRouter();
  const analysis = params.analysis ?? 'No analysis available';
  const place = params.place;
  const [wiki, setWiki] = useState<string | null>(null);
  const [wikiUrl, setWikiUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchWiki = async () => {
      try {
        const topic = place || analysis.split('\n')[0].slice(0, 80);
        if (!topic) return;
        const resp = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
        if (!resp.ok) return;
        const data = await resp.json();
        if (active) {
          setWiki(data.extract);
          setWikiUrl(data.content_urls?.desktop?.page ?? data.content_urls?.mobile?.page ?? null);
        }
      } catch {}
    };
    fetchWiki();
    return () => { active = false };
  }, [place, analysis]);

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="return-up-back" size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.title}>Analysis</Text>
        </View>
        {place ? <Text style={styles.subtitle}>{place}</Text> : null}
        <Markdown style={markdownStyles}>{analysis}</Markdown>
        {wiki ? (
          <View style={styles.wikiBox}>
            <Text style={styles.wikiTitle}>Wikipedia summary</Text>
            <Text style={styles.wikiBody}>{wiki}</Text>
            {wikiUrl ? (
              <Pressable onPress={() => Linking.openURL(wikiUrl)}>
                <Text style={styles.wikiLink}>Read more</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '600',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  wikiBox: {
    marginTop: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
  },
  wikiTitle: {
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 6,
  },
  wikiBody: {
    color: Colors.textMuted,
    lineHeight: 20,
  },
  wikiLink: {
    color: '#58a6ff',
    marginTop: 8,
  },
});


const markdownStyles = StyleSheet.create({
  body: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  heading1: {
    fontSize: 24,
    color: Colors.text,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: '600',
  },
  heading2: {
    fontSize: 20,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet_list_icon: {
    color: Colors.textMuted,
    marginRight: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  link: {
    color: '#58a6ff',
    textDecorationLine: 'underline',
  },
});