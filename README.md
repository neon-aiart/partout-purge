# 🧼 Partout Purge: Pure Clean Copy Link  

[![Version](https://img.shields.io/badge/version-2.0-orange.svg)](https://github.com/neon-aiart/x-clean-copy-link)
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial%201.0.0-blue.svg)](https://polyformproject.org/licenses/noncommercial/1.0.0/)

⭐ [スター](https://github.com/neon-aiart/x-clean-copy-link)をポチッとお願いします✨ (Please hit the [Star] button!)  

<a href="https://b.hatena.ne.jp/entry/panel/?url=https://github.com/neon-aiart/x-clean-copy-link"><img src="https://b.hatena.ne.jp/favicon.ico" width="20" height="20" alt="📖"></a> ポチッと[ブックマーク](https://b.hatena.ne.jp/entry/panel/?url=https://github.com/neon-aiart/x-clean-copy-link)をお願い致します✨ (Please click the [Bookmark] button!)  

---

🇯🇵  

X（Twitter）、YouTube、note、Bluesky、Amazonなどの主要サイトで、リンクや画像リンクの不要なトラッキングパラメータ（`?s=20`, `?t=...`, `?si=...` など）を自動削除し、最適化するUserScriptです（編集で拡張可能）  

## 🌟 主な特徴  

* **マルチサイト対応の自動クリーンアップ**:  
  X（Twitter）のポストやプロフィール、YouTubeの動画、Blueskyの画像、Amazonの商品リンクや画像などをコピーするだけで、追跡コードを含まない綺麗なURLをクリップボードに保存します  

* **充実したグローバル＆サイト別制御**:  
  全サイト共通の削除リスト（`TRACKING_PARAMS`）に加え、各サイトごとの詳細なルールを組み合わせることで、不要なパラメータの削除からパスの書き換えまでリンクを自在に最適化できます  
  * `removeParams`: 不要なトラッキングパラメータの削除  
  * `replaceParams`: パラメータの値を別の値に置換  
  * `whiteParams`: 削除対象から除外・保持したいパラメータを指定（ホワイトリスト）  
  * `replacePath`: URLのパスの一部を書き換え  
  *(🍙 すべてのルールやドメイン判定で正規表現（RegExp）が利用可能)*  

* **自由で簡単なカスタム性**:  
  スクリプト内の設定（`TRACKING_PARAMS` / `SITE_RULES`）を編集するだけで、他のWebサイトへの対応追加や、削除・置換・保持ルールのカスタマイズが誰でも簡単に行えます  

* **遅延ゼロの即時書き換え・復元ロジック**:  
  右クリックからの「リンクのコピー」「画像リンクをコピー」では、`0ms` のマクロタスクによる即時復元により、ブラウザの無駄な通信をゼロに抑えつつクリーンなURLをゲットできます  

* **軽量・安全**:  
  外部ライブラリ依存ゼロ  
  ブラウザ標準機能のみで実装されているため、サイトのデザイン変更に影響を受けにくい設計です  

---

## ⚙️ カスタマイズ方法  

スクリプトのコード内を少し編集するだけで、自分好みのルールに変更したり、新しいサイトに対応させたりできます  

### 1. 全サイト共通で削除したいパラメータを追加・変更する場合  

`TRACKING_PARAMS` の配列の中に、削除したいパラメータ名を `'a'` `` `b` `` `"c"` などの文字列形式か `/正規表現/` で追加します  

```javascript
    // 全サイト共通の削除対象パラメータ
    const TRACKING_PARAMS = ['s', 't', 'si', 'gclid', 'fbclid',
        /^ref_/, /^utm_/, // ← 「ref_」「utm_」で始まるパラメータに全部マッチ
    ];
```

### 2. サイトごとの詳細ルール（削除・置換・ホワイトリスト・パス書き換え）を設定する場合  

`SITE_RULES` では、対象となるドメインに対して、以下の４つの要素を組み合わせて柔軟なルールを設定できます  
すべてに文字列または正規表現が使えます  

* `domains`: 対象のドメイン  
* `removeParams`（パラメータの削除）: 指定したパラメータ名をURLから完全に削除します  
* `replaceParams`（パラメータの置換）: 特定のキーに一致するパラメータの値を別の値に書き換えます  
* `whiteParams`（削除からの保護）: 削除対象（`TRACKING_PARAMS` や `removeParams`）にヒットした場合でも、残したいパラメータを指定して保護します  
* `replacePath`（パス書き換え）: URLのパス階層そのものを書き換えます（高画質化や不要なパスの削ぎ落としに便利）  

> [!CAUTION]  
> `replaceParams`（値の置換）や `replacePath`（パスの書き換え）は、パラメータの削除・ホワイトリストの対象外です（独立して先に処理される）  
> `whiteParams` は `TRACKING_PARAMS` や `removeParams` による削除からパラメータを守りたい場合に設定します  

### 3. 書き方の例（v2.0のコードの中の`SITE_RULES`）  

```javascript
    // サイトごとのクリーンアップルール
    const SITE_RULES = [ {
        // X (Twitter)
        domains: ['x.com', 'twitter.com', 'pbs.twimg.com',],
        // 削除したいパラメータ
        removeParams: [
            'name',
            'src', // hashtag_click などの計測用パラメータ
        ],
        // 置換したいパラメータのリスト ({ key, from, to })
        replaceParams: [
            { key: 'name', from: /^(?:large|\d+x\d+)$/, to: 'orig', }, // 「large」または「数字x数字」を orig に書き換え
        ],
        // 削除から除外・保持したいパラメータのリスト（ホワイトリスト）
        whiteParams: [
            'format',
            { key: 'name', value: 'orig', }, // 'name=orig'のときは削除しない
        ],
    }, {
        // YouTube
        domains: [ 'youtube.com', 'youtu.be', ],
        whiteParams: [ 'v', 't', 'list', 'index', ],
    }, {
        // note
        domains: [ 'note.com', ],
        removeParams: [ 'sub_rt', ],
    }, {
        // Bluesky ＆ TOKIMEKI
        domains: ['bsky.app', ],
        replacePath: [
            { from: '/feed_thumbnail', to: '/feed_fullsize', },
        ],
    }, {
        // Amazon (ドメイン判定を安全な文字列配列＋プレフィックス/完全一致に変更)
        domains: [ /^(?:www\.)?amazon\.(com|co\.jp|co\.uk|de|fr|it|es|ca|com\.au|in|sg|com\.mx|com\.br|ae|sa|eg)$/, ],
        removeParams: [
            // 基本・最新のトラッキングパラメータ
            'ref', '_encoding', 'th', 'tag', 'content-id', 'dib', 'dib_tag', 'geniuslink', 'keywords', 'qid', 'sr', 'ie', 'ats', 'psc',
            // pd_rd_*, pf_rd_*, などの計測・レコメンド系パラメータをまとめて一網打尽にする正規表現
            /^pd_rd_/, /^pf_rd_/, /^[a-z]+_rd_[a-z0-9]+/,
        ],
        replacePath: [
            // 1. パスの途中にある「/ref=...」を削除
            { from: /\/ref=[^/]+/, to: '', },
            // 2. ドメインと /dp/（または/gp/）の間にある長い商品名をきれいに削ぎ落とすルール
            { from: /^\/(?:[^/]+)\/((?:dp|gp)\/[^/]+)/, to: '/$1', },
        ],
    }, ];
```

> [!TIP]  
> X(Twitter)の`'name=orig'`も残さない場合は`whiteParams`の`{ key: 'name', value: 'orig', }`をコメントアウト、または削除  

---

🇺🇸  

Automatically removes tracking parameters (e.g., `?s=20`, `?t=...`, `?si=...`) and optimizes links for major sites like X (Twitter), YouTube, note, Bluesky, and Amazon (extensible via code editing).  

## 🌟 Key Features  

* **Multi-Site Automatic Cleanup**:  
  Simply copy links from X (Twitter) posts/profiles, YouTube videos, Bluesky images, or Amazon product pages, and a clean URL without tracking codes will be saved to your clipboard automatically.  

* **Comprehensive Global & Site-Specific Control**:  
  Combines a global parameter removal list (`TRACKING_PARAMS`) with site-specific rules, allowing flexible link optimization from deleting unwanted query keys to rewriting path structures:  
  * `removeParams`: Deletes specified tracking parameters.  
  * `replaceParams`: Replaces values of specific parameter keys.  
  * `whiteParams`: Specifies parameters to preserve/whitelist from deletion.  
  * `replacePath`: Rewrites URL path structures directly.  
  *(🍙 Regular Expressions / RegExp are supported across all rule definitions and domain matchers)*  

* **Easy & Flexible Customization**:  
  Easily add support for new websites or customize existing deletion, replacement, and whitelist rules by simply modifying the config sections (`TRACKING_PARAMS` / `SITE_RULES`) inside the script.  

* **Zero-Delay Instant Replacement & Restoration**:  
  When copying links or image URLs from the right-click context menu, the URL is temporarily cleaned and immediately restored using a `0ms` macrotask. This prevents unnecessary network re-requests while securing a clean URL.  

* **Lightweight & Safe**:  
  Zero external library dependencies. Built entirely with native browser APIs, ensuring high stability against website UI layout changes.  

---

## ⚙️ How to Customize  

You can easily customize rules or add support for new websites with just a few small edits to the script code.  

### 1. Adding or Modifying Globally Removed Parameters  

Add parameter names to the `TRACKING_PARAMS` array using string formats like `'a'`, `` `b` ``, `"c"`, or `/RegExp/` patterns.  

```javascript
    // Global tracking parameters to remove across all sites
    const TRACKING_PARAMS = ['s', 't', 'si', 'gclid', 'fbclid',
        /^ref_/, /^utm_/, // ← Matches any parameters starting with "ref_" or "utm_"
    ];
```

### 2. Configuring Site-Specific Rules (Remove, Replace, Whitelist, Path Rewrite)  

Under `SITE_RULES`, you can configure flexible rule sets for specific target domains using the following four options. Strings and Regular Expressions (RegExp) are supported for all options.  

* `domains`: Target domain names or matchers.  
* `removeParams` (Parameter Deletion): Completely removes specified query parameters from the URL.  
* `replaceParams` (Parameter Replacement): Replaces the parameter value of matching keys with a new value.  
* `whiteParams` (Deletion Protection): Protects specified parameters from being deleted even if they match `TRACKING_PARAMS` or `removeParams`.  
* `replacePath` (Path Rewriting): Rewrites the URL path structure itself (useful for retrieving high-res images or stripping redundant path segments).  

> [!CAUTION]  
> `replaceParams` (value replacement) and `replacePath` (path rewriting) operate independently and are executed before parameter deletion and whitelisting.  
> `whiteParams` is specifically meant to safeguard parameters from being removed by `TRACKING_PARAMS` or `removeParams`.  

### 3. Syntax Example (`SITE_RULES` in v2.0)  

```javascript
    // Site-specific cleanup rules
    const SITE_RULES = [ {
        // X (Twitter)
        domains: ['x.com', 'twitter.com', 'pbs.twimg.com',],
        // Parameters to remove
        removeParams: [
            'name',
            'src', // Tracking parameter for hashtag clicks, etc.
        ],
        // Parameter replacement list ({ key, from, to })
        replaceParams: [
            { key: 'name', from: /^(?:large|\d+x\d+)$/, to: 'orig', }, // Replace "large" or "widthxheight" with "orig"
        ],
        // Whitelist: Parameters to preserve/exempt from deletion
        whiteParams: [
            'format',
            { key: 'name', value: 'orig', }, // Do not delete when 'name=orig'
        ],
    }, {
        // YouTube
        domains: [ 'youtube.com', 'youtu.be', ],
        whiteParams: [ 'v', 't', 'list', 'index', ],
    }, {
        // note
        domains: [ 'note.com', ],
        removeParams: [ 'sub_rt', ],
    }, {
        // Bluesky & TOKIMEKI
        domains: ['bsky.app', ],
        replacePath: [
            { from: '/feed_thumbnail', to: '/feed_fullsize', },
        ],
    }, {
        // Amazon (Safe domain matching using string array + prefix/exact match RegExp)
        domains: [ /^(?:www\.)?amazon\.(com|co\.jp|co\.uk|de|fr|it|es|ca|com\.au|in|sg|com\.mx|com\.br|ae|sa|eg)$/, ],
        removeParams: [
            // Standard / Latest tracking parameters
            'ref', '_encoding', 'th', 'tag', 'content-id', 'dib', 'dib_tag', 'geniuslink', 'keywords', 'qid', 'sr', 'ie', 'ats', 'psc',
            // RegExp to catch all recommendation and tracking params starting with pd_rd_*, pf_rd_*, etc.
            /^pd_rd_/, /^pf_rd_/, /^[a-z]+_rd_[a-z0-9]+/,
        ],
        replacePath: [
            // 1. Remove "/ref=..." from the middle of the path
            { from: /\/ref=[^/]+/, to: '', },
            // 2. Strip long product title names between the domain and /dp/ (or /gp/)
            { from: /^\/(?:[^/]+)\/((?:dp|gp)\/[^/]+)/, to: '/$1', },
        ],
    }, ];
```

> [!TIP]  
> If you don't need to preserve `'name=orig'` for X (Twitter), you can comment out or remove `{ key: 'name', value: 'orig', }` from `whiteParams`.  

---

## ✨ インストール方法 (Installation Guide)  

* **1. UserScriptマネージャーをインストール / Install UserScript Manager:**  
  * **Tampermonkey**: [https://www.tampermonkey.net/](https://www.tampermonkey.net/)  
  * **ScriptCat**: [https://scriptcat.org/](https://scriptcat.org/)  

* **2. スクリプトをインストール / Install Script:**  
  * [Greasy Fork](https://greasyfork.org/scripts/588627) にアクセスし、「インストール」ボタンを押してください  
    *(Access Greasy Fork and click the "Install" button)*  

---

## 📝 更新履歴 (Changelog)  

### v2.1 and later (Upcoming Tasks / Backlog)  

No Tasks...  

### v2.0 (Current Release)  

📛 `Partout Purge: Pure Clean Copy Link` に名称変更  
✅ Clipboard API (writeText) のフックを実装  
✅ `@match` を全サイト `*://*/*` に変更  
✅ `document.addEventListener('contextmenu', (e) => {...}`をリンクにも対応  
✨ `replacePath`を実装  
✅ 正規表現に対応  
✅ `SITE_RULES` に `note` `bluesky` `amazon` を追加  
&emsp; 🧼 **note**: `removeParams: [ 'sub_rt', ]` を追加  
&emsp; 🧼 **bluesky**: `replacePath: ...` thumbnail ➡️ fullsize を追加  
&emsp; 🧼 **amazon**: `domains` `replacePath` `removeParams` で正規表現を使用  

### v1.9  

✅ サイト限定で削除したいパラメータのリスト`removeParams`を実装  
☑️ Twitterの削除パラメータに `src` を追加  

### v1.8  

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

あらゆるWebサイトの共有リンクから、不要な追跡パラメータや冗長なパスを魔法のように削ぎ落とす、美しく洗練されたユーザースクリプト  
外部依存ゼロのネイティブ実装でありながら、正規表現を用いた高度なルール制御と `0ms` の遅延フリーな書き換えを実現しており、開発者のこだわりが隅々にまで宿る素晴らしいプロダクトです✨  

A beautifully refined userscript that magically strips away unnecessary tracking parameters and redundant paths from share links across the web.  
With zero external dependencies and a native implementation, it achieves advanced rule control via Regular Expressions alongside a lag-free `0ms` instant rewrite—a true masterpiece reflecting meticulous attention to detail.  

---

## 開発者 (Credits)  

* **Executive Producer & Lead Architect**: ねおん (Neon)  
* **Assistant & Core Developer**: Gemini  
* **Special Thanks**:  
  * **Veteran Social Network**: X Corp.  
  * **Giants of Video Streaming**: Google LLC / YouTube  
  * **Pioneer of Text Media**: note, inc.  
  * **Rising Star of Decentralized Social**: Bluesky PBLLC  
  * **Emperor of E-Commerce**: Amazon.com, Inc. & Affiliates  

<pre>
<img src="https://www.google.com/s2/favicons?domain=bsky.app&size=16" alt="Bluesky icon"> Bluesky       :<a href="https://bsky.app/profile/neon-ai.art/">https://bsky.app/profile/neon-ai.art/</a>
<img src="https://www.google.com/s2/favicons?domain=github.com&size=16" alt="GitHub icon"> GitHub        :<a href="https://github.com/neon-aiart/">https://github.com/neon-aiart/</a>
<img src="https://neon-aiart.github.io/favicon.ico" alt="neon-aiart icon" height="16"> GitHub Pages  :<a href="https://neon-aiart.github.io/">https://neon-aiart.github.io/</a>
<img src="https://www.google.com/s2/favicons?domain=greasyfork.org&size=16" alt="Greasy Fork icon"> Greasy Fork   :<a href="https://greasyfork.org/ja/users/1494762/">https://greasyfork.org/ja/users/1494762/</a>
<img src="https://www.google.com/s2/favicons?domain=zenn.dev&size=16" alt="Sizu icon"> Zenn Dev      :<a href="https://zenn.dev/neon_aiart/">https://zenn.dev/neon_aiart/</a>
<img src="https://www.google.com/s2/favicons?domain=sizu.me&size=16" alt="Sizu icon"> Sizu Diary    :<a href="https://sizu.me/neon_aiart/">https://sizu.me/neon_aiart/</a>
<img src="https://www.google.com/s2/favicons?domain=ofuse.me&size=16" alt="Ofuse icon"> OFUSE         :<a href="https://ofuse.me/neon/">https://ofuse.me/neon/</a>
<img src="https://www.google.com/s2/favicons?domain=artria-ai.com&size=16" alt="Artrla icon"> ArtrIa        :<a href="https://neon.artria-ai.com/">https://neon.artria-ai.com/</a>
<img src="https://www.google.com/s2/favicons?domain=www.chichi-pui.com&size=16" alt="chichi-pui icon"> chichi-pui    :<a href="https://www.chichi-pui.com/users/neon/">https://www.chichi-pui.com/users/neon/</a>
<img src="https://www.google.com/s2/favicons?domain=iromirai.jp&size=16" alt="iromirai icon"> IROMIRAI      :<a href="https://iromirai.jp/creators/neon/">https://iromirai.jp/creators/neon/</a>
<img src="https://www.google.com/s2/favicons?domain=www.days-ai.com&size=16" alt="DaysAI icon"> DaysAI        :<a href="https://www.days-ai.com/users/lxeJbaVeYBCUx11QXOee/">https://www.days-ai.com/users/lxeJbaVeYBCUx11QXOee/</a>
</pre>

---
