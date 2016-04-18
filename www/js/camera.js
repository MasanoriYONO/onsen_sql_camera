// This is a JavaScript file

var f_read_flag = 0;
var saved_photo_filename = "";
var saved_photo_directory = "net.masanoriyono.shizugas.camera";
var image_tag = "";
var photo_div = "";
var saved_date = "";
var array_picture = [];
var update_div = "";
var update_div_id = 0;
var delete_id = 0;
var confirm_id = 0;
var remove_photo_filename;
var saved_location = "";
var photo_id = 0;
var f_file = false;
var image_directory = "";
var view_title = "";
var p_db = window.openDatabase("shizugas.camera", "1.0", "shizugas.camera", 24 * 1024 * 1024);

var image_width;
var image_height;
var camera_canvas_width;
var camera_canvas_height;
var scale;
var w_scale;
var h_scale;
var canvas;
var context;
var image;

function photo(id, divisoin, recdate, recloc, filename){
    this.id = id;
    this.division = divisoin;
    this.recdate = recdate;
    this.recloc = recloc;
    this.filename = filename;
}

function view_detail(index){
    var options = {path: image_directory + array_picture[index].filename, id:index, title:array_picture[index].division};
    myNavigator.pushPage('page_photo_detail.html', options);
}

$(document).on('pageinit', '#page_photo_detail', function(event) {
    var page = myNavigator.getCurrentPage();
    pd_id = page.options.id; 
    $("#v_title").empty();
    $("#v_title").text(page.options.title);
    
    $("#camera_pic").empty();
    $("#camera_pic").attr("src",page.options.path);
    
    var rect = document.body.getBoundingClientRect();
            
    canvas = $('#canvas').get(0);
    if ( ! canvas || ! canvas.getContext ) {
        console.log("! canvas || ! canvas.getContext");
        return false; 
    }
    canvas.width = rect.width;
    if(monaca.isAndroid){
        canvas.height = rect.height - 20;
    }
    if(monaca.isIOS){
        canvas.height = rect.height - 100;
    }
        
    console.log("canvas.width:" + canvas.width);
    console.log("canvas.height:" + canvas.height);
    
    context = canvas.getContext('2d');
    
    image = new Image();
    image.src = page.options.path;
    if(monaca.isAndroid){
        image.onload = function(){
            console.log("Android.image.onload.");
            image_width = image.width;
            image_height = image.height;
        
            console.log("image_width:" + image_width);
            console.log("image_height:" + image_height);
            //Xperiaなど
            if(image_width > image_height){
                w_scale = canvas.width / image_height;
                h_scale = canvas.height / image_width;
                console.log("w_scale:" + w_scale);
                console.log("h_scale:" + h_scale);
                if(w_scale > h_scale){
                    scale = h_scale;
                }else{
                    scale = w_scale;
                }
                
                console.log("scale:" + scale);
                
                context.translate(canvas.width, 0);
                context.rotate(90 * Math.PI/180);
                
                console.log("(canvas.height - image_width*scale)/2:" + (canvas.height - image_width*scale)/2);
                console.log("(canvas.width - image_height*scale)/2:" + (canvas.width - image_height*scale)/2);
                
                context.drawImage(image, 0, 0, image_width, image_height, 
                    (canvas.height - image_width*scale)/2,
                    (canvas.width - image_height*scale)/2,
                    image_width*scale,
                    image_height*scale);
            }else{
                w_scale = canvas.width / image_width;
                h_scale = canvas.height / image_height;
                console.log("w_scale:" + w_scale);
                console.log("h_scale:" + h_scale);
                if(w_scale > h_scale){
                    scale = h_scale;
                }else{
                    scale = w_scale;
                }
                
                console.log("scale:" + scale);
                console.log("(canvas.width - image_width*scale)/2:" + (canvas.width - image_width*scale)/2);
                console.log("(canvas.height - image_height*scale)/2:" + (canvas.height - image_height*scale)/2);
                context.drawImage(image, 0, 0, image_width, image_height, 
                    (canvas.width - image_width*scale)/2,
                    (canvas.height - image_height*scale)/2,
                    image_width*scale,
                    image_height*scale);
            }
            
        };
    }
    
    if(monaca.isIOS){
        image.onload = function(){
            console.log("iOS.image.onload.");
            image_width = image.width;
            image_height = image.height;
        
            console.log("image_width:" + image_width);
            console.log("image_height:" + image_height);
            
            /* correctOrientation = false の場合 */
            /*
            w_scale = canvas.width / image_height;
            h_scale = canvas.height / image_width;
            console.log("w_scale:" + w_scale);
            console.log("h_scale:" + h_scale);
            if(w_scale > h_scale){
                scale = h_scale;
            }else{
                scale = w_scale;
            }
            console.log("scale:" + scale);
            
            context.translate(canvas.width, 0);
            context.rotate(90 * Math.PI/180);
            
            console.log("(canvas.height - image_width*scale)/2:" + (canvas.height - image_width*scale)/2);
            console.log("(canvas.width - image_height*scale)/2:" + (canvas.width - image_height*scale)/2);
            
            context.drawImage(image, 0, 0, image_width, image_height, 
                (canvas.height - image_width*scale)/2,
                (canvas.width - image_height*scale)/2,
                image_width*scale,
                image_height*scale);
            */
            
            /* correctOrientation = true の場合 */
            w_scale = canvas.width / image_width;
            h_scale = canvas.height / image_height;
            console.log("w_scale:" + w_scale);
            console.log("h_scale:" + h_scale);
            if(w_scale > h_scale){
                scale = h_scale;
            }else{
                scale = w_scale;
            }
            
            console.log("scale:" + scale);
            console.log("(canvas.width - image_width*scale)/2:" + (canvas.width - image_width*scale)/2);
            console.log("(canvas.height - image_height*scale)/2:" + (canvas.height - image_height*scale)/2);
            context.drawImage(image, 0, 0, image_width, image_height, 
                (canvas.width - image_width*scale)/2,
                (canvas.height - image_height*scale)/2,
                image_width*scale,
                image_height*scale);
        };
    }
});

