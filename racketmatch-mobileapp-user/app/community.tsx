import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../components/BackButton';
import * as Animatable from 'react-native-animatable';

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Erro ao buscar posts:', err);
      Alert.alert('Erro', 'Não foi possível carregar os posts.');
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;

    try {
      setPosting(true);
      const token = await AsyncStorage.getItem('authToken');
      const res = await axios.post(
        'http://localhost:5000/api/posts',
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) => [res.data, ...prev]);
      setNewPost('');
    } catch (err) {
      console.error('Erro ao postar:', err);
      Alert.alert('Erro', 'Não foi possível publicar seu post.');
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BackButton />
      <Animatable.Text animation="fadeInDown" style={styles.title}>
        Comunidade 🗣️🎾
      </Animatable.Text>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.postInputContainer}>
        <TextInput
          placeholder="Partilha a tua paixão pelo desporto... 🏅"
          value={newPost}
          onChangeText={setNewPost}
          multiline
          style={styles.textInput}
        />
        <Button title={posting ? 'A publicar...' : '📢 Publicar'} onPress={handlePost} color="#2e7d32" disabled={posting} />
      </Animatable.View>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ainda não há posts na comunidade.</Text>
          <Text style={styles.emptySubtext}>Seja o primeiro a partilhar algo! 🎉</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => (
            <Animatable.View
              animation="fadeInUp"
              delay={index * 100}
              style={styles.postCard}
            >
              <View style={styles.postHeader}>
                <Text style={styles.authorName}>👤 {item.author?.name || 'Anónimo'}</Text>
                <Text style={styles.timestamp}>🕒 {new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <Text style={styles.postContent}>{item.content}</Text>
            </Animatable.View>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  postInputContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  textInput: {
    minHeight: 80,
    borderColor: '#c8e6c9',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  postHeader: {
    marginBottom: 8,
  },
  authorName: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  timestamp: {
    fontSize: 12,
    color: '#757575',
  },
  postContent: {
    fontSize: 16,
    color: '#424242',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});
