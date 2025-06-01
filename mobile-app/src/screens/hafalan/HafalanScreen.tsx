import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HafalanScreen() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={64}
            color={theme.colors.primary}
          />
          <Text variant="headlineSmall" style={styles.title}>
            Detail Hafalan
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Halaman detail hafalan akan menampilkan informasi lengkap tentang progress hafalan, nilai, dan catatan musyrif.
          </Text>
          <Button mode="contained" style={styles.button}>
            Coming Soon
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  card: {
    width: '100%',
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 24,
  },
});
