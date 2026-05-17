import { MaterialIcons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  LogBox,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import EmojiPicker from "react-native-emoji-chooser";

// Esconde avisos chatos no console
LogBox.ignoreLogs([
  "VirtualizedLists should never be nested",
  "Error saving recent emoji",
]);

// Retorna a data de hoje formatada em português
function formatarData() {
  return new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Componente de uma tarefa individual
function TarefaItem({ task, onToggle }) {
  return (
    <View style={styles.tarefaItem}>
      {/* Checkbox que marca/desmarca a tarefa */}
      <Checkbox
        value={task.done}
        onValueChange={() => onToggle(task.id)}
        color={task.done ? "#515CC6" : undefined}
        style={styles.checkbox}
      />
      <View style={styles.tarefaTextos}>
        {/* Nome da tarefa, riscado se concluída */}
        <Text style={[styles.tarefaNome, task.done && styles.tarefaNomeRiscado]}>
          {task.text}
        </Text>
        {/* Emoji e categoria aparecem só se a tarefa não estiver concluída */}
        {!task.done && (
          <View style={styles.categoriaRow}>
            <Text style={styles.tarefaEmoji}>{task.emoji}</Text>
            <Text style={styles.tarefaCategoria}>{task.category}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function App() {
  // Lista de tarefas
  const [tasks, setTasks] = useState([]);
  // Controla se o modal está aberto
  const [modalVisivel, setModalVisivel] = useState(false);
  // Campos do formulário
  const [novaTarefa, setNovaTarefa] = useState("");
  const [categoria, setCategoria] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  // Controla se o seletor de emojis está aberto
  const [emojiPickerAberto, setEmojiPickerAberto] = useState(false);

  // Separa as tarefas em dois grupos
  const incompletas = tasks.filter((t) => !t.done);
  const realizadas = tasks.filter((t) => t.done);

  // Fecha o modal e limpa todos os campos
  function fecharModal() {
    Keyboard.dismiss();
    setModalVisivel(false);
    setEmojiPickerAberto(false);
    setNovaTarefa("");
    setCategoria("");
    setSelectedEmoji("");
  }

  // Cria uma nova tarefa e adiciona na lista
  function adicionarTarefa() {
    if (!novaTarefa.trim()) return; // não deixa adicionar tarefa vazia

    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: novaTarefa.trim(),
        category: categoria.trim() || "Geral", // usa "Geral" se não informar categoria
        emoji: selectedEmoji,
        done: false,
      },
    ]);

    fecharModal();
  }

  // Marca ou desmarca uma tarefa como concluída
  function toggleTarefa(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Cabeçalho com data e resumo */}
      <View style={styles.header}>
        <Text style={styles.headerData}>{formatarData()}</Text>
        <Text style={styles.headerResumo}>
          {incompletas.length} incompletas, {realizadas.length} realizadas
        </Text>
      </View>

      {/* Lista de tarefas com scroll */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de tarefas pendentes */}
        <Text style={styles.secaoTitulo}>Incompletas</Text>
        {incompletas.length === 0 && (
          <Text style={styles.secaoVazia}>Nenhuma tarefa pendente 🎉</Text>
        )}
        {incompletas.map((task) => (
          <TarefaItem key={task.id} task={task} onToggle={toggleTarefa} />
        ))}

        {/* Seção de tarefas concluídas */}
        <Text style={[styles.secaoTitulo, { marginTop: 28 }]}>Realizadas</Text>
        {realizadas.length === 0 && (
          <Text style={styles.secaoVazia}>Nenhuma tarefa concluída ainda</Text>
        )}
        {realizadas.map((task) => (
          <TarefaItem key={task.id} task={task} onToggle={toggleTarefa} />
        ))}

        {/* Espaço para o botão + não cobrir a última tarefa */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão flutuante para abrir o modal */}
      <Pressable style={styles.fab} onPress={() => setModalVisivel(true)}>
        <MaterialIcons name="add" size={32} color="#fff" />
      </Pressable>

      {/* Modal de criar tarefa */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        {/* Sobe o conteúdo quando o teclado abre */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          {/* Toque fora do card fecha o modal */}
          <Pressable style={styles.overlay} onPress={fecharModal}>

            {/* Card branco — toque dentro não fecha o modal */}
            <Pressable
              style={styles.modalCard}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Campo de texto da tarefa */}
              <Text style={styles.modalLabel}>Tarefa</Text>
              <TextInput
                style={styles.inputModal}
                placeholder="Fazer as compras do mes"
                placeholderTextColor="#BDBDBD"
                value={novaTarefa}
                onChangeText={setNovaTarefa}
              />

              {/* Linha com emoji e categoria lado a lado */}
              <View style={styles.modalRow}>
                {/* Botão que abre o seletor de emojis */}
                <View style={styles.emojiCol}>
                  <Text style={styles.modalLabel}>Emoji</Text>
                  <Pressable
                    style={styles.emojiBotao}
                    onPress={() => setEmojiPickerAberto((p) => !p)}
                  >
                    <Text style={styles.emojiTexto}>{selectedEmoji}</Text>
                  </Pressable>
                </View>

                {/* Campo de texto da categoria */}
                <View style={styles.categoriaCol}>
                  <Text style={styles.modalLabel}>Categoria</Text>
                  <TextInput
                    style={styles.inputModal}
                    placeholder="Mercado"
                    placeholderTextColor="#BDBDBD"
                    value={categoria}
                    onChangeText={setCategoria}
                  />
                </View>
              </View>

              {/* Seletor de emojis — aparece só quando aberto */}
              {emojiPickerAberto && (
                <View style={styles.emojiPickerContainer}>
                  <EmojiPicker
                    onSelect={(emoji) => {
                      setSelectedEmoji(emoji);
                      setEmojiPickerAberto(false);
                    }}
                    mode="light"
                    lang="en"
                    columnCount={8}
                  />
                </View>
              )}

              {/* Botão de criar a tarefa */}
              <Pressable style={styles.btnCriar} onPress={adicionarTarefa}>
                <Text style={styles.btnCriarTexto}>Criar</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderBottomColor: "#FF4545",
  },
  headerData: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A2E",
    letterSpacing: -0.5,
  },
  headerResumo: {
    fontSize: 13,
    color: "#FF4545",
    marginTop: 2,
    fontWeight: "500",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9E9E9E",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  secaoVazia: {
    fontSize: 14,
    color: "#BDBDBD",
    marginBottom: 12,
    fontStyle: "italic",
  },
  tarefaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 12,
  },
  checkbox: {
    marginTop: 2,
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  tarefaTextos: { flex: 1 },
  tarefaNome: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A2E",
    lineHeight: 20,
  },
  tarefaNomeRiscado: {
    textDecorationLine: "line-through",
    color: "#BDBDBD",
    fontWeight: "400",
  },
  categoriaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 3,
  },
  tarefaEmoji: { fontSize: 12 },
  tarefaCategoria: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  fab: {
    position: "absolute",
    bottom: 36,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#515CC6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#515CC6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 12,
    flexShrink: 1,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9E9E9E",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  inputModal: {
    backgroundColor: "#F5F5F5",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1A1A2E",
  },
  modalRow: {
    flexDirection: "row",
    gap: 12,
  },
  emojiCol: { width: 72 },
  emojiBotao: {
    backgroundColor: "#F5F5F5",
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiTexto: { fontSize: 24 },
  categoriaCol: { flex: 1 },
  emojiPickerContainer: {
    height: 180,
    overflow: "hidden",
    borderRadius: 10,
  },
  btnCriar: {
    backgroundColor: "#515CC6",
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  btnCriarTexto: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});