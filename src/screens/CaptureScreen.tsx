import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  Animated, 
  Easing, 
  ScrollView,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { mockScenarios, ScannedItem } from '../data/mockScenarios';
import { saveWord } from '../services/storage';
import { 
  Camera, 
  Image as ImageIcon, 
  Sparkles, 
  Volume2, 
  Bookmark, 
  Check, 
  X, 
  AlertCircle, 
  Send,
  RefreshCw
} from 'lucide-react-native';
import * as Speech from 'expo-speech';

export default function CaptureScreen() {
  const [activeTab, setActiveTab] = useState<'camera' | 'paste'>('camera');
  const [manualText, setManualText] = useState('');
  
  // Scanning states
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'showingResult'>('idle');
  const [selectedItem, setSelectedItem] = useState<ScannedItem | null>(null);
  const [showKavana, setShowKavana] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Scan animations
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const focusAnim = useRef(new Animated.Value(1)).current;
  const resultPanelAnim = useRef(new Animated.Value(400)).current; // starts offscreen (bottom)

  useEffect(() => {
    if (scanStatus === 'scanning') {
      // Loop laser scanning animation
      scanLineAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          })
        ])
      ).start();

      // Focus bracket pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(focusAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(focusAnim, {
            toValue: 0.9,
            duration: 800,
            useNativeDriver: true,
          })
        ])
      ).start();
    } else {
      scanLineAnim.stopAnimation();
      focusAnim.stopAnimation();
    }
  }, [scanStatus]);

  // Handle mock scan activation
  const triggerScan = (item: ScannedItem) => {
    setSelectedItem(item);
    setScanStatus('scanning');
    setShowKavana(false);
    setIsSaved(false);

    // Simulate OCR delay
    setTimeout(() => {
      setScanStatus('showingResult');
      // Slide up the results sheet
      Animated.spring(resultPanelAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 2000);
  };

  const triggerManualScan = () => {
    if (!manualText.trim()) return;
    Keyboard.dismiss();

    // Check if entered text matches any of our mock scenarios
    const match = mockScenarios.find(
      s => s.hebrew.toLowerCase().includes(manualText.toLowerCase().trim()) || 
           manualText.toLowerCase().trim().includes(s.hebrew.toLowerCase())
    );

    const scanItem: ScannedItem = match || {
      id: 'custom',
      hebrew: manualText.trim(),
      literal: 'Custom Hebrew phrase',
      transliteration: 'transliteration unknown',
      kavana: 'This is a custom phrase entered by the user. There is no predefined cultural intent, but you can save it to build your own custom library notes.',
      tone: 'Everyday',
      category: 'User Input',
      contextExample: 'Entered manually.',
      audioText: manualText.trim(),
    };

    triggerScan(scanItem);
  };

  const playAudio = async () => {
    if (!selectedItem) return;
    try {
      await Speech.speak(selectedItem.audioText, { language: 'he-IL' });
    } catch (error) {
      console.log('TTS Error:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    const success = await saveWord(selectedItem);
    if (success) {
      setIsSaved(true);
    }
  };

  const resetScanner = () => {
    Animated.timing(resultPanelAnim, {
      toValue: 400,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setScanStatus('idle');
      setSelectedItem(null);
      setManualText('');
    });
  };

  // Laser line position styling
  const laserTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240] // based on viewfinder height
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* View Mode Tabs */}
      {scanStatus === 'idle' && (
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'camera' ? styles.tabActive : null]}
            onPress={() => setActiveTab('camera')}
          >
            <Camera size={16} color={activeTab === 'camera' ? '#fff' : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'camera' ? styles.tabTextActive : null]}>Scan Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'paste' ? styles.tabActive : null]}
            onPress={() => setActiveTab('paste')}
          >
            <Send size={16} color={activeTab === 'paste' ? '#fff' : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'paste' ? styles.tabTextActive : null]}>Paste Hebrew</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Camera Scanning Viewport Mode */}
      {activeTab === 'camera' && scanStatus !== 'showingResult' && (
        <View style={styles.viewportContainer}>
          <View style={styles.viewfinder}>
            {/* Corner Bracket Bracing */}
            <View style={[styles.bracket, styles.bracketTL]} />
            <View style={[styles.bracket, styles.bracketTR]} />
            <View style={[styles.bracket, styles.bracketBL]} />
            <View style={[styles.bracket, styles.bracketBR]} />

            {scanStatus === 'scanning' ? (
              <>
                {/* Laser animation */}
                <Animated.View style={[styles.laserBar, { transform: [{ translateY: laserTranslateY }] }]} />
                <View style={styles.scanningOverlay}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.scanningText}>ANALYZING HEBREW TEXT...</Text>
                </View>
              </>
            ) : (
              <View style={styles.idleViewfinder}>
                <Camera size={48} color="rgba(255,255,255,0.15)" />
                <Text style={styles.viewfinderHelpText}>Select an advertisement sign below to simulate a camera capture</Text>
              </View>
            )}
          </View>

          {scanStatus === 'idle' && (
            <View style={styles.scenariosSection}>
              <Text style={styles.scenariosTitle}>Select sign to scan:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scenariosScroll}
              >
                {mockScenarios.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.scenarioCard}
                    onPress={() => triggerScan(item)}
                  >
                    <Text style={styles.scenarioCategory}>{item.category.toUpperCase()}</Text>
                    <Text style={styles.scenarioHebrew} numberOfLines={1}>{item.hebrew}</Text>
                    <Text style={styles.scenarioLiteral} numberOfLines={1}>Literal: {item.literal}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {/* Keyboard/Paste Mode */}
      {activeTab === 'paste' && scanStatus !== 'showingResult' && (
        <View style={styles.pasteContainer}>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Paste or type Hebrew text here (e.g. חבל על הזמן)..."
              placeholderTextColor={Colors.textMuted}
              value={manualText}
              onChangeText={setManualText}
            />
            <TouchableOpacity 
              style={[styles.submitButton, !manualText.trim() ? styles.submitButtonDisabled : null]}
              onPress={triggerManualScan}
              disabled={!manualText.trim()}
            >
              <Sparkles size={18} color="#000" />
              <Text style={styles.submitButtonText}>Translate & Explain</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Result Panel Overlay */}
      {scanStatus === 'showingResult' && selectedItem && (
        <Animated.View style={[styles.resultPanel, { transform: [{ translateY: resultPanelAnim }] }]}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultHeaderTitle}>Scan Results</Text>
            <TouchableOpacity onPress={resetScanner} style={styles.closeButton}>
              <X size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.resultScroll} contentContainerStyle={styles.resultScrollContent}>
            {/* Hebrew Result Card */}
            <View style={styles.wordDetailCard}>
              <View style={styles.wordRow}>
                <Text style={styles.resultHebrew}>{selectedItem.hebrew}</Text>
                <TouchableOpacity onPress={playAudio} style={styles.playButton}>
                  <Volume2 size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.resultTransliteration}>{selectedItem.transliteration}</Text>
              
              <View style={styles.literalBox}>
                <Text style={styles.literalTitle}>Literal Translation:</Text>
                <Text style={styles.literalVal}>{selectedItem.literal}</Text>
              </View>

              {!showKavana ? (
                <TouchableOpacity 
                  style={styles.revealButton}
                  onPress={() => setShowKavana(true)}
                >
                  <Sparkles size={16} color="#fff" />
                  <Text style={styles.revealButtonText}>Explain Kavana (Real Intent)</Text>
                </TouchableOpacity>
              ) : (
                <Animated.View style={styles.kavanaRevealBox}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, { backgroundColor: 'rgba(34, 211, 238, 0.15)', borderColor: Colors.primary }]}>
                      <Text style={[styles.badgeText, { color: Colors.primary }]}>{selectedItem.category}</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: 'rgba(168, 85, 247, 0.15)', borderColor: Colors.secondary }]}>
                      <Text style={[styles.badgeText, { color: Colors.secondary }]}>{selectedItem.tone}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.kavanaHeading}>The Intent (Kavana)</Text>
                  <Text style={styles.kavanaText}>{selectedItem.kavana}</Text>

                  {selectedItem.contextExample ? (
                    <View style={styles.exampleBox}>
                      <Text style={styles.exampleHeading}>In Context:</Text>
                      <Text style={styles.exampleText}>{selectedItem.contextExample}</Text>
                    </View>
                  ) : null}

                  {/* Actions */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity 
                      style={[styles.saveButton, isSaved ? styles.saveButtonSaved : null]}
                      onPress={handleSave}
                      disabled={isSaved}
                    >
                      {isSaved ? (
                        <>
                          <Check size={16} color="#fff" />
                          <Text style={styles.saveButtonText}>Saved to Library</Text>
                        </>
                      ) : (
                        <>
                          <Bookmark size={16} color="#000" />
                          <Text style={[styles.saveButtonText, { color: '#000' }]}>Save Word</Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.recaptureButton} onPress={resetScanner}>
                      <RefreshCw size={16} color="#fff" />
                      <Text style={styles.recaptureButtonText}>Scan Another</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              )}
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    margin: 20,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  viewportContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  viewfinder: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#0a0a0a',
    borderRadius: 24,
    borderColor: Colors.border,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minHeight: 300,
  },
  bracket: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderColor: Colors.primary,
  },
  bracketTL: {
    top: 20,
    left: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  bracketTR: {
    top: 20,
    right: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bracketBL: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bracketBR: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  scanningOverlay: {
    alignItems: 'center',
    gap: 12,
  },
  scanningText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  idleViewfinder: {
    alignItems: 'center',
    padding: 30,
  },
  viewfinderHelpText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 15,
    lineHeight: 18,
  },
  scenariosSection: {
    paddingVertical: 20,
  },
  scenariosTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 20,
    marginBottom: 12,
  },
  scenariosScroll: {
    paddingLeft: 20,
    paddingRight: 5,
    gap: 12,
  },
  scenarioCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    width: 200,
    justifyContent: 'space-between',
  },
  scenarioCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  scenarioHebrew: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 6,
  },
  scenarioLiteral: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  pasteContainer: {
    flex: 1,
    padding: 20,
  },
  inputCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    minHeight: 250,
    justifyContent: 'space-between',
  },
  textInput: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'top',
    height: 140,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
  },
  resultPanel: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  resultHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 15,
  },
  resultScroll: {
    flex: 1,
  },
  resultScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  wordDetailCard: {
    backgroundColor: Colors.surface,
    borderColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultHebrew: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  playButton: {
    padding: 10,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.2)',
  },
  resultTransliteration: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 6,
    fontWeight: '600',
  },
  literalBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  literalTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  literalVal: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  revealButton: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  revealButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  kavanaRevealBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingTop: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  badge: {
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  kavanaHeading: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.accentGold,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  kavanaText: {
    fontSize: 15,
    color: Colors.textDim,
    lineHeight: 22,
  },
  exampleBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
  },
  exampleHeading: {
    fontSize: 11,
    color: Colors.accentGold,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: '#ffffff',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: Colors.accentGreen,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 1.2,
  },
  saveButtonSaved: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: Colors.accentGreen,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  recaptureButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flex: 0.8,
  },
  recaptureButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
