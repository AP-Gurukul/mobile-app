import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, useTheme, Button, IconButton, Searchbar, Surface, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { fetchPYQs, fetchPYQBoards, PYQQuestion, PYQBoard } from '../../services/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SUBJECTS = ['All', 'Polity', 'History', 'Economy', 'Geography', 'Science'];

export default function PYQScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [boards, setBoards] = useState<PYQBoard[]>([]);
  const [papers, setPapers] = useState<PYQQuestion[]>([]);
  
  const [selectedYear, setSelectedYear] = useState('2023');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    loadPapers();
  }, [selectedYear, selectedSubject]);

  const loadInitial = async () => {
    const fetchedBoards = await fetchPYQBoards();
    setBoards(fetchedBoards);
  };

  const loadPapers = async () => {
    setLoading(true);
    const fetchedPapers = await fetchPYQs(selectedYear, selectedSubject);
    setPapers(fetchedPapers);
    setLoading(false);
  };

  const filteredPapers = papers.filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase()));

  const years = boards.length > 0 ? boards[0].years : ['2023', '2022', '2021', '2020'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Previous Year Papers</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Searchbar
          placeholder="Search questions..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchbar, { borderColor: theme.colors.outline, borderWidth: 1, backgroundColor: theme.colors.surface }]}
          elevation={0}
          inputStyle={{ color: theme.colors.onSurface }}
        />

        {/* Year Filter */}
        <Text variant="titleMedium" style={styles.filterTitle}>Filter by Year</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {years.map((year) => (
            <Chip
              key={year}
              selected={selectedYear === year}
              onPress={() => setSelectedYear(year)}
              style={[styles.chip, { borderColor: theme.colors.outline, borderWidth: selectedYear === year ? 0 : 1, backgroundColor: selectedYear === year ? theme.colors.primaryContainer : theme.colors.surface }]}
              textStyle={{ color: selectedYear === year ? theme.colors.onPrimaryContainer : theme.colors.onSurface }}
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
              style={[styles.chip, { borderColor: theme.colors.outline, borderWidth: selectedSubject === sub ? 0 : 1, backgroundColor: selectedSubject === sub ? theme.colors.primaryContainer : theme.colors.surface }]}
              textStyle={{ color: selectedSubject === sub ? theme.colors.onPrimaryContainer : theme.colors.onSurface }}
              showSelectedOverlay
            >
              {sub}
            </Chip>
          ))}
        </ScrollView>

        <View style={[styles.divider, { backgroundColor: theme.colors.surfaceVariant }]} />

        {/* Results */}
        <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 16 }}>Available Questions</Text>
        
        {loading ? (
           <View style={{ padding: 40, alignItems: 'center' }}>
             <ActivityIndicator size="large" color={theme.colors.primary} />
           </View>
        ) : filteredPapers.length === 0 ? (
          <Surface style={[styles.emptyCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]} elevation={0}>
            <MaterialCommunityIcons name="text-box-search-outline" size={48} color={theme.colors.onSurfaceVariant} />
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>No papers found</Text>
          </Surface>
        ) : (
          filteredPapers.map((paper) => (
            <View key={paper.id} style={[styles.paperCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', padding: 16 }}>
                 <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.colors.surfaceVariant, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                   <MaterialCommunityIcons name="file-document-outline" size={24} color={theme.colors.primary} />
                 </View>
                 <View style={{ flex: 1 }}>
                   <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.onSurface }}>{paper.text}</Text>
                   <Text style={{ fontSize: 13, color: theme.colors.onSurfaceVariant, marginTop: 4 }}>{paper.subject} • {paper.year}</Text>
                 </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>
                <Button mode="outlined" style={{ borderColor: theme.colors.outline }} onPress={() => {}}>View Details</Button>
                <Button mode="contained" onPress={() => {}}>Practice</Button>
              </View>
            </View>
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
  divider: { height: 1, marginVertical: 8, marginBottom: 24 },
  paperCard: { marginBottom: 16, borderRadius: 16 },
  emptyCard: { padding: 32, borderRadius: 16, alignItems: 'center', marginTop: 16 },
});
