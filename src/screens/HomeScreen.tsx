import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../theme/colors';
import { Camera, Bookmark, Sparkles, BookOpen, Volume2, Flame, Award, ArrowRight } from 'lucide-react-native';
import * as Speech from 'expo-speech';

export default function HomeScreen({ navigation }: any) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(5);
  const [savedCount, setSavedCount] = useState(6);
  const [mastery, setMastery] = useState(35);

  const wordOfTheDay = {
    hebrew: 'חבל על הזמן',
    literal: 'Waste of time',
    transliteration: 'haval al hazman',
    kavana: 'Confusingly, this actually means "Incredible" or "Amazing" in Israeli slang. It is one of the most common expressions of extreme praise.',
  };

  const playAudio = async () => {
    try {
      await Speech.speak(wordOfTheDay.hebrew, { language: 'he-IL' });
    } catch (error) {
      console.log('Error speaking text:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>KAVANA</Text>
            <Text style={styles.brandSubtitle}>Translate Hebrew. Understand context.</Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame size={20} color={Colors.accentGold} fill={Colors.accentGold} />
            <Text style={styles.streakText}>{streak} Day Streak</Text>
          </View>
        </View>

        {/* Dashboard Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Flame size={22} color={Colors.accentGold} />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Bookmark size={22} color={Colors.primary} />
            <Text style={styles.statNumber}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved Words</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Award size={22} color={Colors.accentGreen} />
            <Text style={styles.statNumber}>{mastery}%</Text>
            <Text style={styles.statLabel}>Mastery</Text>
          </View>
        </View>

        {/* Word of the Day Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Word of the Day</Text>
          <View style={styles.glowIndicator} />
        </View>

        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={() => setIsFlipped(!isFlipped)}
          style={[styles.card, isFlipped ? styles.cardFlipped : null]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTag}>DAILY FEATURE</Text>
            <TouchableOpacity onPress={playAudio} style={styles.speakerButton}>
              <Volume2 size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {!isFlipped ? (
            <View style={styles.cardContent}>
              <Text style={styles.hebrewWord}>{wordOfTheDay.hebrew}</Text>
              <Text style={styles.transliteration}>"{wordOfTheDay.transliteration}"</Text>
              <Text style={styles.literalText}>Literal: {wordOfTheDay.literal}</Text>
              
              <View style={styles.cardFooter}>
                <Sparkles size={14} color={Colors.accentGold} />
                <Text style={styles.cardFooterText}>Tap to reveal the Kavana</Text>
              </View>
            </View>
          ) : (
            <View style={styles.cardContent}>
              <Text style={styles.kavanaTag}>THE KAVANA (THE INTENT)</Text>
              <Text style={styles.kavanaExplanation}>{wordOfTheDay.kavana}</Text>
              
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>Tap to flip back</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Explore</Text>
        
        <View style={styles.grid}>
          <TouchableOpacity 
            style={[styles.gridItem, { borderColor: Colors.primary }]}
            onPress={() => navigation.navigate('Capture')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: 'rgba(34, 211, 238, 0.15)' }]}>
              <Camera size={24} color={Colors.primary} />
            </View>
            <Text style={styles.gridTitle}>Scan & OCR</Text>
            <Text style={styles.gridDesc}>Extract text from signs, images or paste text.</Text>
            <View style={styles.gridLink}>
              <Text style={[styles.gridLinkText, { color: Colors.primary }]}>Scan now</Text>
              <ArrowRight size={14} color={Colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridItem, { borderColor: Colors.secondary }]}
            onPress={() => navigation.navigate('Quiz')}
          >
            <View style={[styles.gridIconContainer, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <BookOpen size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.gridTitle}>Vocab Builder</Text>
            <Text style={styles.gridDesc}>Master Hebrew letters, slang, and core concepts.</Text>
            <View style={styles.gridLink}>
              <Text style={[styles.gridLinkText, { color: Colors.secondary }]}>Play quiz</Text>
              <ArrowRight size={14} color={Colors.secondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.banner}>
          <Sparkles size={20} color={Colors.accentGold} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Unlock Real Communication</Text>
            <Text style={styles.bannerDesc}>Literal translations miss tone and context. Kavana bridges the gap.</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  streakText: {
    color: Colors.accentGold,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 15,
    marginBottom: 30,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    height: '60%',
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  glowIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginLeft: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
    minHeight: 220,
    justifyContent: 'space-between',
  },
  cardFlipped: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(34, 211, 238, 0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  speakerButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 15,
  },
  hebrewWord: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  transliteration: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  literalText: {
    fontSize: 14,
    color: Colors.textDim,
    marginTop: 8,
    fontStyle: 'italic',
  },
  kavanaTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  kavanaExplanation: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  cardFooterText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 6,
  },
  grid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  gridItem: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    height: 200,
    justifyContent: 'space-between',
  },
  gridIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  gridDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },
  gridLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  gridLinkText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.accentGold,
  },
  bannerDesc: {
    fontSize: 12,
    color: Colors.textDim,
    marginTop: 2,
    lineHeight: 16,
  },
});