function modify_div(id){
    confirm_id = id
    
    navigator.notification.confirm(
        "説明を変更する場合は「変更」を\n写真を削除する場合は「削除」を\n押してください。", 
        confirmCallback, 
        "この写真について", 
        ["変更","削除","キャンセル"]);
    
}

function confirmCallback(buttonIndex){
    
    if(buttonIndex == 1){
        navigator.notification.prompt(
            "説明を変更する場合は入力してください。", 
            modifyCallback, 
            "写真の説明を変更しますか？", 
            ["OK","キャンセル"],
            array_picture[confirm_id].division);
            
    }else if(buttonIndex == 2){
        navigator.notification.confirm(
            "削除しますか？", 
            deleteCallback, 
            "この写真を削除", 
            ["OK","キャンセル"]);
    }
}

function modifyCallback(results){
    if(results.buttonIndex == 1){
        
        update_div_id = array_picture[confirm_id].id;
        update_div = results.input1;
        $("#v_title").text(update_div);
        console.log(update_div);
        camera_update_division_DB();
    }
}

function deleteCallback(buttonIndex){
    if(buttonIndex == 1){
        delete_id = array_picture[confirm_id].id;
        console.log("deleteCallback:" + delete_id);
        
        camera_delete_DB();
        
        remove_photo_filename = array_picture[confirm_id].filename;
        camera_removeImageFile();
    }
}

//// DB作成。
function camera_populateSQL(tx) {
    console.log("camera_populateSQL.");
    // tx.executeSql('DROP TABLE IF EXISTS PHOTO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS PHOTO (id INTEGER PRIMARY KEY AUTOINCREMENT, division , recdate, recloc, filename)');
}
// DB初期化。
function camera_resetSQL(tx) {
    console.log("camera_resetSQL.");
    
    tx.executeSql('DROP TABLE IF EXISTS PHOTO');
    tx.executeSql('CREATE TABLE IF NOT EXISTS PHOTO (id INTEGER PRIMARY KEY AUTOINCREMENT, division , recdate, recloc, filename)');
}

