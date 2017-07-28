window.onload = function() {
    //init canvas
    canvas_background = document.getElementById("background");
    canvas_wball = document.getElementById("w_ball");
    canvas_bball = document.getElementById("b_ball");
    canvas_grade = document.getElementById("grade");
    canvas_start = document.getElementById("start");
    canvas_end = document.getElementById("end");
    //if don't support canvas
    if (!canvas_background.getContext) {
        console.log("Canvas not supported. Please install a HTML5 compatible browser.");
        return;
    }
    // 设置大小
    setSize();
    // get 2D context of canvas
    getContext();
    
    // 设置起始位置
    start_x = 195;
    start_y = 245;
    // 画开始界面
    init_start();
    
    //初始化各种变量
    grade = 0;
    level = 1;
    levelup = 1;
    startflag = 0;
    defateflag = 0;
    clearflag = 0;
    grade = 0;
    Change_x = 0;
    Change_y = 0;
    t_ball = 0;
    t_blackball = 0;
    b_balls = [];
    // 游戏框宽
    gridwidth = 210;
    // 栅格数
    n = 3;
    //画游戏背景
    init_background();
    
    //初始化小球 w_x与w_y为圆心位置
    w_x = start_x + gridwidth / 2;
    w_y = start_y + gridwidth / 2;
    //初始化白球
    w_ball = createWBall(w_x, w_y);
    init_wball(w_ball);

    //初始化得分块位置
    g_position = 1;
    while (g_position == 5) {
        g_position = m_random9();
    }
    //初始化得分
    init_grade()
    t = setInterval("update()", 20)

    
    //添加鼠标键盘监听
    canvas_wball.addEventListener('keydown', doKeyDown, true);
    canvas_wball.focus();
    canvas_start.addEventListener('mousedown', doMouseDown, true);
    canvas_start.focus();
    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('mousedown', doMouseDown, true);

}

//用到的一些基本函数
function setSize(){
    canvas_background.width = canvas_background.parentNode.clientWidth;
    canvas_background.height = canvas_background.parentNode.clientHeight;
    canvas_wball.width = canvas_wball.parentNode.clientWidth;
    canvas_wball.height = canvas_wball.parentNode.clientHeight;
    canvas_bball.width = canvas_bball.parentNode.clientWidth;
    canvas_bball.height = canvas_bball.parentNode.clientHeight;
    canvas_grade.width = canvas_bball.parentNode.clientWidth;
    canvas_grade.height = canvas_bball.parentNode.clientHeight;
    canvas_start.width = canvas_bball.parentNode.clientWidth;
    canvas_start.height = canvas_bball.parentNode.clientHeight;
    canvas_end.width = canvas_bball.parentNode.clientWidth;
    canvas_end.height = canvas_bball.parentNode.clientHeight;
}

function getContext(){
    ctx_background = canvas_background.getContext("2d");
    ctx_wball = canvas_wball.getContext("2d");
    ctx_bball = canvas_bball.getContext("2d");
    ctx_grade = canvas_grade.getContext("2d");
    ctx_start = canvas_start.getContext("2d");
    ctx_end = canvas_end.getContext("2d");
}

//三种随机数
function m_random9() {
    var a = parseInt(Math.random() * 9 + 1, 10)
    return Math.floor(a);
}
function m_random4() {
    var a = parseInt(Math.random() * 4 + 1, 10)
    return Math.floor(a);
}
function m_random3() {
    var a = parseInt(Math.random() * 3 + 1, 10)
    return Math.floor(a);
}

function distance(x1, y1, x2, y2) {
    var dis = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
    return Math.sqrt(dis);
}

function getPointOnCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left * (canvas.width / bbox.width),
        y: y - bbox.top * (canvas.height / bbox.height)
    };
}

//所有初始化

function init_grade() {
    drawGrade();
}

function init_start() {
    ctx_start.fillStyle = "rgb(252,171,119)";
    ctx_start.fillRect(0, 0, 800, 800)
    ctx_start.font = "80px Moonlight";
    ctx_start.fillStyle = "white";
    ctx_start.fillText("SMOVE", 170, start_y);
    ctx_start.font = "40px Moonlight";
    ctx_start.fillText("Press to Start", 155, 2 * start_y);
}

