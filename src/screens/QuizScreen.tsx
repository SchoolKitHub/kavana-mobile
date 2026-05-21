import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { flashcards, Flashcard } from '../data/flashcards';
import { 
  Sparkles, 
  Check, 
  X, 
  RotateCcw, 
  Award, 
  Play, 
  BookOpen,
  ArrowRight,
  ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function QuizScreen({ navigation }: any) {
  // Quiz Configuration
  const [quizState, setQuizState] = useState<'config' | 'playing' | 'summary'>('config');
  const [sessionSize, setSessionSize] = useState<number>(10);
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<number[]>([]);
  
  // Card Flip State
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Start the quiz
  const startQuiz = (size: number) => {
    // Shuffle flashcards
    const shuffled = [...flashcards].sort(() => 0.5 - Math.random());
    // Get subset
    const selected = shuffled.slice(0, size);
    setDeck(selected);
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers([]);
    setIncorrectAnswers([]);
    setIsFlipped(false);
    flipAnim.setValue(0);
    setQuizState('playing');
  };

  // Animate Flip
  const flipCard = () => {
    if (isFlipped) {
      // Flip back to front
      Animated.spring(flipAnim, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => setIsFlipped(false));
    } else {
      // Flip to back
      Animated.spring(flipAnim, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => setIsFlipped(true));
    }
  };

  const handleAnswer = (correct: boolean) => {
    const currentCard = deck[currentIndex];
    
    if (correct) {
      setScore(prev => prev + 1);
      setCorrectAnswers(prev => [...prev, currentCard.id]);
    } else {
      setIncorrectAnswers(prev => [...prev, currentCard.id]);
    }

    // Reset card flip first (rotate back to front)
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(false);
      // Advance to next card
      if (currentIndex < deck.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setQuizState('summary');
      }
    });
  };

  // Card Flip Rotations
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [90, 91],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const animatedFrontStyle = {
    transform: [{ rotateY: frontInterpolate }],
    opacity: frontOpacity,
  };

  const animatedBackStyle = {
    transform: [{ rotateY: backInterpolate }],
    opacity: backOpacity,
  };

  if (quizState === 'config') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Practice Quiz</Text>
          <Text style={styles.subtitle}>Test your Hebrew letters, grammar, and Kavana cultural concepts</Text>
        </View>

        <View style={styles.configContent}>
          <View style={styles.iconContainer}>
            <BookOpen size={48} color={Colors.primary} />
          </View>
          
          <Text style={styles.configPrompt}>Choose your quiz size:</Text>
          
          <View style={styles.optionsList}>
            {[5, 10, 20, 55].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionButton,
                  sessionSize === size ? styles.optionButtonActive : null
                ]}
                onPress={() => setSessionSize(size)}
              >
                <View style={styles.optionInfo}>
                  <Text style={[
                    styles.optionTitle,
                    sessionSize === size ? styles.optionTitleActive : null
                  ]}>
                    {size === 55 ? 'Full Deck' : `${size} Cards`}
                  </Text>
                  <Text style={styles.optionDesc}>
                    {size === 5 ? 'Quick refresher' : size === 10 ? 'Standard session' : size === 20 ? 'Thorough practice' : 'Master all questions'}
                  </Text>
                </View>
                <ChevronRight size={20} color={sessionSize === size ? '#000000' : Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => startQuiz(sessionSize)}
          >
            <Play size={18} color="#000" fill="#000" />
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (quizState === 'playing') {
    const currentCard = deck[currentIndex];
    const progress = (currentIndex) / deck.length;

    return (
      <SafeAreaView style={styles.container}>
        {/* Progress Bar & Header */}
        <View style={styles.playHeader}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressText}>Question {currentIndex + 1} of {deck.length}</Text>
            <Text style={styles.scoreCounter}>Correct: {score}</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Card Component */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={flipCard} 
            style={styles.cardWrapper}
          >
            {/* Front Side */}
            <Animated.View style={[styles.card, styles.cardFront, animatedFrontStyle]}>
              <View style={styles.cardTagRow}>
                <Text style={styles.cardTag}>QUESTION</Text>
                <Sparkles size={16} color={Colors.primary} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.questionText}>{currentCard.question}</Text>
              </View>
              <Text style={styles.cardPrompt}>Tap to reveal answer</Text>
            </Animated.View>

            {/* Back Side */}
            <Animated.View style={[styles.card, styles.cardBack, animatedBackStyle, { position: 'absolute', top: 0, left: 0 }]}>
              <View style={styles.cardTagRow}>
                <Text style={[styles.cardTag, { color: Colors.secondary }]}>ANSWER</Text>
                <Award size={16} color={Colors.accentGold} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.answerText}>{currentCard.answer}</Text>
              </View>
              <Text style={styles.cardPrompt}>Tap to see question again</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Action Controls */}
        <View style={styles.actionContainer}>
          {!isFlipped ? (
            <TouchableOpacity 
              style={styles.revealAnswerButton}
              onPress={flipCard}
            >
              <Text style={styles.revealAnswerButtonText}>Show Answer</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.feedbackRow}>
              <TouchableOpacity 
                style={[styles.feedbackBtn, styles.incorrectBtn]}
                onPress={() => handleAnswer(false)}
              >
                <X size={20} color="#ffffff" />
                <Text style={styles.feedbackBtnText}>Incorrect</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.feedbackBtn, styles.correctBtn]}
                onPress={() => handleAnswer(true)}
              >
                <Check size={20} color="#000000" />
                <Text style={[styles.feedbackBtnText, { color: '#000000' }]}>Correct</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }

  if (quizState === 'summary') {
    const finalPercentage = Math.round((score / deck.length) * 100);
    let feedbackMsg = 'Keep practicing!';
    if (finalPercentage >= 90) feedbackMsg = 'Incredible! You are a Kavana Master!';
    else if (finalPercentage >= 70) feedbackMsg = 'Great job! You have a solid grasp!';
    else if (finalPercentage >= 50) feedbackMsg = 'Good effort! Let’s try again.';

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.summaryContainer}>
          <View style={styles.rewardIconContainer}>
            <Award size={64} color={Colors.accentGold} />
          </View>
          
          <Text style={styles.summaryTitle}>Quiz Completed!</Text>
          <Text style={styles.summaryFeedback}>{feedbackMsg}</Text>

          {/* Stats Box */}
          <View style={styles.statsPanel}>
            <View style={styles.summaryStatItem}>
              <Text style={styles.summaryStatVal}>{score} / {deck.length}</Text>
              <Text style={styles.summaryStatLabel}>Correct Answers</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryStatItem}>
              <Text style={[
                styles.summaryStatVal, 
                { color: finalPercentage >= 75 ? Colors.accentGreen : finalPercentage >= 50 ? Colors.accentGold : Colors.accentRed }
              ]}>
                {finalPercentage}%
              </Text>
              <Text style={styles.summaryStatLabel}>Accuracy</Text>
            </View>
          </View>

          {/* Action Row */}
          <View style={styles.summaryActions}>
            <TouchableOpacity 
              style={styles.summaryBtnPrimary}
              onPress={() => startQuiz(deck.length)}
            >
              <RotateCcw size={16} color="#000000" />
              <Text style={styles.summaryBtnTextPrimary}>Retry Quiz</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.summaryBtnSecondary}
              onPress={() => setQuizState('config')}
            >
              <BookOpen size={16} color="#ffffff" />
              <Text style={styles.summaryBtnTextSecondary}>Change Quiz Size</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return null;
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
    lineHeight: 16,
  },
  configContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderColor: 'rgba(34, 211, 238, 0.2)',
    borderWidth: 1,
  },
  configPrompt: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionsList: {
    width: '100%',
    gap: 12,
    marginBottom: 30,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  optionTitleActive: {
    color: '#000000',
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  startButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playHeader: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreCounter: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: 380,
  },
  card: {
    width: CARD_WIDTH,
    height: 380,
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardBack: {
    backgroundColor: 'rgba(168, 85, 247, 0.05)',
    borderColor: Colors.secondary,
  },
  cardTagRow: {
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
  cardBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
  },
  answerText: {
    fontSize: 22,
    color: Colors.secondary,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
  },
  cardPrompt: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionContainer: {
    paddingHorizontal: 20,
    paddingBottom: 35,
    paddingTop: 10,
  },
  revealAnswerButton: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealAnswerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 12,
  },
  feedbackBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  incorrectBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: Colors.accentRed,
    borderWidth: 1,
  },
  correctBtn: {
    backgroundColor: Colors.accentGreen,
  },
  feedbackBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  summaryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  rewardIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  summaryTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
  },
  summaryFeedback: {
    fontSize: 15,
    color: Colors.textDim,
    marginBottom: 30,
    textAlign: 'center',
  },
  statsPanel: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 35,
  },
  summaryStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatVal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  summaryStatLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: Colors.border,
    height: '60%',
    alignSelf: 'center',
  },
  summaryActions: {
    width: '100%',
    gap: 12,
  },
  summaryBtnPrimary: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  summaryBtnTextPrimary: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  summaryBtnSecondary: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  summaryBtnTextSecondary: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
