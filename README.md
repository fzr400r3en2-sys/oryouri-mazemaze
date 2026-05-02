# おりょうりまぜまぜ

2歳10か月くらいの子どもが、10インチタブレットのブラウザで触って遊べる料理ごっこゲームの初版です。

勝ち負け、点数、制限時間、ゲームオーバーはありません。材料を選んで、ボウルに入れて、まぜて、できあがりを見るだけの短いサイクルです。

## 作成ファイル

- `index.html` ゲーム画面
- `styles.css` 見た目とアニメーション
- `app.js` ゲームの状態管理と操作
- `manifest.webmanifest` ホーム画面追加用のPWA設定
- `sw.js` 初回読み込み後のオフラインキャッシュ
- `README.md` この説明

## スマホ・タブレットで遊ぶ準備

GitHub Pagesの公開URLは、通常は次を使います。

```text
https://fzr400r3en2-sys.github.io/oryouri-mazemaze/
```

公開URLを確認するには次を実行します。

```powershell
python tools/resolve_public_url.py --show-source
```

iPhoneで読み込むQRコードを生成するには次を実行します。

```powershell
python tools/generate_iphone_qr.py
```

生成されるファイル:

- `iphone-qr.svg`
- `iphone-qr.html`

PCで `iphone-qr.html` を開き、iPhoneのカメラでQRコードを読み込むとゲームURLを開けます。

Androidタブレットで読み込むQRコードを生成するには次を実行します。

```powershell
python tools/generate_iphone_qr.py --svg android-qr.svg --html android-qr.html --device-name Androidタブレット --browser-name Chrome
```

生成されるファイル:

- `android-qr.svg`
- `android-qr.html`

PCで `android-qr.html` を開き、AndroidタブレットのカメラでQRコードを読み込むとゲームURLを開けます。

iPhone側の操作:

1. QRコードを読み込む
2. Safariで開く
3. Safariの共有ボタンから「ホーム画面に追加」を選ぶ
4. 「追加」を押す
5. 次回からホーム画面の「まぜまぜ」アイコンで開く

iOSの仕様上、「ホーム画面に追加」はWebサイト側から完全自動では実行できません。初回にSafariで開いた時だけ、画面下に短い案内を表示します。ホーム画面アイコンから開いた時は案内を出しません。

Service WorkerはHTTPSまたはlocalhostで動きます。GitHub Pagesで初回読み込みした後は、ゲーム本体、完成料理SVG、アプリアイコンをキャッシュし、可能な範囲でオフラインでも遊べるようにします。iOSの容量管理でキャッシュが消えることはあります。

公開URLが違う場合は、次の優先順位でURLを指定できます。

1. 環境変数 `PUBLIC_URL`
2. `public_url.txt`
3. 固定既定値 `https://fzr400r3en2-sys.github.io/oryouri-mazemaze/`
4. `git remote get-url origin` から推定
5. 推定できない場合は `public_url.sample.txt` を参考に `public_url.txt` を作成

PowerShellで一時的にURLを指定してQRを作る例:

```powershell
$env:PUBLIC_URL = "https://example.com/oryouri-mazemaze/"
python tools/generate_iphone_qr.py
```

Androidタブレット用QRも同じ `PUBLIC_URL` を使います。

## GitHub Pages公開手順

1. 変更を `https://github.com/fzr400r3en2-sys/oryouri-mazemaze.git` にpushする
2. GitHubのリポジトリ設定で Pages を開く
3. Sourceを `Deploy from a branch` にする
4. Branchを `main`、フォルダを `/ (root)` にする
5. 公開後、`https://fzr400r3en2-sys.github.io/oryouri-mazemaze/` を開いて表示を確認する
6. 必要なら `python tools/generate_iphone_qr.py` を再実行してiPhone用QRを作り直す
7. Android用QRは `python tools/generate_iphone_qr.py --svg android-qr.svg --html android-qr.html --device-name Androidタブレット --browser-name Chrome` で作り直す

## PCでの確認方法

一番簡単な確認は、`index.html` をブラウザで開く方法です。

PowerShellでこのフォルダにいる場合:

```powershell
Start-Process .\index.html
```

タッチ操作に近い確認をしたい場合は、ChromeやEdgeの開発者ツールでタブレット幅に切り替えてください。

## タブレットでの確認方法

PCとタブレットが同じWi-Fiにいる状態で、PC側から簡易サーバを起動します。

