import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

const PremiumCard = () => {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchPremiumStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) return;

        const res = await axios.get("http://31.97.177.93:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsPremium(res.data.isPremium);
      } catch (err) {
        console.error("Erro ao verificar status Premium", err);
        setIsPremium(false);
      }
    };

    fetchPremiumStatus();
  }, []);

  if (isPremium === null) {
    return (
      <View style={styles.cardLoading}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="small" color="#FFD700" />
          <Text style={styles.loadingText}>Carregando vantagens Premium...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Icon name="crown" size={20} color="#FFD700" />
        <Text style={styles.title}>RacketMatch Premium</Text>
      </View>
      <Text style={styles.description}>Descubra as vantagens do Premium</Text>

      {isPremium ? (
        <View style={styles.activeBadge}>
          <Icon name="check-circle" size={16} color="#28a745" />
          <Text style={styles.activeText}>Já és Premium</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => router.push("/premium")}>
          <Text style={styles.buttonText}>Ver Mais</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FFD700",
    borderRadius: 12,
    elevation: 4,
  },
  cardLoading: {
    margin: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
    elevation: 2,
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1A2B3C",
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  activeText: {
    marginLeft: 6,
    color: "#28a745",
    fontWeight: "bold",
  },
});

export default PremiumCard;