// 最新の1件のファイル名を取得。撮影後にファイル名を取得するコールバックを呼ぶ。
function camera_view_new_record_SQL(tx) {
    console.log("camera_view_new_record_SQL.");
    
    tx.executeSql(
        'SELECT * FROM PHOTO WHERE division = "' + photo_div + '" ORDER BY id desc LIMIT 1'
        , []
        , camera_insertquerySuccess
    	, camera_errorCB);
}

// 最新の1件のファイル名を取得。ボタンを押してページ遷移時の表示用。
function camera_view_SQL(tx) {
	console.log("camera_view_SQL.");
	
    tx.executeSql(
    	'SELECT * FROM PHOTO WHERE division = "' + photo_div + '" ORDER BY id desc LIMIT 1'
    	, []
    	, camera_querySuccess
    	, camera_errorCB);
}
// 撮影した写真のファイル名を追加する。
function camera_insertSQL(tx) {
	console.log("camera_insertSQL.");
	
    tx.executeSql('INSERT INTO PHOTO (division, recdate, filename) VALUES ("'
        + photo_div + '","' + saved_date + '","' + saved_photo_filename + '")');
}

// 撮影した場所の位置情報を更新する。
function camera_update_location_SQL(tx) {
    console.log("camera_update_location_SQL.");
	
    tx.executeSql('UPDATE PHOTO SET recloc = "'+ saved_location + '" where id = ' + photo_id);
}

// 撮影した写真の説明を更新する。
function camera_update_division_SQL(tx) {
    console.log("camera_update_division_SQL.");
    
    tx.executeSql('UPDATE PHOTO SET division = "'+ update_div + '" where id = ' + update_div_id);
}

// 撮影した写真の情報を削除する。
function camera_delete_SQL(tx) {
    console.log("camera_delete_SQL.");
    
    tx.executeSql('DELETE FROM PHOTO where id = ' + delete_id);
    delete_id = 0;
}

// 撮影した写真のファイル名を追加するSQLを実行。成功時には撮影した写真のファイル名をDBから取得する。
function camera_insertDB() {
	console.log("camera_insertDB.");
	
    p_db.transaction(camera_insertSQL, camera_errorCB, camera_insert_success_CB);
}

function camera_createDB() {
	console.log("camera_createDB.");
	
    p_db.transaction(camera_populateSQL, camera_errorCB);
}

function camera_resetDB() {
    console.log("camera_resetDB.");
	
    p_db.transaction(camera_resetSQL, camera_errorCB);
}

function camera_getphotoFromDB() {
	console.log("camera_getphotoFromDB.");
	
    p_db.transaction(camera_view_SQL, camera_errorCB);
}

function camera_update_division_DB(){
    console.log("camera_update_division_DB.");
    
    p_db.transaction(camera_update_division_SQL, camera_errorCB, camera_get_saved_date_FromDB);
}

function camera_delete_DB(){
    console.log("camera_delete_DB.");
    
    p_db.transaction(camera_delete_SQL, camera_errorCB, camera_get_saved_date_FromDB);
}

function camera_update_location_DB(){
    console.log("camera_update_location_DB.");
    
    p_db.transaction(camera_update_location_SQL, camera_errorCB);
}

// 撮影後ファイル名の新規追加に成功した時のコールバック。新規追加した一枚を取得。
function camera_insert_success_CB() {
    console.log("camera_insert_success_CB.");
	
    p_db.transaction(camera_view_new_record_SQL, camera_errorCB);
}
// 撮影日時の一覧表示のために取得。
function camera_get_saved_date_FromDB() {
    console.log("camera_get_saved_date_FromDB.");
    
    p_db.transaction(camera_saved_date_SQL, camera_errorCB);
}

