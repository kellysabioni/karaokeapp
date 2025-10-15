import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function Home() {
  const musicas = [
    {
      id: 1,
      titulo: "Se...",
      cantor: "Djavan",
      capa: require("../assets/images/djavan-foto.png"),
    },

    {
      id: 2,
      titulo: "Velha infância",
      cantor: "Tribalistas",
      capa: require("../assets/images/tribalistas.png"),
    },

    {
      id: 3,
      titulo: "Anjos",
      cantor: "O Rappa",
      capa: require("../assets/images/orappa.png"),
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
      <ScrollView>
        {musicas.map((musica) => (
          <View key={musica.id} style={styles.musicaItem}>
            <Image source={musica.capa} style={styles.albumArt} />
            <View style={styles.musicaInfo}>
              <Text style={styles.titulo}>{musica.titulo}</Text>
              <Text style={styles.cantor}>Cantor: {musica.cantor}</Text>
            </View>
            <TouchableOpacity style={styles.btnCantar}>
              <Text style={styles.btnCantarText}>CANTAR</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Menu inferior */}
      <View style={styles.bottomMenu}>
        <Text style={styles.menuItem}>Eu</Text>
        <Text style={styles.menuItem}>Músicas</Text>
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
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#442953",
  },
  menuItem: { color: "#FFC84B", fontWeight: "bold", fontSize: 16 },
});
