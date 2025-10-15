import React, { useState } from "react";
import { View, Text, TextInput, Image, Alert, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "../supabase/supabase";
import { styles } from "../styles/global";
import "react-native-url-polyfill/auto";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleCadastro = async () => {
    // Validação básica
    if (!nome || !email || !senha || !confirmSenha) {
      Alert.alert("Erro", "Todos os campos são obrigatórios!");
      return;
    }

    // Validação de e-mail
    if (!emailRegex.test(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido!");
      return;
    }

    // Confirmação de senha
    if (senha !== confirmSenha) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    try {
      // Cadastro no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (error) {
        Alert.alert("Erro", error.message);
        return;
      }

      // Salvar nome na tabela de usuários (tabela cadastro)
      const { error: insertError } = await supabase
        .from("cadastro")
        .insert([{ id: data.user?.id, nome, email }]);

      if (insertError) {
        Alert.alert("Erro", insertError.message);
        return;
      }

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.push("/");
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Algo deu errado, tente novamente.");
    }
  };

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
          placeholder="Nome completo"
          autoCapitalize="words"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
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
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          secureTextEntry
          value={confirmSenha}
          onChangeText={setConfirmSenha}
        />

        <View>
          <Pressable style={styles.button} onPress={handleCadastro}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </Pressable>

          <View style={styles.separador_cont}>
            <View style={styles.line} />
            <Text style={styles.text}>ou</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.button2}>
            <Link href="/" style={styles.buttonText2}>
              Fazer login
            </Link>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