function camera_saved_date_SQL(tx) {
    console.log("camera_saved_date_SQL.");
    
    tx.executeSql(
        'SELECT * FROM PHOTO ORDER BY id desc '
        , []
        , camera_saved_date_querySuccess
        , camera_errorCB);
}
function camera_saved_date_querySuccess(sql, results){
    console.log("camera_saved_date_querySuccess.");
    
    // 配列の初期化
    array_picture = [];
    
    var str="";
    for(var i = 0 ; i < results.rows.length; i++){
        str += "id: " + results.rows.item(i).id + "\n"
            + "division: " + results.rows.item(i).division + "\n"
            + "recdate: " + results.rows.item(i).recdate + "\n"
            + "filename: " + results.rows.item(i).filename + "\n\n";
        
        var temp_photo = new photo(results.rows.item(i).id,
                        results.rows.item(i).division,
                        results.rows.item(i).recdate,
                        results.rows.item(i).recloc,
                        results.rows.item(i).filename);
        
        array_picture.push(temp_photo);
    }
    if(str){
        // console.log(str);
        
        for(var i=0; i < array_picture.length; i++){
            console.log(array_picture[i].id);
            console.log(array_picture[i].division);
            console.log(array_picture[i].recdate);
            console.log(array_picture[i].recloc);
            console.log(array_picture[i].filename);
        }
    }
    
    var picture_list = new PictureList();
    picture_list.load();
}
// カメラページの初期表示。
function med_camera_init(){
    console.log("med_camera_init.");
    
    // myNavigator.on('postpush', function(e) {
    //     $(e.enterPage.element).find("#saved_date_1").text(saved_date_1);
    //     $(e.enterPage.element).find("#saved_date_2").text(saved_date_2);
    //     $(e.enterPage.element).find("#saved_date_3").text(saved_date_3);
    //     $(e.enterPage.element).find("#saved_date_4").text(saved_date_4);
    //     $(e.enterPage.element).find("#saved_date_5").text(saved_date_5);
    // });
    
}

// 撮影後に1枚取得する場合。
function camera_insertquerySuccess(sql, results){
    console.log("camera_insertquerySuccess.");

    var str="";
    for(var i = 0 ; i < results.rows.length; i++){
        str += "id: " + results.rows.item(i).id + "\n"
            + "division: " + results.rows.item(i).division + "\n"
            + "recdate: " + results.rows.item(i).recdate + "\n"
            + "filename: " + results.rows.item(i).filename + "\n\n";
    }
    if(str){
        console.log(str);
        photo_id = results.rows.item(0).id;
        console.log("photo_id from db:" + photo_id);
        saved_date = results.rows.item(0).recdate;
        console.log("recdate from db:" + saved_date);
        saved_photo_filename = results.rows.item(0).filename;
        console.log("filename from db:" + saved_photo_filename);
        
        camera_readImageFile4capture();
    }
}

//結果表示
function camera_querySuccess(sql, results){
	console.log("camera_querySuccess.");
	
    var str="";
    for(var i = 0 ; i < results.rows.length; i++){
        str += "id: " + results.rows.item(i).id + "\n"
            + "division: " + results.rows.item(i).division + "\n"
            + "recdate: " + results.rows.item(i).recdate + "\n"
            + "recloc: " + results.rows.item(i).recloc + "\n"
            + "filename: " + results.rows.item(i).filename + "\n\n";
    }
    
    if(str){
        console.log(str);
        photo_id = results.rows.item(0).id;
        console.log("photo_id from db:" + photo_id);
        saved_date = results.rows.item(0).recdate;
        console.log("recdate from db:" + saved_date);
        saved_location = results.rows.item(0).recloc;
        console.log("recloc from db:" + saved_location);
        saved_photo_filename = results.rows.item(0).filename;
        console.log("filename from db:" + saved_photo_filename);
        // camera_readImageFile('camera_pic');
        camera_readImageFile('camera_canvas');
    }
}
//
function camera_errorCB(err) {
	console.log("camera_errorCB.");
    alert("SQL 実行中にエラーが発生しました: " + err.message);
}

