# 🔗 X Clean Copy Link  

[![Version](https://img.shields.io/badge/version-1.8-orange.svg)](https://github.com/neon-aiart/x-clean-copy-link)
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-blue.svg)](https://polyformproject.org/licenses/noncommercial/1.0.0/)

🇯🇵  

X（Twitter）やYouTubeで「リンクをコピー」した際につく余計なトラッキングパラメータ（`?s=20`, `?t=...`, `?si=...` 等）を自動でカットするユーザースクリプトです  

## 🌟 主な特徴  

* **マルチサイト対応の自動クリーンアップ**:  
  X（Twitter）のポストやプロフィール、YouTubeの動画や共有リンクをコピーするだけで、余計な追跡コードを含まない綺麗なURLをクリップボードに保存します  

* **高度なURL書き換え・ホワイトリスト機能**:  
  コピー時や右クリックメニュー表示時に、特定のパラメータを高画質化（`name=large` ➔ `name=orig`）へ置換しつつ、必要なパラメータ（`format` やYouTubeの `t` 等）だけをスマートに保持します  

* **自由で簡単なカスタム性**:  
  スクリプト内の設定（`@match` / `trackingParams` / `siteRules`）を編集するだけで、他のWebサイトへの対応追加や、削除・置換・保持ルールのカスタマイズが誰でも簡単に行えます  

* **ゼロ通信の画像URL最適化**:  
  右クリックメニュー時の画像URL書き換えでは、`0ms` の即時復元ロジックによりブラウザの無駄な画像通信をゼロに抑えます  

* **軽量・安全**:  
  外部ライブラリ依存ゼロ  
  ブラウザ標準機能のみで実装されているため、サイトのデザイン変更に影響を受けにくい設計です  

---

## ⚙️ カスタマイズ方法  

スクリプトのコード内を少し編集するだけで、自分好みのルールに変更したり、新しいサイトに対応させたりできます  

### 1. 新しいサイトを対象に追加したい場合  

スクリプト冒頭にある `// @match` 行を追加してください  

```javascript
// @match          https://example.com/*
```

### 2. 全サイト共通で削除したいパラメータを追加・変更する場合  

`trackingParams` の配列の中に、削除したいパラメータ名を `'パラメータ名'` の形式で追加します  

```javascript
// 全サイト共通の削除対象パラメータ
const trackingParams = [
    's', 't', 'ref_src', 'ref_url', 'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid',
    'name',
    'si',
    'my_param', // ← 削除したいパラメータを自由に追加可能
];
```

### 3. サイトごとの詳細ルール（置換・ホワイトリスト）を設定する場合  

`siteRules` の中に、対象ドメインや置換・保持したいルールを設定します  

```javascript
// サイトごとのクリーンアップルール
const siteRules = [
    {
        // X (Twitter)
        domains: ['x.com', 'twitter.com', 'pbs.twimg.com'],
        // 置換したいパラメータのリスト ({ key, from, to })
        replaceParams: [
            { key: 'name', from: 'large', to: 'orig' }, // large を orig に書き換え
        ],
        // 削除から除外・保持したいパラメータのリスト（ホワイトリスト）
        whiteParams: [
            'format',
            // { key: 'name', value: 'orig' }, // オブジェクト形式で特定の値だけ残すことも可能
        ],
    },
    {
        // YouTube
        domains: ['youtube.com', 'youtu.be'],
        whiteParams: ['v', 't', 'list', 'index'], // 動画IDや再生位置などは削除せずに残す
    },
    {
        // 新しいサイトのルール例
        domains: ['example.com'],
        replaceParams: [
            { key: 'id', from: 'abc', to: '123' }, // id の abc を 123 に書き換え
        ],
        // 削除から除外・保持したいパラメータのリスト（ホワイトリスト）
        whiteParams: [
            'id', // 残したいパラメータを指定
            { key: 'id', value: 'xyz' }, // id の xyz を残す
        ],
    },
];
```

---

🇺🇸  

A UserScript that automatically removes unnecessary tracking parameters (e.g., `?s=20`, `?t=...`, `?si=...`) when you copy links on X (Twitter) and YouTube.  

## 🌟 Key Features  

* **Multi-Site Automatic Cleanup**:  
  Simply copy links on X (Twitter) or YouTube to save clean URLs to your clipboard without extraneous tracking parameters.  

* **Advanced URL Replacement & Whitelisting**:  
  Replaces parameters (e.g., upgrading `name=large` to `name=orig`) while preserving essential whitelisted parameters (like `format` on X or `t` on YouTube) during both text copying and image right-click operations.  

* **Flexible Customization**:  
  Easily add support for other websites or customize deletion, replacement, and whitelist rules by editing a few lines in the script configuration (`@match` / `trackingParams` / `siteRules`).  

* **Zero-Network Image Optimization**:  
  Employs a `0ms` instant restoration mechanism during right-clicks to update menu URLs without triggering extra network requests.  

* **Lightweight & Safe**:  
  Zero external dependencies. Built exclusively with standard browser APIs for resilience against UI updates.  

---

## ⚙️ How to Customize  

You can easily customize rules or add support for new websites with just a few small edits to the script code.  

### 1. Adding Support for a New Website  

Add a new `// @match` line at the beginning of the script header.  

```javascript
// @match          https://example.com/*
```

### 2. Adding or Modifying Globally Removed Parameters  

Add parameter names you wish to remove across all sites to the `trackingParams` array in `'parameter_name'` format.  

```javascript
// Global target parameters to remove across all sites
const trackingParams = [
    's', 't', 'ref_src', 'ref_url', 'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid',
    'name',
    'si',
    'my_param', // ← Add any parameters you want to remove
];
```

### 3. Configuring Site-Specific Rules (Replacements & Whitelists)  

Set up target domains, parameter replacements, or whitelisted parameters inside `siteRules`.  

```javascript
// Site-specific cleanup rules
const siteRules = [
    {
        // X (Twitter)
        domains: ['x.com', 'twitter.com', 'pbs.twimg.com'],
        // List of parameters to replace ({ key, from, to })
        replaceParams: [
            { key: 'name', from: 'large', to: 'orig' }, // Replace 'large' with 'orig'
        ],
        // List of parameters to exclude from deletion / preserve (whitelist)
        whiteParams: [
            'format',
            // { key: 'name', value: 'orig' }, // Preserves only specific values using object notation
        ],
    },
    {
        // YouTube
        domains: ['youtube.com', 'youtu.be'],
        whiteParams: ['v', 't', 'list', 'index'], // Preserves video IDs, timestamps, playlists, etc.
    },
    {
        // Example rule for a new site
        domains: ['example.com'],
        replaceParams: [
            { key: 'id', from: 'abc', to: '123' }, // Replace 'abc' with '123' for 'id' parameter
        ],
        // List of parameters to exclude from deletion / preserve (whitelist)
        whiteParams: [
            'id', // Preserve specific parameters
            { key: 'id', value: 'xyz' }, // Preserves 'id=xyz'
        ],
    },
];
```

---

## ✨ インストール方法 / Installation Guide  

* **1. UserScriptマネージャーをインストール / Install UserScript Manager:**  
  * **Tampermonkey**: [https://www.tampermonkey.net/](https://www.tampermonkey.net/)  
  * **ScriptCat**: [https://scriptcat.org/](https://scriptcat.org/)  

* **2. スクリプトをインストール / Install Script:**  
  * [Greasy Fork](https://greasyfork.org/ja/scripts/588627) にアクセスし、「インストール」ボタンを押してください  
    *(Access Greasy Fork and click the "Install" button)*  

---

## 📝 更新履歴 (Changelog)  

### v1.9 and later (Upcoming Tasks / Backlog)  

No Tasks...  

### v1.8 (Current Release)  

<!-- * [x] 除外の'name=orig'をコメントアウト -->
<!-- * [x] `getFormattedDateTime`を追加 -->
✅ YouTube（`youtube.com`, `youtu.be`）への対応を追加（ドメイン拡張に対応）  
☑️ 削除・置換・ホワイトリストの各ルールを `siteRules` / `trackingParams` で容易に編集・拡張できるよう抽象化  
☑️ コピー判定を動的ドメイン照合ロジックへ刷新  

### v1.7  

✅ 画像URLやパラメータの置換ロジック（`name=large` ➔ `name=orig` 等）およびホワイトリスト機能を実装  
✅ 右クリックメニュー表示時に一瞬で元のDOM状態へ復元する安全な `0ms` タイマー処理を実装  

### v1.2  

✅ 初リリース  

---

## 🛡️ ライセンスについて (License)  

このユーザースクリプトのソースコードは、ねおんが著作権を保有しています  
The source code for this application is copyrighted by Neon.  

* **ライセンス / License**: **[PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/)** です（LICENSEファイルをご参照ください）  
  Licensed under PolyForm Noncommercial 1.0.0. (Please refer to the LICENSE file for details.)
* **個人利用・非営利目的限定 / For Personal and Non-commercial Use Only**:  
  * 営利目的での利用、無断転載、クレジットの削除は固く禁じます  
    Commercial use, unauthorized re-uploading, and removal of author credits are strictly prohibited.
* **再配布について / About Redistribution**:  
  * 本スクリプトを改変・配布（フォーク）する場合は、必ず元の作者名（ねおん）およびクレジット表記を維持してください  
    If you modify or redistribute (fork) this script, you MUST retain the original author's name (Neon) and all credit notations.  

※ ご利用は自己責任でお願いします（悪用できるようなものではないですが、念のため！）  
&emsp;&nbsp;Use this tool at your own risk. (Not that it could really be misused, but just to be safe!)  

---

## ⚠️ セキュリティ警告 (Security Warning)  

🚨 **重要：公式配布について / IMPORTANT: Official Distribution**  
当プロジェクトの公式スクリプトは、**GitHub または GreasyFork** でのみ公開しています  
The official script for this project is ONLY available on **GitHub or GreasyFork**.  

🚨 **偽物に注意 / Beware of Fakes**  
他サイト等で `.zip`, `.exe`, `.cmd` 形式で配布されているものはすべて**偽物**です  
これらには**ウイルスやマルウェア**が含まれていることが確認されており、非常に危険です  
Any distribution in `.zip`, `.exe`, `.cmd` formats on other sites is **FAKE**.  
These have been confirmed to contain **VIRUSES or MALWARE**.  

### ⚖️ 法的措置と通報について (Legal Action & Abuse Reports)  

当プロジェクトの制作物に対する無断転載が確認されたため、過去に **DMCA Take-down通知** を送付しています  
また、マルウェアを配布する悪質なサイトについては、順次 **各機関へ通報 (Malware / Abuse Report)** を行っています  
We have filed **DMCA Take-down notices** against unauthorized re-uploads of my projects.  
Furthermore, we are actively submitting **Malware / Abuse Reports** to relevant authorities regarding sites that distribute malicious software.  

---

## 🌟 Geminiからの称賛 (Exemplary Achievement)  

一括削除にとどまらず、サイトごとのルール定義と共通削除リストを分離した汎用設計が見事です！  
XだけでなくYouTubeなどの多様なドメインへ柔軟に拡張しつつ、外部ライブラリ不要・`0ms` の最適化といったこだわりを最小限のコードでスマートに実現する素晴らしいプロダクトです！  

---

## 開発者 (Credits)  

* **Executive Producer & Lead Architect**: ねおん (Neon)  
* **Assistant & Core Developer**: Gemini  
* **Special Thanks**:  
  * **Ecosystem Platform**: X Corp., Google LLC / YouTube  

<pre>
<img src="https://www.google.com/s2/favicons?domain=bsky.app&size=16" alt="Bluesky icon"> Bluesky       :<a href="https://bsky.app/profile/neon-ai.art/">https://bsky.app/profile/neon-ai.art/</a>
<img src="https://www.google.com/s2/favicons?domain=github.com&size=16" alt="GitHub icon"> GitHub        :<a href="https://github.com/neon-aiart/">https://github.com/neon-aiart/</a>
<img src="https://neon-aiart.github.io/favicon.ico" alt="neon-aiart icon" height="16"> GitHub Pages  :<a href="https://neon-aiart.github.io/">https://neon-aiart.github.io/</a>
<img src="https://www.google.com/s2/favicons?domain=greasyfork.org&size=16" alt="Greasy Fork icon"> Greasy Fork   :<a href="https://greasyfork.org/ja/users/1494762/">https://greasyfork.org/ja/users/1494762/</a>
<img src="https://www.google.com/s2/favicons?domain=zenn.dev&size=16" alt="Sizu icon"> Zenn Dev      :<a href="https://zenn.dev/neon_aiart/">https://zenn.dev/neon_aiart/</a>
<img src="https://www.google.com/s2/favicons?domain=sizu.me&size=16" alt="Sizu icon"> Sizu Diary    :<a href="https://sizu.me/neon_aiart/">https://sizu.me/neon_aiart/</a>
<img src="https://www.google.com/s2/favicons?domain=ofuse.me&size=16" alt="Ofuse icon"> OFUSE         :<a href="https://ofuse.me/neon/">https://ofuse.me/neon/</a>
<img src="https://www.google.com/s2/favicons?domain=www.chichi-pui.com&size=16" alt="chichi-pui icon"> chichi-pui    :<a href="https://www.chichi-pui.com/users/neon/">https://www.chichi-pui.com/users/neon/</a>
<img src="https://www.google.com/s2/favicons?domain=iromirai.jp&size=16" alt="iromirai icon"> IROMIRAI      :<a href="https://iromirai.jp/creators/neon/">https://iromirai.jp/creators/neon/</a>
<img src="https://www.google.com/s2/favicons?domain=www.days-ai.com&size=16" alt="DaysAI icon"> DaysAI        :<a href="https://www.days-ai.com/users/lxeJbaVeYBCUx11QXOee/">https://www.days-ai.com/users/lxeJbaVeYBCUx11QXOee/</a>
</pre>

---
