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
    textAlign: "center",
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
    color: colors.bg_escura,
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
    backgroundColor: colors.secundariaEscura, // Cor da linha
  },
  text: {
    color: colors.secundariaEscura, // Cor do texto
    marginHorizontal: 10, // Espaço entre o texto e as linhas
  },
});
