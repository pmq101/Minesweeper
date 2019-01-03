$(document).ready(function() {

    var won = false;
    var lost = false;
    var time = 1;
    var score = 0;
    var bombCount = 0;
    //var correctBombFlagNum = 0;
    var flagNum = 0;
    var highScore = null;
    var timer = null;
    var safeSpaceNum = null;
    

    function createBoard() {
        $(".board").empty();
        $(".timer").empty();
        $(".bombsLeft").empty();
        $(".game-end").empty();
        clearInterval(timer);
        won = false;
        lost = false;
        time = 1;

        var rowSize = $(".rowNum").val();
        var colSize = $(".colNum").val();
        bombCount = $(".bombNum").val();
        safeSpaceNum = (rowSize * colSize) - bombCount;

        if (rowSize < 8 || rowSize > 30 || colSize < 8 || colSize > 40 || bombCount < 1) {
            alert("The board settings you specified are not valid!");
        } else {
            $(".board").append("<table>");
            for (var row = 0; row < rowSize; row++) {
                $(".board").append("<tr>");
                for (var col = 0; col < colSize; col++) {
                    $(".board").append("<td class='minespace firstspace clickable' row=" + row + " col=" + col + "></td>");
                }
                $(".board").append("</tr>");
            }
            $(".board").append("</table>");

            $(".timer").append("<h4>Time Elapsed: 0 seconds</h4>"); // appends time elapsed at 0 seconds
        $(".bombsLeft").append("<h5>Bombs not yet thought to be found: " + bombCount + "</h5>");

        for (var bomb = 0; bomb < bombCount; bomb++) {
            var randRow = parseInt(Math.random() * rowSize);
            var randCol = parseInt(Math.random() * colSize);

            while($("td[row=" + randRow + "][col=" + randCol + "]").hasClass("bomb")) {
                randRow = parseInt(Math.random() * rowSize);
                randCol = parseInt(Math.random() * colSize);
            }

            $("td[row=" + randRow + "][col=" + randCol + "]").addClass("bomb");
        }

        for (var row = 0; row < rowSize; row++) {
            for (var col = 0; col < colSize; col++) {
                if (!$("td[row=" + row + "][col=" + col + "]").hasClass("bomb")) {
                    var numBombs = 0;

                    var r = row-1;
                    var c = col-1;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }
                    c = col;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }
                    c = col+1;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }

                    r = row;
                    c = col-1;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }
                    c = col;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }
                    c = col+1;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }

                    r = row+1;
                    c = col-1;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }
                    c = col;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }
                    c = col+1;
                    if ($("td[row=" + r + "][col=" + c + "]").hasClass("bomb")) {
                        numBombs++;
                    }
                    $("td[row=" + row + "][col=" + col + "]").attr("numBombs", numBombs);
                    //$("td[row=" + row + "][col=" + col + "]").text($("td[row=" + row + "][col=" + col + "]").attr("numBombs"));
                }
            }
        }
        }

        
    }


    function timerStart() {
        timer = setInterval(function() {
            if (won == true || lost == true) {
                clearInterval(timer);
            } else {
                $(".timer").empty();
                $(".timer").append("<h4>Time Elapsed: " + time + " seconds</h4>");
                time++;
            }
        }, 1000);
    }
    

    // Click Create Board to generate game board
    $(".board-button").click(function() {
        createBoard();
    });

    // Click Restart Game to generate new board
    $(".restart-button").click(function() {
        createBoard();
    });



    // Click first random button to start game  (hint: click() function has a bug, use on() instead)
    $(".board").on("click", ".minespace", function(e) {
        if ($(this).hasClass("firstspace") && $(this).hasClass("clickable")) {          // first click to start game
            timerStart();
            $(".minespace").removeClass("firstspace");
        }

        if (e.shiftKey && !$(this).hasClass("flagged") && $(this).hasClass("clickable")) {      // shift click if isn't flagged
            $(this).addClass("flagged").append("<i class='fas fa-flag'></i>");
            flagNum++;

            $(".bombsLeft").empty();
            $(".bombsLeft").append("<h5>Bombs not yet thought to be found: " + (bombCount - flagNum) + "</h5>");
        }



        if ($(this).hasClass("bomb") && !$(this).hasClass("flagged") && $(this).hasClass("clickable")) {     // if bomb is clicked
            lost = true;
            $(".minespace").removeClass("clickable");   // make minespaces unclickable if lost
            $(".bomb").css("background", "pink");        // reveal bomb spaces
            $(this).css("background", "red");

            score = time - 1;
            $(".game-end").empty().append("<h1 style='color:red'>You Lost! Your time was " + score + " seconds</h1>");
        } else if (!$(this).hasClass("bomb") && !$(this).hasClass("flagged") && $(this).hasClass("clickable")) {

            $(this).removeClass("clickable");
            $(this).css("background", "white");
            $(this).text($(this).attr("numBombs"));

            $(this).addClass("adj-clickable");  // adds adj-clickable class (gets removed later if numBombs == 0)
            
            
            safeSpaceNum--;
            score = time -1;
            if (safeSpaceNum == 0) {
                won = true;
                $(".minespace").removeClass("clickable");   // make minespaces unclickable if won
                $(".bomb").css("background", "pink");        // reveal bomb spaces

                if (score < highScore || highScore == null) {
                    highScore = score;
                    $(".high-score").empty();
                    $(".high-score").append("<h2>High Score: Completed in " + highScore + " seconds</h2>");
                }
                $(".game-end").empty().append("<h1 style='color:green'>You Won! Your time was " + score + " seconds</h1>");

            }

            var thisRow = parseInt($(this).attr("row"));
            var thisCol = parseInt($(this).attr("col"));
            if ($(this).attr("numBombs") == "0") {
                $(this).empty();
                $(this).removeClass("adj-clickable");

                for (var row = thisRow-1; row <= thisRow+1; row++) {
                    for (var col = thisCol-1; col <= thisCol+1; col++) {

                        if ((row == thisRow && col == thisCol) || row == -1 || col == -1) { // stops edge cases and repeat tiles
                            continue;
                        }

                        $("td[row=" + row + "][col=" + col + "]").trigger("click");     // recursively calls click
                            
                    }
                }
            }
        }
    });


    $(".board").on("click", ".adj-clickable", function() {
        var thisRow = parseInt($(this).attr("row"));
        var thisCol = parseInt($(this).attr("col"));

        var adjFlags = 0;

        for (var row = thisRow-1; row <= thisRow+1; row++) {
            for (var col = thisCol-1; col <= thisCol+1; col++) {
                if ((row == thisRow && col == thisCol) || row == -1 || col == -1) { // stops edge cases and repeating this tile
                    continue;
                }
                if ($("td[row=" + row + "][col=" + col + "]").hasClass("flagged")) {    // counts number of adjacent flags
                    adjFlags++;
                }
            }
        }
        
        if (parseInt($(this).attr("numBombs")) == adjFlags) {
            for (var row = thisRow-1; row <= thisRow+1; row++) {
                for (var col = thisCol-1; col <= thisCol+1; col++) {
                    if ((row == thisRow && col == thisCol) || row == -1 || col == -1) { // stops edge cases and repeating this tile
                        continue;
                    }
                    
                    $("td[row=" + row + "][col=" + col + "]").trigger("click");     // recursively calls click
                }
            }
        }
        
    });


    $(".board").on("click", ".flagged", function(e) {
        if (e.shiftKey && $(this).hasClass("flagged")) {   // shift click if is flagged
            $(this).empty().removeClass("flagged");
            flagNum--;

            $(".bombsLeft").empty();
            $(".bombsLeft").append("<h5>Bombs not yet thought to be found: " + (bombCount - flagNum) + "</h5>");
        }
    });
});