window.addEventListener('load', eventWindowLoaded, false);
var videoElement;
var videoDiv;
function eventWindowLoaded() {

    videoElement = document.createElement("video");
    videoDiv = document.createElement('div');
    document.body.appendChild(videoDiv);
    videoDiv.appendChild(videoElement);
    videoDiv.setAttribute("style", "display:none;");
    var videoType = supportedVideoFormat(videoElement);
    if (videoType == "") {
        alert("no video support");
        return;
    }
    videoElement.setAttribute("src", "1." + videoType);
    videoElement.setAttribute("loop", "true");
    videoElement.addEventListener("canplaythrough", videoLoaded, false);


}

function supportedVideoFormat(video) {
    var returnExtension = "";
    if (video.canPlayType("video/mp4") == "probably" || video.canPlayType("video/mp4") == "maybe") {
        returnExtension = "mp4";
    } else if (video.canPlayType("video/webm") == "probably" || video.canPlayType("video/webm") == "maybe") {
        returnExtension = "webm";
    } else if (video.canPlayType("video/ogg") == "probably" || video.canPlayType("video/ogg") == "maybe") {
        returnExtension = "ogg";
    }

    return returnExtension;

}


function canvasSupport() {
    return Modernizr.canvas;
}




function videoLoaded() {
    canvasApp();

}



function canvasApp() {

    if (!canvasSupport()) {
        return;
    }



    function drawScreen() {

        //Background

        context.fillStyle = '#303030';
        context.fillRect(0, 0, theCanvas.width, theCanvas.height);
        //Box
        context.strokeStyle = '#FFFFFF';
        context.strokeRect(5, 5, theCanvas.width - 10, theCanvas.height - 10);


        for (var c = 0; c < M; c++) {
            for (var r = 0; r < N; r++) {

                var tempPiece = board[c][r];
//                var imageX = tempPiece.finalCol * blockWidth;
//                var imageY = tempPiece.finalRow * blockHeight;
                var placeX = r * blockWidth + r * xPad + startXOffset;
                var placeY = c * blockHeight + c * yPad + startYOffset;
                //context.drawImage(videoElement , imageX, imageY, blockWidth, blockHeight);
               // console.log(videoElement.videoWidth + " " + videoElement.videoHeight)
                context.drawImage(videoElement, tempPiece.finalCol * blockWidth, tempPiece.finalRow * blockHeight, blockWidth, blockHeight, placeX, placeY, blockWidth, blockHeight);
                if (tempPiece.selected) {
                    context.strokeStyle = '#FFFF00';
                    context.strokeRect(placeX, placeY, blockWidth, blockHeight);

                }
            }
        }

    }

    function randomizeBoard(board) {
        var m = board.length;
        var n = board[0].length
        var result = [Math.floor(Math.random() * m * n)];
        board[0][0].finalRow = Math.floor(result[0] / n);
        board[0][0].finalCol = result[0] % n;

        var temp,temprow ,tempcol;

        for (var i = 1; i < m * n; i++) {
            var j = 0;
            while (j < i) {
                temp = Math.floor(Math.random() * m * n);
                for (; j < i; j++) {
                    if (result[j] == temp)
                        break;
                }
                if (j == i) {
                    result.push(temp);
                    temprow = Math.floor(i / n);
                    tempcol = i % n;
                    board[temprow][tempcol].finalRow = Math.floor(temp / n);
                    board[temprow][tempcol].finalCol = temp % n;
                }
                else
                    j = 0;
            }

        }


//        var newBoard = new Array();
//        var rows = board.length;
//        var cols = board[0].length
//        for (var i = 0; i < rows; i++) {
//            newBoard[i] = new Array();
//            for (var j = 0; j < cols; j++) {
//                var found = false;
//                var rndCol = 0;
//                var rndRow = 0;
//                while (!found) {
//                    var rndCol = Math.floor(Math.random() * cols);
//                    var rndRow = Math.floor(Math.random() * rows);
//                    if (board[rndCol][rndRow] != false) {
//                        found = true;
//                    }
//                }

//                newBoard[i][j] = board[rndCol][rndRow];
//                board[rndCol][rndRow] = false;
//            }

//        }

//        return newBoard;

    }

    function eventMouseUp(event) {

        var mouseX;
        var mouseY;
        var pieceX;
        var pieceY;
        if (event.layerX || event.layerX == 0) { // Firefox
            mouseX = event.layerX;
            mouseY = event.layerY;
        } else if (event.offsetX || event.offsetX == 0) { // Opera
            mouseX = event.offsetX;
            mouseY = event.offsetY;
        }
        var selectedList = new Array();
        for (var i = 0; i < M; i++) {

            for (var j = 0; j < N; j++) {
                pieceX = j * blockWidth + j * xPad + startXOffset;
                pieceY = i * blockHeight + i * yPad + startYOffset;
                if ((mouseY >= pieceY) && (mouseY <= pieceY + blockHeight) && (mouseX >= pieceX) && (mouseX <= pieceX + blockWidth)) {

                    if (board[i][j].selected) {
                        board[i][j].selected = false;

                    } else {
                        board[i][j].selected = true;

                    }
                }
                if (board[i][j].selected) {
                    selectedList.push({ col: j, row: i })
                }

            }

        }
        if (selectedList.length == 2) {
            var selected1 = selectedList[0];
            var selected2 = selectedList[1];
            var tempPiece1 = board[selected1.row][selected1.col];
            board[selected1.row][selected1.col] = board[selected2.row][selected2.col];
            board[selected2.row][selected2.col] = tempPiece1;
            board[selected1.row][selected1.col].selected = false;
            board[selected2.row][selected2.col].selected = false;
        }




    }

    var theCanvas = document.getElementById('mycanvas');
    var context = theCanvas.getContext('2d');
    videoElement.loop = true;
    videoElement.play();

    //Puzzle Settings

    var M = 4;
    var N = 4;
    //各个块之间的间隙
    var xPad = 10;
    var yPad = 10;
    //第一个块在canvas的位置
    var startXOffset = 10;
    var startYOffset = 10;
    //块的宽度，高度
    console.log(videoElement.width +","+ videoElement.height);
    var blockWidth = videoElement.videoWidth / N ;
    var blockHeight = videoElement.videoHeight / M ;
//    //320x240
//    blockWidth = 160;
//    blockHeight = 160;

    theCanvas.width = 2 * startXOffset + (N - 1) * xPad + N * blockWidth;
    theCanvas.height = 2 * startYOffset + (M - 1) * yPad + M * blockHeight;
    var board = new Array();

    //Initialize Board



    for (var i = 0; i < M; i++) {
        board[i] = new Array();
        for (var j = 0; j < N; j++) {
            board[i][j] = { finalCol: j, finalRow: i, selected: false };
        }
    }

    randomizeBoard(board);

    theCanvas.addEventListener("mouseup", eventMouseUp, false);

    setInterval(drawScreen, 100);

}