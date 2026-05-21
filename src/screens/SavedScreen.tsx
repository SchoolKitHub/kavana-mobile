import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { getSavedWords, deleteWord } from '../services/storage';
import { ScannedItem } from '../data/mockScenarios';
import { 
  Search, 
  Volume2, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  Tag, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react-native';
import * as Speech from 'expo-speech';

export default function SavedScreen() {
  const [savedWords, setSavedWords] = useState<ScannedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const loadWords = async () => {
    const words = await getSavedWords();
    setSavedWords(words);
  };

  useFocusEffect(
    useCallback(() => {
      loadWords();
    }, [])
  );

  const handleDelete = (hebrew: string) => {
    Alert.alert(
      'Delete Word',
      'Are you sure you want to remove this word from your library?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteWord(hebrew);
            setSavedWords(updated);
            if (expandedCardId === hebrew) {
              setExpandedCardId(null);
            }
          }
        }
      ]
    );
  };

  const playAudio = async (text: string) => {
    try {
      await Speech.speak(text, { language: 'he-IL' });
    } catch (error) {
      console.log('Error speaking text:', error);
    }
  };

  // Get unique categories from saved words
  const categories = ['All', ...Array.from(new Set(savedWords.map(w => w.category)))].filter(Boolean);

  const filteredWords = savedWords.filter(item => {
    const matchesSearch = 
      item.hebrew.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.literal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kavana.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    if (expandedCardId === id) {
      setExpandedCardId(null);
    } else {
      setExpandedCardId(id);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Library</Text>
        <Text style={styles.subtitle}>Your personalized vocabulary with cultural context</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search saved words or context..."
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Pills */}
      {categories.length > 1 && (
        <View style={styles.filterSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryPill,
                  selectedCategory === category ? styles.categoryPillActive : null
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Tag size={12} color={selectedCategory === category ? '#000000' : Colors.textDim} style={styles.pillIcon} />
                <Text style={[
                  styles.categoryPillText,
                  selectedCategory === category ? styles.categoryPillTextActive : null
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Words List */}
      <ScrollView 
        contentContainerStyle={styles.listContent}
        style={styles.listContainer}
      >
        {filteredWords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <BookOpen size={48} color={Colors.border} />
            <Text style={styles.emptyText}>
              {savedWords.length === 0 
                ? "You haven't saved any words yet.\nUse the Capture tab to scan advertisements or paste Hebrew text."
                : "No matching words found."}
            </Text>
          </View>
        ) : (
          filteredWords.map((item) => {
            const isExpanded = expandedCardId === item.hebrew;
            return (
              <TouchableOpacity
                key={item.hebrew}
                activeOpacity={0.9}
                style={[styles.wordCard, isExpanded ? styles.wordCardExpanded : null]}
                onPress={() => toggleExpand(item.hebrew)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.leftHeader}>
                    <Text style={styles.hebrewText}>{item.hebrew}</Text>
                    <Text style={styles.transliterationText}>{item.transliteration}</Text>
                  </View>
                  <View style={styles.rightHeader}>
                    <TouchableOpacity 
                      onPress={() => playAudio(item.audioText || item.hebrew)}
                      style={styles.iconBtn}
                    >
                      <Volume2 size={18} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDelete(item.hebrew)}
                      style={[styles.iconBtn, styles.deleteBtn]}
                    >
                      <Trash2 size={18} color={Colors.accentRed} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.literalText} numberOfLines={1}>
                    Literal: {item.literal}
                  </Text>
                  {isExpanded ? <ChevronUp size={16} color={Colors.textMuted} /> : <ChevronDown size={16} color={Colors.textMuted} />}
                </View>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.divider} />
                    
                    {/* Badges */}
                    <View style={styles.badgeRow}>
                      <View style={[styles.badge, { backgroundColor: 'rgba(34, 211, 238, 0.12)', borderColor: Colors.primary }]}>
                        <Text style={[styles.badgeText, { color: Colors.primary }]}>{item.category}</Text>
                      </View>
                      <View style={[styles.badge, { backgroundColor: 'rgba(168, 85, 247, 0.12)', borderColor: Colors.secondary }]}>
                        <Text style={[styles.badgeText, { color: Colors.secondary }]}>{item.tone}</Text>
                      </View>
                    </View>

                    {/* Kavana Explanation */}
                    <View style={styles.kavanaContainer}>
                      <View style={styles.kavanaHeaderRow}>
                        <Sparkles size={14} color={Colors.accentGold} />
                        <Text style={styles.kavanaTitle}>THE KAVANA (INTENT)</Text>
                      </View>
                      <Text style={styles.kavanaText}>{item.kavana}</Text>
                    </View>

                    {/* Example Context */}
                    {item.contextExample && (
                      <View style={styles.exampleContainer}>
                        <Text style={styles.exampleTitle}>Usage Example:</Text>
                        <Text style={styles.exampleText}>{item.contextExample}</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    paddingVertical: 10,
  },
  filterSection: {
    marginBottom: 5,
  },
  categoryScroll: {
    paddingLeft: 20,
    paddingRight: 5,
    gap: 8,
    paddingVertical: 5,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillIcon: {
    marginRight: 4,
  },
  categoryPillText: {
    color: Colors.textDim,
    fontSize: 11,
    fontWeight: 'bold',
  },
  categoryPillTextActive: {
    color: '#000000',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 15,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 15,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 30,
  },
  wordCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  wordCardExpanded: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftHeader: {
    flex: 1,
  },
  hebrewText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  transliterationText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  rightHeader: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.15)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  literalText: {
    fontSize: 13,
    color: Colors.textDim,
    fontStyle: 'italic',
    flex: 1,
    marginRight: 10,
  },
  expandedContent: {
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  kavanaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 12,
  },
  kavanaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  kavanaTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.accentGold,
    letterSpacing: 1,
  },
  kavanaText: {
    fontSize: 14,
    color: Colors.textDim,
    lineHeight: 20,
  },
  exampleContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.04)',
    borderColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  exampleTitle: {
    fontSize: 10,
    color: Colors.accentGold,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 13,
    color: '#ffffff',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