function init_background() {

    // 设置背景颜色
    ctx_background.fillStyle = "rgb(252,171,119)";
    ctx_background.fillRect(0, 0, 800, 800)
    // 画游戏框框

    // 圆角矩形半径
    grid_r = 40;

    bdColor = "#ffffff";
    //边框的颜色
    drawGamebcg(start_x, start_y, gridwidth, gridwidth, grid_r, 4, bdColor);
}

function init_wball() {
    w_ball.draw(w_ball.x, w_ball.y, 20, "white")
}



//创建白、黑球

function createWBall(x, y) {
    var WBall = new Object();
    WBall.x = x;
    WBall.y = y;
    WBall.position = 5;
    WBall.draw = drawWBall;
    WBall.clear = clearWBall;
    return WBall;
}

function createBBall() {
    var BBall = new Object();
    //朝向有四种 上下左右 分别为1234
    BBall.toward = m_random4();
    BBall.pos = m_random3() - 1;
    if (BBall.toward <= 2) {
        BBall.x = start_x + BBall.pos * gridwidth / 3 + 34;
        if (BBall.toward == 1)
            BBall.y = 700;
        else
            BBall.y = 0;
    } else {
        BBall.y = start_y + BBall.pos * gridwidth / 3 + 34;
        if (BBall.toward == 3)
            BBall.x = 600;
        else
            BBall.x = 0;
    }
    BBall.speed = 4;
    BBall.draw = drawBBall;
    BBall.clear = clearBBall;
    return BBall;
}

function createSymBBall(bball) {
    var BBall = new Object();
    //朝向有四种 上下左右 分别为1234
    switch (bball.toward) {
    case 1:
        BBall.toward = 2;
        break;
    case 2:
        BBall.toward = 1;
        break;
    case 3:
        BBall.toward = 4;
        break;
    case 4:
        BBall.toward = 3;
        break;
    }
    switch (bball.pos) {
    case 0:
        BBall.pos = 2;
        break;
    case 1:
        BBall.pos = 1;
        break;
    case 2:
        BBall.pos = 0;
        break;
    }
    if (BBall.toward <= 2) {
        BBall.x = start_x + BBall.pos * gridwidth / 3 + 34;
        if (BBall.toward == 1)
            BBall.y = 700;
        else
            BBall.y = 0;
    } else {
        BBall.y = start_y + BBall.pos * gridwidth / 3 + 34;
        if (BBall.toward == 3)
            BBall.x = 600;
        else
            BBall.x = 0;
    }
    BBall.speed = 4;
    BBall.draw = drawBBall;
    BBall.clear = clearBBall;
    return BBall;
}

function createSideBBall(bball) {
    var BBall = new Object();
    //朝向有四种 上下左右 分别为1234
    BBall.toward = bball.toward;
    var ran = m_random4() >= 3 ? 0 : 2;

    switch (bball.pos) {
    case 0:
        BBall.pos = 1;
        break;
    case 1:
        BBall.pos = rand;
        break;
    case 2:
        BBall.pos = 1;
        break;
    }
    if (BBall.toward <= 2) {
        BBall.x = start_x + BBall.pos * gridwidth / 3 + 34;
        if (BBall.toward == 1)
            BBall.y = 700;
        else
            BBall.y = 0;
    } else {
        BBall.y = start_y + BBall.pos * gridwidth / 3 + 34;
        if (BBall.toward == 3)
            BBall.x = 600;
        else
            BBall.x = 0;
    }
    BBall.speed = 4;
    BBall.draw = drawBBall;
    BBall.clear = clearBBall;
    return BBall;
}

function createSideBBall_2(bball) {
    var BBall = new Object();
    //朝向有四种 上下左右 分别为1234
    BBall.toward = bball.toward;
    var ran = m_random4() >= 3 ? 0 : 2;

    switch (bball.pos) {
    case 0:
        BBall.pos = 1;
        break;
    case 1:
        BBall.pos = rand;
        break;
    case 2:
        BBall.pos = 1;
        break;
    }
    if (BBall.toward <= 2) {
        BBall.x = start_x + BBall.pos * gridwidth / 3 + 34;
        if (BBall.toward == 1)
            BBall.y = 700;
        else
            BBall.y = 0;
    } else {
        BBall.y = start_y + BBall.pos * gridwidth / 3 + 34;
        if (BBall.toward == 3)
            BBall.x = 600;
        else
            BBall.x = 0;
    }
    BBall.speed = 6;
    BBall.draw = drawBBall;
    BBall.clear = clearBBall;
    return BBall;
}


