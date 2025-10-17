import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
  Camera,
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";
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

  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<any | null>(null);

  const cameraRef = useRef<CameraView>(null);

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

  // Permissão da Câmera: Simplificado para teste de funcionalidade
  useEffect(() => {
    if (permission === null) {
      requestPermission();
    }
    // Não faz nada se a permissão não foi concedida, confiando no handlePlayOrRecord
    // para solicitar na interação do usuário.
  }, [permission]);

  if (!musicaSelecionada) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#fff" }}>Erro: Música não encontrada.</Text>
        <Pressable style={styles.buttonVoltar} onPress={() => router.back()}>
          <Text style={styles.buttonVoltarText}>{"< Voltar"}</Text>
        </Pressable>
      </View>
    );
  }

  // Processa letra (sem alterações)
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

  // Scroll automático (sem alterações)
  useEffect(() => {
    if (scrollRef.current && posicoesLinhas[linhaAtual] !== undefined) {
      scrollRef.current.scrollTo({
        y: posicoesLinhas[linhaAtual] - 100,
        animated: true,
      });
    }
  }, [linhaAtual, posicoesLinhas]);

  // FUNÇÃO FINALIZAR (STOP)
  const stopPlayback = async () => {
    player.pause();
    player.seekTo(0);
    setLinhaAtual(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Finaliza a gravação se estiver ativa
    if (isRecording && recording) {
      try {
        await recording.stop();
        const videoUri = recording.getURI();
        console.log("Gravação finalizada. URI:", videoUri);
      } catch (error) {
        console.error("Erro ao finalizar gravação:", error);
      }

      setIsRecording(false);
      setRecording(null);
    } else {
      setIsRecording(false);
      setRecording(null);
    }
  };

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

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }

          if (index === linhas.length - 1) {
            const tempoAtual = status.currentTime;
            const tempoRestante = (status.duration ?? tempoAtual) - tempoAtual;
            timeoutRef.current = setTimeout(() => {
              stopPlayback();
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

  // FUNÇÃO INICIAR (PLAY ou GRAVAR)
  const handlePlayOrRecord = async () => {
    if (isRecording) return; // Impede duplo clique

    if (isCameraEnabled) {
      if (cameraRef.current) {
        let currentPermission = permission;

        // 1. FORÇA O ALERTA E A SOLICITAÇÃO SE NECESSÁRIO
        if (currentPermission === null || !currentPermission.granted) {
          Alert.alert(
            "Permissão necessária",
            "Para gravar, precisamos de acesso à sua câmera e microfone. O sistema pedirá sua permissão agora."
          );

          const permissionResult = await requestPermission();
          currentPermission = permissionResult;

          if (!currentPermission.granted) {
            Alert.alert(
              "Acesso Negado",
              "Não podemos gravar o vídeo sem permissão."
            );
            return;
          }
        }

        // 2. INICIA A GRAVAÇÃO SOMENTE APÓS CONCESSÃO
        if (currentPermission.granted) {
          try {
            const newRecording = await cameraRef.current.recordAsync({
              maxDuration: 600,
            });

            setRecording(newRecording);
            setIsRecording(true);
          } catch (error) {
            Alert.alert(
              "Erro de Gravação",
              "Não foi possível iniciar a gravação. Verifique as permissões."
            );
            console.error("Erro ao iniciar recordAsync:", error);
            return;
          }
        }
      }
    }

    // Em ambos os casos (gravando ou não), toca a música
    player.play();
  };

  // 🚨 SIMPLIFICANDO VERIFICAÇÕES INICIAIS
  if (!permission) return <View style={{ flex: 1, backgroundColor: "#000" }} />;

  // Removemos a tela de erro de permissão negada para teste.
  // if (!permission.granted && isCameraEnabled) { return ... }

  if (!linhas.length) {
    return <ActivityIndicator style={{ flex: 1 }} color="#00ff88" />;
  }

  return (
    <View style={styles.container}>
      {isCameraEnabled && (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
      )}

      <View style={styles.overlay}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{cantor}</Text>

        {/* Bloco de Alternância (Toggle) */}
        <View style={styles.toggleContainer}>
          <Pressable
            style={[
              styles.toggleButton,
              !isCameraEnabled && styles.toggleActive,
            ]}
            onPress={() => setIsCameraEnabled(false)}
          >
            <Text
              style={[
                styles.toggleText,
                !isCameraEnabled && styles.toggleTextActive,
              ]}
            >
              Apenas Cantar
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleButton,
              isCameraEnabled && styles.toggleActive,
            ]}
            onPress={() => setIsCameraEnabled(true)}
          >
            <Text
              style={[
                styles.toggleText,
                isCameraEnabled && styles.toggleTextActive,
              ]}
            >
              Cantar e Gravar
            </Text>
          </Pressable>
        </View>

        {/* Indicador de Gravação */}
        {isRecording && (
          <Text style={styles.recordingIndicator}>🔴 GRAVANDO</Text>
        )}

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
          {/* BOTÃO PRINCIPAL: Toca OU Grava */}
          <Pressable
            style={[
              styles.buttonControlLarge,
              isRecording || isCameraEnabled
                ? styles.buttonRecording
                : styles.buttonPrimary,
            ]}
            onPress={handlePlayOrRecord}
            disabled={isRecording}
          >
            <Text style={styles.buttonControlText}>
              {isRecording
                ? "🎤 CANTANDO..."
                : isCameraEnabled
                ? "⏺ Gravar & Cantar"
                : "▶ Tocar"}
            </Text>
          </Pressable>

          {/* Botões de controle menores */}
          <Pressable
            style={styles.buttonControl}
            onPress={() => player.pause()}
          >
            <Text style={styles.buttonControlText}>⏸ Pausar</Text>
          </Pressable>

          <Pressable style={styles.buttonControl} onPress={stopPlayback}>
            <Text style={styles.buttonControlText}>⏹ Finalizar</Text>
          </Pressable>

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
  message: { textAlign: "center", color: "#fff", paddingBottom: 10 },
  recordingIndicator: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },

  // ------------------------------------------------------------------
  // ESTILOS DE BOTÕES E CONTROLES
  // ------------------------------------------------------------------

  controleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
    paddingVertical: 10,
  },

  buttonControl: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#00ff88",
    margin: 4,
    minWidth: "22%",
  },

  buttonControlLarge: {
    minWidth: "95%",
    marginBottom: 8,
    paddingVertical: 15,
    borderRadius: 10,
  },

  buttonControlText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  buttonPrimary: {
    backgroundColor: "#00ff88",
    borderColor: "#00ff88",
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonRecording: {
    backgroundColor: "red",
    borderColor: "darkred",
    alignItems: "center",
  },

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

  // ------------------------------------------------------------------
  // ESTILOS DO TOGGLE (ALTERNÂNCIA)
  // ------------------------------------------------------------------
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    marginVertical: 10,
    overflow: "hidden",
    height: 45,
    alignSelf: "center",
    width: "90%",
  },
  toggleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "600",
  },
  toggleActive: {
    backgroundColor: "#00ff88",
  },
  toggleTextActive: {
    color: "#000",
    fontWeight: "bold",
  },
});
