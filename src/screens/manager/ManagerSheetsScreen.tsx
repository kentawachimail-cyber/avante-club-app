import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, Alert, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTeam } from '../../context/TeamContext';
import { useMemberProfiles, MemberProfile } from '../../context/MemberProfileContext';

const BRAND_COLOR = '#1A3C5E';
const BG = '#F5F7FA';
const SURFACE = '#FFFFFF';
const BORDER = '#E2E6EA';
const TEXT = '#1A1A2E';
const TEXT2 = '#888899';

// 外部スプレッドシート（経費・月謝）
const EXTERNAL_SHEETS = [
  {
    id: 'expense',
    icon: '△',
    title: '経費精算シート',
    description: '指導者から送信された経費・領収書の一覧',
    url: 'https://docs.google.com/spreadsheets/d/YOUR_EXPENSE_SHEET_ID/edit',
    color: '#1DB954',
  },
  {
    id: 'payment',
    icon: '¥',
    title: '月謝支払い管理シート',
    description: '会員ごとの月謝支払い状況・引き落とし履歴',
    url: 'https://docs.google.com/spreadsheets/d/YOUR_PAYMENT_SHEET_ID/edit',
    color: '#E8A020',
  },
];

// ──────────────────────────────────────────────
// 顧客管理モーダル
// ──────────────────────────────────────────────
function CustomerManagementModal({
  visible,
  onClose,
  profiles,
}: {
  visible: boolean;
  onClose: () => void;
  profiles: MemberProfile[];
}) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={modal.container}>
        <View style={modal.header}>
          <Text style={modal.headerTitle}>顧客管理シート</Text>
          <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
            <Text style={modal.closeBtnText}>閉じる</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={modal.content}>
          <View style={modal.countRow}>
            <Text style={modal.countText}>登録会員数：</Text>
            <Text style={modal.countNum}>{profiles.length}名</Text>
          </View>

          {profiles.length === 0 ? (
            <View style={modal.empty}>
              <Text style={modal.emptyIcon}>○</Text>
              <Text style={modal.emptyText}>まだ登録された会員がいません</Text>
            </View>
          ) : (
            profiles.map(profile => (
              <View key={profile.id} style={modal.card}>
                <View style={modal.cardHeader}>
                  <Text style={modal.cardName}>{profile.name}</Text>
                  <Text style={modal.cardCohort}>{profile.cohort}</Text>
                </View>
                <View style={modal.row}>
                  <Text style={modal.fieldLabel}>フリガナ</Text>
                  <Text style={modal.fieldValue}>{profile.furigana}</Text>
                </View>
                <View style={modal.row}>
                  <Text style={modal.fieldLabel}>生年月日</Text>
                  <Text style={modal.fieldValue}>{profile.birthDate}</Text>
                </View>
                <View style={modal.row}>
                  <Text style={modal.fieldLabel}>メール</Text>
                  <Text style={modal.fieldValue}>{profile.email}</Text>
                </View>
                <View style={modal.row}>
                  <Text style={modal.fieldLabel}>登録日</Text>
                  <Text style={modal.fieldValue}>{profile.registeredAt}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// ──────────────────────────────────────────────
// メイン画面
// ──────────────────────────────────────────────
export default function ManagerSheetsScreen() {
  const { settings } = useTeam();
  const { profiles } = useMemberProfiles();
  const [customerModalVisible, setCustomerModalVisible] = useState(false);

  const openSheet = (url: string, title: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert('エラー', `「${title}」を開けませんでした。URLを確認してください。`)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: settings.primaryColor }]}>
        <Text style={styles.headerTitle}>管理シート</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            このページは管理者のみ閲覧できます。
          </Text>
        </View>

        {/* 顧客管理（アプリ内） */}
        <TouchableOpacity style={styles.card} onPress={() => setCustomerModalVisible(true)}>
          <View style={[styles.iconBox, { backgroundColor: '#4A90D9' }]}>
            <Text style={styles.icon}>○</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>顧客管理シート</Text>
            <Text style={styles.desc}>入会アンケートの回答一覧（名前・フリガナ・生年月日・期生）</Text>
            <Text style={styles.badge}>{profiles.length}名登録済み</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* 外部スプレッドシート */}
        {EXTERNAL_SHEETS.map(sheet => (
          <TouchableOpacity key={sheet.id} style={styles.card}
            onPress={() => openSheet(sheet.url, sheet.title)}>
            <View style={[styles.iconBox, { backgroundColor: sheet.color }]}>
              <Text style={styles.icon}>{sheet.icon}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{sheet.title}</Text>
              <Text style={styles.desc}>{sheet.description}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <CustomerManagementModal
        visible={customerModalVisible}
        onClose={() => setCustomerModalVisible(false)}
        profiles={profiles}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { backgroundColor: BRAND_COLOR, paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 16, gap: 14 },
  notice: {
    backgroundColor: '#EEF3F9', borderRadius: 12, padding: 14,
    borderLeftWidth: 4, borderLeftColor: BRAND_COLOR,
  },
  noticeText: { fontSize: 13, color: '#445', lineHeight: 20 },
  card: {
    backgroundColor: SURFACE, borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, color: '#fff', fontWeight: '700' },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  desc: { fontSize: 12, color: '#777', lineHeight: 18 },
  badge: { fontSize: 11, color: '#4A90D9', fontWeight: '700', marginTop: 4 },
  arrow: { fontSize: 24, color: '#bbb' },
});

const modal = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: BORDER, backgroundColor: SURFACE,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: TEXT, letterSpacing: 1 },
  closeBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  closeBtnText: { fontSize: 14, color: TEXT2 },
  content: { padding: 16, gap: 12 },
  countRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#EEF3F9', borderRadius: 8, padding: 12,
  },
  countText: { fontSize: 13, color: TEXT2 },
  countNum: { fontSize: 15, fontWeight: '800', color: BRAND_COLOR },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyIcon: { fontSize: 36, color: '#ccc' },
  emptyText: { fontSize: 14, color: TEXT2 },
  card: {
    backgroundColor: SURFACE, borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: BORDER, gap: 8,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 4,
  },
  cardName: { fontSize: 16, fontWeight: '700', color: TEXT },
  cardCohort: {
    fontSize: 11, fontWeight: '700', color: '#4A90D9',
    backgroundColor: '#EEF3F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20,
  },
  row: { flexDirection: 'row', gap: 8 },
  fieldLabel: { fontSize: 11, color: TEXT2, width: 64, fontWeight: '600' },
  fieldValue: { fontSize: 13, color: TEXT, flex: 1 },
});
