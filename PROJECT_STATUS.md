# フローチャートアプリ - プロジェクト状況

**最終更新**: 2025-12-04 15:03  
**バージョン**: v1.5.1  
**プロジェクト場所**: `C:\Users\user\Desktop\flowchart-app`

---

## ✅ 実装済み機能

### 基本機能
- ✅ Start/End/Execution/Conditionノードの配置
- ✅ ノード間の接続(エッジ)
- ✅ テキストの編集(ダブルクリック)
- ✅ ノードのリサイズ
- ✅ **ノード・エッジの削除機能** (v1.5.0で追加)
  - 選択してDeleteキーまたはBackspaceキーで削除可能
- ✅ エクスポート機能(PNG, JSON, Text, Mermaid)
- ✅ インポート機能(JSON)
- ✅ 自動整形機能(縦方向)
- ✅ クリアオール機能

### ノードの詳細
- **Start/Endノード**: 楕円形、固定サイズ
- **Executionノード**: 長方形、リサイズ可能 (v1.5.1で接続点を改善)
  - 上部ハンドル: target (入力のみ) - 1つ
  - 下部ハンドル: source (出力のみ) - 1つ
  - 標準的なフローチャートの上から下への流れに対応
- **Conditionノード**: ダイヤモンド形、リサイズ可能
  - True: 下部ハンドル(緑色)
  - False: 左右ハンドル(赤色) - **片方使用すると他方が非表示**

### UI改善
- ✅ ハンドルサイズ: 18px(つかみやすく)
- ✅ ノードのドラッグ判定改善(nodragクラス使用)
- ✅ 条件分岐ノードの当たり判定改善
- ✅ バージョン表示: 左上に表示
- ✅ **接続点の重複を解消** (v1.5.1で修正)

---

## 🎉 更新履歴

### v1.5.1 (2025-12-04 15:03)
**UI修正:**
- ✅ Executionノードの接続点重複を解消
  - 以前：上部に2つ、下部に2つのハンドルが重なっていた
  - 修正後：上部に1つ(入力)、下部に1つ(出力)のシンプルな構造
  - 見た目がすっきりし、標準的なフローチャートの流れに対応

**変更箇所**: `CustomNodes.tsx` ExecutionNode (127-209行目)

```typescript
deleteKeyCode="Delete"
```

### v1.4.0 (2025-12-04 14:41)
**修正内容:**
- ✅ ドラッグ&ドロップ機能の復元（screenToFlowPositionを使用）
- ✅ 実行ノードの接続ハンドル改善
  - 下部の2つのハンドルを1つに統合
  - 上下両方のハンドルを双方向対応(target + source)に変更
  - 下から上への接続が可能

**変更箇所**: 
- `FlowchartBuilder.tsx` - onDrop関数
- `CustomNodes.tsx` - ExecutionNode

---

## 📁 VS Codeで開くフォルダ

```
C:\Users\user\Desktop\flowchart-app
```

このフォルダをVS Codeで開いて、ファイルを直接編集してください。

---

## 🚀 開発サーバーの起動

```powershell
cd C:\Users\user\Desktop\flowchart-app
npm run dev
```

ブラウザ: `http://localhost:5173`

---

## 🔧 主要ファイル

- `src/components/FlowchartBuilder.tsx` - メインコンポーネント
- `src/components/nodes/CustomNodes.tsx` - ノード定義
- `src/utils/export.ts` - エクスポート機能

---

**次のアクション**: VS Codeで`C:\Users\user\Desktop\flowchart-app`を開いて、`FlowchartBuilder.tsx`の`onDrop`関数を修正
