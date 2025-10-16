import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import apiMusica from "../services/apiMusica";
const musicas = apiMusica();
import { styles } from "../styles/global";

export default function Inicial() {
  const router = useRouter();

  return (
    <View style={styles.containerInicial}>
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
              <Text style={styles.botao}> 🎙️ Cantar</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* Menu inferior fixo */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity onPress={() => router.push("/inicial")}>
          <Text style={styles.menuItem}>Músicas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Text style={styles.menuItem}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
