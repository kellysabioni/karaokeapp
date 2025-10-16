// src/styles/global.
import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_escura,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textoIntermediario,
  },
  logo: {
    width: 180,
    height: 180,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 90,
    borderRadius: 90,
  },
  input: {
    backgroundColor: "#fafafaca",
    color: colors.primariaEscura,
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1.3,
    borderColor: colors.primaria,
  },
  button: {
    backgroundColor: colors.secundaria,
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
  },
  buttonText: {
    color: colors.primaria,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  button2: {
    backgroundColor: "#fafafad5",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: colors.secundaria,
  },
  buttonText2: {
    color: colors.bg_escura,
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: colors.secundariaEscura,
    fontSize: 12,
    textAlign: "center",
    marginBottom: 18,
    alignSelf: "center", // centraliza o texto sem expandir o Link
    display: "flex", // garante que o conteúdo não estique
    width: "auto", // área clicável = apenas o texto
  },
  link2: {
    flexDirection: "row",
    justifyContent: "center",
    color: colors.primariaEscura,
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
    backgroundColor: colors.secundariaEscura, // Cor da linha
  },
  text: {
    color: colors.secundariaEscura, // Cor do texto
    marginHorizontal: 10, // Espaço entre o texto e as linhas
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    width: "85%",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaria,
    marginBottom: 12,
    textAlign: "center",
  },
  containerInicial: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: colors.primariaClara,
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: colors.secundariaEscura,
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: { color: colors.primariaClara, fontWeight: "600" },
  musicaItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  albumArt: { width: 50, height: 50, borderRadius: 5, marginRight: 10 },
  musicaInfo: { flex: 1 },
  titulo: { fontSize: 16, fontWeight: "bold" },
  cantor: { fontSize: 12, color: "#888" },
  btnCantar: {
    backgroundColor: colors.secundariaEscura,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  btnCantarText: { color: colors.primariaClara, fontWeight: "bold" },
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: colors.primariaClara,
  },
  menuItem: {
    color: colors.secundariaEscura,
    fontWeight: "bold",
    fontSize: 16,
  },
  nomePerfil: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.secundaria,
    marginBottom: 6,
    textAlign: "center",
  },
  emailPerfil: {
    fontSize: 16,
    color: colors.white,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonPerfil: {
    width: "100%",
    marginTop: 30,
  },
});
