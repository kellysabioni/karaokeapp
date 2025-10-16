import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
// Importar useLocalSearchParams do Expo Router
import { useLocalSearchParams } from "expo-router";
// Importar a API de músicas
import apiMusica from "../services/apiMusica";
import { useAudioPlayer } from "expo-audio";
import { styles as globalStyles } from "../styles/global";

export default function Player() {
  // 1. Obtém o ID da música da URL
  const params = useLocalSearchParams();
  const musicaId = Number(params.id);

  // 2. Obtém todos os dados e encontra a música selecionada
  const musicas = apiMusica();
  const musicaSelecionada = musicas.find((musica) => musica.id === musicaId);

  // Tratamento de erro: se a música não for encontrada
  if (!musicaSelecionada) {
    return (
      <View style={globalStyles.container}>
        <Text>Erro: Música não encontrada.</Text>
      </View>
    );
  }

  const player = useAudioPlayer(musicaSelecionada.audio);

  // Você não precisa mais do stopAll com múltiplas músicas fixas
  const stopPlayback = () => {
    player.pause();
    player.seekTo(0);
  };

  return (
    <View style={globalStyles.container}>
      {/* Exibir o título da música */}
      <Text style={styles.title}>{musicaSelecionada.titulo}</Text>
      <Text style={styles.subtitle}>{musicaSelecionada.cantor}</Text>

      {/* Botões de controle para a música selecionada */}
      <View style={styles.buttonContainer}>
        <Button title="▶ Tocar" onPress={() => player.play()} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="⏸ Pausar" onPress={() => player.pause()} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="⏹ Parar e Resetar" onPress={stopPlayback} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 10,
    width: 200, // Ajuste para melhor visualização
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
  },
});
