import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Colors } from '../../ui/colors';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border }, tabBarActiveTintColor: Colors.text, tabBarInactiveTintColor: Colors.textMuted }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lens',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="planner"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="translate"
        options={{
          title: 'Translate',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="language" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <FontAwesome size={26} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