////撮影
function camera() {
    console.log("camera.");
    
    navigator.camera.getPicture(camera_getPictureSuccess, camera_failCamera,
    {
        quality: 75,
        destinationType: Camera.DestinationType.File_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true,
        correctOrientation:true
    });
}
// 撮影で成功した時。
function camera_getPictureSuccess(uri) {
    console.log("camera_getPictureSuccess.");
    //一時ファイルをギャラリーに保存する。
    window.resolveLocalFileSystemURL(uri, camera_moveToPersistent, camera_failFS);
}

function camera_moveToPersistent(fileEntry) {
    console.log("camera_moveToPersistent.");
    // ファイル移動時に名前をつけるようにする。20150821
    var m = moment();
    saved_photo_filename = m.format("YYYYMMDD_HHmmss") + ".jpg";
    ////
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
        //The folder is created if doesn't exist
        fileSys.root.getDirectory( 
                    saved_photo_directory
                    ,{create:true, exclusive: false}
                    ,function(directory) {
                        // fileEntry.moveTo(directory, saved_photo_filename,  camera_moveToSuccess, camera_failFS);
                        fileEntry.copyTo(directory, saved_photo_filename,  camera_moveToSuccess, camera_failFS);
                    }
                    ,camera_failFS);
    },camera_failFS);
    
    /* 
    iOSではシステムの一時フォルダからアプリのフォルダへ移動する際に
    fileEntry.nameにcdv_photo_001.jpgという毎回同じファイル名をセットしてきていた。
    そのため複数枚のリスト表示をする際にもDBには同じレコードが複数存在するのに
    ファイル実体は移動時に毎回上書きされてしまうために1つしか存在せず
    同じ画像ファイルがいくつも表示される、という状況になっていた。
    
    Androidでは命名規則は機種依存だと思う。未確認。ASUSはUnixタイムスタンプをつける機種だった。
    他の機種はIMG_XXX.JPGなどの名前かもしれない。
    
    両方のOSでファイル名規則は時間にして移動時にリネームすることにした。
    以下は変更前のコード。fileEntry.nameをそのまま使用していた。
    */
    // window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //     //The folder is created if doesn't exist
    //     fileSys.root.getDirectory( 
    //                 saved_photo_directory
    //                 ,{create:true, exclusive: false}
    //                 ,function(directory) {
    //                     fileEntry.moveTo(directory, fileEntry.name,  camera_moveToSuccess, camera_failFS);
    //                 }
    //                 ,camera_failFS);
    // },camera_failFS);
    
}

function camera_moveToSuccess(fileEntry) {
    console.log("camera_moveToSuccess.");
    
    // alert('画像ファイル「' + fileEntry.name + '」を移動しました。\n' + fileEntry.fullPath);
    $('#camera_pic')
        .css('display', 'block')
        .attr('src', image_directory + saved_photo_filename);
    
    // ファイル移動時に名前をつけるように変更。20150821
    // photo_data = fileEntry.name;
    // saved_photo_filename = fileEntry.name;
    
    // TODO:撮影日時の取得と格納。
    var m = moment();
    saved_date = m.format("YYYY-MM-DD HH:mm:ss");
    console.log(saved_date);
    
    // TODO:撮影場所の取得と格納。
    // navigator.geolocation.getCurrentPosition(camera_onGeoSuccess
    //     ,camera_onGeoError
    //     ,{ maximumAge: 3000, timeout:   10000, enableHighAccuracy: true });
            
    // 撮影情報をDBに格納。
    // camera_insertDB();
    
    navigator.notification.prompt(
        "この写真の説明を入力してください。", 
        promptCallback, 
        "入力してください", 
        ["OK","キャンセル"],
        "写真の説明");        
}

