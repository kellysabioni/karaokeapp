import React, { useState } from "react";
import { View, Text, TextInput, Image, Alert, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { styles } from "../styles/global";
import { supabase } from "../supabase/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 1. Validar e-mail
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: senha,
    });
    if (!emailRegex.test(email)) {
      Alert.alert("E-mail inválido");
      return;
    }

    if (senha.length < 6) {
      Alert.alert("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (error) Alert.alert(error.message);
    setLoading(false);
    router.push("/inicial");
  }

  // 2. Validar senha
  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: senha,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={[styles.container, { justifyContent: "flex-start" }]}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View>
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

          <Link href="/esqueciSenha" style={styles.link}>
            Esqueci a senha
          </Link>
        </View>

        <View>
          <Pressable style={[styles.button]} onPress={signInWithEmail}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
          <View style={styles.separador_cont}>
            <View style={styles.line} />
            <Text style={styles.text}>ou</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={[styles.button2]}>
            <Link href="/cadastro" style={styles.buttonText2}>
              Cadastre-se
            </Link>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
