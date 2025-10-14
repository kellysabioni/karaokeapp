import React, { useState } from "react";
import { View, Text, TextInput, Image, Alert, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { styles } from "../styles/global";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [emailError, setEmailError] = useState("");
  const [senhaError, setSenhaError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateFields = () => {
    let isValid = true;

    // 1. Validar e-mail
    if (email.trim() === "") {
      setEmailError("O e-mail é obrigatório.");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Por favor, insira um e-mail válido.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // 2. Validar senha
    if (senha.trim() === "") {
      setSenhaError("A senha é obrigatória.");
      isValid = false;
    } else {
      setSenhaError("");
    }

    return isValid;
  };

  const validateOnDatabase = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    // Aqui você faria uma chamada para a sua API de backend
    // Exemplo: fetch('https://sua-api.com/login', { ... });
    // Por enquanto, vamos simular uma resposta do servidor.
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        // Simular um e-mail e senha válidos no "banco de dados"
        if (email === "teste@exemplo.com" && senha === "123456") {
          resolve({ success: true, message: "Login realizado com sucesso!" });
        } else {
          resolve({ success: false, message: "E-mail ou senha incorretos." });
        }
      }, 1000);
    });
  };

  const handleLogin = async () => {
    // 1. Validar os campos antes de prosseguir
    if (!validateFields()) {
      return;
    }

    // 2. Tentar autenticar no "banco de dados"
    const response = await validateOnDatabase();

    // 3. Checar a resposta e exibir uma mensagem
    if (response.success) {
      Alert.alert("Sucesso", response.message);
      router.replace("/(main)/index");
    } else {
      Alert.alert("Erro", response.message);
    }
  };

  const isButtonDisabled =
    email.trim() === "" || senha.trim() === "" || !emailRegex.test(email);

  return (
    <View style={[styles.container, { justifyContent: "flex-start" }]}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            onBlur={validateFields}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            onBlur={validateFields}
          />
          {senhaError ? (
            <Text style={styles.errorText}>{senhaError}</Text>
          ) : null}

          <Link href="/esqueciSenha" style={styles.link}>
            Esqueci a senha
          </Link>
        </View>

        <View>
          <Pressable style={[styles.button]}>
            <Link href="/inicial" style={styles.buttonText}>
              Entrar
            </Link>
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
