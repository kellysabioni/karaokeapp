import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { styles as globalStyles } from "../styles/global";

export default function Player() {
  // Criar players com os arquivos já carregados
  const djavanPlayer = useAudioPlayer(
    require("../assets/music/djavan-se-instrumental.mp3")
  );
  const rappaPlayer = useAudioPlayer(
    require("../assets/music/orappa-anjos-instrumental.mp3")
  );
  const tribalistasPlayer = useAudioPlayer(
    require("../assets/music/tribalistas-velhainfancia-instrumental.mp3")
  );

  const stopAll = () => {
    djavanPlayer.pause();
    djavanPlayer.seekTo(0);

    rappaPlayer.pause();
    rappaPlayer.seekTo(0);

    tribalistasPlayer.pause();
    tribalistasPlayer.seekTo(0);
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.buttonContainer}>
        <Button title="▶ Djavan - Se" onPress={() => djavanPlayer.play()} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="▶ O Rappa - Anjos" onPress={() => rappaPlayer.play()} />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="▶ Tribalistas - Velha Infância"
          onPress={() => tribalistasPlayer.play()}
        />
      </View>

      <View style={[styles.buttonContainer, { marginTop: 20 }]}>
        <Button title="⏹ Parar tudo" onPress={stopAll} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 5,
  },
});
