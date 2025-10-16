import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet, // Importado para definir os estilos
} from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { colors } from "../styles/colors";
import "react-native-url-polyfill/auto";

// ===============================================
// ESTILOS PRÓPRIOS DA PÁGINA PERFIL
// ===============================================
const perfilStyles = StyleSheet.create({
  // 1. Estilo para o container principal (fundo de tela, flex total)
  containerPerfil: {
    flex: 1,
    backgroundColor: "#1c1433", // Cor de fundo da tela
    paddingTop: 40, // Espaço no topo para o conteúdo
    paddingHorizontal: 0, // Remove padding horizontal para o menu ir de ponta a ponta
  },

  // 2. Estilo da "CAIXA" dos dados do usuário (AJUSTADO: Maior e alinhamento à esquerda)
  profileBox: {
    backgroundColor: "#1c143355", // Cor de fundo da caixa
    marginHorizontal: 10, // Diminui a margem horizontal para a caixa ficar mais larga
    padding: 30, // Aumenta o padding interno
    borderRadius: 15,
    alignItems: "flex-start", // ALINHA O CONTEÚDO À ESQUERDA

    width: "95%", // Garante que a caixa ocupe quase toda a largura
    height: 300,
    alignSelf: "center", // Centraliza a caixa na tela
  },

  // Estilos do texto dentro da caixa (AJUSTADO: Alinhamento à esquerda)
  nomePerfil: {
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 6,
    fontSize: 24,
    textAlign: "left",
    width: "100%",
    paddingTop: 20,
  },
  emailPerfil: {
    fontSize: 16,
    color: "#fafafa97",
    marginBottom: 24,
    textAlign: "left",
    width: "100%",
  },

  // Estilo do botão de AÇÃO (Salvar - usado no modo edição)
  actionButton: {
    marginTop: 15,
    paddingVertical: 12, // Um pouco maior
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: colors.secundaria,
    width: "100%", // Ocupa toda a largura da caixa
    alignItems: "center",
  },
  actionButtonText: {
    color: colors.primaria,
    fontSize: 18,
    fontWeight: "bold",
  },

  // NOVO: Estilo para o botão EDITAR (fora da caixa)
  editButtonContainer: {
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: 20,
  },

  // Estilo do texto de SAIR (simples)
  logoutText: {
    marginTop: 20,
    color: "#fafafa97",
    fontSize: 16,
    textAlign: "center", // Alinhamento à esquerda
    width: "100%",
  },

  // Estilos para o modo de edição (TextInputs dentro da caixa)
  input: {
    backgroundColor: "#fafafaca",
    color: colors.primariaEscura,
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1.3,
    borderColor: colors.primaria,
    width: "100%",
  },

  // 3. Linha Separadora
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
    paddingHorizontal: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.secundariaEscura,
    opacity: 0.5,
  },

  // 4. Menu Fixo na parte inferior
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: colors.primariaClara,
    // Propriedades para fixar:
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
  },
  menuItem: {
    color: colors.secundariaEscura,
    fontWeight: "bold",
    fontSize: 16,
  },
});

// ===============================================
// COMPONENTE PERFIL
// ===============================================
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
          router.replace("/");
          return;
        }

        const user = userData.user;
        setEmail(user.email || "");

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
    router.replace("/");
  };

  // Tela de carregamento
  if (carregando) {
    return (
      <View
        style={[
          perfilStyles.containerPerfil,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.secundaria} />
      </View>
    );
  }

  return (
    <View style={perfilStyles.containerPerfil}>
      {/* INÍCIO DA CAIXA (PROFILE BOX) */}
      <View style={perfilStyles.profileBox}>
        {modoEdicao ? (
          <>
            {/* INPUTS DE EDIÇÃO */}
            <TextInput
              style={perfilStyles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              keyboardType="email-address"
              placeholderTextColor={colors.textoIntermediario}
            />
            <TextInput
              style={perfilStyles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="Nova senha (opcional)"
              secureTextEntry
              placeholderTextColor={colors.textoIntermediario}
            />

            {/* BOTÃO SALVAR */}
            <Pressable
              style={perfilStyles.actionButton}
              onPress={handleSalvar}
              disabled={carregando}
            >
              <Text style={perfilStyles.actionButtonText}>
                {carregando ? "Salvando..." : "Salvar"}
              </Text>
            </Pressable>

            {/* BOTÃO CANCELAR */}
            <Pressable
              onPress={() => setModoEdicao(false)}
              style={{ marginTop: 10 }}
            >
              <Text style={perfilStyles.logoutText}>Cancelar</Text>
            </Pressable>
          </>
        ) : (
          <>
            {/* TEXTOS (NOME E EMAIL) */}
            <Text style={perfilStyles.nomePerfil}>{nome}</Text>
            <Text style={perfilStyles.emailPerfil}>{email}</Text>

            {/* BOTÃO SAIR (FICA DENTRO DA CAIXA) */}
            <Pressable onPress={handleLogout}>
              <Text style={perfilStyles.logoutText}>Sair</Text>
            </Pressable>
          </>
        )}
      </View>
      {/* FIM DA CAIXA (PROFILE BOX) */}

      {/* LINHA SEPARADORA ABAIXO DA CAIXA (e do botão Editar) */}
      <View style={perfilStyles.separatorContainer}>
        <View style={perfilStyles.separatorLine} />
      </View>

      {/* BOTÃO EDITAR PERFIL (AGORA FORA DA CAIXA) */}
      {!modoEdicao && (
        <View style={perfilStyles.editButtonContainer}>
          <Pressable
            style={perfilStyles.actionButton}
            onPress={() => setModoEdicao(true)}
          >
            <Text style={perfilStyles.actionButtonText}>Editar Perfil</Text>
          </Pressable>
        </View>
      )}

      {/* O restante do conteúdo da página pode vir aqui, se houver */}

      {/* MENU INFERIOR FIXO */}
      <View style={perfilStyles.bottomMenu}>
        <TouchableOpacity onPress={() => router.push("/inicial")}>
          <Text style={perfilStyles.menuItem}>Músicas</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/perfil")}>
          <Text style={perfilStyles.menuItem}>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
