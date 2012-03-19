let PLUGIN_INFO =
    <KeySnailPlugin>
    <name>Bookmark (tentative name)</name>
    <description>TBD</description>
    <description lang="ja">TBD</description>
    <author>gardejo (MORIYA Masaki)</author>
    <license>MIT</license>
    <updateURL>https://github.com/gardejo/js-keysnail-plugin/raw/master/bookmark/bookmark.ks.js</updateURL>
    <iconURL>https://github.com/gardejo/js-keysnail-plugin/raw/master/bookmark/bookmark.ks.png</iconURL>
    <version>0.0.0</version>
    <minVersion>1.8.0</minVersion>
    <detail><![CDATA[
=== Usage ===

TBD

>||

key.setViewKey(['C-i', 'a'], function () {
    ext.exec('add-bookmark');
}, M({
    en: 'Add this page to bookmark',
    ja: '現在のページをブックマークに追加',
}), true);

key.setViewKey(['C-i', 'r'], function () {
    ext.exec('remove-bookmark');
}, M({
    en: 'Remove this page from bookmark',
    ja: '現在のページをブックマークから削除',
}), true);

key.setViewKey(['C-i', 't'], function () {
    ext.exec('toggle-bookmark');
}, M({
    en: 'Toggle bookmark in this page',
    ja: '現在のページをブックマークに追加または削除',
}), true);

||<

]]></detail>

    <detail lang="ja"><![CDATA[
=== 概要 ===
TBD

Firefoxのブックマークを追加・削除・切替します。
はてブ用やRIL用のプラグインがあって生ブックマークにない現状に堪えかねた件。

既存のKeySnailプラグインやMDNを見よう見まねで書いて取り敢えず動いた状態で、効率性だとかお作法だとかは全く考慮されていません。

bmanyはBookmark Anythingの略なので、ただ単にBookmarkを操作するならbmanyへのpull requestではなく単発のプラグインとした方が良いかもしれないため、オレオレプラグインとして取り敢えず置いておきます。

TODO: 「bookmark」なる挑発的な名前空間をどうにかするかも。

=== 使い方 ===
TBD

キーバインドは適当に。

>||

key.setViewKey(['C-i', 'a'], function () {
    ext.exec('add-bookmark');
}, M({
    en: 'Add this page to bookmark',
    ja: '現在のページをブックマークに追加',
}), true);

key.setViewKey(['C-i', 'r'], function () {
    ext.exec('remove-bookmark');
}, M({
    en: 'Remove this page from bookmark',
    ja: '現在のページをブックマークから削除',
}), true);

key.setViewKey(['C-i', 't'], function () {
    ext.exec('toggle-bookmark');
}, M({
    en: 'Toggle bookmark in this page',
    ja: '現在のページをブックマークに追加または削除',
}), true);

||<

]]></detail>
</KeySnailPlugin>;

// Add ext

var bookmark = (function () {
    const classes     = Components.classes;
    const interfaces  = Components.interfaces;
    const bmService   = classes['@mozilla.org/browser/nav-bookmarks-service;1']
                      .getService(interfaces.nsINavBookmarksService);
    const ioService   = classes['@mozilla.org/network/io-service;1']
                      .getService(interfaces.nsIIOService);
    const displayTime = 2000;

    function getURI () {
        return ioService.newURI(window.content.location.href, null, null);
    }

    function getTitle () {
        return window.content.document.wrappedJSObject.title.toString();
    }

    let self = {
        add : function (uri) {
            if (uri === undefined)
                uri = getURI();
            if (bmService.isBookmarked(uri))
                return;

            var title = getTitle();
            bmService.insertBookmark(
                bmService.unfiledBookmarksFolder,
                uri,
                -1, // bottom (last)
                title
            );
            display.echoStatusBar('Added bookmark: ' + title, displayTime);
        },

        remove : function (uri) {
            if (uri === undefined)
                uri = getURI();
            if (! bmService.isBookmarked(uri))
                return;

            var title = getTitle();
            bmService.removeItem(
                bmService.getBookmarkIdsForURI(uri)
            );
            display.echoStatusBar('Removed bookmark: ' + title, displayTime);
        },

        toggle : function () {
            var uri = getURI();
            if (bmService.isBookmarked(uri))
                this.remove(uri);
            else
                this.add(uri);
        }
    };

    return self;
})();

plugins.withProvides(function(provide) {
    provide('add-bookmark', function () {
        bookmark.add();
    }, M({
        en: 'Add this page to bookmark',
        ja: '現在のページをブックマークに追加',
    }));

    provide('remove-bookmark', function () {
        bookmark.remove();
    }, M({
        en: 'Remove this page from bookmark',
        ja: '現在のページをブックマークから削除',
    }));

    provide('toggle-bookmark', function (ev, arg) {
        bookmark.toggle();
    }, M({
        en: 'Toggle bookmark in this page',
        ja: '現在のページをブックマークに追加または削除',
    }));
}, PLUGIN_INFO);
