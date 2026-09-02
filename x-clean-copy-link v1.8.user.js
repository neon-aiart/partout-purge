// ==UserScript==
// @name           X & YouTube Clean Copy Link
// @version        1.8
// @icon           data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧼</text></svg>
// @description    Automatically removes tracking parameters (e.g., ?s=20, ?t=..., ?si=..., utm_*) when copying links on X (Twitter) and YouTube to keep your URLs clean.
// @description:ja X（Twitter）やYouTubeでリンクをコピーしたときに、?s=20 や ?si=... などの不要なトラッキングコードを自動で削除する軽量スクリプトです
// @author         ねおん
// @namespace      https://bsky.app/profile/neon-ai.art
// @homepage       https://github.com/neon-aiart
// @match          https://x.com/*
// @match          https://twitter.com/*
// @match          https://pbs.twimg.com/media/*
// @match          https://www.youtube.com/*
// @match          https://youtu.be/*
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

    const SCRIPT_VERSION = '1.8';
    const DEBUG = false;

    if (DEBUG) console.log(`[${getFormattedDateTime()}] 🧼 X Clean Copy Link v${SCRIPT_VERSION}: デバッグモード`);

    // 全サイト共通の削除対象パラメータ
    const trackingParams = ['s', 't', 'ref_src', 'ref_url', 'utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid',
        'name',
        'si',
    ];

    // サイトごとのクリーンアップルール
    const siteRules = [ {
        // X (Twitter)
        domains: ['x.com', 'twitter.com', 'pbs.twimg.com',],
        // 置換したいパラメータのリスト ({ key, from, to })
        replaceParams: [
            { key: 'name', from: 'large', to: 'orig', },
        ],
        // 削除から除外・保持したいパラメータのリスト（ホワイトリスト）
        whiteParams: [
            'format',
            // { key: 'name', value: 'orig', }, // 'name=orig'のときは削除しない
        ],
    }, {
        // YouTube
        domains: [ 'youtube.com', 'youtu.be', ],
        whiteParams: [ 'v', 't', 'list', 'index', ],
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
     * URL文字列を受け取り、クリーンアップして文字列で返す共通関数
     * @param {string} urlString
     * @returns {string} Cleaned URL
     */
    function cleanUrl(urlString) {
        try {
            const url = new URL(urlString);

            // 現在のドメインにマッチするルールを検索
            const matchedRule = siteRules.find((rule) =>
                rule.domains.some((domain) => url.hostname === domain || url.hostname.endsWith('.' + domain))
            );

            const replaceParams = matchedRule?.replaceParams || [];
            const whiteParams = matchedRule?.whiteParams || [];

            if (DEBUG) {
                console.groupCollapsed(`[DEBUG] [${getFormattedDateTime()}] 🧼 X-Clean: CleanURL:`, url.href);
                console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: Matched Rule:`, { url, replaceParams, whiteParams, });
            }

            // 1. パラメータの置換処理
            replaceParams.forEach(({ key, from, to, }) => {
                if (url.searchParams.get(key) === from) {
                    url.searchParams.set(key, to);
                    if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: Replace:`, { url, key, from, to, });
                }
            });

            // 2. 指定したパラメータの削除処理 (whiteParams の条件に一致するものは削除しない)
            trackingParams.forEach((param) => {
                const currentValue = url.searchParams.get(param);

                // ホワイトリストに含まれるか判定
                const isWhitelisted = whiteParams.some((white) => {
                    if (typeof white === 'string') {
                        const result = white === param;
                        if (DEBUG && result) console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: White:`, { url, white, });
                        return result;
                    }
                    if (typeof white === 'object' && white.key === param) {
                        const result = white.value === undefined || white.value === currentValue;
                        if (DEBUG && result) console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: White:`, { url, param, currentValue, });
                        return result;
                    }
                    return false;
                });

                // ホワイトリストに含まれない場合はパラメータを削除
                if (!isWhitelisted) {
                    if (DEBUG && url.searchParams.get(param)) console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: Delete:`, { url, param, });
                    url.searchParams.delete(param);
                }
            });

            return url.toString();
        } catch (err) {
            return urlString;
        } finally {
            if (DEBUG) console.groupEnd();
        }
    }

    // 1. シェアボタンやテキストコピー時のイベント（copy）
    document.addEventListener('copy', (e) => {
        const text = window.getSelection().toString().trim();
        if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: Copy Text`, text);

        // siteRules に定義されているドメインのいずれかが含まれているか判定
        const isTargetUrl = siteRules.some((rule) =>
            rule.domains.some((domain) => text.includes(domain))
        );

        if (isTargetUrl) {
            const cleaned = cleanUrl(text);
            e.clipboardData.setData('text/plain', cleaned);
            e.preventDefault();
            if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: Result (Copy)`, cleaned);
        }
    });

    // 2. 右クリックメニューを開いた時のイベント（contextmenu）
    document.addEventListener('contextmenu', (e) => {
        // 右クリックされた要素が画像（または親要素に画像がある場合）
        const img = e.target.closest('img');
        if (img && img.src && img.src.includes('twimg.com/')) {
            const originalSrc = img.src;
            const cleaned = cleanUrl(originalSrc);

            if (originalSrc !== cleaned) {
                // 右クリックされた瞬間に一時的に綺麗にしたURLへ差し替え
                img.src = cleaned;
                if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: Cleaned URL`, cleaned);

                // メニュー構築完了直後（0ms後のマクロタスク）で即座に復元
                setTimeout(() => {
                    img.src = originalSrc;
                    if (DEBUG) console.log(`[DEBUG] [${getFormattedDateTime()}] X-Clean: Restored Original`, originalSrc);
                }, 0);
            }
        }
    });
})();
