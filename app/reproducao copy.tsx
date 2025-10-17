import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  // 🚨 Substituir Button por Pressable
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
// As bibliotecas `expo-audio` não são nativas do Expo e requerem uma importação correta
// Estou assumindo que `useAudioPlayer` e `useAudioPlayerStatus` estão corretos para o seu ambiente.
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
  // ⚠️ Importante: O player deve ser inicializado, mesmo que null no início
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
        {/* 1. Botão "Voltar" (Pressable) */}
        <Pressable style={styles.buttonVoltar} onPress={() => router.back()}>
          <Text style={styles.buttonVoltarText}>{"< Voltar"}</Text>
        </Pressable>
      </View>
    );
  }

  // Processa letra (Sem alterações)
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

  // Sincroniza linha atual e para música no fim da última linha (Sem alterações)
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

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          if (index === linhas.length - 1) {
            const tempoAtual = status.currentTime;
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

  // Scroll automático (Sem alterações)
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
        {/* 2. Botão "Conceder permissão" (Pressable) */}
        <Pressable style={styles.buttonPrimary} onPress={requestPermission}>
          <Text style={styles.buttonPrimaryText}>Conceder permissão</Text>
        </Pressable>
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
          {/* 3. Botão "Tocar" (Pressable) */}
          <Pressable style={styles.buttonControl} onPress={() => player.play()}>
            <Text style={styles.buttonControlText}>▶ Tocar</Text>
          </Pressable>

          {/* 4. Botão "Pausar" (Pressable) */}
          <Pressable
            style={styles.buttonControl}
            onPress={() => player.pause()}
          >
            <Text style={styles.buttonControlText}>⏸ Pausar</Text>
          </Pressable>

          {/* 5. Botão "Parar" (Pressable) */}
          <Pressable style={styles.buttonControl} onPress={stopPlayback}>
            <Text style={styles.buttonControlText}>⏹ Parar</Text>
          </Pressable>

          {/* 6. Botão "Voltar" (Pressable) */}
          <Pressable style={styles.buttonControl} onPress={() => router.back()}>
            <Text style={styles.buttonControlText}>⬅ Voltar</Text>
          </Pressable>
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
    // Adicionar padding vertical para dar espaço aos botões
    paddingVertical: 10,
  },
  message: { textAlign: "center", color: "#fff", paddingBottom: 10 },

  // ------------------------------------------------------------------
  // ✅ NOVOS ESTILOS PARA OS PRESSABLES
  // ------------------------------------------------------------------

  // Estilo para o botão de conceder permissão (Destacado)
  buttonPrimary: {
    backgroundColor: "#00ff88",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  buttonPrimaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Estilo para os botões de controle de reprodução (Compactos)
  buttonControl: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Fundo sutil
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#00ff88", // Borda neon
  },
  buttonControlText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  // Estilos para o botão Voltar na tela de erro (Estilo secundário)
  buttonVoltar: {
    backgroundColor: "transparent",
    borderColor: "#aaa",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonVoltarText: {
    color: "#aaa",
    fontSize: 16,
  },
});
