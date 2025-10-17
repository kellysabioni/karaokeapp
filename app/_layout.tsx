import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

// Importar o tipo Session para evitar o erro de TypeScript
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// --- Componente de Layout Protegido ---
function ProtectedLayout() {
  const router = useRouter();
  const segments = useSegments();

  // Define que a sessão pode ser do tipo Session ou null
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ CORREÇÃO: Define quais rotas são PUBLICAS.
  // O segmento para a raiz (index.tsx) é uma string vazia ('').
  const isPublicRoute =
    segments[0] === "" || // index.tsx (Login)
    segments[0] === "cadastro"; // cadastro.tsx

  // 1. Verificar a sessão inicial e configurar o listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Lógica de Redirecionamento CENTRALIZADA
  useEffect(() => {
    if (loading) return;

    if (!session && !isPublicRoute) {
      // Se NÃO está logado E NÃO está em uma rota pública
      // -> Redireciona para o Login (/)
      console.log("Usuário deslogado. Redirecionando para login (/).");
      router.replace("/");
    } else if (session && isPublicRoute) {
      // Se ESTÁ logado E está em uma rota pública (Login ou Cadastro)
      // -> Redireciona para a Inicial (/inicial)
      console.log("Usuário logado. Redirecionando para inicial (/inicial).");
      router.replace("/inicial");
    }
  }, [session, loading, isPublicRoute]);

  if (loading) {
    // Exibe um loading enquanto a sessão é verificada
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1c1433",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // 3. Renderiza o Stack de navegação (após a verificação)
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1c1433",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Remove o cabeçalho para as telas de Login e Cadastro */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ headerShown: false }} />
    </Stack>
  );
}

// --- Layout Principal ---
export default function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1c1433" />
      <ProtectedLayout />
    </SafeAreaProvider>
  );
}