function promptCallback(results){
    if(results.buttonIndex == 1){
        photo_div = results.input1;
        
        // 撮影情報をDBに格納。
        camera_insertDB();
    }
}

function camera_onGeoSuccess(position) {
    console.log("camera_onGeoSuccess.");
    
    // console.log('Latitude: '          + position.coords.latitude          + '\n' +
    //       'Longitude: '         + position.coords.longitude         + '\n' +
    //       'Altitude: '          + position.coords.altitude          + '\n' +
    //       'Accuracy: '          + position.coords.accuracy          + '\n' +
    //       'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //       'Heading: '           + position.coords.heading           + '\n' +
    //       'Speed: '             + position.coords.speed             + '\n' +
    //       'Timestamp: '         + position.timestamp                + '\n');
    saved_location = position.coords.latitude
                    + " "
                    + position.coords.longitude;
    console.log("saved_location:" + saved_location);
    $('#saved_location').text(saved_location);
    // 位置情報を格納。
    camera_update_location_DB();
}

// onError 時のコールバックは、PositionError オブジェクトを受け取ります。
//
function camera_onGeoError(error) {
    console.log("camera_onGeoError.");
    
    // alert('現在位置を取得できませんでした。');
    saved_location = "現在位置を取得できませんでした。";
    console.log("saved_location:" + saved_location);
    $('#saved_location').text(saved_location);
    camera_update_location_DB();
}

function camera_failCamera(message) {
    console.log("camera_failCamera.");
    
    console.log('カメラ操作に失敗しました。\n' + message);
}

function camera_failFS(error) {
    console.log("camera_failFS.");
    
    console.log('ファイルシステム操作に失敗しました。\nエラーコード: ' + error.code);
}
//+++++++　read image　+++++++
function camera_readImageFile(dest_tag){
    console.log("camera_readImageFile");
    image_tag = dest_tag;
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, camera_gotDIR_R_Image, camera_fail);
}

function camera_gotDIR_R_Image(fileSystem) {
    console.log("camera_gotDIR_R_Image");
    
    fileSystem.root.getDirectory(saved_photo_directory, {create: true}, camera_gotFS_R_Image, camera_fail);
    
}

function camera_gotFS_R_Image(dirEntry) {
    console.log("camera_gotFS_R_Image");
    console.log(saved_photo_filename);
    
    dirEntry.getFile(saved_photo_filename, {create: true}, camera_gotFileEntry_R_Image, camera_fail);
    
    image_directory = dirEntry.nativeURL;
    console.log("image_directory:" + image_directory);
}
        
function camera_gotFileEntry_R_Image(fileEntry) {
    console.log("camera_gotFileEntry_R_Image");
    
    fileEntry.file(camera_gotFile_Image, camera_fail);
}
        
function camera_gotFile_Image(file){
    console.log("camera_gotFile_Image");
    
    camera_readAsDataURL(file);
}
        
function camera_readAsDataURL(file) {
    console.log("camera_readAsDataURL");
    
    var reader = new FileReader();
    reader.onloadstart = function(evt) {
        f_read_flag++;
    };
    reader.onloadend = function(evt) {
        var saved_data = evt.target.result;
        
        if(image_tag != ""){
            myNavigator.on('postpush', function(e) {
                $(e.enterPage.element).find("#saved_date").text(saved_date);
                // $(e.enterPage.element).find("#saved_location").text(saved_location);
                $(e.enterPage.element).find("#camera_pic").attr('src', saved_data);
                
                $(e.enterPage.element).find("#camera_pic").css('display', 'block');
                $(e.enterPage.element).find("#view_date").css('display', 'block');
            });
        }
    };
    reader.readAsDataURL(file);
}

//+++++++　read image for capture　+++++++
// 撮影後に表示するファイル情報を取得する。
function camera_readImageFile4capture(){
    console.log("camera_readImageFile4capture");
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, camera_gotDIR_R_Image4capture, camera_fail);
}

