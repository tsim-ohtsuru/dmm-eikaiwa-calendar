// 【件名フォーマット（恐らく固定）】
// レッスン予約

// 【予約内容フォーマット】
// HTMLメールになっているので↓の文章で探す
// "XXX様、2019/mm/dd HH:MMのXXXXとのレッスン予約が完了しました。レッスン開始の数分前にレッスンに参加してください。"

var MAIL_SEARCH_QUERY = 'newer_than:1d subject:"レッスン予約"';
var BODY_SEARCH_QUERY = 'レッスン予約が完了しました';

var EVENT_TITLE = '【DMM英会話】';
var MY_NAME = "XXX";

function registDmmCalendar() {
    // メインのカレンダーに登録する
    var calendar = CalendarApp.getDefaultCalendar();

    var row = 1;
    // Gmailから指定文字列でスレッドを検索する
    var threads = GmailApp.search(MAIL_SEARCH_QUERY);

    // スレッドで繰り返し
    for (var i = 0; i < threads.length; i++) {
        // スレッド内のメッセージを取得
        var messages = threads[i].getMessages();

        // メッセージで繰り返し
        for (var j = 0; j < messages.length; j++) {

            // メッセージ本文
            var body = messages[j].getBody();
            var splitedBody = body.split("\n");

            for (var k = 0; k < splitedBody.length; k++) {
                // メール本文にDMM英会話のレッスン予約完了の旨が書いてあるかの確認を行う
                if (splitedBody[k].indexOf(BODY_SEARCH_QUERY) !== -1) {

                    // フォーマット
                    // "XXX様、2019/mm/dd HH:MMのXXXXとのレッスン予約が完了しました。レッスン開始の数分前にレッスンに参加してください。"
                    var str = splitedBody[k];

                    // 文頭の自分の名前を削除
                    // -> "様、2019/mm/dd HH:MMのXXXXとのレッスン予約が完了しました。レッスン開始の数分前にレッスンに参加してください。"
                    str = str.replace(MY_NAME, "");

                    // 取得
                    var time = str.match(/(\d){2}\:(\d){2}/)[0];
                    var teacher_name = str.match(/[a-zA-Z]+/)[0];
                    var date = str.match(/(\d){4}.(\d+){2}.(\d+){2}/)[0];

                    var content = EVENT_TITLE + " " + teacher_name + " (" + time + ")";

                    // カレンダーに追加する
                     _addToCalendar(calendar, content, date, time);
                    break;
                }
            }

        }
    }
}

// カレンダーに追加する
// date : "yyyy/mm/dd"
// time : "hh:mm"
function _addToCalendar(calendar, content, date, time) {

    // イベントの日付
    var startDate = new Date(date + " " + time);
    var endDate = new Date(date + " " + time);
    endDate.setTime(endDate.getTime() + 30 * 60 * 1000 + 1);
    Logger.log(startDate);
    Logger.log(endDate);

    // その日のイベント
    var eventsForDay = calendar.getEvents(startDate, endDate);
    Logger.log(eventsForDay);
    var exsists = false;

    // 既存のイベントに存在するか確認する
    for (var l = 0; l < eventsForDay.length; l++) {
        // 存在したらフラグを立ててループを抜ける
        Logger.log('Title: ' + eventsForDay[l].getTitle());
        Logger.log('content: ' + content);
        Logger.log('calender: ' + eventsForDay[l].getTitle());

        if (content == eventsForDay[l].getTitle()) {
            Logger.log(exsists);

            exsists = true;
            break;
        }
    }

    // 既存のイベントが存在しなかった場合のみイベントを登録する
    if (!exsists) {
        Logger.log(date + " " + time);
        Logger.log(content);
        Logger.log(startDate);

        var event = calendar.createEvent(
            content,
            startDate,
            endDate
        );
        Logger.log('Event ID: ' + event.getId());
    }
}