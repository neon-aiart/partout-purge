// ==UserScript==
// @name           Partout Purge: Pure Clean Copy Link
// @name:en        Partout Purge: Pure Clean Copy Link
// @name:ja        Partout Purge: Pure Clean Copy Link
// @version        2.0
// @icon           data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧼</text></svg>
// @description    Automatically removes tracking parameters (e.g., `?s=20`, `?t=...`, `?si=...`) and optimizes links for major sites like X (Twitter), YouTube, note, Bluesky, and Amazon (extensible via code editing).
// @description:en Automatically removes tracking parameters (e.g., `?s=20`, `?t=...`, `?si=...`) and optimizes links for major sites like X (Twitter), YouTube, note, Bluesky, and Amazon (extensible via code editing).
// @description:ja X（Twitter）、YouTube、note、Bluesky、Amazonなどの主要サイトで、リンクや画像リンクの不要なトラッキングパラメータ（`?s=20`, `?t=...`, `?si=...` など）を自動削除し、最適化するUserScriptです（編集で拡張可能）
// @author         ねおん
// @namespace      https://bsky.app/profile/neon-ai.art
// @homepage       https://github.com/neon-aiart
// @match          *://*/*
// @grant          none
// @license        PolyForm Noncommercial 1.0.0; https://polyformproject.org/licenses/noncommercial/1.0.0/
// ==/UserScript==

/**
 * ==============================================================================
 * IMPORTANT NOTICE / 重要事項
 * ==============================================================================
 * Copyright (c) 2026 ねおん (Neon)
 * Licensed under the PolyForm Noncommercial License 1.0.0.
 *   [JP] 本スクリプトは個人利用・非営利目的でのみ使用・改変が許可されます。
 * 無断転載、作者名の書き換え、およびクレジットの削除は固く禁じます。
 * 本スクリプトを改変・配布（フォーク）する場合は、必ず元の作者名（ねおん）
 * およびこのクレジット表記を維持してください。
 *   [EN] This script is licensed for personal and non-commercial use only.
 * Unauthorized re-uploading, modification of authorship, or removal of
 * author credits is strictly prohibited. If you fork this project, you MUST
 * retain the original credits and authorship.
 * ==============================================================================
 */

