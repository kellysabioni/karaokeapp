import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { colors } from "../styles/colors";
import { styles } from "../styles/global";
import "react-native-url-polyfill/auto";

export default function Perfil() {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(true);

  // Carrega dados do usuário logado
  useEffect(() => {
    async function carregarPerfil() {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData?.user) {
          Alert.alert("Erro", "Não foi possível carregar o usuário.");
          router.replace("/"); // volta para login
          return;
        }

        const user = userData.user;
        setEmail(user.email || "");

        // Busca o nome do usuário na tabela "cadastro"
        const { data: perfilData, error: perfilError } = await supabase
          .from("cadastro")
          .select("nome")
          .eq("id", user.id)
          .single();

        if (perfilError) {
          console.log(perfilError);
          Alert.alert("Erro", "Erro ao carregar perfil.");
        } else {
          setNome(perfilData?.nome || "");
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Erro", "Erro ao carregar informações do perfil.");
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, []);

  // Atualiza perfil no Supabase
  const handleSalvar = async () => {
    try {
      setCarregando(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      // Atualiza e-mail e/ou senha
      if (email || senha) {
        const { error: authError } = await supabase.auth.updateUser({
          email: email,
          password: senha || undefined,
        });

        if (authError) {
          Alert.alert("Erro", authError.message);
          setCarregando(false);
          return;
        }
      }

      Alert.alert(
        "Sucesso",
        senha
          ? "Perfil e senha atualizados com sucesso!"
          : "Perfil atualizado com sucesso!"
      );
      setModoEdicao(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Falha ao atualizar perfil.");
    } finally {
      setCarregando(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/"); // volta para login
  };

  // Tela de carregamento
  if (carregando) {
    return (
      <View style={[styles.container, { alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.secundaria} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      {modoEdicao ? (
        <>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            keyboardType="email-address"
            placeholderTextColor={colors.textoIntermediario}
          />
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Nova senha (opcional)"
            secureTextEntry
            placeholderTextColor={colors.textoIntermediario}
          />
        </>
      ) : (
        <>
          <Text style={styles.nomePerfil}>{nome}</Text>
          <Text style={styles.emailPerfil}>{email}</Text>
        </>
      )}

      <View style={styles.buttonPerfil}>
        {modoEdicao ? (
          <Pressable
            style={[styles.button, { backgroundColor: colors.secundaria }]}
            onPress={handleSalvar}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>
              {carregando ? "Salvando..." : "Salvar"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.button, { backgroundColor: colors.secundaria }]}
            onPress={() => setModoEdicao(true)}
          >
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.button2, { backgroundColor: colors.white }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText2}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}
