import { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, TextInput } from 'react-native';
import { Screen, Title, Subtitle, Button, Input, Card, IconButton } from '../../ui/components';
import { translateText } from '../../services/translate';
import { Colors } from '../../ui/colors';

export default function TranslateScreen() {
  const [sourceText, setSourceText] = useState('Hello, where is the nearest train station?');
  const [targetText, setTargetText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ja');
  const [openPicker, setOpenPicker] = useState<null | 'source' | 'target'>(null);

  const languages = useMemo(() => ([
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
    { code: 'pt', label: 'Portuguese' },
    { code: 'ja', label: 'Japanese' },
    { code: 'ko', label: 'Korean' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ru', label: 'Russian' },
    { code: 'ar', label: 'Arabic' },
  ]), []);

  const sourceRef = useRef<TextInput | null>(null);
  const targetRef = useRef<TextInput | null>(null);

  const translate = async () => {
    setLoading(true);
    try {
      const res = await translateText(sourceText.trim(), { target: targetLang, source: sourceLang });
      setTargetText(res);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const swapBoxes = () => {
    setSourceText(targetText);
    setTargetText(sourceText);
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const labelFor = (code: string) => languages.find(l => l.code === code)?.label || code;

  const [error, setError] = useState<string | null>(null);

  return (
    <Screen>
      <Title>Translate</Title>
      <Subtitle>Two-way text translation</Subtitle>

      <Card style={{ marginBottom: 10, position: 'relative' }}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionLabel}>From</Text>
          <Pressable onPress={() => setOpenPicker(openPicker === 'source' ? null : 'source')}>
            {({ pressed }) => (
              <View style={[styles.langPill, { opacity: pressed ? 0.7 : 1 }]}>
                <Text style={styles.langPillText}>{labelFor(sourceLang)}</Text>
                <Text style={styles.chevron}>▾</Text>
              </View>
            )}
          </Pressable>
        </View>
        <Input
          multiline
          numberOfLines={5}
          placeholder="Enter text"
          value={sourceText}
          onChangeText={setSourceText}
          style={{ minHeight: 120, textAlignVertical: 'top', marginTop: 8 }}
          ref={(r) => { sourceRef.current = r; }}
        />
        <View style={styles.iconActionsWrap}>
          <IconButton icon="⧉" onPress={async () => {
            try {
              if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).clipboard?.writeText) {
                await (navigator as any).clipboard.writeText(sourceText);
              }
            } catch {}
          }} accessibilityLabel="Copy source" />
          <IconButton icon="✕" onPress={() => setSourceText('')} accessibilityLabel="Clear source text" />
        </View>
      </Card>

      <Card style={{ marginTop: 10, position: 'relative' }}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionLabel}>To</Text>
          <Pressable onPress={() => setOpenPicker(openPicker === 'target' ? null : 'target')}>
              {({ pressed }) => (
                <View style={[styles.langPill, { opacity: pressed ? 0.7 : 1 }]}>
                  <Text style={styles.langPillText}>{labelFor(targetLang)}</Text>
                  <Text style={styles.chevron}>▾</Text>
                </View>
              )}
            </Pressable>
        </View>
        <Input
          multiline
          numberOfLines={5}
          placeholder="Translation"
          value={targetText}
          onChangeText={setTargetText}
          style={{ minHeight: 120, textAlignVertical: 'top', marginTop: 8 }}
          ref={(r) => { targetRef.current = r; }}
        />
        <View style={styles.iconActionsWrap}>
          <IconButton icon="⧉" onPress={async () => {
            try {
              if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).clipboard?.writeText) {
                await (navigator as any).clipboard.writeText(targetText);
              }
            } catch {}
          }} accessibilityLabel="Copy translation" />
          <IconButton icon="✕" onPress={() => setTargetText('')} accessibilityLabel="Clear translation text" />
        </View>
      </Card>

      {!!error && (
        <Text style={{ color: '#ef4444', marginTop: 8 }}>{error}</Text>
      )}

      <View style={[styles.actionsRow, { marginTop: 12 }] }>
        <Button title={loading ? 'Translating…' : 'Translate'} onPress={async () => {
          try {
            await translate();
          } catch (e: any) {
            setError(typeof e?.message === 'string' ? e.message : 'Translation failed');
          }
        }} disabled={loading} style={{ flex: 1, height: 44, paddingVertical: 0, marginTop: -2 }} />
        <Pressable onPress={swapBoxes} style={{ marginLeft: 8 }} accessibilityLabel="Swap">
          {({ pressed }) => (
            <View style={[styles.swapBtn, { opacity: pressed ? 0.7 : 1 }]}>
              <Text style={styles.swapIcon}>⇄</Text>
            </View>
          )}
        </Pressable>
      </View>

      {!!openPicker && (
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select language</Text>
              <Pressable onPress={() => setOpenPicker(null)}>
                {({ pressed }) => (
                  <Text style={[styles.pickerClose, { opacity: pressed ? 0.7 : 1 }]}>✕</Text>
                )}
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 320 }}>
              {languages.map(lang => (
                <Pressable key={lang.code} onPress={() => {
                  if (openPicker === 'source') setSourceLang(lang.code);
                  if (openPicker === 'target') setTargetLang(lang.code);
                  setOpenPicker(null);
                }}>
                  {({ pressed }) => (
                    <View style={[styles.pickerItem, { backgroundColor: pressed ? '#141414' : 'transparent' }]}> 
                      <Text style={styles.pickerItemText}>{lang.label}</Text>
                      <Text style={styles.pickerItemCode}>{lang.code}</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    color: Colors.text,
    fontWeight: '600',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  langPillText: {
    color: Colors.text,
    marginRight: 6,
  },
  chevron: {
    color: Colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  swapBtn: {
    height: 44,
    width: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  swapIcon: {
    color: Colors.text,
    fontSize: 18,
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  pickerCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 12,
    width: '100%',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pickerTitle: {
    color: Colors.text,
    fontWeight: '600',
  },
  pickerClose: {
    color: Colors.text,
    fontSize: 18,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerItemText: {
    color: Colors.text,
    fontSize: 16,
  },
  pickerItemCode: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  iconActionsWrap: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'row',
  },
  copyIconWrap: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  iconBtn: {
    height: 36,
    width: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconText: {
    color: Colors.text,
    fontSize: 18,
  },
});


