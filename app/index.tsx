import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  Pressable,
  Modal,
} from "react-native";
import { Link, router } from "expo-router";
import { styles } from "../styles/global";
import { supabase } from "../supabase/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  // Novo estado para o modal
  const [showModal, setShowModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function signInWithEmail() {
    setLoading(true);
    if (!emailRegex.test(email)) {
      Alert.alert("E-mail inválido");
      setLoading(false);
      return;
    }
    if (senha.length < 6) {
      Alert.alert("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) Alert.alert(error.message);
    else router.push("/inicial");

    setLoading(false);
  }

  // 🔐 Função para redefinir senha
  async function handleResetPassword() {
    if (!emailRegex.test(resetEmail)) {
      Alert.alert("E-mail inválido");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: "https://seuapp.com/redefinir-senha", // URL configurada no Supabase
    });

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      Alert.alert(
        "Verifique seu e-mail",
        "Enviamos um link para redefinir sua senha."
      );
      setShowModal(false);
      setResetEmail("");
    }
  }

  return (
    <View style={[styles.container, { justifyContent: "flex-start" }]}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <View>
        <TextInput
          style={styles.input}
          placeholder="Digite o e-mail"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* 🔗 Abre o modal ao clicar */}
        <Pressable onPress={() => setShowModal(true)}>
          <Text style={styles.link}>Esqueci a senha</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={signInWithEmail}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>

        <View style={styles.separador_cont}>
          <View style={styles.line} />
          <Text style={styles.text}>ou</Text>
          <View style={styles.line} />
        </View>

        <Pressable
          style={styles.button2}
          onPress={() => router.push("/cadastro")}
        >
          <Text style={styles.buttonText2}>Cadastre-se</Text>
        </Pressable>
      </View>

      {/* 🔽 Modal de redefinição de senha */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Redefinir senha</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Pressable
              style={styles.button}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Enviando..." : "Enviar link"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.button2, { marginTop: 10 }]}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.buttonText2}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
