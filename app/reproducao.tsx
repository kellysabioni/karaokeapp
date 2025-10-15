import React from "react";
import { View, Button } from "react-native";
import { useAudioPlayer } from "expo-audio";
import { styles } from "../styles/global";

export default function App() {
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
    <View style={styles.container}>
      <Button
        title="▶ Djavan - Se (Instrumental)"
        onPress={() => djavanPlayer.play()}
      />
      <Button
        title="▶ O Rappa - Anjos (Instrumental)"
        onPress={() => rappaPlayer.play()}
      />
      <Button
        title="▶ Tribalistas - Velha Infância (Instrumental)"
        onPress={() => tribalistasPlayer.play()}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="⏹ Parar tudo" onPress={stopAll} />
      </View>
    </View>
  );
}