//所有有关绘制的函数
function drawGamebcg(x, y, w, h, r, bdWidth, bdColor) {
    ctx_background.beginPath();
    ctx_background.moveTo(x + r, y);
    ctx_background.lineWidth = bdWidth;
    ctx_background.strokeStyle = bdColor;
    ctx_background.arcTo(x + w, y, x + w, y + h, r);
    ctx_background.arcTo(x + w, y + h, x, y + h, r);
    ctx_background.arcTo(x, y + h, x, y, r);
    ctx_background.arcTo(x, y, x + w, y, r);
    ctx_background.stroke();
    ctx_background.closePath();
    var width = w / 3;
    var height = h / 3;
    ctx_background.lineWidth = bdWidth / 2;
    for (var i = 1; i < 3; i++) {
        ctx_background.moveTo(x + i * width, y + r / 3);
        ctx_background.lineTo(x + i * width, y + h - r / 3)
        ctx_background.stroke();
    }
    for (var i = 1; i < 3; i++) {
        ctx_background.moveTo(x + r / 3, y + i * height);
        ctx_background.lineTo(x + w - r / 3, y + i * height)
        ctx_background.stroke();
    }
}

function drawWBall(x, y, r, color) {
    ctx_wball.beginPath();
    ctx_wball.arc(x, y, r, 0, Math.PI * 2, true)
    ctx_wball.fillStyle = color;
    ctx_wball.fill();
}

function drawBBall(x, y, r, color) {
    ctx_bball.beginPath();
    ctx_bball.arc(x, y, r, 0, Math.PI * 2, true)
    ctx_bball.fillStyle = color;
    ctx_bball.fill();
}

function drawGrade() {
    var g_x;
    var g_y;
    if (g_position % 3 == 0)
        g_x = start_x + 2 * gridwidth / 3 + 25;
    if (g_position % 3 == 1)
        g_x = start_x + 0 * gridwidth / 3 + 25;
    if (g_position % 3 == 2)
        g_x = start_x + 1 * gridwidth / 3 + 25;
    g_y = start_y + (Math.ceil(g_position / 3) - 1) * gridwidth / 3 + 25;
    if ((grade + 1) % 15 == 0)
        ctx_grade.fillStyle = "yellow";
    else
        ctx_grade.fillStyle = "blue";
    ctx_grade.fillRect(g_x, g_y, 25, 25)
}

function clearGrade() {
    ctx_grade.clearRect(start_x, start_y, 210, 210)
}

//所有有关清除的函数
function clearBBall(x, y) {
    ctx_bball.clearRect(x - 25, y - 25, 50, 50)
}

function clearWBall() {
    ctx_wball.clearRect(start_x, start_y, 210, 210)
}



//update函数
function update() {
    if (startflag) {
        updateWBall();
        updateBBall();
        updateGrade();
    }
}

function updateWBall() {
    var x = w_ball.x;
    var y = w_ball.y;
    w_ball.x += Change_x;
    w_ball.y += Change_y;
    if (t_ball === 0 && (Change_y || Change_x))
        t_ball = 5;
    else if (t_ball) {
        t_ball--;
        if (t_ball === 0) {
            Change_x = Change_y = 0;
        }
        w_ball.clear();
        drawWBall(w_ball.x, w_ball.y, 20, "white")
    }
}

function updategrade() {
    grade++;
    var grade_text = grade + "";
    document.getElementById("grade_text").innerHTML = grade_text;
    if (grade == 0) {
        document.getElementById("level").innerHTML = "Level " + level;
        return;
    }
    if (grade % 15 == 0 && levelup) {
        level++;
        document.getElementById("level").innerHTML = "Level " + level;
        levelup = 0;
        clearflag = 1;
        ctx_grade.font = "30px Moonlight";
        ctx_grade.fillStyle = "white";
        ctx_grade.fillText("level up", 240, start_y + 250);
    } else if (grade % 15 != 0)
        levelup = 1;

}

function updateGrade() {
    if (g_position === w_ball.position) {
        var g_x;
        var g_y;
        if (g_position % 3 == 0)
            g_x = start_x + 2 * gridwidth / 3 + 25;
        if (g_position % 3 == 1)
            g_x = start_x + 0 * gridwidth / 3 + 25;
        if (g_position % 3 == 2)
            g_x = start_x + 1 * gridwidth / 3 + 25;
        g_y = start_y + (Math.ceil(g_position / 3) - 1) * gridwidth / 3 + 25;
        if (Math.abs(g_x + 12 - w_ball.x) < 10 || Math.abs(g_y + 12 - w_ball.y < 10)) {
            updategrade();
            while (g_position === w_ball.position - 1 || g_position === w_ball.position + 1 || g_position === w_ball.position - 3 || g_position === w_ball.position + 3 || g_position === w_ball.position) {
                g_position = m_random9();
            }
            clearGrade();
            drawGrade();
        }
    }
}

