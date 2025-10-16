import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import apiMusica from "../services/apiMusica";

type Musicas = {
  id: number;
  titulo: string;
  cantor: string;
  capa: any;
  audio: any;
  letra: string;
};

export default function Reproducao() {
  const params = useLocalSearchParams();
  const musicaId = Number(params.id);
  const musicas = apiMusica();
  const musicaSelecionada: Musicas | undefined = musicas.find(
    (m) => m.id === musicaId
  );

  // Estado da câmera
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();

  const [linhas, setLinhas] = useState<{ tempo: number; texto: string }[]>([]);
  const [linhaAtual, setLinhaAtual] = useState(0);

  // Reproduzir áudio
  const { titulo, cantor, audio, letra } = musicaSelecionada ?? {};
  const player = useAudioPlayer(audio);
  const status = useAudioPlayerStatus(player);

  // Solicita permissão da câmera ao abrir
  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!musicaSelecionada) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Erro: Música não encontrada.</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  // Processa a letra LRC
  useEffect(() => {
    if (!letra) return;
    const linhasProcessadas = letra
      .split("\n")
      .map((linha) => {
        const match = linha.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
        if (!match) return null;
        const [, min, sec, texto] = match;
        return {
          tempo: parseFloat(min) * 60 + parseFloat(sec),
          texto: texto.trim(),
        };
      })
      .filter(Boolean) as { tempo: number; texto: string }[];

    setLinhas(linhasProcessadas);
  }, [letra]);

  // Sincroniza a linha atual
  useEffect(() => {
    const interval = setInterval(() => {
      if (status && status.currentTime && linhas.length > 0) {
        const index = linhas.findIndex(
          (l, i) =>
            status.currentTime >= l.tempo &&
            (i === linhas.length - 1 ||
              status.currentTime < linhas[i + 1].tempo)
        );
        if (index !== -1) setLinhaAtual(index);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [status, linhas]);

  const stopPlayback = () => {
    player.pause();
    player.seekTo(0);
    setLinhaAtual(0);
  };

  // Se a permissão ainda está carregando
  if (!permission) return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  // Se a permissão não foi concedida ainda
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para usar a câmera.
        </Text>
        <Button onPress={requestPermission} title="Conceder permissão" />
      </View>
    );
  }

  if (!linhas.length) {
    return <ActivityIndicator style={{ flex: 1 }} color="#00ff88" />;
  }

  return (
    <View style={styles.container}>
      {/* Câmera frontal em background */}
      <CameraView style={styles.camera} facing={facing} />

      {/* Camada com o conteúdo do karaokê */}
      <View style={styles.overlay}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{cantor}</Text>

        <ScrollView contentContainerStyle={styles.letrasContainer}>
          {linhas.map((linha, index) => (
            <Text
              key={index}
              style={[
                styles.letra,
                index === linhaAtual ? styles.letraAtiva : {},
              ]}
            >
              {linha.texto}
            </Text>
          ))}
        </ScrollView>

        <View style={styles.controleContainer}>
          <Button title="▶ Tocar" onPress={() => player.play()} />
          <Button title="⏸ Pausar" onPress={() => player.pause()} />
          <Button title="⏹ Parar" onPress={stopPlayback} />
          <Button title="⬅ Voltar" onPress={() => router.back()} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    padding: 20,
  },
  titulo: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitulo: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  letrasContainer: { alignItems: "center", paddingBottom: 20 },
  letra: {
    color: "#ccc",
    fontSize: 18,
    marginVertical: 3,
    textAlign: "center",
  },
  letraAtiva: { color: "#00ff88", fontWeight: "bold", fontSize: 20 },
  controleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  message: {
    textAlign: "center",
    color: "#fff",
    paddingBottom: 10,
  },
});
