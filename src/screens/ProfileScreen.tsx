import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  NativeSyntheticEvent, 
  NativeScrollEvent 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { getSavedWords } from '../services/storage';
import { 
  Flame, 
  Bookmark, 
  Award, 
  TrendingUp, 
  BookOpen, 
  ChevronRight,
  Shield,
  Compass,
  Zap,
  Info
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CAROUSEL_WIDTH = width - 40;

export default function ProfileScreen() {
  const [savedCount, setSavedCount] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const loadSavedCount = async () => {
    const words = await getSavedWords();
    setSavedCount(words.length);
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedCount();
    }, [])
  );

  const handleCarouselScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / CAROUSEL_WIDTH);
    setCurrentSlideIndex(index);
  };

  // Concept slides data
  const slides = [
    {
      id: '1',
      title: 'The Literal Translation Trap',
      subtitle: 'Why dictionary definitions fail you in the real world.',
      description: 'Literal translation translates words but misses context. Hebrew expressions are highly idiomatic. Translating word-for-word leads to confusion. For example, "חבל על הזמן" literally means "waste of time," but is used to mean "absolutely amazing!"',
      icon: Compass,
      color: Colors.primary,
      bg: 'rgba(34, 211, 238, 0.03)',
    },
    {
      id: '2',
      title: 'Technical vs Comprehension',
      subtitle: 'Grammar vs. connecting with Israelis.',
      description: 'Focusing entirely on perfect grammatical roots can freeze your speech. In Israeli culture, communication is direct, fast, and adaptive. Prioritizing the intent (the Kavana) and slang allows for natural connection over grammatical perfection.',
      icon: Zap,
      color: Colors.secondary,
      bg: 'rgba(168, 85, 247, 0.03)',
    },
    {
      id: '3',
      title: 'Words vs Intent (The Kavana)',
      subtitle: 'The Venn overlap of true understanding.',
      description: 'True comprehension happens at the overlap of literal definition and cultural context. Understanding both unlocks the true intent of the speaker, helping you navigate signs, subtext, and daily life like a local.',
      icon: Shield,
      color: Colors.accentGold,
      bg: 'rgba(245, 158, 11, 0.03)',
      isVenn: true
    }
  ];

  // Badges state
  const badges = [
    {
      id: 'b1',
      name: 'Olim Apprentice',
      desc: 'Maintained a 5-day practice streak',
      unlocked: true,
      icon: Flame,
      color: Colors.accentGold
    },
    {
      id: 'b2',
      name: 'Cultural Explorer',
      desc: 'Saved at least 1 word to library',
      unlocked: savedCount > 0,
      icon: Bookmark,
      color: Colors.primary
    },
    {
      id: 'b3',
      name: 'Kavana Scholar',
      desc: 'Completed a practice quiz session',
      unlocked: true,
      icon: Award,
      color: Colors.secondary
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>K</Text>
          </View>
          <Text style={styles.profileName}>Hebrew Learner</Text>
          <Text style={styles.profileLevel}>Kavana Explorer • level 4</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Flame size={20} color={Colors.accentGold} />
            <Text style={styles.statVal}>5</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Bookmark size={20} color={Colors.primary} />
            <Text style={styles.statVal}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved Words</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={20} color={Colors.secondary} />
            <Text style={styles.statVal}>12 / 55</Text>
            <Text style={styles.statLabel}>Quiz Mastery</Text>
          </View>
        </View>

        {/* Concept Carousel Slider */}
        <View style={styles.carouselSection}>
          <View style={styles.sectionHeaderRow}>
            <Info size={16} color={Colors.primary} />
            <Text style={styles.sectionTitle}>The Kavana Philosophy</Text>
          </View>
          
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleCarouselScroll}
            scrollEventThrottle={16}
            style={styles.carousel}
          >
            {slides.map((slide) => {
              const Icon = slide.icon;
              return (
                <View key={slide.id} style={[styles.slideCard, { backgroundColor: slide.bg, borderColor: slide.color }]}>
                  <View style={styles.slideHeader}>
                    <Icon size={24} color={slide.color} />
                    <View style={styles.slideTitleContainer}>
                      <Text style={styles.slideTitle}>{slide.title}</Text>
                      <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.slideDescription}>{slide.description}</Text>

                  {slide.isVenn && (
                    <View style={styles.vennContainer}>
                      <View style={styles.vennCircleContainer}>
                        <View style={[styles.vennCircle, styles.vennLeft]}>
                          <Text style={styles.vennText}>Literal Words</Text>
                        </View>
                        <View style={[styles.vennCircle, styles.vennRight]}>
                          <Text style={styles.vennText}>Cultural Context</Text>
                        </View>
                        <View style={styles.vennOverlap}>
                          <Text style={styles.vennOverlapText}>Kavana</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {slides.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  currentSlideIndex === index ? styles.dotActive : null
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Unlocked Achievements</Text>
          <View style={styles.badgeList}>
            {badges.map((badge) => {
              const BadgeIcon = badge.icon;
              return (
                <View 
                  key={badge.id} 
                  style={[
                    styles.badgeItem, 
                    !badge.unlocked ? styles.badgeLocked : null
                  ]}
                >
                  <View style={[styles.badgeIconContainer, { backgroundColor: badge.unlocked ? `${badge.color}15` : 'rgba(255,255,255,0.03)' }]}>
                    <BadgeIcon size={22} color={badge.unlocked ? badge.color : Colors.textMuted} />
                  </View>
                  <View style={styles.badgeInfo}>
                    <Text style={[styles.badgeName, !badge.unlocked ? styles.badgeNameLocked : null]}>
                      {badge.name}
                    </Text>
                    <Text style={styles.badgeDesc}>{badge.desc}</Text>
                  </View>
                  {badge.unlocked && <View style={[styles.glowPoint, { backgroundColor: badge.color }]} />}
                </View>
              );
            })}
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
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileLevel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  carouselSection: {
    paddingVertical: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  carousel: {
    paddingLeft: 20,
  },
  slideCard: {
    width: CAROUSEL_WIDTH,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    marginRight: 20,
    minHeight: 220,
  },
  slideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  slideTitleContainer: {
    flex: 1,
  },
  slideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  slideSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  slideDescription: {
    fontSize: 13,
    color: Colors.textDim,
    lineHeight: 18,
  },
  vennContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 100,
  },
  vennCircleContainer: {
    flexDirection: 'row',
    width: 200,
    height: 80,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vennCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    padding: 8,
  },
  vennLeft: {
    left: 20,
  },
  vennRight: {
    right: 20,
  },
  vennText: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vennOverlap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: Colors.accentGold,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    shadowColor: Colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  vennOverlapText: {
    color: Colors.accentGold,
    fontSize: 9,
    fontWeight: '900',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 15,
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 14,
  },
  achievementsSection: {
    padding: 20,
    gap: 12,
  },
  badgeList: {
    gap: 12,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    position: 'relative',
  },
  badgeLocked: {
    opacity: 0.5,
  },
  badgeIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  badgeNameLocked: {
    color: Colors.textMuted,
  },
  badgeDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  glowPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    right: 15,
    top: 15,
  },
});