function camera_gotDIR_R_Image4capture(fileSystem) {
    console.log("camera_gotDIR_R_Image4capture");
    
    fileSystem.root.getDirectory(saved_photo_directory, {create: true}, camera_gotFS_R_Image4capture, camera_fail);
    
}

function camera_gotFS_R_Image4capture(dirEntry) {
    console.log("camera_gotFS_R_Image4capture");
    
    var filename = saved_photo_filename;
    console.log(saved_photo_filename);
    
    dirEntry.getFile(saved_photo_filename, {create: true}, camera_gotFileEntry_R_Image4capture, camera_fail);
}
        
function camera_gotFileEntry_R_Image4capture(fileEntry) {
    console.log("camera_gotFileEntry_R_Image4capture");
    
    fileEntry.file(camera_gotFile_Image4capture, camera_fail);
}
        
function camera_gotFile_Image4capture(file){
    console.log("camera_gotFile_Image4capture");
    
    camera_readAsDataURL4capture(file);
}
        
function camera_readAsDataURL4capture(file) {
    console.log("camera_readAsDataURL4capture");
    
    var reader = new FileReader();
    reader.onloadend = function(evt) {
        var saved_data = evt.target.result;
        
        $('#saved_date').text(saved_date);
        // $('#camera_pic')
        //    .css('display', 'block')
        //    .attr('src',  saved_data);
        
        $(".d_span").css('display', 'block');
        
        $('#camera_canvas').css('display', 'block');
        
        $('#view_date').css('display', 'block');
        
        canvas = $('#camera_canvas').get(0);
        if ( ! canvas || ! canvas.getContext ) {
            console.log("! canvas || ! canvas.getContext");
            return false; 
        }
        canvas.width = camera_canvas_width;
        if(monaca.isAndroid){
            canvas.height = camera_canvas_height - 20;
        }
        if(monaca.isIOS){
            canvas.height = camera_canvas_height - 140;
        }
        
        console.log("canvas.width:" + canvas.width);
        console.log("canvas.height:" + canvas.height);
        
        context = canvas.getContext('2d');
        
        image = new Image();
        image.src = saved_data;
        if(monaca.isAndroid){
            image.onload = function(){
                console.log("Android.image.onload.");
                image_width = image.width;
                image_height = image.height;
            
                console.log("image_width:" + image_width);
                console.log("image_height:" + image_height);
                //Xperiaなど
                if(image_width > image_height){
                    w_scale = canvas.width / image_height;
                    h_scale = canvas.height / image_width;
                    console.log("w_scale:" + w_scale);
                    console.log("h_scale:" + h_scale);
                    if(w_scale > h_scale){
                        scale = h_scale;
                    }else{
                        scale = w_scale;
                    }
                    
                    console.log("scale:" + scale);
                    
                    context.translate(canvas.width, 0);
                    context.rotate(90 * Math.PI/180);
                    
                    console.log("(canvas.height - image_width*scale)/2:" + (canvas.height - image_width*scale)/2);
                    console.log("(canvas.width - image_height*scale)/2:" + (canvas.width - image_height*scale)/2);
                    
                    context.drawImage(image, 0, 0, image_width, image_height, 
                        (canvas.height - image_width*scale)/2,
                        (canvas.width - image_height*scale)/2,
                        image_width*scale,
                        image_height*scale);
                }else{
                    w_scale = canvas.width / image_width;
                    h_scale = canvas.height / image_height;
                    console.log("w_scale:" + w_scale);
                    console.log("h_scale:" + h_scale);
                    if(w_scale > h_scale){
                        scale = h_scale;
                    }else{
                        scale = w_scale;
                    }
                    
                    console.log("scale:" + scale);
                    console.log("(canvas.width - image_width*scale)/2:" + (canvas.width - image_width*scale)/2);
                    console.log("(canvas.height - image_height*scale)/2:" + (canvas.height - image_height*scale)/2);
                    context.drawImage(image, 0, 0, image_width, image_height, 
                        (canvas.width - image_width*scale)/2,
                        (canvas.height - image_height*scale)/2,
                        image_width*scale,
                        image_height*scale);
                }
                
            };
        }
        
        if(monaca.isIOS){
            image.onload = function(){
                console.log("iOS.image.onload.");
                image_width = image.width;
                image_height = image.height;
            
                console.log("image_width:" + image_width);
                console.log("image_height:" + image_height);
                
                /* correctOrientation = false の場合 */
                /*
                w_scale = canvas.width / image_height;
                h_scale = canvas.height / image_width;
                console.log("w_scale:" + w_scale);
                console.log("h_scale:" + h_scale);
                if(w_scale > h_scale){
                    scale = h_scale;
                }else{
                    scale = w_scale;
                }
                console.log("scale:" + scale);
                
                context.translate(canvas.width, 0);
                context.rotate(90 * Math.PI/180);
                
                console.log("(canvas.height - image_width*scale)/2:" + (canvas.height - image_width*scale)/2);
                console.log("(canvas.width - image_height*scale)/2:" + (canvas.width - image_height*scale)/2);
                
                context.drawImage(image, 0, 0, image_width, image_height, 
                    (canvas.height - image_width*scale)/2,
                    (canvas.width - image_height*scale)/2,
                    image_width*scale,
                    image_height*scale);
                */
                
                /* correctOrientation = true の場合 */
                w_scale = canvas.width / image_width;
                h_scale = canvas.height / image_height;
                console.log("w_scale:" + w_scale);
                console.log("h_scale:" + h_scale);
                if(w_scale > h_scale){
                    scale = h_scale;
                }else{
                    scale = w_scale;
                }
                
                console.log("scale:" + scale);
                console.log("(canvas.width - image_width*scale)/2:" + (canvas.width - image_width*scale)/2);
                console.log("(canvas.height - image_height*scale)/2:" + (canvas.height - image_height*scale)/2);
                context.drawImage(image, 0, 0, image_width, image_height, 
                    (canvas.width - image_width*scale)/2,
                    (canvas.height - image_height*scale)/2,
                    image_width*scale,
                    image_height*scale);
            };
        }
    };
    
    reader.readAsDataURL(file);
}

