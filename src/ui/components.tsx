import { ReactNode, forwardRef, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from './colors';

export function Screen({ children, style }: { children: ReactNode, style?: ViewStyle }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function Title({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Body({ children, style }: { children: ReactNode, style?: TextStyle }) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: ReactNode, style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ title, onPress, disabled, style }: { title: string, onPress: () => void, disabled?: boolean, style?: ViewStyle }) {
  return (
    <Pressable onPress={onPress} disabled={!!disabled} style={({ pressed }) => [styles.button, style, { opacity: disabled ? 0.5 : pressed ? 0.7 : 1 }]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export const Input = forwardRef<TextInput, React.ComponentProps<typeof TextInput>>((props, ref) => {
  return <TextInput ref={ref} {...props} style={[styles.input, props.style]} placeholderTextColor={Colors.textMuted} />
});

export function IconButton({ icon, onPress, style, accessibilityLabel }: { icon: string, onPress: () => void, style?: ViewStyle, accessibilityLabel?: string }) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        onPress();
        setPressed(true);
        setTimeout(() => setPressed(false), 1000);
      }}
      style={({ pressed: actuallyPressed }) => [
        styles.iconButton,
        style,
        { opacity: actuallyPressed ? 0.7 : 1 },
        pressed && styles.iconButtonPressed,
      ]}
    >
      <Text style={styles.iconButtonText}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.textMuted,
    marginBottom: 12,
  },
  body: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
  },
  button: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: Colors.primaryText,
    fontWeight: '600',
    letterSpacing: 0.3,
    paddingTop: 2,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  iconButton: {
    height: 36,
    width: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconButtonPressed: {
    borderColor: Colors.border,
  },
  iconButtonText: {
    color: Colors.text,
    fontSize: 18,
  },
});


