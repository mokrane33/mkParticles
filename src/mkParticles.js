/**
 * Created by UTILISATEUR on 27/10/2018.
 */
/**
 * Created by User on 16/08/2018.
 */
var canvacontainer='canvas';
function MkParticles(cc){
    var that = this;
    var interpole, canvas=cc, context, independents,mouseFollows, gameObjects = [], destroyables = [], current = "logo";
    var moseover=false
    var options = {
        randomX: 0,
        randomY: 0,
        maxRadius: 2,
        minRadius: 0.5,
        linkNumber: 10,
        alpha: true,
        minAlpha: 0.4,
        showPoints: true,
        showLine: true,
        animate: true,
        scale: 1,
        incrementation: 1,
        colors: {
            background: "#cccccc",
            /*points: "#000000", "rgba(0,0,0,0)", "image", {from:"#000000",to:"#ffffff"}*/
            points: "#ffffff", /*{
             from: "#111111",
             to: "#333333"
             },*/
            line: "points"
        },
        minTimeLogo: 20,
        maxTimeLogo: 40,
        minTimeForm: 30,
        maxTimeForm: 50,
        destroy: 50,
        independents: 500,
        mouseFollow: 150,
        independentsLinkRadius: 50
    };
    var Time = {
        last: Date.now(),
        deltaTime: 0
    };
    window.onfocus = function(){
        Time.last = Date.now();
        Time.deltaTime = 0;
        scrollVerif();
    };

    window.onblur = function(){
        options.animate=false;
    };

    function Independent(particles, distance){
        this.particles = particles || [];
        this.distance = distance || 0;
    }


    Independent.prototype.update = function(){
        for (var i = 0, length = this.particles.length; i < length; i=i+options.incrementation) {
            var particle = this.particles[i];
            particle.update();

            particle.originX += Math.cos(particle.angle / 180 * Math.PI) * particle.orbit * Time.deltaTime;
            particle.originY += Math.sin(particle.angle / 180 * Math.PI) * particle.orbit * Time.deltaTime;
            if(particle.originX < 0)
                particle.originX = canvas.width;
            if(particle.originX > canvas.width)
                particle.originX = 0;
            if(particle.originY < 0)
                particle.originY = canvas.height;
            if(particle.originY > canvas.height)
                particle.originY = 0;
            particle.x = particle.originX;
            particle.y = particle.originY;
        }

    }
    Independent.prototype.draw = function(){
        var myid = gameObjects.indexOf(this);
        var temp = this.particles.concat();
        for (var i = temp.length - 1; i >= 0; --i) {
            var p1 = temp[i];
            if(options.showPoints){
                p1.draw();
            }

            if(options.showLine){
                for (var j = gameObjects.length - 1; j >= 0; j--) {
                    if(j == myid) continue;
                    for (var k = gameObjects[j].particles.length - 1; k >= 0; k--) {
                        var p2 = gameObjects[j].particles[k];
                        if(i != k){
                            p1.lineTo(p2, this.distance * options.scale /* options.incrementation*/);
                        }
                    }
                }
                for (var i2 = 0, length = temp.length; i2 < length; i2++) {
                    var p3 = temp[i2];
                    if(i != i2){
                        p1.lineTo(p3, this.distance * options.scale /** options.incrementation*/);
                    }
                }
            }
            temp.splice(i, 1);
        }
    };


    function MouseFollow(particles, distance){
        this.particles = particles || [];
        this.distance = distance || 0;
    }
    MouseFollow.prototype.update = function(){
        for (var i = 0, length = this.particles.length; i < length; i=i+options.incrementation) {
            var particle = this.particles[i];
            particle.update();
            if(!moseover){
                particle.originX += Math.cos(particle.angle / 180 * Math.PI) * particle.orbit * Time.deltaTime;
                particle.originY += Math.sin(particle.angle / 180 * Math.PI) * particle.orbit * Time.deltaTime;
                if(particle.originX < 0)
                    particle.originX = canvas.width;
                if(particle.originX > canvas.width)
                    particle.originX = 0;
                if(particle.originY < 0)
                    particle.originY = canvas.height;
                if(particle.originY > canvas.height)
                    particle.originY = 0;
                particle.x = particle.originX;
                particle.y = particle.originY;
            }
            else{
                this.particles[i].x += ((particle.x + Math.cos(particle.angle + i) * particle.orbit) - this.particles[i].x) * particle.speed * Time.deltaTime;
                this.particles[i].y += ((particle.y + Math.sin(particle.angle + i) * particle.orbit) - this.particles[i].y) * particle.speed * Time.deltaTime;
            }
        }

    };
    MouseFollow.prototype.draw = function(){
        var myid = gameObjects.indexOf(this);
        var temp = this.particles.concat();
        for (var i = temp.length - 1; i >= 0; --i) {
            var p1 = temp[i];
            if(options.showPoints){
                p1.draw();
            }

            if(options.showLine){
                for (var j = gameObjects.length - 1; j >= 0; j--) {
                    if(j == myid) continue;
                    for (var k = gameObjects[j].particles.length - 1; k >= 0; k--) {
                        var p2 = gameObjects[j].particles[k];
                        if(i != k){
                            p1.lineTo(p2, this.distance * options.scale /* options.incrementation*/);
                        }
                    }
                }
                for (var i2 = 0, length = temp.length; i2 < length; i2++) {
                    var p3 = temp[i2];
                    if(i != i2){
                        p1.lineTo(p3, this.distance * options.scale /* options.incrementation*/);
                    }
                }
            }
            temp.splice(i, 1);
        }
    };

    function Shape(particles, distance){
        this.particles = particles || [];
        this.distance = distance || 0;
    }

    Shape.prototype.update = function(){
        for (var i = 0, length = this.particles.length; i < length; i++) {
            var particle = this.particles[i];
            particle.update();
            this.particles[i].x += ((particle.x + Math.cos(particle.angle + i) * particle.orbit) - this.particles[i].x) * particle.speed * Time.deltaTime;
            this.particles[i].y += ((particle.y + Math.sin(particle.angle + i) * particle.orbit) - this.particles[i].y) * particle.speed * Time.deltaTime;
            particle.angle += 0.08;
        }
    };

    Shape.prototype.draw = function(){
        var temp = this.particles.concat();
        for (var i = temp.length - 1; i >= 0; --i) {
            var particle = temp[i];
            if(options.showPoints){
                particle.draw();
            }
            if(options.showLine){
                for (var i2 = 0, length = temp.length; i2 < length; i2++) {
                    var p2 = temp[i2];
                    if(i != i2){
                        particle.lineTo(p2, this.distance * options.scale /* options.incrementation*/);
                    }
                }
            }
            temp.splice(i, 1);
        }
    };

    function Particle(x, y, radius, color, alpha){
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        this.originX = x || 0;
        this.originY = y || 0;
        this.speed = Math.random()*3+1;
        this.radius = radius || 2;
        this.alpha = alpha || Math.random()*this.radius/(options.maxRadius-options.minRadius)+options.minAlpha;
        this.color = color || options.colors.points;
        this.currentColor = this.color;
        this.orbit = /*0;*/ randomBetween(0, 5);
        this.angle = /*0;*/ randomBetween(0, 90);
        this.linkNumber = 0;
        this.type = "line";
    }

    Particle.prototype.update = function(){
        this.linkNumber = 0;
        this.x = lerp(this.x, this.originX, this.speed*Time.deltaTime);
        this.y = lerp(this.y, this.originY, this.speed*Time.deltaTime);
    };

    Particle.prototype.draw = function(){
        if(this.radius > 0){
            context.save();
            if(options.alpha) context.globalAlpha = this.alpha; /*/(distanceTo(this, {x:this.originX,y:this.originY})/1000);*/
            this.currentColor = lerpColor(this.currentColor, this.color, this.speed*Time.deltaTime);
            context.fillStyle = this.currentColor;
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }
    };
    Particle.prototype.lineTo = function(p, distance){
        distance = distance || 0;
        var dist = distanceTo(this, p);
        if(dist <= distance && (options.linkNumber == 0 || this.linkNumber <= options.linkNumber)){
            this.linkNumber++;
            var transp = (1-round100(dist/distance))*Math.abs((this.alpha+p.alpha)/2);
            context.save();
            if(options.alpha) context.globalAlpha = transp;
            context.strokeStyle = this.color;
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.lineTo(p.x, p.y);
            context.closePath();
            context.stroke();
            context.restore();
        }
    };

    function deltaTime(){
        var time = Date.now();
        Time.deltaTime = (time-Time.last)/1000;
        Time.last = time;
    }



    function initFromTable(image){
        var table = image.path;
        var particle;
        for(var i = 0, length = table.length; i < length; i++){
            var shape;
            var points = [];
            if(i < gameObjects.length){
                shape = gameObjects[i];
            } else {
                shape = new Shape();
            }
            shape.distance = image.distance;
            /* Parcours des points de la forme*/
            var incr = 0;
            for(var j = 0, pointLength = table[i].length; j < pointLength; j+=options.incrementation){
                var radius = randomBetween(0, options.maxRadius);
                var col = options.colors.points;
                points[j] = [
                    (randomNegative(options.randomX)+table[i][j][0])*options.scale + canvas.width/2 - (image.width/2) * options.scale,
                    (randomNegative(options.randomY)+table[i][j][1])*options.scale + canvas.height/2 - (image.height/2) * options.scale + image.top
                ];
                if(incr < shape.particles.length){
                    particle = shape.particles[incr];
                    particle.originX = points[j][0];
                    particle.originY = points[j][1];
                    particle.radius = radius;
                    particle.color = col;
                    if(typeof table[i][j][2] !== "undefined"){
                        particle.type = table[i][j][2];
                    } else {
                        particle.type = "line";
                    }
                    if(typeof table[i][j][3] !== "undefined"){
                        shape.distance = table[i][j][3];
                    }
                } else {
                    particle = new Particle(
                        points[j][0],
                        points[j][1],
                        radius,
                        col
                    );
                    if(typeof table[i][j][2] !== "undefined"){
                        particle.type = table[i][j][2];
                    }
                    if(typeof table[i][j][3] !== "undefined"){
                        shape.distance = table[i][j][3];
                    }
                    shape.particles.push(particle);
                }
                incr++;
            }
            /* Si il y a plus de points que dans la nouvelle forme, on les supprimes*/
            for (var p = shape.particles.length-1; p >= Math.floor(j/options.incrementation); --p) {
                particle = shape.particles[p];
                particle.originX = Math.random()*canvas.width;
                particle.originY = Math.random()*canvas.height;
                destroyables.push(shape.particles.splice(p, 1)[0]);
            }
            /* Si c'est une nouvelle forme on la push*/
            if(i >= gameObjects.length)
                gameObjects.push(shape);
        }
        for (var g = gameObjects.length - 1; g >= i; g--) {
            var go = gameObjects[g];
            for(var h = go.particles.length - 1; h >= 0; h--){
                particle = go.particles[h];
                particle.originX = Math.random()*canvas.width;
                particle.originY = Math.random()*canvas.height;
                destroyables.push(go.particles.splice(h, 1)[0]);
            }
            gameObjects.splice(g, 1);
        }
    }

    // var timeoutLogo = null;

    // this.showLogo = function(){
    //
    //     clearTimeout(timeoutLogo);
    //     options.logo.addClass("show-hide");
    //     timeoutLogo = setTimeout(function(){ options.logo.removeClass("show-hide"); timeoutLogo = null; }, 4000);
    //     setTimeout(function(){ options.accroche.addClass("display-none"); timeoutLogo = null; }, 6000);
    // };

    function createInterpolation(name){
        clearTimeout(interpole);
        var image;
        image = {
            top: -30,
            width: 500,
            height: 520,
            distance: 40,
            path: [
                // [
                //
                //     [46,267.5],[33.5,262],[49.5,257],[36,249.5],[52.5,243.5],[40.5,232],[56,229.5],[44.75,217],[58,217],[49,204],[62,204],[
                //     53,193],[65,193],[55.5,180],[68.5,180],[58.5,168.5],[68.5,166],[62,156.5],[74,156.5],[63.5,144],[67.5,127.5],[80,130],[75.5,140],[87.5,144],[81.5,153],[92.5,160.5],[84,168.5],[97,177],[86.25,181.5],[99.5,187],[87.5,194],[103.5,197.5],[89.5,207],[106.5,207],[97.5,219.5],[104,231],[117,227.5],[110,221],[112,213],[125,221],[119.5,207.5],[133,207.5],[128,200],[138,200],[135,188.5],[146,188.5],[143.5,177.5],[153,185.5],[153,167],[159,174.5],[159,157],[166.5,162],[166.5,150],[173,155],[183,150],[173,140],[179.5,131.5],[191,123],[187,140],[202,127.5],[202,145],[188,152.5],[197.5,161],[185.5,166.5],[193.75,174.5],[183,178.5],[194.5,185.5],[180,189.5],[191,200],[
                //     175.5,204],[188.75,215.5],[175.5,223.5],[187,231],[171.5,238],[186.75,247],[171.5,252.5],[186.75,260],[171.5,264],[179.5,270.666]]
                // ,

                [
                    [22.983,336],[4.838,327.789],[28.064,320.325],[8.468,309.128],[32.419,300.171],[15,283.003],[37.5,279.271],[
                    21.169,260.611],[40.403,260.611],[27.338,241.204],[46.209,241.204],[33.145,224.782],[50.564,224.782],[36.774,205.375],[55.645,205.375],[
                    41.128,188.207],[55.645,184.475],[46.209,170.293],[63.628,170.293],[48.387,151.632],[54.193,127],[72.338,130.732],[66.5,140],[85.15,146.198],[75.825,160.143],[92.922,171.764],[79.711,184.159],[99.916,197.33],[83.208,204.302],[
                    103.801,212.824],[85.15,223.67],[110.018,229.093],[88.259,243.813],[114.681,243.813],[100.693,263.182],[110.795,281],[131,275.577],[
                    120.121,265.506],[123.229,253.11],[132.1,271],[123,250.199],[145.336,250.199],[137.063,238.643],[153.609,238.643],[148.646,220.923],[166.846,220.923],[
                    162.709,203.975],[178.427,216.301],[178.427,187.796],[188.354,199.352],[188.354,172.388],[200.764,180.092],[200.764,161.602],[
                    211.518,169.306],[228.063,161.602],[211.518,146.194],[222.273,133.097],[241.3,120],[234.682,146.194],[259.5,126.934],[255.028,145.052],[233.96,156.916],[248.256,170.361],[230.198,179.062],[242.613,191.716],[226.436,198.043],[
                    243.741,209.116],[221.921,215.443],[238.475,232.053],[215.15,238.38],[235.089,256.57],[215.15,269.225],[232.455,281.089],[209.13,292.161],[
                    232.079,306.398],[209.13,315.098],[232.079,326.962],[209.13,333.289],[221.169,343.833]
                ]




            ]
        };

        if(image){
            current = name;
            initFromTable(image);
        }
    }

    this.interpolate = function(name, duration){
        if(duration){
            interpole = setTimeout(function(){ createInterpolation(name); }, duration);
        } else {
            createInterpolation(name);
        }
    };

    this.randomize = function(duration, ignore){
        duration = duration || 1000;
        ignore = ignore || 100;
        for (var i = gameObjects.length - 1; i >= 0; i--) {
            var points = gameObjects[i].particles;
            for (var j = points.length - 1; j >= 0; j--) {
                var particle = points[j];
                if(ignore > Math.random() * 100){
                    particle.originX = Math.random() * canvas.width;
                    particle.originY = Math.random() * canvas.height;
                }
            }
        }
        this.interpolate(current, duration);
    };

    // function randLogo(){
    //     that.showLogo();
    //     setTimeout(function(){ randLogo(); }, randomBetween(options.minTimeLogo * 1000, options.maxTimeLogo * 1000));
    // }

    // function randForm(){
    //     that.randomize(randomBetween(1000, 4000), randomBetween(10, 40));
    //     setTimeout(function(){ randForm(); }, randomBetween(options.minTimeForm * 1000, options.maxTimeForm * 1000));
    // }

    function loop() {
        deltaTime();
        clear();
        update();
        render();
        if(options.animate) requestAnimationFrame(loop);
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        if(independents)
            independents.update();
        if(mouseFollows)
            mouseFollows.update();
        for (var index = 0, length = gameObjects.length; index < length; index++) {
            gameObjects[index].update();
        }
        for (var j = destroyables.length-1; j >= 0; j--) {
            var particle = destroyables[j];
            particle.update();
            var dist = distanceTo(particle, {x:particle.originX,y:particle.originY});
            var a = particle.alpha-0.05;
            particle.alpha = (a > 0) ? a : 0;
            if(dist < options.destroy){
                destroyables.splice(j,1);
            }
        }
    }

    function render() {
        context.lineWidth = 1;
        if(independents)
            independents.draw();
        if(mouseFollows)
            mouseFollows.draw();
        for (var i = gameObjects.length - 1 /*temp.length - 1*/; i >= 0; --i) {
            gameObjects[i].draw();
        }
        var temp = destroyables.concat();
        for (var j = destroyables.length-1; j >= 0; j--) {
            var particle = destroyables[j];
            particle.draw();
            if(options.showLine){
                for (var i2 = 0, length = temp.length; i2 < length; i2++) {
                    var p2 = temp[i2];
                    if(i != i2){
                        particle.lineTo(p2, 35);
                    }
                }
            }
            temp.splice(i, 1);
        }
    }

    function lerp(a, b, f){
        return a + f * (b - a);
    }

    function distanceTo(pointA, pointB) {
        var dx = Math.abs(pointA.x - pointB.x);
        var dy = Math.abs(pointA.y - pointB.y);
        return Math.sqrt(dx * dx + dy * dy);
    }

    function randomBetween(min, max) {
        /*return ~~(Math.random() * (max - min + 1) + min);*/
        return Math.random() * (max - min + 1) + min;
    }

    function randomNegative(n){
        return (Math.random()*n*2)-n;
    }

    function round100(n){
        return Math.round(n * 100) / 100;
    }

    function stringToColor(color){
        var c;
        if(color.charAt(0)=="#"){
            c = color.substring(1,7);
            return {
                r: parseInt(c.substring(0,2),16),
                g: parseInt(c.substring(2,4),16),
                b: parseInt(c.substring(4,6),16)
            }
        } else {
            c = color.replace("rgba(", "").replace(")", "").split(',');
            return {
                r: parseInt(c[0], 10),
                g: parseInt(c[1], 10),
                b: parseInt(c[2], 10)
            }
        }
    }

    function colorToRgba(color){
        return "rgba("+color.r+","+color.g+","+color.b+",1)";
    }

    function lerpColor(from, to, t){
        var colfrom = stringToColor(from);
        var colto = stringToColor(to);
        return colorToRgba({
            r:Math.round(lerp(colfrom.r, colto.r, t)),
            g:Math.round(lerp(colfrom.g, colto.g, t)),
            b:Math.round(lerp(colfrom.b, colto.b, t))
        });
    }

    function calculateScale(){
        var width = $(window).width();
        if(width < 672){
            options.scale = 0.6;
            options.incrementation = 1;
            options.independents=50;
            options.mouseFollow=    30;
            createIndependents();
            createMouseFollow();
        } else {
            options.scale = 1;
            options.incrementation = 1;
            options.independents=300;
            options.mouseFollow=    150;
            createIndependents();
            createMouseFollow();
        }
    }

    function createIndependents()
    {
        var ps = [];
        for (var i = 0; i < options.independents; i++)
        {
            var radius = randomBetween(0.2, 1);
            var col = options.colors.points;
            var particle = new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                radius,
                col
            );
            particle.orbit = randomBetween(20, 50);
            particle.angle = randomBetween(0, 360);
            ps.push(particle);
        }
        independents = new Independent(ps, options.independentsLinkRadius);
    }

    function createMouseFollow()
    {
        var ps = [];
        for (var i = 0; i < options.mouseFollow; i++)
        {
            var radius = randomBetween(0.2, 1);
            var col = options.colors.points;
            var particle = new Particle(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                radius,
                col
            );
            particle.orbit = randomBetween(20, 50);
            particle.angle = randomBetween(0, 360);
            ps.push(particle);
        }
        mouseFollows = new MouseFollow(ps, options.independentsLinkRadius);
    }

    function init(){
        // canvas = document.getElementById('canvas');
        if(!canvas) return;
        canvas.width = $(window).width();
        canvas.height = $(window).height();
        context = canvas.getContext('2d');
        calculateScale();
        deltaTime();
        loop();
        that.interpolate("logo", 3000);
        createIndependents();
        createMouseFollow();
        canvas.addEventListener('mouseover',function (event ) {
            for(var i = 0, lenght = mouseFollows.particles.length;i < lenght; i++)
            {
                mouseFollows.particles[i].originX=event.pageX;
                mouseFollows.particles[i].originY=event.pageY;
                moseover=true;
            }
        });
        canvas.addEventListener('mouseout',function () {
            moseover=false;
            for(var i = 0, lenght = mouseFollows.particles.length;i < lenght; i++)
            {
                mouseFollows.particles[i].originX=mouseFollows.particles[i].x;
                mouseFollows.particles[i].originY=mouseFollows.particles[i].y;
            }
        });
        canvas.addEventListener('mousemove',
            function (event ) {
                for(var i = 0, lenght = mouseFollows.particles.length;i < lenght; i++)
                {
                    mouseFollows.particles[i].originX=event.pageX;
                    mouseFollows.particles[i].originY=event.pageY;
                }
            });
    }
    var resizing;
    function resize(){
        calculateScale();
        createInterpolation(current);
    }
    $(window).scroll(function () {
        scrollVerif();
    });
    function scrollVerif(){
        if($(window).scrollTop()>($(window).height()+20)){
            if(options.animate){
                options.animate=false;
            }
        }else{
            if(!options.animate){
                options.animate=true;
                loop();
            }
        }
    }
    $(window).resize(function(){
        clearTimeout(resizing);
        canvas.width = $(window).width();
        canvas.height = $(window).height();
        resizing = setTimeout(resize, 200);
    });
    init();
}
if(document.getElementById(canvacontainer)){
    var canvas = document.createElement(canvacontainer);

    div = document.getElementById(canvacontainer);
    div.style.position="relative";
    canvas.style.width  = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex   = 999;
    canvas.style.position = "absolute";

    div.prepend(canvas)
    mkParticle = new MkParticles(canvas);
}