// error
function camera_fail(error) {
    console.log("camera_fail:" + error.code);
}


// +++++++　remove image file　+++++++
// ファイルを削除する。
function camera_removeImageFile(){
    console.log("camera_removeImageFile.");
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, camera_gotDIR_R_removeImage, camera_failFS);
}

function camera_gotDIR_R_removeImage(fileSystem) {
    console.log("camera_gotDIR_R_removeImage.");
    
    fileSystem.root.getDirectory(saved_photo_directory, {create: false}, camera_gotFS_R_removeImage, camera_failFS);
    
}

function camera_gotFS_R_removeImage(dirEntry) {
    console.log("camera_gotFS_R_removeImage.");
    
    var filename = remove_photo_filename;
    console.log(remove_photo_filename);
    
    dirEntry.getFile(remove_photo_filename, {create: false}, camera_gotFileEntry_R_removeImage, camera_failFS);
}
        
function camera_gotFileEntry_R_removeImage(fileEntry) {
    console.log("camera_gotFileEntry_R_removeImage.");
    
    fileEntry.remove(camera_gotFile_removeImage, camera_failFS);
}

function camera_gotFile_removeImage(file){
    console.log("camera_gotFile_removeImage.");
}

function set_init_medipage(){
    myNavigator.on('postpush', function(e) {
        $(e.enterPage.element).find("#view_title").text(view_title);
        $(e.enterPage.element).find("#saved_date").text("");
        $(e.enterPage.element).find("#camera_pic").attr('src', '');
        $(e.enterPage.element).find("#camera_pic").css('display', 'none');
        $(e.enterPage.element).find("#view_date").css('display', 'none');
    });
}