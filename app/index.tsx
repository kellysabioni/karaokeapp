import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Alert,
  Pressable,
} from "react-native";
import { Link, router } from "expo-router";

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
        style={{
          width: 180,
          height: 180,
          alignSelf: "center",
          marginTop: 90,
          marginBottom: 90,
          borderRadius: 90,
        }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#Fafafa",
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: 90,
    marginBottom: 90,
    borderRadius: 90,
  },
  input: {
    backgroundColor: "#fafafa",
    color: "#201124",
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1.3,
    borderColor: "#36173D",
  },
  button: {
    backgroundColor: "#FFC55A",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#36173D",
    fontSize: 18,
    fontWeight: "bold",
  },

  button2: {
    backgroundColor: "#fafafa",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: "#FFC55A",
  },
  buttonText2: {
    color: "#FFC55A",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#FFC107",
    textAlign: "right",
    marginTop: 1,
    marginBottom: 18,
  },
  link2: {
    flexDirection: "row",
    justifyContent: "center",
    color: "#201124",
    marginBottom: 18,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  separador_cont: {
    flexDirection: "row", // Alinha os itens horizontalmente
    alignItems: "center", // Centraliza os itens verticalmente
    marginVertical: 20, // Adiciona um espaço acima e abaixo do componente
  },
  line: {
    flex: 1, // Faz a linha ocupar o espaço disponível
    height: 0.75, // Altura da linha
    backgroundColor: "#4E2A57", // Cor da linha
  },
  text: {
    color: "#4E2A57", // Cor do texto
    marginHorizontal: 10, // Espaço entre o texto e as linhas
  },
});
