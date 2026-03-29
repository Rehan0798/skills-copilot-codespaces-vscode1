/**
 * PdfViewerScreen
 *
 * Renders the selected / remote PDF using react-native-pdf.
 * Features:
 *  - Page counter (current / total)
 *  - Zoom via pinch gesture (built-in to react-native-pdf)
 *  - Loading indicator with progress bar
 *  - Error state with retry option
 */

import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute, RouteProp} from '@react-navigation/native';

import {RootStackParamList} from '../types/navigation';

type PdfViewerRouteProp = RouteProp<RootStackParamList, 'PdfViewer'>;

export default function PdfViewerScreen(): React.JSX.Element {
  const {params} = useRoute<PdfViewerRouteProp>();
  const insets = useSafeAreaInsets();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0); // used to force a reload

  const source = {uri: params.uri, cache: true};

  const retry = () => {
    setError(null);
    setIsLoaded(false);
    setLoadProgress(0);
    setCurrentPage(1);
    setTotalPages(0);
    setKey(k => k + 1);
  };

  return (
    <View style={[styles.container, {paddingBottom: insets.bottom}]}>
      {/* ── Loading overlay ── */}
      {!isLoaded && !error && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
          {loadProgress > 0 && loadProgress < 1 && (
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, {width: `${loadProgress * 100}%`}]}
              />
            </View>
          )}
          <Text style={styles.loadingText}>
            {loadProgress > 0
              ? `Loading… ${Math.round(loadProgress * 100)}%`
              : 'Opening PDF…'}
          </Text>
        </View>
      )}

      {/* ── Error state ── */}
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Could not load PDF</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── PDF Viewer ── */}
      <Pdf
        key={key}
        source={source}
        trustAllCerts={false}
        style={styles.pdf}
        onLoadProgress={progress => setLoadProgress(progress)}
        onLoadComplete={(numberOfPages, _filePath) => {
          setTotalPages(numberOfPages);
          setIsLoaded(true);
        }}
        onPageChanged={(page, _numberOfPages) => setCurrentPage(page)}
        onError={err => {
          const msg =
            err instanceof Error ? err.message : 'Unknown error occurred';
          setError(msg);
        }}
        enablePaging={false}
        horizontal={false}
      />

      {/* ── Page counter badge ── */}
      {isLoaded && totalPages > 0 && (
        <View style={styles.pageBadge}>
          <Text style={styles.pageBadgeText}>
            {currentPage} / {totalPages}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
  },
  pdf: {
    flex: 1,
    width: '100%',
    backgroundColor: '#404040',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#555',
  },
  progressBarContainer: {
    width: '80%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#c0392b',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  retryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  pageBadge: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  pageBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
