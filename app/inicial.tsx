import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import apiMusica from "../services/apiMusica";
const musicas = apiMusica();
import { styles } from "../styles/global";

export default function Inicial() {
  const router = useRouter();

  // 🚫 Lógica para manipular o botão "Voltar" do Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Exibe o alerta de confirmação
        Alert.alert(
          "Sair do aplicativo",
          "Você tem certeza que deseja sair do Karaokê?",
          [
            {
              text: "Cancelar",
              onPress: () => null,
              style: "cancel",
            },
            {
              text: "Sim",
              onPress: () => BackHandler.exitApp(),
            },
          ],
          { cancelable: false }
        );
        return true;
      };

      // ✅ AJUSTE AQUI: Capture a referência do listener
      const backHandlerSubscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      // ✅ E use o método remove() na função de cleanup
      return () => {
        backHandlerSubscription.remove();
      };
    }, [])
  );

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
