/**
 * @fileOverview S3. Dlbsnail Plugin for KeySnail
 * @name s3dlbsnail.ks.js
 * @author gardejo <gardejo@ermitejo.com>
 * @license The MIT License
 */

// PLUGIN_INFO {{ =========================================================== //

var PLUGIN_INFO =
<KeySnailPlugin>
    <name>S3. Dlbsnail</name>
    <description>Work with Download Manager (S3)</description>
    <description lang="ja">Download Manager (S3) との連携</description>
    <version>0.0.4</version>
    <updateURL>http://github.com/gardejo/js-keysnail-plugins/raw/master/s3dlbsnail.ks.js</updateURL>
    <iconURL>http://github.com/gardejo/js-keysnail-plugins/raw/master/s3dlbsnail.png</iconURL>
    <author mail="gardejo@ermitejo.com" homepage="http://gardejo.org/">gardejo (MORIYA Masaki)</author>
    <license document="http://www.opensource.org/licenses/mit-license.php">The MIT License</license>
    <license lang="ja">MIT ライセンス</license>
    <minVersion>1.8.0</minVersion>
    <include>main</include>
    <provides>
    <ext>s3dlbsnail-show-file-list</ext>
    <ext>s3dlbsnail-all-clear</ext>
    <ext>s3dlbsnail-checksum-for-any-file</ext>
    <ext>s3dlbsnail-all-pause</ext>
    <ext>s3dlbsnail-all-resume</ext>
    <ext>s3dlbsnail-all-cancel</ext>
    <ext>s3dlbsnail-all-open</ext>
    <ext>s3dlbsnail-show-command-for-all</ext>
    <ext>s3dlbsnail-toggle-mode</ext>
    <ext>s3dlbsnail-toggle-auto-mode</ext>
    <ext>s3dlbsnail-open-preference</ext>
    <ext>s3dlbsnail-open-history</ext>
    </provides>
    <detail lang="ja"><![CDATA[
=== 使い方 ===

    Firefox アドオンの "Download Manager (S3)" ( https://addons.mozilla.org/ja/firefox/addon/s3download-statusbar/ ) がインストールされていると、ダウンロードされたアイテムの操作が可能になります。

次のようにして任意のキーへコマンドを割り当てておくことも可能です。

>|javascript|
key.setViewKey('d', function (ev, arg) {
    ext.exec("s3dlbsnail-show-file-list", arg, ev);
}, 'Show Download Manager (S3) Items', true);
||<

上記のようなコードを .keysnail.js へ記述しておくことにより、ブラウズ画面において d キーを押すことで、ダウンロードしたアイテムの状態・ダウンロード進行状況・ファイル名・ソースを表示するプロンプトが立ち上がります。状態が "finished" のファイルを選択することで開くことができます。
また、それ以外にも、リネーム・URLのコピー・ステータスバーからの削除などができます。
以下のようなコードを PRESERVE エリアへ貼り付けることで、それらの機能をキーに対応させることができます。

>|javascript|
plugins.options["s3dlbsnail.file_key_map"] = {
    "C-z"   : "prompt-toggle-edit-mode",
    "SPC"   : "prompt-next-page",
    "b"     : "prompt-previous-page",
    "j"     : "prompt-next-completion",
    "k"     : "prompt-previous-completion",
    "g"     : "prompt-beginning-of-candidates",
    "G"     : "prompt-end-of-candidates",
    "q"     : "prompt-cancel",
    // for finished file
    "o"     : "open-this-file",
    "O"     : "show-this-file",
    "R"     : "rename-this-file",
    // "C-D"   : "delete-this-file",
    "C"     : "clear-this-file",
    "S"     : "checksum-this-file",
    // for in progress or pause file
    // "C-C"   : "cancel-this-file",
    // for in progress file
    // "C-P"   : "pause-this-file",
    // for pause file
    "r"     : "resume-this-file",
    // for all file
    "c"     : "copy-url",
    "V"     : "visit-ref-website",
    "u"     : "undo-clear",
    "h"     : "refresh-file-list",
    "s"     : "switch-file-type"
};
||<

また、表示するファイルの状態を指定できるようにしました。リスト表示している状態から、デフォルトでは s キーを押すことで、表示するファイル状態を変更できます。

また、最初に開いた時に表示するタイプも設定できます。以下のように設定すると、最初に開いたときはファイルのダウンロードが完了したもののみを表示します。

>|javascript|
plugins.options["s3dlbsnail.default_show_type"]  = "finished";
||<

mooz さんの公開している "Dark Theme" ( https://github.com/mooz/keysnail/raw/master/plugins/_dark-theme.ks.js )をお使いの方は、以下のように設定してみて、ここからお好みのスタイルに変更するといいかもしれません。

>|javascript|
plugins.options["s3dlbsnail.finished_style"]    = "color:#7ad3f2";
plugins.options["s3dlbsnail.in progress_style"] = "color:#33ff33";
plugins.options["s3dlbsnail.paused_style"]      = "color:red";
plugins.options["s3dlbsnail.default_style"]     = "";
plugins.options["s3dlbsnail.name_style"]        = "";
plugins.options["s3dlbsnail.source_style"]      = style.prompt.url;
plugins.options["s3dlbsnail.command_style"]     = "color:#7ad3f2;font-weight:bold";
plugins.options["s3dlbsnail.file_style"]        = "font-weight:bold";
plugins.options["s3dlbsnail.description_style"] = "";
||<

=== dlbsnailとの互換 ===

"s3dlbsnail" の API は原作の "dlbsnail" と互換性があるため、 .keysnail.js で "dlbsnail" 関連の設定がなされている場合、 "dlbsnail" を "s3dlbsnail" に一括置換すれば、そのままお使いいただけます。

=== 注意 ===

上記の設定では、削除( delete-this-file )やキャンセル( cancel-this-file )などの不可逆的な操作に関してはコメントアウトしてあります。誤使用の恐れがあるからです。これらの機能で生じたいかなる事故に対して責任は負いかねますので、その覚悟のある方は適宣コメントアウトを外してください。

=== 一括操作 ===

ダウンロードしたファイルを一括に操作で操作するコマンドも用意しました。具体的には、それぞれの操作が実行可能なファイルに対して、ステータスバーからの削除・一時停止・再開・キャンセル・開くことができます。それぞれのコマンドを任意のキーに割り当てることも可能です。上記の通り、キャンセルは不可逆的な操作なので、十分注意して使用してください。

>|javascript|
key.setViewKey('D', function (ev, arg) {
    ext.exec("s3dlbsnail-show-command-for-all", arg, ev);
}, L('s3dlbasnail-all系コマンド'), true);
||<

また、上記の設定を行うことで、ブラウズ画面において D キーを押すことで実行可能な全体操作を一覧で表示し、選択することで実行することもできます。

=== 謝辞 ===

この KeySnail プラグインの開発に当たっては、 satoudosu さん( http://d.hatena.ne.jp/satoudosu/ )の "dlbsnail" ( http://github.com/satoudosu/KeySnail_Plugin/raw/master/dlbsnail.ks.js ) 0.3 (2011/05/05) をフォークさせていただきました。
当該プラグインの依存先である Firefox アドオン "Download Statusbar" ( https://addons.mozilla.org/ja/firefox/addon/download-statusbar/ ) 0.9.10 が Firefox 26 以降に対応していないため、後継アドオンの "Download Manager (S3)" 3.11.1-signed に対応させるための変更を施したものです。

"Icon Archive" ( http://www.iconarchive.com )のアイコンをベースにしたアイコンも、同様に使わせていただきました。

    ]]></detail>
</KeySnailPlugin>;

// }} ======================================================================= //

// Options {{ =============================================================== //

let REFRESHER = null;

let pOptions = plugins.setupOptions("s3dlbsnail", {
    "all_style"         : { preset: "color:black;font-weight:bold" },
    "finished_style"    : { preset: "color:black;" },
    "in progress_style" : { preset: "color:black;" },
    "paused_style"      : { preset: "color:black;" },
    "default_style"     : { preset: "" },
    "name_style"        : { preset: "" },
    "source_style"      : { preset: style.prompt.url },
    "command_style"     : { preset: "font-weight:bold;" },
    "file_style"        : { preset: "font-weight:bold;" },
    "description_style" : { preset: "" },
    "interval"          : {
        preset : 3*1*1000, // 3 seconds
        description: M({
            ja: "更新間隔",
            en: "Interval between updates"
        })
    },
    "default_show_type" : {
        preset: "all",
        description: M({
            ja: "デフォルトの表示ファイルタイプ",
            en: "Default file type to show"
        })
    },
    "file_key_map"      : {
        preset: {
            "C-z"   : "prompt-toggle-edit-mode",
            "SPC"   : "prompt-next-page",
            "b"     : "prompt-previous-page",
            "j"     : "prompt-next-completion",
            "k"     : "prompt-previous-completion",
            "g"     : "prompt-beginning-of-candidates",
            "G"     : "prompt-end-of-candidates",
            "q"     : "prompt-cancel",
            // for finished file
            "o"     : "open-this-file",
            "O"     : "show-this-file",
            "R"     : "rename-this-file",
            // "C-D"   : "delete-this-file",
            "C"     : "clear-this-file",
            "S"     : "checksum-this-file",
            // for in progress or pause file
            // "C-C"   : "cancel-this-file",
            // for in progress file
            // "C-P"   : "pause-this-file",
            // for pause file
            "r"     : "resume-this-file",
            // for all file
            "c"     : "copy-url",
            "V"     : "visit-ref-website",
            "u"     : "undo-clear",
            "h"     : "refresh-file-list",
            "s"     : "switch-file-type"
        },
        description: M({
            ja: "個別操作用キーマップ",
            en: "Local keymap for manipulation in single file list"
        })
    },
    "action_key_map"    : {
        preset: {
            "C-z"   : "prompt-toggle-edit-mode",
            "SPC"   : "prompt-next-page",
            "b"     : "prompt-previous-page",
            "j"     : "prompt-next-completion",
            "k"     : "prompt-previous-completion",
            "g"     : "prompt-beginning-of-candidates",
            "G"     : "prompt-end-of-candidates",
            "q"     : "prompt-cancel"
        },
        description: M({
            ja: "全体アクション用キーマップ",
            en: "Local keymap for manipulation for all file"
        })
    },
    "switch_to_keymap"  : {
        preset: {
            "C-z"   : "prompt-toggle-edit-mode",
            "SPC"   : "prompt-next-page",
            "b"     : "prompt-previous-page",
            "j"     : "prompt-next-completion",
            "k"     : "prompt-previous-completion",
            "g"     : "prompt-beginning-of-candidates",
            "G"     : "prompt-end-of-candidates",
            "q"     : "prompt-cancel"
        },
        description: M({
            ja: "表示切り替え用キーマップ",
            en: "Local keymap for switch file status to show"
        })
    }
}, PLUGIN_INFO);

// }} ======================================================================= //

var s3dlbsnail =
    (function () {
        function allOpen() {
            var downbarelem = getDownbarelem();
            var comparray   = downbarelem.getElementsByAttribute("state", "1");

            for (var i=0; i<comparray.length; i++)
                s3downbar.action.start_open_finished(comparray[i].id);
        }

        function allClear() {
            s3downbar.action.clear_all();
        }

        function allPause() {
            s3downbar.action.set_pause_all();
        }

        function allResume() {
            s3downbar.action.set_resume_all();
        }

        function allCancel() {
            s3downbar.action.set_cancel_all();
        }

        var allActions = [
            [function () {
                allClear();
                display.echoStatusBar("claer all", 2000);
            }, "Clear all finished items from statusbar",
            "allClear", ["1"]],

            [function () {
                allPause();
                display.echoStatusBar("pause all", 2000);
            }, "Pause all items which are in progress",
            "allPause", ["0"]],

            [function () {
                allResume();
                display.echoStatusBar("resume all", 2000);
            }, "Resume all items which are pause",
            "allResume", ["4"]],

            [function () {
                allCancel();
                display.echoStatusBar("cancel all", 2000);
            }, "Cancel all items which are in progress or pause",
            "allCancel", ["0", "4"]],

            [function () {
                allOpen();
                display.echoStatusBar("open all", 2000);
            }, "Open all items which are finished",
            "allOpen", ["1"]]
        ];

        function getDownbarelem() {
            var wm  = Components
                    .classes["@mozilla.org/appshell/window-mediator;1"]
                    .getService(Components.interfaces.nsIWindowMediator);
            var e   = wm.getEnumerator("navigator:browser");
            var win = e.getNext();

            var downbarelem = win.document.getElementById("s3downbar");

            return downbarelem;
        }

        function getState(stateString) {
            var state;
            switch (stateString) {
                case "-1":
                    state = "not started";
                    break;
                case "0":
                    state = "in progress";
                    break;
                case "1":
                    state = "finished";
                    break;
                case "4":
                    state = "paused";
                    break;
                case "5":
                    state = "queued";
                    break;
                case "6":
                    state = "parental blocked";
                    break;
                case "7":
                    state = "av scanning";
                    break;
                case "8":
                    state = "av dirty";
                    break;
                default:
                    state = "unknown";
                    break;
            }

            return state;
        }

        function showFileList(type, index, input, editMode, exclude) {

            var collectList = [];

            var fileList = s3downbar.utils.get_downlist();
            for (var i=0; i<fileList.length; i++) {
                try {
                    var id          = fileList[i].id;
                    var dlElem      = document.getElementById(id);
                    var file        = dlElem.getAttribute("name");
                    var source      = dlElem.getAttribute("source");
                    var state       = getState(dlElem.getAttribute("state"));
                    // TODO: Verify if the code is compatible with dlbsnail.
                    var history = s3downbar.get_history(id);
                    var currpercent = (history ? history.progress : "?") + " %";
                    // TODO: Verify if the code is compatible with dlbsnail.
                    /*
                    const kExternalHelperAppServContractID
                        = "@mozilla.org/uriloader/external-helper-app-service;"
                        + "1";
                    var mimeService
                        = Components
                        .classes[kExternalHelperAppServContractID]
                        .getService(Components.interfaces.nsIMIMEService);
                    var contentType
                        = mimeService
                        .getTypeFromFile
                            ( (s3downbar.get_history(id))["target"] );
                    var iconURL
                        = "moz-icon:"
                        + dlElem.getAttribute("target")
                        + "?size=32&contentType="
                        + contentType;
                    */
                    var iconURL
                        = "moz-icon:"
                        + dlElem.getAttribute("target")
                        + "?size=32";

                    if (i != exclude) {
                        if (type != "all" && state != type)
                            continue;
                        else
                            collectList.push
                                ([state, currpercent, iconURL, file, source, id]);
                    }
                } catch (e) {
                    // window.alert(e);
                }
            }

            var ref           = true;
            var isShowingList = true;
            var fileIndex     = index || 0;
            var initialInput  = input || "";
            var isEditMode    = editMode || false;
            var actionIndex   = 0;

            function makeRefresher() {
                REFRESHER = window.setTimeout(function() {
                    var repeatFlag = false;
                    for (var i=0; i<collectList.length; i++) {
                        if (collectList[i][0] != "finished") {
                            repeatFlag = true;
                            // TODO: Verify if the code is compatible with
                            // dlbsnail.
                            var newPercent
                                = (s3downbar.get_history(id))["progress"];
                            collectList[i][1] = newPercent + " %";

                            if (newPercent == 100)
                                collectList[i][0] = "finished";
                        }
                    }

                    if (ref && repeatFlag) {
                        prompt.finish(true);
                        showFileList(
                            type,
                            fileIndex,
                            initialInput,
                            prompt.editModeEnabled
                        );
                    }
                }, pOptions["interval"]);
            }

            // cf. http://d.hatena.ne.jp/satoudosu/20110321/1300725216
            var promptShiftAction =
                [function (aIndex) {
                    if (isShowingList) {
                        isShowingList              = false;
                        fileIndex                  = aIndex;
                        isEditMode                 = prompt.editModeEnabled;
                        actionContext.initialIndex = actionIndex;
                        prompt.selector(actionContext);
                    } else {
                        isShowingList              = true;
                        actionIndex                = aIndex;
                        fileContext.initialIndex   = fileIndex;
                        fileContext.initialInput   = initialInput;
                        ref                        = true;
                        makeRefresher();
                        prompt.selector(fileContext);
                        prompt.editModeEnabled     = isEditMode;
                    }
                },
                M({ja: "デフォルトのprompt-select-actionを上書き",
                   en: "Override prompt-select-action"}),
                "prompt-select-action"];

            var fileActions = [
                [function (aIndex) {
                    s3downbar.action.start_open_finished(
                        collectList[aIndex][5],
                        collectList[aIndex][0] == "finished"
                    );
                    prompt.finish(true);
                },
                M({ja: "このファイルを開く",
                   en: "Open this file"}),
                "open-this-file,c"],

                [function (aIndex) {
                    s3downbar.action.start_show_file(
                        collectList[aIndex][5],
                        collectList[aIndex][0] == "finished"
                    );
                    prompt.finish(true);
                },
                M({ja: "このファイルを含むフォルダを開く",
                   en: "Show this file"}),
                "show-this-file,c"],

                [function (aIndex) {
                    if (collectList[aIndex][0] == "finished") {
                        s3downbar.action.rename_finished
                            (collectList[aIndex][5]);
                        collectList[aIndex][3]
                            = document.getElementById(collectList[aIndex][5])
                                      .getAttribute("name");
                        if (isShowingList)
                            prompt.refresh();
                    }
                },
                M({ja: "リネーム",
                   en: "Rename this file"}),
                "rename-this-file,c"],

                [function (aIndex) {
                    if (collectList[aIndex][0] == "finished") {
                        s3downbar.action.delete_animate_cont
                            (collectList[aIndex][5]);
                        if (collectList.length == 1)
                            prompt.finish(true);

                        var n = (aIndex == collectList.length - 1)
                              ? aIndex - 1
                              : aIndex;
                        collectList.splice(aIndex, 1);
                        if (isShowingList && collectList.length > 1)
                            showFileList(
                                type,
                                n,
                                initialInput,
                                prompt.editModeEnabled,
                                aIndex
                            );
                    }
                },
                M({ja: "このファイルを削除",
                   en: "Delete this file"}),
                "delete-this-file,c"],

                [function (aIndex) {
                    if (collectList[aIndex][0] == "finished") {
                        s3downbar.action.clear_animate
                            (collectList[aIndex][5], 1, 125, "width", "clear");
                        if (collectList.length == 1)
                            prompt.finish(true);

                        var n = (aIndex == collectList.length - 1)
                              ? aIndex - 1
                              : aIndex;
                        collectList.splice(aIndex, 1);
                        if (isShowingList && collectList.length > 1)
                            showFileList(
                                type,
                                n,
                                initialInput,
                                prompt.editModeEnabled,
                                aIndex
                            );
                    }
                },
                M({ja: "このファイルをステータスバーから取り除く",
                   en: "Clear this file"}),
                "clear-this-file,c"],

                [function (aIndex) {
                    s3downbar.action.checksum(collectList[aIndex][5]);
                },
                M({ja: "チェックサムの計算",
                   en: "Checksum this file"}),
                "checksum-this-file"],

                [function (aIndex) {
                    if (
                        collectList[aIndex][0] == "in progress" ||
                        collectList[aIndex][0] == "paused"
                    ) {
                        s3downbar.action.set_cancel(collectList[aIndex][5]);
                        if (collectList.length == 1)
                            prompt.finish(true);

                        var n = (aIndex == collectList.length - 1)
                              ? aIndex - 1
                              : aIndex;
                        collectList.splice(aIndex, 1);
                        if (isShowingList && collectList.length > 1)
                            showFileList(
                                type,
                                n,
                                initialInput,
                                prompt.editModeEnabled,
                                aIndex
                            );
                    }
                },
                M({ja: "ダウンロードのキャンセル",
                   en: "Cancel this file"}),
                "cancel-this-file,c"],

                [function (aIndex) {
                    if (collectList[aIndex][0] == "in progress") {
                        s3downbar.action.set_pause(collectList[aIndex][5]);
                        collectList[aIndex][0] = "paused";
                        if (isShowingList)
                            prompt.refresh();
                    }
                },
                M({ja: "一時停止",
                   en: "Pause this file"}),
                "pause-this-file,c"],

                [function (aIndex) {
                    if (collectList[aIndex][0] == "paused") {
                        s3downbar.action.set_resume(collectList[aIndex][5]);
                        collectList[aIndex][0] = "in progress";
                        if (isShowingList)
                            prompt.refresh();
                    }
                },
                M({ja: "ダウンロードの再開",
                   en: "Resume this file"}),
                "resume-this-file,c"],

                [function (aIndex) {
                    s3downbar.action.copy_URL(collectList[aIndex][5]);
                },
                M({ja: "URL のコピー",
                   en: "Copy url"}),
                "copy-url,c"],

                [function (aIndex) {
                    s3downbar.action.visit_referrer_website
                        (collectList[aIndex][5]);
                },
                M({ja: "ソースのウェブサイトを訪れる",
                   en: "Visit ref website"}),
                "visit-ref-website"],

                [function (aIndex) {
                    s3downbar.action.undo_clear();
                    if (isShowingList)
                        showFileList(
                            type,
                            aIndex,
                            initialInput,
                            prompt.editModeEnabled
                        );
                },
                M({ja: "クリアのやり直し",
                   en: "Undo clear"}),
                "undo-clear"],

                [function (aIndex) {
                    if (!document.getElementById("keysnail-prompt").hidden)
                        prompt.finish(true);

                    var fileStatuses = [
                        ["all"],
                        ["finished"],
                        ["paused"],
                        ["in progress"]
                    ];

                    let index = 0;
                    for (var i=0; i<fileStatuses.length; i++) {
                        if (type == fileStatuses[i][0]) {
                            index = i;
                            break;
                        }
                    }

                    prompt.selector({
                        message      : "Choose file type to show",
                        collection   : fileStatuses,
                        header       : ["file type"],
                        flags        : [0],
                        initialIndex : index,
                        keymap       : pOptions["switch_to_keymap"],
                        stylist      : function (args, n, current) {
                            let stateOption = args[0] + "_style";
                            let stateStyle  = stateOption in pOptions
                                            ? pOptions[stateOption]
                                            : pOptions["default_style"];
                            return stateStyle;
                        },
                        callback : function(i) {
                            showFileList(fileStatuses[i][0]);
                        }
                    });
                },
                M({ja: "表示ファイルの切り替え",
                   en: "Change file type to show"}),
                "switch-file-type, c"],

                [function (aIndex) {
                    showFileList(
                        type,
                        aIndex,
                        initialInput,
                        prompt.editModeEnabled
                    );
                },
                M({ja: "リストの更新",
                   en: "Refresh file list"}),
                "refresh-file-list"],
                promptShiftAction
            ];

            var actionCollection = [];
            for (i = 0; i<fileActions.length-1; i++) {
                actionCollection.push((i+1) + ". " + fileActions[i][1]);
            }

            makeRefresher();

            var fileContext = {
                message      : type + " downloaded items",
                acyclic      : false,
                collection   : collectList,
                flags        : [0, 0, ICON | IGNORE, 0, 0, HIDDEN],
                header       : ["State", "Percent", "File Name", "Source"],
                style        : [
                    "",
                    "",
                    pOptions["name_style"],
                    pOptions["source_style"]
                ],
                width        : [10, 10, 50, 30],
                keymap       : pOptions["file_key_map"],
                actions      : fileActions,
                initialIndex : fileIndex,
                initialInput : initialInput,
                onChange     : function (arg) {
                    fileIndex = arg.index;
                    initialInput = arg.textbox.value;
                },
                onFinish     : function () {
                    ref = false;
                },
                stylist      : function (args, n, current) {
                    if (current !== collectList || (n !== 0 && n !== 1))
                        return null;
                    let stateOption = args[0] + "_style";

                    let stateStyle = stateOption in pOptions
                                   ? pOptions[stateOption]
                                   : pOptions["default_style"];

                    return stateStyle;
                }
            };

            var actionContext = {
                message    : "pattern: ",
                collection : actionCollection,
                header     : ["Actions"],
                style      : ["text-decoration: underline;"],
                keymap     : pOptions["action_key_map"],
                actions    : [
                    [function (aIndex) {
                        fileActions[aIndex][0](fileIndex);

                        // 更新と表示タイプ変更以外が呼ばれたら
                        if (aIndex < actionCollection.length - 2)
                            prompt.finish(true);
                    },
                    M({ja: "アクションの実行",
                       en: "execute this action"}),
                    "execute-this-action"],
                    promptShiftAction
                ]
            };

            prompt.selector(fileContext);
            prompt.editModeEnabled = isEditMode;
        }

        var self = {
            listItems: function() {
                showFileList(pOptions["default_show_type"]);
            },
            clearAll: function() {
                allClear();
            },
            pauseAll: function() {
                allPause();
            },
            resumeAll: function() {
                allResume();
            },
            cancelAll: function() {
                allCancel();
            },
            openAll: function() {
                allOpen();
            },
            showAllActions: function() {

                var downbarelem = getDownbarelem();

                var actionList = [];
                var dispList   = [];

                for (var i=0; i<allActions.length; i++) {
                    var count      = 0;
                    var targetList = allActions[i][3];
                    for (var j=0; j<targetList.length; j++) {
                        count += downbarelem
                                .getElementsByAttribute("state", targetList[j])
                                .length;
                    }

                    if (count != 0) {
                        actionList.push([
                            allActions[i][2],
                            count + " files",
                            allActions[i][1],
                            getState(targetList[0])
                        ]);
                        dispList.push(i);
                    }
                }

                if (actionList.length == 0)
                    return void display.echoStatusBar("No items in Statusbar");

                prompt.selector(
                    {
                        message   : "All Actions",
                        collection: actionList,
                        flags     : [0, 0, 0, HIDDEN],
                        header    : ["Name", "Target", "Description"],
                        width     : [15, 15, 70],
                        keymap    : pOptions["action_key_map"],
                        style     : [
                            "", 
                            pOptions["file_style"],
                            pOptions["description_style"]
                        ],
                        stylist   : function (args, n, current) {
                            if (current !== actionList || n !== 0)
                                return null;

                            let targetState = args[3] + "_style";

                            let sty = targetState in pOptions
                                    ? pOptions[targetState]
                                    : pOptions["default_style"];

                            return sty;
                        },
                        callback  : function (i) {
                            if (i >= 0) {
                                allActions[dispList[i]][0]();
                            }
                        }
                    }
                );
            }
        };

        return self;
    })();

plugins.s3dlbsnail = s3dlbsnail;

// Add exts {{ ============================================================== //

ext.add("s3dlbsnail-show-file-list", function() {
    s3dlbsnail.listItems();
}, M({ja: "ファイルリストの表示",
      en: "Show File List"}));

ext.add("s3dlbsnail-all-clear", function () {
    s3dlbsnail.clearAll();
}, M({ja: "ダウンロード完了したファイルをすべてクリア",
      en: "Download Manager (S3) All Clear"}));

ext.add("s3dlbsnail-all-pause", function () {
    s3dlbsnail.pauseAll();
}, M({ja: "進行途中のファイルをすべて一時停止",
      en: "Download Manager (S3) All Pause"}));

ext.add("s3dlbsnail-all-resume", function () {
    s3dlbsnail.resumeAll();
}, M({ja: "一時停止中のファイルをすべて再開",
      en: "Download Manager (S3) All Resume"}));

ext.add("s3dlbsnail-all-cancel", function () {
    s3dlbsnail.cancelAll();
}, M({ja: "進行途中のファイルをすべてキャンセル",
      en: "Download Manager (S3) All Cancel"}));

ext.add("s3dlbsnail-all-open", function () {
    s3dlbsnail.openAll();
}, M({ja: "ダウンロード完了したファイルをすべて開く",
      en: "Download Manager (S3) All Open"}));

ext.add("s3dlbsnail-show-command-for-all", function () {
    s3dlbsnail.showAllActions();
}, M({ja: "全体操作のコマンド一覧",
      en: "Show Commands for All items"}));

ext.add("s3dlbsnail-toggle-mode", function() {
    s3downbar.action.mode_toggle();
}, M({ja: "ミニモードのトグル",
      en: "Toggle Download Manager (S3) Mode"}));

ext.add("s3dlbsnail-toggle-auto-mode", function() {
    s3downbar.action.auto_mode_toggle();
}, M({ja: "オートモードのトグル",
      en: "Toggle Download Manager (S3) Auto Mode"}));

ext.add("s3dlbsnail-open-preference", function() {
    s3downbar.action.open_options_window();
}, M({ja: "Download Manager (S3) の設定を開く",
      en: "Open Download Manager (S3) preference"}));

ext.add("s3dlbsnail-open-history", function() {
    s3downbar.action.open_download_window();
}, M({ja: "ダウンロード履歴を見る",
      en: "Open Download History"}));

ext.add("s3dlbsnail-checksum-for-any-file", function() {
    s3downbar.action.checksum_for_any_file();
}, M({ja: "指定したファイルのチェックサムを計算する",
      en: "Checksum for any file"}));

// }} ======================================================================= //
