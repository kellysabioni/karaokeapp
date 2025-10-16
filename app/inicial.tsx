import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import apiMusica from "../services/apiMusica"; // Import default
const musicas = apiMusica(); // Chama a função para obter o array

export default function Inicial() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🎤 Escolha sua música</Text>

      <FlatList
        data={musicas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/reproducao",
                params: { id: item.id },
              })
            }
          >
            <Image source={item.capa} style={styles.capa} />
            <View style={styles.info}>
              <Text style={styles.nomeMusica}>{item.titulo}</Text>
              <Text style={styles.cantor}>{item.cantor}</Text>
              <Text style={styles.botao}>🎙️ Cantar</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  titulo: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#222",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  capa: {
    width: 90,
    height: 90,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  info: { flex: 1, padding: 10, justifyContent: "center" },
  nomeMusica: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cantor: { color: "#bbb", fontSize: 15 },
  botao: {
    color: "#00ff88",
    marginTop: 10,
    fontSize: 16,
    textAlign: "right",
  },
});