```powershell
.\venv\Scripts\python.exe -m http.server 8000
```

別のPowerShellでPCのIPアドレスを確認します。

```powershell
ipconfig
```

タブレットのブラウザで次のように開きます。

```text
http://PCのIPアドレス:8000/
```

例:

```text
http://192.168.1.20:8000/
```

## 実装内容

- タイトル画面で「ぱんけーき」「かれー」「じゅーす」「ぷりん」「ぜりー」「あいす」から選べます。
- 材料カードをタップすると、ボウルに材料が入ります。
- 3個以上入れると「まぜまぜへ」ボタンが出ます。
- 材料は6個以上入れても、ボウル内で小さくまとまりながら見た目に反映されます。まぜる画面へ進む時は「まぜまぜへ」ボタンを押します。
- まぜる画面では、大きい「まぜる」ボタンか、ボウルをなぞる操作で進みます。
- 一定回数まぜると、選んだ材料の色を少し反映した完成料理が出ます。
- 完成画面では、生成済みの完成料理SVGを優先して表示します。SVGが読めない場合は、既存のCSS/DOM描画に戻ります。
- 完成画面から同じ料理をもう一回遊ぶか、別の料理に戻れます。

## 完成料理SVGの生成方法

完成料理のSVG素材は、Python標準ライブラリだけを使うスクリプトで生成できます。外部の画像生成AI APIや外部画像素材は使いません。

```powershell
python tools/generate_dish_assets.py
```

生成先は `assets/images/dishes/` です。スクリプトは何度実行しても同じ内容を出力し、既存ファイルは上書きします。

生成されるファイル:

- `assets/images/dishes/pancake.svg`
- `assets/images/dishes/curry.svg`
- `assets/images/dishes/juice.svg`
- `assets/images/dishes/pudding.svg`
- `assets/images/dishes/jelly.svg`
- `assets/images/dishes/icecream.svg`
- `assets/images/dishes/preview.html`

`assets/images/dishes/preview.html` をブラウザで開くと、6種類の完成料理SVGを一覧で確認できます。ゲーム本体とは独立した確認用ページです。

## PWAアイコンの生成方法

アプリアイコンは外部画像素材を使わず、Python標準ライブラリだけで生成します。

```powershell
python tools/generate_app_icons.py
```

生成される主なファイル:

- `assets/icons/icon.svg`
- `assets/icons/icon-180.svg`
- `assets/icons/icon-192.svg`
- `assets/icons/icon-512.svg`
- `assets/icons/apple-touch-icon.png`
- `favicon.ico`

## 改善メモ

- 材料カードと主要ボタンを大きめに調整しました。
- 最初に触る場所が分かりやすいよう、材料カード側にやさしい視覚ガイドを追加しました。
- 材料投入時に、材料がボウルへ飛んで入る小さな演出を追加しました。
- まぜる画面に、ぐるぐる操作を示す視覚ガイドと、まぜるたびの波紋を追加しました。
- 完成時の飾り位置と形が少し変わるようにしました。
- ボウル内の材料を丸ではなく、たまご、粉、牛乳、野菜、果物などの簡易パーツで表示するようにしました。
- パンケーキ、カレー、ジュースで、まぜ中の色・具・泡の見た目を分けました。
- 完成画面は途中材料を消し、完成料理専用の見た目だけを表示します。
- 材料を選んでいる途中に勝手にまぜ画面へ進まないようにしました。
- 6個以上の材料を選んだ時も、具材アイコンとまとまり表示で量が増えたことが分かるようにしました。
- まぜ中の描画を料理ごとに分け、パンケーキは生地、カレーはルーと具、ジュースは液体と泡が変化するようにしました。
- 料理に「ぷりん」「ぜりー」「あいす」を追加しました。
- 新しい料理も、まぜ中の質感と完成品の見た目をそれぞれ分けています。

## 方針メモ

- 説明を読まなくても触って進むように、文字は短めにしています。
- 否定表現、失敗扱い、点数、タイマーは入れていません。
- 音は入れていません。無音でも成立するよう、タップ反応とアニメーションを入れています。
- 外部依存はありません。
- 画面のタップ領域は大きめにしています。

## 今後の拡張ポイント

- やさしい短い効果音を、保護者が許容しやすい音量で追加する。
- 材料をドラッグしてボウルへ入れる操作を追加する。
- 完成料理の見た目パターンを増やす。
- 背景やボウルの色を料理ごとに少し変える。
