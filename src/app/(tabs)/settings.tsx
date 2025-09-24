import { useState } from 'react';
import { Screen, Title, Subtitle, Card, Input } from '../../ui/components';
import { View, Text } from 'react-native';

export default function SettingsScreen() {
  const [openRouterKey, setOpenRouterKey] = useState('');
  const [googleKey, setGoogleKey] = useState('');
  const [libreUrl, setLibreUrl] = useState('');

  return (
    <Screen>
      <Title>Settings</Title>
      <Subtitle>Runtime configuration (env preferred)</Subtitle>
      <Card style={{ gap: 10 }}>
        <Text style={{ color: '#9AA0A6' }}>Keys are typically provided via env vars at build time.</Text>
        <Input placeholder="OpenRouter API Key (env recommended)" value={openRouterKey} onChangeText={setOpenRouterKey} />
        <Input placeholder="Google Translate API Key (optional)" value={googleKey} onChangeText={setGoogleKey} />
        <Input placeholder="LibreTranslate URL (optional)" value={libreUrl} onChangeText={setLibreUrl} />
      </Card>
    </Screen>
  );
}


