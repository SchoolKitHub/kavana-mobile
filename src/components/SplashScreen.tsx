import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Text, Animated, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';

interface SplashScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  // Animation Values
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  const word = "kavana.";
  const letterAnims = useRef(word.split("").map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Start Logo Entrance Animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Start Letter Stagger Animation
    const letterAnimations = letterAnims.map((anim) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      })
    );

    // Stagger letters starting after logo starts showing (at 300ms)
    const letterStaggerTimer = setTimeout(() => {
      Animated.stagger(60, letterAnimations).start();
    }, 300);

    // Tagline fade in
    const taglineTimer = setTimeout(() => {
      Animated.timing(taglineOpacity, {
        toValue: 0.6,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 1000);

    // Progress bar animation
    const progressTimer = setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Completion / Fade out entire screen after 2.5 seconds
    const exitTimer = setTimeout(() => {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        onComplete();
      });
    }, 2500);

    return () => {
      clearTimeout(letterStaggerTimer);
      clearTimeout(taglineTimer);
      clearTimeout(progressTimer);
      clearTimeout(exitTimer);
    };
  }, []);

  // Left-aligned progress bar using translateX interpolation
  const progressBarWidth = 160;
  const progressTranslate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-progressBarWidth / 2, 0],
  });

  return (
    <Animated.View style={[styles.container, { opacity: overlayOpacity }]}>
      {/* Decorative ambient background glow */}
      <View style={styles.glowContainer}>
        <View style={styles.glow} />
      </View>

      <View style={styles.content}>
        {/* Animated Logo Container */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="cover"
          />
          <View style={styles.logoOverlay} />
        </Animated.View>

        {/* Animated Brand Text */}
        <View style={styles.textContainer}>
          {word.split("").map((char, index) => {
            const translateY = letterAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            });
            const opacity = letterAnims[index];

            return (
              <Animated.Text
                key={index}
                style={[
                  styles.letter,
                  char === '.' && styles.dot,
                  {
                    opacity,
                    transform: [{ translateY }],
                  },
                ]}
              >
                {char}
              </Animated.Text>
            );
          })}
        </View>

        {/* Animated Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          The Smart Hebrew Translator
        </Animated.Text>

        {/* Glowing Progress Line */}
        <View style={[styles.progressTrack, { width: progressBarWidth }]}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressBarWidth,
                transform: [
                  { translateX: progressTranslate },
                  { scaleX: progressAnim },
                ],
              },
            ]}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.12,
  },
  glow: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: Colors.primary,
    opacity: 0.6,
    // Note: React Native doesn't support filter: blur out of the box for Android/iOS reliably without expo-blur, 
    // but on web & native we can simulate this with large radius or overlays.
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(18, 18, 18, 0.4)',
    padding: 2,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  logo: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.15)',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  letter: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  dot: {
    color: Colors.primary,
    fontWeight: '900',
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 1,
    marginTop: 32,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 1,
    // Add simple shadow/glow style
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
