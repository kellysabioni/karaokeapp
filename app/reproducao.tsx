import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
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

  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();

  const [linhas, setLinhas] = useState<{ tempo: number; texto: string }[]>([]);
  const [linhaAtual, setLinhaAtual] = useState(0);

  const { titulo, cantor, audio, letra } = musicaSelecionada ?? {};
  const player = useAudioPlayer(audio);
  const status = useAudioPlayerStatus(player);

  const scrollRef = useRef<ScrollView>(null);
  const [posicoesLinhas, setPosicoesLinhas] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Processa letra
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

  // Sincroniza linha atual e para música no fim da última linha
  useEffect(() => {
    const interval = setInterval(() => {
      if (status && status.currentTime && linhas.length > 0) {
        const index = linhas.findIndex(
          (l, i) =>
            status.currentTime >= l.tempo &&
            (i === linhas.length - 1 ||
              status.currentTime < linhas[i + 1].tempo)
        );

        if (index !== -1) {
          setLinhaAtual(index);

          // Cancela timeout anterior
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          // Se for a última linha, agenda parada da música
          if (index === linhas.length - 1) {
            const tempoAtual = status.currentTime;
            // assume que a última linha dura até o fim da música
            const tempoRestante = (status.duration ?? tempoAtual) - tempoAtual;
            timeoutRef.current = setTimeout(() => {
              player.pause();
            }, tempoRestante * 1000);
          }
        }
      }
    }, 200);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [status, linhas]);

  // Scroll automático
  useEffect(() => {
    if (scrollRef.current && posicoesLinhas[linhaAtual] !== undefined) {
      scrollRef.current.scrollTo({
        y: posicoesLinhas[linhaAtual] - 100,
        animated: true,
      });
    }
  }, [linhaAtual, posicoesLinhas]);

  const stopPlayback = () => {
    player.pause();
    player.seekTo(0);
    setLinhaAtual(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  if (!permission) return <View style={{ flex: 1, backgroundColor: "#000" }} />;

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
      <CameraView style={styles.camera} facing={facing} />
      <View style={styles.overlay}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{cantor}</Text>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.letrasContainer}
        >
          {linhas.map((linha, index) => (
            <Text
              key={index}
              style={[
                styles.letra,
                index === linhaAtual ? styles.letraAtiva : {},
              ]}
              onLayout={(e) => {
                const layout = e.nativeEvent.layout;
                setPosicoesLinhas((prev) => {
                  const nova = [...prev];
                  nova[index] = layout.y;
                  return nova;
                });
              }}
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
  camera: { flex: 1, position: "absolute", width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.65)", padding: 20 },
  titulo: { color: "#fff", fontSize: 22, textAlign: "center", marginBottom: 4 },
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
  message: { textAlign: "center", color: "#fff", paddingBottom: 10 },
});
