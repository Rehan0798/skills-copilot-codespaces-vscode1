/**
 * HomeScreen
 *
 * Lets the user either:
 *  - Pick a local PDF file via the system document picker, or
 *  - Enter a remote PDF URL and open it directly.
 */

import React, {useState} from 'react';
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RootStackParamList} from '../types/navigation';

type HomeScreenNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const SAMPLE_PDFS = [
  {
    label: 'React Native Docs (sample)',
    url: 'https://www.w3.org/WAI/WCAG21/wcag21.pdf',
  },
  {
    label: 'Lorem Ipsum PDF (sample)',
    url: 'https://www.africau.edu/images/default/sample.pdf',
  },
];

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<HomeScreenNav>();
  const [urlInput, setUrlInput] = useState('');

  const openLocalFile = async () => {
    try {
      const result: DocumentPickerResponse[] = await DocumentPicker.pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });
      const file = result[0];
      if (file?.uri) {
        navigation.navigate('PdfViewer', {
          uri: Platform.OS === 'ios' ? decodeURIComponent(file.uri) : file.uri,
          fileName: file.name ?? 'Document',
        });
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Could not open file. Please try again.');
      }
    }
  };

  const openUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      Alert.alert('No URL', 'Please enter a PDF URL.');
      return;
    }
    if (!trimmed.startsWith('http')) {
      Alert.alert('Invalid URL', 'Please enter a valid http/https URL.');
      return;
    }
    navigation.navigate('PdfViewer', {
      uri: trimmed,
      fileName: trimmed.split('/').pop() ?? 'PDF',
    });
  };

  const openSample = (url: string, label: string) => {
    navigation.navigate('PdfViewer', {uri: url, fileName: label});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      {/* ── Local file picker ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Open Local PDF</Text>
        <Text style={styles.cardDescription}>
          Browse your device storage and select a PDF file to read.
        </Text>
        <TouchableOpacity style={styles.button} onPress={openLocalFile}>
          <Text style={styles.buttonText}>📂  Pick a PDF File</Text>
        </TouchableOpacity>
      </View>

      {/* ── Remote URL ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Open PDF from URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/file.pdf"
          placeholderTextColor="#aaa"
          value={urlInput}
          onChangeText={setUrlInput}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
          onSubmitEditing={openUrl}
        />
        <TouchableOpacity style={styles.button} onPress={openUrl}>
          <Text style={styles.buttonText}>🌐  Open URL</Text>
        </TouchableOpacity>
      </View>

      {/* ── Sample PDFs ── */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sample PDFs</Text>
        {SAMPLE_PDFS.map(({label, url}) => (
          <TouchableOpacity
            key={url}
            style={[styles.button, styles.sampleButton]}
            onPress={() => openSample(url, label)}>
            <Text style={styles.buttonText}>📄  {label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  sampleButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
});
