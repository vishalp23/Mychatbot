import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useChatSessions } from '../context/ChatSessionContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../navigation/types';

const CustomDrawerContent = (props: any) => {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    addSession,
    deleteSession,
    renameSession,
  } = useChatSessions();

  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [renameMode, setRenameMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');

  const createNewChat = () => {
    const newId = Date.now().toString();
    addSession(newId);
    setCurrentSessionId(newId);
    navigation.navigate('Chat', { sessionId: newId });
  };

  const openMenu = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setMenuVisible(true);
    setRenameMode(false);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedSessionId(null);
  };

  const confirmDelete = () => {
    if (selectedSessionId) {
      Alert.alert('Delete Chat', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSession(selectedSessionId);
            closeMenu();
          },
        },
      ]);
    }
  };

  const handleRename = () => {
    setRenameMode(true);
    const session = sessions.find((s) => s.id === selectedSessionId);
    setEditTitle(session?.title || '');
  };

  const saveRename = () => {
    if (selectedSessionId && editTitle.trim()) {
      renameSession(selectedSessionId, editTitle.trim());
    }
    closeMenu();
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.newChatButton} onPress={createNewChat}>
        <Ionicons name="add" size={20} color="#000" />
        <Text style={styles.newChatText}>New Chat</Text>
      </TouchableOpacity>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chatRow}>
            <TouchableOpacity
              style={[
                styles.chatItem,
                item.id === currentSessionId && styles.activeSession,
              ]}
              onPress={() => {
                setCurrentSessionId(item.id);
                navigation.navigate('Chat', { sessionId: item.id });
              }}
            >
              <Ionicons name="chatbubble-outline" size={18} color="#000" />
              <Text style={styles.chatTitle}>{item.title}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuIcon}
              onPress={() => openMenu(item.id)}
            >
              <Entypo name="dots-three-horizontal" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu}>
          <View style={styles.menuContainer}>
            {renameMode ? (
              <>
                <TextInput
                  value={editTitle}
                  onChangeText={setEditTitle}
                  style={styles.renameInput}
                  autoFocus
                  onSubmitEditing={saveRename}
                />
                <TouchableOpacity onPress={saveRename}>
                  <Text style={styles.menuItem}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity onPress={handleRename}>
                  <Text style={styles.menuItem}>Rename</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDelete}>
                  <Text style={[styles.menuItem, { color: 'red' }]}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#FAF7F1',
    flex: 1,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  newChatText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  chatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeSession: {
    backgroundColor: '#DDD',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  chatTitle: {
    marginLeft: 8,
    fontSize: 15,
    color: '#000',
  },
  menuIcon: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  menuContainer: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
  },
  renameInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    fontSize: 16,
  },
});

export default CustomDrawerContent;
