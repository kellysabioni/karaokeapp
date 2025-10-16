import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

export default function Home() {
  const musicas = [
    {
      id: 1,
      titulo: "Anjos",
      cantor: "O Rappa",
      capa: require("../assets/images/anjos.png"),
    },
    {
      id: 2,
      titulo: "Baby",
      cantor: "Justin Bieber",
      capa: require("../assets/images/baby.png"),
    },
    {
      id: 3,
      titulo: "Evidências",
      cantor: "Chitaozinho & Xororó",
      capa: require("../assets/images/evidencias.png"),
    },
    {
      id: 4,
      titulo: "Gostava Tanto De Você",
      cantor: "Tim Maia",
      capa: require("../assets/images/gostava-tanto-de-voce.png"),
    },
    {
      id: 5,
      titulo: "Heaven",
      cantor: "Bryan Adams",
      capa: require("../assets/images/heaven.png"),
    },
    {
      id: 6,
      titulo: "Levo comigo",
      cantor: "RESTART",
      capa: require("../assets/images/levo-comigo.png"),
    },
    {
      id: 7,
      titulo: "Mágica",
      cantor: "Calcinha Preta",
      capa: require("../assets/images/magica.png"),
    },
    {
      id: 8,
      titulo: "Quando a chuva passar",
      cantor: "Ivete Sangalo",
      capa: require("../assets/images/quando-a-chuva-passar.png"),
    },
    {
      id: 9,
      titulo: "Sailor Song",
      cantor: "Gigi Perez",
      capa: require("../assets/images/sailor-song.png"),
    },
    {
      id: 10,
      titulo: "Se...",
      cantor: "Djavan",
      capa: require("../assets/images/se.png"),
    },
    {
      id: 11,
      titulo: "Tempo Perdido",
      cantor: "legião Urbana",
      capa: require("../assets/images/tempo-perdido.png"),
    },
    {
      id: 12,
      titulo: "vagalumes",
      cantor: "Pollo",
      capa: require("../assets/images/vagalumes.png"),
    },
    {
      id: 13,
      titulo: "Velha infâcia",
      cantor: "Tribalistas",
      capa: require("../assets/images/velha-infancia.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MÚSICAS</Text>
      </View>

      {/* Abas superiores */}
      <View style={styles.tabs}>
        <Text style={styles.tab}>♫ Brasil</Text>
        <Text style={styles.tab}>♫ Gênero</Text>
      </View>

      {/* Lista de músicas */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {musicas.map((musica) => (
          <View key={musica.id} style={styles.musicaItem}>
            <Image source={musica.capa} style={styles.albumArt} />
            <View style={styles.musicaInfo}>
              <Text style={styles.titulo}>{musica.titulo}</Text>
              <Text style={styles.cantor}>Cantor: {musica.cantor}</Text>
            </View>
            <TouchableOpacity
              style={styles.btnCantar}
              onPress={() => router.push("/reproducao")}
            >
              <Text style={styles.btnCantarText}>CANTAR</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Menu inferior fixo */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Text style={styles.menuItem}>Perfil</Text>
        </TouchableOpacity>

        <Text style={[styles.menuItem, { opacity: 0.6 }]}>Músicas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#442953", padding: 20, alignItems: "center" },
  headerTitle: {
    color: "#FFC84B",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: { color: "#442953", fontWeight: "600" },
  musicaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  albumArt: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  musicaInfo: { flex: 1 },
  titulo: { fontSize: 16, fontWeight: "bold" },
  cantor: { fontSize: 12, color: "#888" },
  btnCantar: {
    backgroundColor: "#FFC84B",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  btnCantarText: { color: "#442953", fontWeight: "bold" },

  // Menu inferior fixo e elevado
  bottomMenu: {
    position: "absolute",
    bottom: 20, // sobe o menu
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#442953",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 6,
  },
  menuItem: { color: "#FFC84B", fontWeight: "bold", fontSize: 16 },
});