function updateBBall() {
    if (level == 1) {
        if (t_blackball % 100 == 0) {
            var bball = createBBall();
            b_balls.push(bball);
        }
        for (var i = 0; i < b_balls.length; i++) {
            var bball = b_balls[i];
            var y = 0;
            var x = 0;
            switch (bball.toward) {
            case 1:
                y = -bball.speed;
                break;
            case 2:
                y = bball.speed;
                break;
            case 3:
                x = -bball.speed;
                break;
            case 4:
                x = bball.speed;
                break;
            }
            bball.x += x;
            bball.y += y;
            if (distance(bball.x, bball.y, w_ball.x, w_ball.y) < 45) {
                defateflag = 1;
            }
            bball.clear(bball.x - x, bball.y - y);
            if (bball.x < -30 || bball.y < -30 || bball.x > 630 || bball.y > 730) {
                b_balls.splice(i, 1);
            }
        }
        for (var i = 0; i < b_balls.length; i++) {
            var bball = b_balls[i];
            bball.draw(bball.x, bball.y, 25, "black");
        }
    }
    if (level == 2) {
        if (clearflag == 1 && b_balls.length == 0)
            clearflag = 0;
        if (t_blackball % 80 == 0 && clearflag == 0) {
            var bball_1 = createBBall();
            var bball_2 = createSymBBall(bball_1);
            b_balls.push(bball_1);
            b_balls.push(bball_2);
            ctx_grade.clearRect(240, start_y + 220, 295, 30)
        }
        for (var i = 0; i < b_balls.length; i++) {
            var bball = b_balls[i];
            var y = 0;
            var x = 0;
            switch (bball.toward) {
            case 1:
                y = -bball.speed;
                break;
            case 2:
                y = bball.speed;
                break;
            case 3:
                x = -bball.speed;
                break;
            case 4:
                x = bball.speed;
                break;
            }
            bball.x += x;
            bball.y += y;
            if (distance(bball.x, bball.y, w_ball.x, w_ball.y) < 45) {
                defateflag = 1;
            }
            bball.clear(bball.x - x, bball.y - y);
            if (bball.x < -30 || bball.y < -30 || bball.x > 630 || bball.y > 730) {
                b_balls.splice(i, 1);
            }
        }
        for (var i = 0; i < b_balls.length; i++) {
            var bball = b_balls[i];
            bball.draw(bball.x, bball.y, 25, "black");
        }
    }
    if (level == 3) {
        if (clearflag == 1 && b_balls.length == 0)
            clearflag = 0;
        if (t_blackball % 60 == 0 && clearflag == 0) {
            var bball_1 = createBBall();
            var bball_2 = createSideBBall(bball_1);
            b_balls.push(bball_1);
            b_balls.push(bball_2);
            ctx_grade.clearRect(240, start_y + 220, 295, 30)
        }
        for (var i = 0; i < b_balls.length; i++) {
            var bball = b_balls[i];
            var y = 0;
            var x = 0;
            switch (bball.toward) {
            case 1:
                y = -bball.speed;
                break;
            case 2:
                y = bball.speed;
                break;
            case 3:
                x = -bball.speed;
                break;
            case 4:
                x = bball.speed;
                break;
            }
            bball.x += x;
            bball.y += y;
            if (distance(bball.x, bball.y, w_ball.x, w_ball.y) < 45) {
                defateflag = 1;
            }
            bball.clear(bball.x - x, bball.y - y);

            if (bball.x < -30 || bball.y < -30 || bball.x > 630 || bball.y > 730) {
                b_balls.splice(i, 1);
            }
        }
        for (var i = 0; i < b_balls.length; i++) {
            var bball = b_balls[i];
            bball.draw(bball.x, bball.y, 25, "black");
        }
    }
    if (level >= 4) {
        if (clearflag == 1 && b_balls.length == 0)
            clearflag = 0;
        if (t_blackball % 50 == 0 && clearflag == 0) {
            var bball_1 = createBBall();
            var bball_2 = createSideBBall_2(bball_1);
            bball_1.speed += level - 4;
            bball_2.speed += level - 4;
            b_balls.push(bball_1);
            b_balls.push(bball_2);
            ctx_grade.clearRect(240, start_y + 220, 295, 30)
        }
        for (var i = 0; i < b_balls.length; i++) {
            var bball = b_balls[i];
            var y = 0;
            var x = 0;
            switch (bball.toward) {
            case 1:
                y = -bball.speed;
                break;
            case 2:
                y = bball.speed;
                break;
            case 3:
                x = -bball.speed;
                break;
            case 4:
                x = bball.speed;
                break;
            }
            bball.x += x;
            bball.y += y;
            if (distance(bball.x, bball.y, w_ball.x, w_ball.y) < 45) {
                defateflag = 1;
            }
            bball.clear(bball.x - x, bball.y - y);

            if (bball.x < -30 || bball.y < -30 || bball.x > 630 || bball.y > 730) {
                b_balls.splice(i, 1);
            }
        }
        for (var i = 0; i < b_balls.length; i++) {
            var bball = b_balls[i];
            bball.draw(bball.x, bball.y, 25, "black");
        }
    }
    if (defateflag) {
        clearInterval(t);
        gameover();
    }
    t_blackball++;
}

