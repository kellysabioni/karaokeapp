import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Image, Alert, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { supabase } from "../supabase/supabase";
import { styles } from "../styles/global";
import "react-native-url-polyfill/auto";
import { Session } from "@supabase/supabase-js";

export default function Cadastro() {
  return (
    <View style={[styles.container, { justifyContent: "flex-start" }]}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View>
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCapitalize="none"
        />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry />
        <TextInput
          style={styles.input}
          placeholder="Confirme a senha"
          secureTextEntry
        />
        <View>
          <Pressable style={[styles.button]}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </Pressable>

          <View style={styles.separador_cont}>
            <View style={styles.line} />
            <Text style={styles.text}>ou</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={[styles.button2]}>
            <Link href="/" style={styles.buttonText2}>
              Fazer login
            </Link>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
