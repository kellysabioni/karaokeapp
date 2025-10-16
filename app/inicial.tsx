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
import apiMusica from "../services/apiMusica";
import { styles } from "../styles/global";

export default function Home() {
  type Musicas = {
    id: number;
    titulo: string;
    cantor: string;
    capa: any;
    audio: any;
  };

  const musicas = apiMusica();

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
        {musicas.map((musica: Musicas) => (
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