//处理游戏结束
function gameover() {
    ctx_end.fillStyle = "rgba(252,171,119,0.5)";
    ctx_end.fillRect(0, 0, 800, 800)
    ctx_end.font = "80px Moonlight";
    ctx_end.fillStyle = "white";
    ctx_end.fillText("Game Over", 80, start_y + 60);
    ctx_end.font = "40px Moonlight";
    ctx_end.fillText("Press to Restart", 135, 2 * start_y);
}

function restart() {
    ctx_end.clearRect(0, 0, 800, 800)
    for (var i = 0; i < b_balls.length; i++) {
        var bball = b_balls[i];
        bball.clear(bball.x, bball.y);
    }
    b_balls.splice(0, b_balls.length);
    startflag = 0;
    init_start();
    defateflag = 0;
    clearflag = 0;
    ctx_wball.clearRect(0, 0, 800, 800);
    level = 1;
    w_ball = createWBall(w_x, w_y);
    t = setInterval("update()", 20);
    init_wball(w_ball);
    ctx_grade.clearRect(0, 0, 800, 800);
    grade = 0;
    //初始化得分块位置
    g_position = 1;
    while (g_position == 5) {
        g_position = m_random9();
    }
    console.log(g_position);
    init_grade()
    //初始化得分
    grade = -1;
    updategrade();
    Change_x = Change_y = 0;
}

//事件处理函数
function doKeyDown(e) {
    var keyID = e.keyCode ? e.keyCode : e.which;
    if (keyID === 38 || keyID === 87) {
        // up arrow and W
        if (!Change_y && !Change_x)
            if (w_ball.position >= 4) {
                Change_y = -12;
                w_ball.position -= 3;
            }
    }
    if (keyID === 39 || keyID === 68) {
        // right arrow and D
        if (!Change_y && !Change_x)
            if (w_ball.position % 3 != 0) {
                Change_x = 12;
                w_ball.position += 1;
            }
    }
    if (keyID === 40 || keyID === 83) {
        // down arrow and S
        if (!Change_y && !Change_x)
            if (w_ball.position <= 6) {
                Change_y = 12;
                w_ball.position += 3;
            }
    }
    if (keyID === 37 || keyID === 65) {
        // left arrow and A
        if (!Change_y && !Change_x)
            if (w_ball.position % 3 != 1) {
                Change_x = -12;
                w_ball.position -= 1;
            }
    }
}

function doMouseDown(event) {
    var x = event.pageX;
    var y = event.pageY;
    var canvas = event.target;
    var loc = getPointOnCanvas(canvas, x, y);
    console.log("mouse down at point( x:" + loc.x + ", y:" + loc.y + ")");
    if (startflag == 0 && loc.x > 155 && loc.x < 460 && loc.y > 2 * start_y - 30 && loc.y < 2 * start_y) {
        startflag = 1;
        ctx_start.clearRect(0, 0, 800, 800);
    }
    if (defateflag == 1 && loc.x > 155 && loc.x < 460 && loc.y > 2 * start_y - 30 && loc.y < 2 * start_y) {
        restart();
    }
}