(function() {
    'use strict';

    const SCRIPT_VERSION = '2.0';
    const DEBUG = false;
    if (DEBUG) console.log(`[${getFormattedDateTime()}] 🧼 Partout Purge: Pure Clean Copy Link v${SCRIPT_VERSION}: デバッグモード`);

    // 全サイト共通の削除対象パラメータ
    const TRACKING_PARAMS = ['s', 't', 'si', 'gclid', 'fbclid',
        /^ref_/, /^utm_/, // ← 「ref_」「utm_」で始まるパラメータに全部マッチ
    ];

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
        // Amazon (主要な国別ドメインの正規表現リスト)
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

    function getFormattedDateTime() {
        const now = new Date();

        const pad = (num) => num.toString().padStart(2, '0'); // ２桁にする関数

        const y = now.getFullYear();
        const m = pad(now.getMonth() + 1);
        const d = pad(now.getDate());
        const h = pad(now.getHours());
        const min = pad(now.getMinutes());
        const s = pad(now.getSeconds());

        return `${y}/${m}/${d} ${h}:${min}:${s}`;
    }

    /**
     * ホスト名/URL文字列が指定されたドメイン（文字列または正規表現）にマッチするか判定するヘルパー
     * @param {string} hostname - 例: 'cdn.bsky.app' や 'https://x.com/...'
     * @param {Array<string|RegExp>} domains - SITE_RULES[].domains の配列
     * @returns {boolean}
     */
    function isDomainMatched(hostname, domains) {
        return domains.some((domain) => {
            if (domain instanceof RegExp) return domain.test(hostname);
            if (typeof domain === 'string') return hostname === domain || hostname.endsWith('.' + domain);
            return false;
        });
    }

    /**
     * URL文字列を受け取り、クリーンアップして文字列で返す共通関数
     * @param {string} urlString
     * @returns {string} Cleaned URL
     */
    function cleanUrl(urlString) {
        try {
            const url = new URL(urlString);

            // 現在のドメインにマッチするルールを検索（isDomainMatchedを使用）
            const matchedRule = SITE_RULES.find((rule) => isDomainMatched(url.hostname, rule.domains));

            const replaceParams = matchedRule?.replaceParams || [];
            const replacePath = matchedRule?.replacePath || [];
            const removeParams = matchedRule?.removeParams || [];
            const whiteParams = matchedRule?.whiteParams || [];
            if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] Matched Rule:`, { url, replaceParams, replacePath, removeParams, whiteParams, });

            // 1. パスの置換処理 (replacePath)
            replacePath.forEach(({ from, to, }) => {
                if (from instanceof RegExp) {
                    if (from.test(url.pathname)) {
                        url.pathname = url.pathname.replace(from, to);
                        if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] Path Replace (RegExp):`, { url, from, to, });
                    }
                } else if (typeof from === 'string' && url.pathname.includes(from)) {
                    url.pathname = url.pathname.replace(from, to);
                    if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] Path Replace (String):`, { url, from, to, });
                }
            });

            // 2. パラメータの置換処理 (replaceParams)
            replaceParams.forEach(({ key, from, to, }) => {
                // searchParams を走査して柔軟にマッチング
                for (const [paramKey, paramVal, ] of url.searchParams.entries()) {
                    const isKeyMatch = key instanceof RegExp ? key.test(paramKey) : key === paramKey;
                    if (isKeyMatch) {
                        const isValMatch = from === undefined || (from instanceof RegExp ? from.test(paramVal) : from === paramVal);
                        if (isValMatch) {
                            // 置換後の値を算出（fromが正規表現の場合は置換適用、それ以外は直接to）
                            const newValue = from instanceof RegExp ? paramVal.replace(from, to) : to;
                            url.searchParams.set(paramKey, newValue);
                            if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] Replace Param:`, { url, paramKey, paramVal, newValue, });
                        }
                    }
                }
            });

            // 3. 共通削除リストとサイト個別削除リストを統合（重複排除）
            const targetDeleteParams = Array.from(new Set([...TRACKING_PARAMS, ...removeParams,]));

            // 4. 指定したパラメータの削除処理 (whiteParams の条件に一致するものは削除しない)
            for (const param of Array.from(url.searchParams.keys())) {
                const currentValue = url.searchParams.get(param);

                // 削除対象（targetDeleteParams）にヒットするか判定
                const shouldDelete = targetDeleteParams.some((pattern) => {
                    return pattern instanceof RegExp ? pattern.test(param) : pattern === param;
                });

                if (shouldDelete) {
                    // ホワイトリストに含まれるか判定
                    const isWhitelisted = whiteParams.some((white) => {
                        if (typeof white === 'string') return white === param;
                        if (white instanceof RegExp) return white.test(param);
                        if (typeof white === 'object' && white !== null) {
                            const isKeyMatch = white.key instanceof RegExp ? white.key.test(param) : white.key === param;
                            if (isKeyMatch) {
                                return white.value === undefined || (white.value instanceof RegExp ? white.value.test(currentValue) : white.value === currentValue);
                            }
                        }
                        return false;
                    });

                    // ホワイトリストに含まれない場合はパラメータを削除
                    if (!isWhitelisted) {
                        if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] Delete Param:`, { url, param, });
                        url.searchParams.delete(param);
                    }
                }
            }

            return url.toString();
        } catch (err) {
            return urlString;
        }
    }

    // 渡されたテキスト（またはURL文字列）がサイトルールに一致するか判定し、必要ならクリーンアップする汎用ハンドラー
    function processText(text) {
        if (!text || typeof text !== 'string') return text;
        const trimmed = text.trim();

        let hostname = trimmed;
        try {
            hostname = new URL(trimmed).hostname;
        } catch (err) {
            // URL形式ではない普通のテキスト選択などの場合
        }

        // SITE_RULES に定義されているドメインのいずれかが含まれているか判定
        const isTarget = SITE_RULES.some((rule) => isDomainMatched(hostname, rule.domains));
        if (isTarget) return cleanUrl(trimmed);
        return text;
    }

    // 1. シェアボタンやテキスト選択コピー時のイベント（copy）
    document.addEventListener('copy', (e) => {
        const selectionText = window.getSelection().toString();
        if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] PPP: Selection Text`, selectionText);
        if (selectionText) {
            if (DEBUG) console.groupCollapsed(`[DEBUG] [${getFormattedDateTime()}] 🧼 PPP: copy`);
            const cleaned = processText(selectionText);
            if (selectionText !== cleaned) {
                e.clipboardData.setData('text/plain', cleaned);
                e.preventDefault();
                if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] PPP: Cleaned (Selection Copy)`, cleaned);
            }
            if (DEBUG) console.groupEnd();
        }
    });

    // 2. 右クリックメニューを開いた時のイベント（contextmenu）
    document.addEventListener('contextmenu', (e) => {
        const targets = [];
        if (DEBUG) console.groupCollapsed(`[DEBUG] [${getFormattedDateTime()}] 🧼 PPP: contextmenu`);

        // A. 上流にある親のリンク (Aタグ) を探す（テキストリンクや画像リンクのURL用）
        const aTarget = e.target.closest('a');
        if (aTarget && aTarget.href) {
            targets.push({ element: aTarget, prop: 'href', url: aTarget.href, });
            if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] PPP: a Target:`, aTarget.href);
        }

        // B. 直接クリックされた画像 (IMGタグ) または親に近いIMGを探す（画像アドレスコピー用）
        const imgTarget = e.target.closest('img');
        if (imgTarget && imgTarget.src) {
            targets.push({ element: imgTarget, prop: 'src', url: imgTarget.src, });
            if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] PPP: img Target:`, imgTarget.src);
        }
        if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] PPP: Target:`, targets);

        // ヒットしたターゲット（最大2つ）をそれぞれ processText に通してクリーンアップ
        targets.forEach(({ element, prop, url, }) => {
            const cleaned = processText(url);

            if (url !== cleaned) {
                // 右クリックされた瞬間に一時的に綺麗にしたURLへ差し替え
                element[prop] = cleaned;
                if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] PPP: Cleaned (${element.tagName} / ${prop})`, cleaned);

                // メニュー構築完了直後（0ms後のマクロタスク）で即座に復元
                setTimeout(() => {
                    element[prop] = url;
                    if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] PPP: Restored Original (${element.tagName} / ${prop})`, url);
                }, 0);
            }
        });
        if (DEBUG) console.groupEnd();
    });

    // 3. モダンな Clipboard API (writeText) のフック
    if (navigator.clipboard && navigator.clipboard.writeText) {
        const originalWriteText = navigator.clipboard.writeText;
        navigator.clipboard.writeText = async function(text) {
            try {
                if (DEBUG) console.groupCollapsed(`[DEBUG] [${getFormattedDateTime()}] 🧼 PPP: write text`);
                const cleaned = processText(text);
                if (text !== cleaned) {
                    if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] PPP: Clipboard.writeText Intercepted`, { before: text, after: cleaned, });
                    return originalWriteText.call(navigator.clipboard, cleaned);
                }
            } catch (e) {
                // 万が一パースや処理でエラーが出ても、元の処理を止めないようにフォールバック
            }finally {
                if (DEBUG) console.groupEnd();
            }
            return originalWriteText.call(navigator.clipboard, text);
        };
    }
})();
