import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme, Button, IconButton, Searchbar, Surface, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const YEARS = ['2023', '2022', '2021', '2020', '2019', 'Older'];
const SUBJECTS = ['All', 'Polity', 'History', 'Economy', 'Geography', 'Science'];

const MOCK_PAPERS = [
  { id: '1', title: 'APPSC Group 2 Prelims 2023', year: '2023', type: 'Full Paper' },
  { id: '2', title: 'APPSC Group 2 Prelims 2022', year: '2022', type: 'Full Paper' },
  { id: '3', title: 'Polity Questions from 2021', year: '2021', type: 'Subject Wise', subject: 'Polity' },
  { id: '4', title: 'History Questions from 2021', year: '2021', type: 'Subject Wise', subject: 'History' },
];

export default function PYQScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredPapers = MOCK_PAPERS.filter(
    (p) =>
      p.year === selectedYear &&
      (selectedSubject === 'All' || p.subject === selectedSubject)
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Previous Year Papers</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Searchbar
          placeholder="Search papers..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { borderColor: theme.colors.outline, borderWidth: 1 }]}
          elevation={0}
        />

        {/* Year Filter */}
        <Text variant="titleMedium" style={styles.filterTitle}>Filter by Year</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {YEARS.map((year) => (
            <Chip
              key={year}
              selected={selectedYear === year}
              onPress={() => setSelectedYear(year)}
              style={styles.chip}
              showSelectedOverlay
            >
              {year}
            </Chip>
          ))}
        </ScrollView>

        {/* Subject Filter */}
        <Text variant="titleMedium" style={styles.filterTitle}>Filter by Subject</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {SUBJECTS.map((sub) => (
            <Chip
              key={sub}
              selected={selectedSubject === sub}
              onPress={() => setSelectedSubject(sub)}
              style={styles.chip}
              showSelectedOverlay
            >
              {sub}
            </Chip>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* Results */}
        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>Available Papers</Text>
        {filteredPapers.length === 0 ? (
          <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surfaceVariant }]} elevation={0}>
            <IconButton icon="file-document-outline" size={48} iconColor={theme.colors.onSurfaceVariant} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>No papers found</Text>
          </Surface>
        ) : (
          filteredPapers.map((paper) => (
            <Card key={paper.id} style={styles.paperCard} mode="outlined" theme={{ colors: { outline: theme.colors.outline } }}>
              <Card.Title
                title={paper.title}
                subtitle={`${paper.type} • ${paper.year}`}
                left={(props) => <IconButton {...props} icon="file-document-outline" iconColor={theme.colors.primary} />}
              />
              <Card.Actions>
                <Button mode="text" onPress={() => {}}>Download PDF</Button>
                <Button mode="contained" onPress={() => {}}>Practice as Test</Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 4 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  searchbar: { marginBottom: 24, borderRadius: 12 },
  filterTitle: { fontWeight: 'bold', marginBottom: 12 },
  horizontalScroll: { flexDirection: 'row', marginBottom: 24 },
  chip: { marginRight: 8, borderRadius: 20 },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 8, marginBottom: 24 },
  paperCard: { marginBottom: 12, borderRadius: 12 },
  emptyCard: { padding: 32, borderRadius: 16, alignItems: 'center', marginTop: 16 },
});
