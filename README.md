# Neo4j + Next.js 15 ユーザー関係性アプリ

DenoとNext.js 15、Neo4jを使ったシンプルなユーザー関係性可視化アプリケーション

## 🚀 特徴

- **Next.js 15** - App RouterとServer Componentsを活用
- **Neo4j** - グラフデータベースによる関係性管理
- **Deno** - モダンなJavaScript/TypeScriptランタイム
- **TypeScript** - 完全な型安全性
- **Tailwind CSS** - モダンでレスポンシブなUI
- **React Query** - 効率的なデータフェッチングとキャッシュ

## 📋 前提条件

1. **Deno** (v1.40以上)
   ```bash
   curl -fsSL https://deno.land/install.sh | sh
   ```

2. **Docker & Docker Compose** (推奨)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)をインストール

## 🛠 セットアップ

### 1. リポジトリをクローン
```bash
git clone <repository-url>
cd neo4j-try
```

### 2. 環境変数を設定
```bash
cp .env.example .env.local
```

`.env.local`を必要に応じて編集してください。Docker Composeを使用する場合は、デフォルト設定で動作します。

### 3. Neo4jデータベースを起動

**Docker Composeを使用（推奨）:**
```bash
# Neo4jを起動
docker-compose up -d

# ログを確認
docker-compose logs -f neo4j

# Neo4jが起動完了するまで待機（約30秒〜1分）
```

### 4. Neo4jブラウザで接続確認
ブラウザで http://localhost:7474 にアクセスし、以下の認証情報でログインできることを確認：
- **URI:** bolt://localhost:7687
- **ユーザー名:** neo4j
- **パスワード:** password

### 5. アプリケーションを起動
```bash
# 依存関係をインストールして開発サーバーを起動
deno task dev
```

初回実行時に自動的に依存関係がインストールされます。

## 🎯 使用方法

1. **ブラウザでアクセス**
   ```
   http://localhost:3000
   ```

2. **機能を試す**
   - **ユーザー管理タブ**: ユーザーの作成と一覧表示
   - **関係性管理タブ**: ユーザー間の関係性の作成と表示

## 🔗 Neo4j接続ツール

### Neo4j Browser（Web版）
DockerコンテナのNeo4jには、Webベースのブラウザが内蔵されています：

```
🌐 アクセス: http://localhost:7474

認証情報:
- Connect URL: bolt://localhost:7687
- Username: neo4j
- Password: password
```

**使用方法:**
1. ブラウザで http://localhost:7474 にアクセス
2. 接続情報を入力してログイン
3. Cypherクエリを直接実行可能

### Neo4j Desktop（デスクトップアプリ）
より高機能なデスクトップアプリケーションとしても利用できます：

**インストール手順:**
1. [Neo4j公式サイト](https://neo4j.com/download/)からNeo4j Desktopをダウンロード
2. macOS版をインストール（無料のアクティベーションキー必要）
3. アプリケーションを起動

**外部サーバー接続設定:**
1. Neo4j Desktopを起動
2. 左サイドバーの「Remote Connection」をクリック
3. 「Connect to a remote server」を選択
4. 接続情報を入力:
   - **Name:** Docker Neo4j（任意の名前）
   - **URL:** bolt://localhost:7687
   - **Username:** neo4j
   - **Password:** password
5. 「Connect」をクリック

**接続確認:**
```cypher
-- 簡単なテストクエリ
MATCH (n) RETURN count(n) as nodeCount
```

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── users/         # ユーザー関連API
│   │   └── relationships/ # 関係性関連API
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # メインページ
│   └── providers.tsx      # React Query プロバイダー
├── components/            # UIコンポーネント
│   ├── UserCard.tsx       # ユーザー表示カード
│   ├── UserForm.tsx       # ユーザー作成フォーム
│   └── RelationshipForm.tsx # 関係性作成フォーム
├── hooks/                 # カスタムフック
│   ├── useUsers.ts        # ユーザーデータ管理
│   └── useRelationships.ts # 関係性データ管理
└── lib/                   # ユーティリティとデータアクセス
    ├── neo4j.ts          # Neo4j接続とクエリ
    ├── types.ts          # TypeScript型定義
    ├── validations.ts    # Zodバリデーション
    └── utils.ts          # ユーティリティ関数
```

## 🔧 主要なCypherクエリ

### ユーザー作成
```cypher
CREATE (u:User {
  id: randomUUID(),
  name: $name,
  email: $email,
  createdAt: datetime().epochSeconds
})
RETURN u
```

### 関係性作成
```cypher
MATCH (from:User {id: $fromUserId}), (to:User {id: $toUserId})
CREATE (from)-[:FRIEND]->(to)
```

### ユーザーと関係性の取得
```cypher
MATCH (u:User {id: $userId})
OPTIONAL MATCH (u)-[:FRIEND]-(friend:User)
RETURN u, collect(friend) as friends
```

## 🚦 コマンド一覧

### アプリケーション
```bash
# 開発サーバー起動
deno task dev

# 本番ビルド
deno task build

# 本番サーバー起動
deno task start

# リンター実行
deno task lint
```

### Neo4j（Docker Compose）
```bash
# Neo4jを起動
docker-compose up -d

# Neo4jを停止
docker-compose down

# Neo4jを停止してデータも削除
docker-compose down -v

# ログを表示
docker-compose logs -f neo4j

# Neo4jコンテナに接続
docker-compose exec neo4j cypher-shell -u neo4j -p password
```

## 🎨 技術的な特徴

### Neo4j統合
- **シングルトンパターン**: 効率的な接続管理
- **セッション管理**: 適切なリソースクリーンアップ
- **エラーハンドリング**: 接続エラーの適切な処理

### Next.js 15活用
- **App Router**: ファイルベースルーティング
- **Server Components**: サーバーサイドデータフェッチング
- **API Routes**: RESTful API エンドポイント

### 型安全性
- **TypeScript**: 完全な型定義
- **Zod**: ランタイムバリデーション
- **型推論**: エンドツーエンドの型安全性

## 🐛 トラブルシューティング

### Neo4j接続エラー
```
Error: Neo4j connection failed
```
**解決方法:**
1. Neo4jが起動していることを確認: `docker-compose ps`
2. ヘルスチェックを確認: `docker-compose logs neo4j`
3. 接続情報（URI、ユーザー名、パスワード）を確認
4. ファイアウォール設定を確認

### Docker関連エラー
```bash
# Dockerコンテナを完全にリセット
docker-compose down -v
docker-compose up -d

# Dockerイメージを更新
docker-compose pull
docker-compose up -d --force-recreate
```

### 依存関係エラー
```bash
# Denoキャッシュをクリア
deno cache --reload deno.json
```

### ポートエラー
```bash
# ポート3000が使用中の場合
deno task dev --port 3001

# Neo4jのポートが使用中の場合
# docker-compose.ymlでポート番号を変更
```

## 📈 今後の拡張案

- [ ] グラフ可視化（D3.js / Vis.js）
- [ ] ユーザー検索機能
- [ ] 関係性の種類拡張
- [ ] パス検索機能
- [ ] リアルタイム更新
- [ ] 認証機能
- [ ] データエクスポート
- [ ] Neo4j Browser連携

## 📄 ライセンス

MIT License

