import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Screen, Title, Subtitle, Button, Input, Card } from '../../ui/components';
import { translateText } from '../../services/translate';
import { Colors } from '../../ui/colors';

export default function TranslateScreen() {
  const [sourceText, setSourceText] = useState('Hello, where is the nearest train station?');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState('ja');

  const translate = async () => {
    setLoading(true);
    try {
      const res = await translateText(sourceText, { target: targetLang });
      setTranslated(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Title>Translate</Title>
      <Subtitle>Text translation with auto-detect</Subtitle>
      <Input
        multiline
        numberOfLines={4}
        placeholder="Type text to translate"
        value={sourceText}
        onChangeText={setSourceText}
        style={{ minHeight: 120, textAlignVertical: 'top' }}
      />
      <Input placeholder="Target language (e.g., ja, es, fr)" value={targetLang} onChangeText={setTargetLang} style={{ marginTop: 8 }} />
      <Button title={loading ? 'Translating…' : 'Translate'} onPress={translate} disabled={loading} />
      <ScrollView style={{ marginTop: 16 }}>
        {!!translated && (
          <Card>
            <Text style={{ color: Colors.text, fontWeight: '600', marginBottom: 6 }}>Result</Text>
            <Text style={{ color: Colors.text, lineHeight: 22 }}>{translated}</Text>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({});


