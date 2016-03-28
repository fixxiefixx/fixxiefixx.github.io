/*
Hallo!
Das hir ist deine Spielevorlage!
Ich hoffe, ich habe alles gut genug dokumentiert.

Alles was hier JackTheRunnerFIXXIE heißt musst du umbennen in etwas sehr
individuelles. So wie KotzeMannGRKDM
Die wirren Buchstaben können wichtig sein, falls jemand anderes
auch KotzeMann entwickelt!

WICHTIG

Wenn dein Spiel geschafft ist, dann rufe

onVictory();

auf! Später wird da dann ein richtiger Gewonnenbildschrim erscheinen!

Wenn man in deinem Spiel verliert dann rufe

onLose()

auf, dardurch wird dein Spiel neugestartet.

Wärend du an deinem Spiel arbeitest, arbeite ich am Drumherum.
So dass es dann alles auch supi aussieht!

Spiellänge 2-4 Minuten.
*/



JackDanger.JackTheRunnerFIXXIE = function() {

};

//Cheats
JackDanger.JackTheRunnerFIXXIE.prototype.godmode=false;
JackDanger.JackTheRunnerFIXXIE.prototype.fireonstart=false;
JackDanger.JackTheRunnerFIXXIE.prototype.spawnatboss=false;




JackDanger.JackTheRunnerFIXXIE.prototype.init = function() {
    logInfo("init Game JackTheRunnerFIXXIE");
    addLoadingScreen(this,false);//nicht anfassen, wenn true dann loadingscreen überspringen
}

JackDanger.JackTheRunnerFIXXIE.prototype.preload = function() {
	this.load.path = 'games/' + currentGameData.id + '/assets/';//nicht anfassen
	
    //füge hie rein was du alles laden musst.
    this.load.atlas("john");
    this.load.atlas("zombie");
    this.load.atlas("wobby");
    this.load.atlas("slimeexplo");
    this.load.atlas("prof");
    this.load.atlas("profblase");
    this.load.atlas("slimedrop");
    this.load.atlas("herz");
    
    this.load.tilemap('map',"map.json",null,Phaser.Tilemap.TILED_JSON);
    
    this.load.image("tileset");
    this.load.image("datatiles");
    this.load.image("player");
    this.load.image("fire");
    this.load.image("chili");
    this.load.image("bar");
    this.load.image("bg","bg.jpg");
    this.load.image("smoke");
    
    this.load.audio("slimeexplo",["slimeexplo.ogg","slimeexplo.mp3"]);
    this.load.audio("hmm",["hmm.ogg","hmm.mp3"]);
    this.load.audio("fire",["fire.ogg","fire.mp3"]);
    this.load.audio("haha",["haha.ogg","haha.mp3"]);
    this.load.audio("tuer",["tuer.ogg","tuer.mp3"]);
    this.load.audio("bgmusic",["bgmusic.ogg","bgmusic.mp3"]);
    this.load.audio("bossmusic",["bossmusic.ogg","bossmusic.mp3"]);
    this.load.audio("bossmusic2",["bossmusic2.ogg","bossmusic2.mp3"]);
    this.load.audio("gameovermusic",["gameover.ogg","gameover.mp3"]);
    this.load.audio("throw",["throw.wav"]);
    
    this.load.video("gameover",["gameover.mp4","gameover.webm"]);
    this.load.video("wobbyeat","wobbyeat.mp4");
    this.load.video("erstinken","erstinken.mp4");
    this.load.video("water","water.mp4");
    this.load.video("final","final.mp4");
    this.load.video("bgmovie","background.mp4");
}

//wird nach dem laden gestartet
JackDanger.JackTheRunnerFIXXIE.prototype.create = function() {
    Pad.init();//nicht anfassen
    //removeLoadingScreen();//nicht anfassen

    //this.addStuff();
}

//wird jeden Frame aufgerufen
JackDanger.JackTheRunnerFIXXIE.prototype.update = function() {
    var dt = this.time.physicsElapsedMS * 0.001;
    
    this.updateObjects(dt);
}

/////////////////////////////////////////////////////////
// Zeug das zum Spiel gehört, das kannst du alles /////// 
// Löschen oder ändern oder was weiß ich ////////////////
/////////////////////////////////////////////////////////



JackDanger.JackTheRunnerFIXXIE.prototype.addGameObject=function(obj){
    obj.objid=this.beiobjid;
    this.beiobjid=this.beiobjid+1;
    this.objectsToAdd.push(obj);
    //Spieler muss immer im Vordergrund stehen
    if(this.player!=null)
        this.player.bringToTop();
}

JackDanger.JackTheRunnerFIXXIE.prototype.removeGameObject=function(obj){
    this.objectIdsToRemove.push(obj.objid);
}

JackDanger.JackTheRunnerFIXXIE.prototype.getMapObjects = function(map,name) {
    var objs=new Array();
    var mapobjects=map.objects.objects;
    var i;
    for(i=0;i<mapobjects.length;i++)
    {
        if(mapobjects[i].name==name)
        {
            objs.push(mapobjects[i]);
        }
    }
    return objs;
}

JackDanger.JackTheRunnerFIXXIE.prototype.moveTowards=function(z1,z2,speed){
    if(z1<z2){
        z1+=speed;
        z1=Math.min(z1,z2);
    }
    if(z1>z2){
        z1-=speed;
        z1=Math.max(z1,z2);
    }
    return z1;
}

JackDanger.JackTheRunnerFIXXIE.prototype.addFire = function(x,y,speed) {
    this.fireSound.play();
    var fire=this.add.sprite(x,y,"fire");
    fire.anchor.setTo(.5,1);
    
    this.physics.enable(fire);
    fire.body.setSize(1,1,0,0);
    fire.body.allowGravity=false;
    fire.body.velocity.x=speed;
    fire.aliveTime=1;
    fire.updateObj=function(dt,state){
        this.aliveTime-=dt;
        if(state.physics.arcade.collide(this,state.layer_collision)|| this.aliveTime<=0)
        {
            state.removeGameObject(this);
        }
        var state=state;
        state.physics.arcade.overlap(this,state.gameObjects,function(obj1,obj2){
            if(obj2.objDamage!=null)
            {
                obj2.objDamage();
                state.removeGameObject(fire);
            }
        })
    }
    this.addGameObject(fire);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addSlimeexplo = function(x,y) {
    this.slimeExploSound.play();
    var explo=this.add.sprite(x,y,"slimeexplo","slimeexplo01");
    explo.anchor.setTo(.5,1);
    explo.animations.add("explosion",["slimeexplo01","slimeexplo02","slimeexplo03","slimeexplo04","slimeexplo05",
    "slimeexplo06","slimeexplo07"],20,false);
    explo.endtimer=1;
    explo.animations.play("explosion");
    explo.updateObj=function(dt,state){
        this.endtimer-=dt;
        this.y+=dt*10;
        if(this.endtimer<0.5)
        {
            this.alpha=this.endtimer*2;
            
        }
        if(this.endtimer<=0)
        {
            state.removeGameObject(this);
        }
    }
    this.addGameObject(explo);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addSmoke=function(x,y){
    var smoke=this.add.sprite(x,y,"smoke");
    smoke.anchor.setTo(0.5,0.5);
    this.physics.enable(smoke);
    smoke.body.allowGravity=false;
    smoke.phase=0;
    smoke.toy=-150;
    smoke.starty=smoke.y;
    smoke.movespeed=100;
    smoke.updateObj=function(dt,state){
        if(state.physics.arcade.overlap(this,state.player))
        {
            state.damagePlayer("smoke");
        }
        this.angle+=dt*60;
        switch(this.phase)
        {
            case 0://up
                this.y-=dt*this.movespeed;
                if(this.y-this.starty<this.toy)
                {
                    this.phase=1;
                }
            break;
            case 1://down
                this.y+=dt*this.movespeed;
                if(this.y>this.starty)
                {
                    this.phase=0;
                }
            break;
        }
    }
    this.addGameObject(smoke);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addSlimedrop = function(x,y,xspeed,yspeed) {
    var drop=this.add.sprite(x,y,"slimedrop","0001");
    drop.anchor.setTo(.5,1);
    this.physics.enable(drop);
    drop.body.velocity.x=xspeed;
    drop.body.velocity.y=yspeed;
    drop.animations.add("ground",["0002","0003","0004","0005","0006"],20,false);
    drop.timer=0.25;
    drop.phase=0;
    drop.updateObj=function(dt,state){
        if(state.physics.arcade.overlap(this,state.player))
        {
            state.damagePlayer();
        }
        if(this.y>500)
        {
            state.removeGameObject(this);
        }
        switch(this.phase){
            case 0:
                if(state.physics.arcade.collide(this,state.layer_collision)){
                    this.body.allowGravity=false;
                    this.body.velocity.x=0;
                    this.body.velocity.y=0;
                    this.animations.play("ground");
                    this.phase=1;
                }
            break;
            case 1:
                this.timer-=dt;
                if(this.timer<=0){
                    state.removeGameObject(this);
                    state.addSlimeexplo(this.x,this.y);
                }
            break;
        }
    }
    this.addGameObject(drop);
}

JackDanger.JackTheRunnerFIXXIE.prototype.spawnTubeEnemies=function(){
    //Zombie spawnen
    var pipes=this.getMapObjects(this.map,"slimepipe");
    var i;
    for(i=0;i<pipes.length;i++){
        var pipeobj=pipes[i];
        if(this.bossHealth>this.maxBossHealth*0.5){
            this.addZombie(pipeobj.x+32,pipeobj.y,true);
        }
        else{
           this.addWobby(pipeobj.x+32,pipeobj.y,true);
        }  
    }    
}

JackDanger.JackTheRunnerFIXXIE.prototype.smoothMove=function(x)
    {
        if(x<0){
            return 0;
        }
        if(x>1){
            return 1;
        }
        return (-Math.sin(x*Math.PI+Math.PI*0.5)+1)*0.5;
    }
    
JackDanger.JackTheRunnerFIXXIE.prototype.lerp=function lerp(a, b, t) {
 
    return a+t*(b-a);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addBubbleProf = function(x,y) {
    var state=this;
    state.bossmusic2Sound.play("",0,1,true);
    this.maxBossHealth=50;
    this.bossHealth=this.maxBossHealth;
    this.updateBossBar();
    var prof=this.add.sprite(x,y,"profblase","0001");
    
    prof.anchor.setTo(0.5,1);
    this.physics.enable(prof);
    prof.body.setSize(32,32,0,-16);
    prof.body.allowGravity=false;
    prof.animations.add("wobbing",Phaser.Animation.generateFrameNames("",1,16,"",4),10,true);
    prof.phase=0;
    prof.timer=1;
    prof.arenamin=this.getMapObjects(this.map,"bossarenamin")[0];
    prof.arenamax=this.getMapObjects(this.map,"bossarenamax")[0];
    //prof.targetx=(prof.arenamax.x+prof.arenamin.x)*0.5;
    //prof.targety=(prof.arenamax.y+prof.arenamin.y)*0.5;
    
    prof.movespeed=100;
    prof.animations.play("wobbing");
    prof.zombiespawnen=false;
    prof.pipes=this.getMapObjects(this.map,"slimepipe");
    prof.startx=prof.x;
    prof.starty=prof.y;
    prof.startTween=function(x,y){
        this.startx=this.x;
        this.starty=this.y;
        this.tox=x;
        this.toy=y;
        var diffx=x-this.x;
        var diffy=y-this.y;
        var dist=Math.sqrt(diffx*diffx+diffy*diffy);
        if(dist>1)
        {
            this.tweenspeed=(1/dist)*this.movespeed;
        }else{
            this.tweenspeed=this.movespeed;
        }
        this.tweentime=0;
    }
    prof.updateTween=function(dt)
    {
        this.tweentime+=this.tweenspeed*dt;
        var fertig =false;
        if(this.tweentime>1)
        {
            this.tweentime=1;
            fertig=true;
        }
        this.x=state.lerp(this.startx,this.tox,state.smoothMove( this.tweentime));
        this.y=state.lerp(this.starty,this.toy,state.smoothMove( this.tweentime));
        return fertig;
    }
    prof.startTween((prof.arenamax.x+prof.arenamin.x)*0.5,(prof.arenamax.y+prof.arenamin.y)*0.5);
    prof.updateObj=function(dt,state){
        if(state.physics.arcade.overlap(this,state.player))
        {
            state.damagePlayer();
        }
        switch(this.phase){
            case 0://Zum Ziel fliegen
                
                if(this.updateTween(dt)){
                    this.phase=1;
                }
            break;
            case 1://Entscheiden was als nächstes machen
                var moeglichkeiten=4;
                var m=Math.floor(Math.random()*moeglichkeiten);
                switch(m)
                {   default:
                    case 0://Diagonal zum Spieler fliegen
                        this.targetx=this.x;
                        this.targety=this.y;
                        if(this.x<state.player.x){
                            this.targetx+=100;
                        }else{
                            this.targetx-=100;
                        }
                        if(this.y<state.player.y){
                            this.targety+=150;
                        }else{
                            this.targety-=150;
                        }
                        
                        this.targetx=Math.max(this.targetx,this.arenamin.x);
                        this.targetx=Math.min(this.targetx,this.arenamax.x);
                        
                        this.targety=Math.max(this.targety,this.arenamin.y);
                        this.targety=Math.min(this.targety,this.arenamax.y);
                        this.movespeed=100;
                        this.startTween(this.targetx,this.targety)
                        this.phase=0;
                    break;
                    
                    /*case 1://Gegner spawnen
                        this.phase=2;
                        this.timer=1;
                        if(this.zombiespawnen)
                        {
                            

                        }
                        
                    break;*/
                    case 1:
                        this.phase=3;
                        this.movespeed=100;
                        this.startTween(this.x,state.player.y-100);
                    break;
                }
            break;
            case 2://Nichts tun bis timer abgelaufen
                this.timer-=dt;
                if(this.timer<=0)
                {
                    this.phase=1;
                }
            break;
             case 3://Hoch fliegen um danach Slimedrops zu werfen.
                if(this.updateTween(dt))
                {
                    this.phase=4;
                }
            break;
            case 4://Slimedrops werfen
                state.throwSound.play();
                this.phase=2;
                this.timer=1;
                var dropyspeed=Math.random()*-300 - 100;
                state.addSlimedrop(this.x,this.y,100,dropyspeed);
                state.addSlimedrop(this.x,this.y,-100,dropyspeed);
            break;
            case 5://Wenn 20 mal getroffen zur Mitte fliegen
                //this.x=state.moveTowards(this.x,this.targetx,dt*this.movespeed);
                //this.y=state.moveTowards(this.y,this.targety,dt*this.movespeed);
                if(this.updateTween(dt)){
                    this.phase=6;
                    this.timer=1;
                    this.gegnerspawnen=4;
                }
            break;
            case 6:
            this.timer-=dt;
            if(this.timer<=0)
            {
                state.spawnTubeEnemies();
                this.phase=2;
                this.timer=6;
                
            }
            break;
        }
    }
    var treffercounter=10;
    prof.objDamage=function(){
        
            state.damageBoss();
            if(state.bossHealth>0)
            {
                
                this.tint="0xFF0000";
                var sprite=this;
                state.addTimer(0.1,function(){
                    sprite.tint="0xFFFFFF";
                });
                if(treffercounter--<=0)
                {
                    this.phase=5;
                    //this.targetx=(this.arenamax.x+this.arenamin.x)*0.5;
                    //this.targety=(this.arenamax.y+this.arenamin.y)*0.5-80;
                    this.movespeed=100;
                    this.startTween((this.arenamax.x+this.arenamin.x)*0.5,(this.arenamax.y+this.arenamin.y)*0.5-80);
                    treffercounter=10;
                }
            }else{
                state.removeGameObject(this);
                var finalvid=state.add.video("final");
                finalvid.play(false);
                finalvid.addToWorld(0,0);
                state.removeGameObject(state.player);

                    
                    state.world.setBounds(0,0,800,450);
                    state.player.visible=false;
                    state.addTimer(6.6,function(){
                        state.bgmusicSound.stop();
                    state.bossmusicSound.stop();
                    state.bossmusic2Sound.stop();
                        onVictory();});

            }
        
    }
    /*prof.renderObj=function(state){
        game.debug.body(this);
    }*/
    this.addGameObject(prof);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addJumpProf = function(x,y) {
    var prof=this.add.sprite(x,y,"prof","prof_frei");
    this.physics.enable(prof);
    prof.phase=0;
    prof.timer=5;
    prof.updateObj=function(dt,state){
        switch(this.phase)
        {
            case 0:
                if(this.y>500){
                    this.phase=1;
                    this.body.velocity.y=0;
                    this.body.allowGravity=false;
                }
            break;
            case 1:
                this.timer-=dt;
                if(this.timer<=0){
                    state.removeGameObject(this);
                    var arenamin=state.getMapObjects(state.map,"bossarenamin")[0];
                    var arenamax=state.getMapObjects(state.map,"bossarenamax")[0];
                    state.addBubbleProf((arenamin.x+arenamax.x)*0.5,450+32);
                }
            break;
        }
    }
    this.addGameObject(prof);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addProf = function(x,y) {
    this.tuerSound.play();
    var prof=this.add.sprite(x,y,"prof","prof03");
    var state=this;
    this.physics.enable(prof);
    prof.body.allowGravity=false;
    prof.animations.add("open",["pof03","prof04","prof05","prof06","prof07","prof08","prof09","prof10","prof01"],20,false);
    prof.animations.add("close",["pof10","prof09","prof08","prof07","prof06","prof05","prof04","prof03"],20,false);
    prof.animations.add("laughing",["prof01","prof02"],10,true);
    prof.animations.add("die",["prof11","prof19"],8,true);
    prof.animations.add("aua",["prof11","prof12"],10,true);
    prof.animations.add("empty",["prof18"],1,false);
    prof.animations.play("open");
    prof.timer=0.5;
    prof.phase=0;
    prof.updateObj=function(dt,state){
        switch(this.phase)
        {
            case 0://Tür öffnen
                this.timer-=dt;
                if(this.timer<=0)
                {
                    state.hahaSound.play();
                    this.animations.play("laughing");
                    this.phase=1;
                    this.timer=3;
                }
            break;
            case 1://Lachen
                this.timer-=dt;
                if(this.timer<=0)
                {
                    state.tuerSound.play();
                    this.animations.play("close");
                    this.phase=2;
                    this.timer=0.45;
                }
            break;
            case 2://Tür schließen
                this.timer-=dt;
                if(this.timer<=0)
                {
                    state.removeGameObject(this);
                }
            break;
            case 3://Rot blinken
            this.timer-=dt;
                if(this.timer<=0)
                {
                    //state.addSlimeexplo(this.x+32,this.y+64);
                    state.addJumpProf(this.x,this.y);
                    this.animations.play("empty");
                    this.timer=2;
                    this.phase=4;
                }
            break;
            case 4://Nichts tun
            this.visible=!this.visible;
            this.timer-=dt;
            if(this.timer<=0){
                state.removeGameObject(this);
            }
            break;
        }
    }
    prof.objDamage=function(){
        if(this.phase==1){
            state.damageBoss();
            if(state.bossHealth>0)
            {
                this.animations.play("aua");
                state.hahaSound.stop();
            }else{
                this.animations.play("die");
                this.timer=1;
                this.phase=3;
                state.removeGameObject(state.boss);
            }
        }
    }
    this.addGameObject(prof);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addProfTrigger = function(x,y) {
    var proftrigger=this.add.sprite(x,y,"prof","prof03");
    proftrigger.visible=false;
    proftrigger.updateObj=function(dt,state){
        if(this.x-state.player.x <100)
        {
            state.removeGameObject(this);
            state.addProf(this.x,this.y);
        }
    }
    this.addGameObject(proftrigger);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addTimer = function(time,callback) {
    var timer=new Object();
    timer.type="timer";
    timer.time=time;
    timer.callback=callback;
    timer.updateObj=function(dt,state){
        this.time-=dt;
        if(this.time<=0)
        {
            this.callback();
            state.removeGameObject(this);
        }
    }
    this.addGameObject(timer);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addBoss = function(x,y) {
    
    
    
    var boss=this.add.sprite(x,y,"prof","prof03");
    this.boss=boss;
    boss.visible=false;
    boss.phase=0;
    boss.timer=0;
    boss.zanz=0;//Anzahl Zombies die in einer Runde gespawnt wurden
    boss.pipes=this.getMapObjects(this.map,"slimepipe");
    boss.profspawns=this.getMapObjects(this.map,"profspawn");
    boss.updateObj=function(dt,state){
        switch(this.phase){
            case 0://Warte darauf dass der Spieler die Bossarena betritt
                if(this.x-state.player.x<=0)
                {
                    //Ok Bosskampf kann beginnen.
                    state.bgmovie.play(true);
                    state.background.visible=false;
                    state.bgmim.visible=true;
                    
                    state.addBossHealth();
                    state.bgmusicSound.stop();
                    state.bossmusicSound.play("",0,1,true);
                    this.phase=1;
                }
            break;
            case 1://Prof spawnen

                    state.killAllZombies();
                    this.profspawnobj=this.profspawns[Math.floor(Math.random()*this.profspawns.length)];
                    state.addProf(this.profspawnobj.x,this.profspawnobj.y-32);
                    this.timer=6;
                    this.phase=2;
                
            break;
            case 2://Warten bis Prof wieder Tür zu gemacht hat
                this.timer-=dt;
                if(this.timer<=0){
                    this.phase=3;
                }
            break;
            case 3://Zombie spawnen
            if(state.bossHealth>0)
                {
                    state.spawnTubeEnemies();
                    this.timer=6;
                    this.phase=4;
                    this.zanz=0;
                
                }
            break;
            case 4://Den Zombie Zeit geben um vom Spieler fertig gemacht zu werden
                this.timer-=dt;
                if(this.timer<=0){
                    this.phase=1;
                }
            break;
         }
    }
    this.addGameObject(boss);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addChili = function(x,y) {
    var chili=this.add.sprite(x,y,"chili");
    this.physics.enable(chili);
    chili.body.allowGravity=false;
    chili.updateObj=function(dt,state)
    {
        if(state.physics.arcade.overlap(this,state.player))
        {
            if(!state.player.allowFire)
            {
                state.player.allowFire=true;
                
            }else{
                if(!state.fireonstart){
                    state.player.shootTimeMax-=0.1;
                }
            }
            state.removeGameObject(this);
        }
    }
    this.addGameObject(chili);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addZombie = function(x,y,nowaiting) {
    //return;
    var state=this;
    var zombie = this.add.sprite(x,y, "zombie", "walk0001");
        this.physics.enable(zombie);
        zombie.body.setSize(14,64,0,0);
        zombie.anchor.setTo(.5,1);
        zombie.animations.add("walk",["walk0001","walk0002","walk0003","walk0004","walk0005"
        ,"walk0006","walk0007","walk0008","walk0009","walk0010","walk0011","walk0012","walk0013"
        ,"walk0014","walk0015","walk0016","walk0017","walk0018","walk0019"],30,true);
        zombie.animations.add("jump",["walk0022"],1,false);
        zombie.animations.add("stand",["walk0021"],1,false);
        zombie.animations.play("stand");
        zombie.jumpTime=2;
        zombie.prevGround=false;
        zombie.health=2;
        zombie.firstfall=true;
        zombie.type="zombie";
        zombie.updateObj=function(dt,state){
            state.physics.arcade.collide(this,state.layer_collision);
            if(state.physics.arcade.overlap(this,state.player))
            {
                state.damagePlayer();
            }
            
            var isGround=this.body.onFloor();
            if(isGround)
                this.firstfall=false;
            
            
            this.body.velocity.x=0;
            var playerDistX=Math.abs(state.player.x-this.x);
            if((this.x-state.player.x<450 || nowaiting) && !this.firstfall)
            {
                if(isGround&&!this.prevGround)
            {
                this.animations.play("walk");
            }
                if(this.jumpTime>0)
                {
                    this.jumpTime-=dt;
                }
            
                if(this.jumpTime<=0 && isGround)
                {
                    this.jumpTime=Math.random()*2+0.5;
                    this.body.velocity.y = -320;
                    this.animations.play("jump");
                    isGround=false;
                }
                if(playerDistX>10)
                {
                    if(isGround)
                        this.animations.play("walk");
                    if(state.player.x<this.x)
                    {
                        this.body.velocity.x=-100;
                        if(isGround)
                        {
                            
                            this.scale.x=1;
                        }
                    }else
                    {
                        this.body.velocity.x=100;
                        this.scale.x=-1;
                    }
                }else{
                    if(isGround)
                        this.animations.play("stand");
                }
                this.prevGround=isGround;
            }
            
            
            
            if(this.y>500)
            {
                state.removeGameObject(this);
            }
            
        }
        zombie.objDamage=function(){
            this.health-=1;
            if(this.health<0.1)
            {
                this.objKill();
            }else
            {
                state.hmmSound.play();
            }
        }
        zombie.objKill=function(){
            state.addSlimeexplo(this.x,this.y);
            state.removeGameObject(this);
        }
        this.addGameObject(zombie);
}



JackDanger.JackTheRunnerFIXXIE.prototype.addWobby = function(x,y,nowaiting) {
    //return;
    var state=this;
    var zombie = this.add.sprite(x,y, "wobby", "wobby0015");
        this.physics.enable(zombie);
        zombie.body.setSize(14,64,0,0);
        zombie.anchor.setTo(.5,1);
        zombie.animations.add("walk",Phaser.Animation.generateFrameNames("wobby",1,37,"",4),30,true);
        zombie.animations.add("jump",["wobby0016"],1,false);
        zombie.animations.add("stand",["wobby0015"],1,false);
        zombie.animations.play("stand");
        zombie.jumpTime=3;
        zombie.prevGround=false;
        zombie.health=5;
        zombie.firstfall=true;
        zombie.type="zombie";
        zombie.updateObj=function(dt,state){
            state.physics.arcade.collide(this,state.layer_collision);
            if(state.physics.arcade.overlap(this,state.player))
            {
                state.damagePlayer("wobby");
            }
            
            var isGround=this.body.onFloor();
            if(isGround)
                this.firstfall=false;
            
            
            this.body.velocity.x=0;
            var playerDistX=Math.abs(state.player.x-this.x);
            if((this.x-state.player.x<450 || nowaiting) && !this.firstfall)
            {
                if(isGround&&!this.prevGround)
            {
                this.animations.play("walk");
            }
                if(this.jumpTime>0)
                {
                    this.jumpTime-=dt;
                }
            
                if(this.jumpTime<=0 && isGround)
                {
                    this.jumpTime=Math.random()*4+1;
                    this.body.velocity.y = -320;
                    this.animations.play("jump");
                    isGround=false;
                }
                if(playerDistX>10)
                {
                    if(isGround)
                        this.animations.play("walk");
                    if(state.player.x<this.x)
                    {
                        this.body.velocity.x=-50;
                        if(isGround)
                        {
                            
                            this.scale.x=1;
                        }
                    }else
                    {
                        this.body.velocity.x=50;
                        this.scale.x=-1;
                    }
                }else{
                    if(isGround)
                        this.animations.play("stand");
                }
                this.prevGround=isGround;
            }
            
            
            
            if(this.y>500)
            {
                state.removeGameObject(this);
            }
            
        }
        zombie.objDamage=function(){
            this.health-=1;
            if(this.health<0.1)
            {
                this.objKill();
            }else
            {
                state.hmmSound.play();
            }
        }
        zombie.objKill=function(){
            state.addSlimeexplo(this.x,this.y);
            state.removeGameObject(this);
        }
        this.addGameObject(zombie);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addBackZombie = function(x,y) {
    
    var backzombie = this.add.sprite(x,y, "zombie", "walk0001");
    backzombie.visible=false;
    backzombie.updateObj=function(dt,state){
        if(state.player.x-this.x>400)
        {
            state.addZombie(this.x,this.y);
            state.removeGameObject(this);
        }
    }
    this.addGameObject(backzombie);
}

JackDanger.JackTheRunnerFIXXIE.prototype.killAllZombies = function() {
    var i;
    for(i=0;i<this.gameObjects.length;i++)
    {
        var obj=this.gameObjects[i];
        if(obj.type=="zombie")
        {
            obj.objKill();
        }
    }
}

JackDanger.JackTheRunnerFIXXIE.prototype.addBossHealth = function() {
    var redbar=this.add.sprite(0,450-32,"bar");
    redbar.fixedToCamera=true;
    redbar.width=800;
    redbar.height=32;
    redbar.tint="0xD61313";
    this.addGameObject(redbar);
    
    var orangebar=this.add.sprite(0,450-32,"bar");
    orangebar.fixedToCamera=true;
    orangebar.width=800;
    orangebar.height=32;
    orangebar.tint="0xFFA033";
    orangebar.timer=0;
    orangebar.lastgreenw=redbar.width;
    orangebar.updateObj=function(dt,state){
        if(greenbar.width<this.lastgreenw)
        {
            this.timer=1;
            this.lastgreenw=greenbar.width;
        }else
            if(greenbar.width>this.lastgreenw){
                this.width=greenbar.width;
                this.lastgreenw=greenbar.width;
            }
        if(this.timer>0)
        {
            this.timer-=dt;
        }else{
        if(this.width>state.bossbar.width)
        {
            this.width-=dt*100;
        }
        }
    }
    this.addGameObject(orangebar);
    
    var greenbar=this.add.sprite(0,450-32,"bar");
    greenbar.fixedToCamera=true;
    greenbar.width=800;
    greenbar.height=32;
    greenbar.tint="0x92FF24";
    this.addGameObject(greenbar);
    this.bossbar=greenbar;
    
    this.bosstext = game.add.bitmapText(game.width / 2, 450-32, "white", "", 18);
    this.bosstext.fixedToCamera=true;
    this.bosstext.setText("Boss");
}

JackDanger.JackTheRunnerFIXXIE.prototype.updateBossBar = function() {
    this.bossbar.width=(this.bossHealth/this.maxBossHealth)*800;
}

JackDanger.JackTheRunnerFIXXIE.prototype.damageBoss = function() {
    this.bossHealth -= 1;
    this.updateBossBar();
    if(this.bossHealth<=0)
    {
        this.bgmusicSound.stop();
        this.bossmusicSound.stop();
        //onVictory();
    }
}

JackDanger.JackTheRunnerFIXXIE.prototype.damagePlayer=function(damager)
{
    var state=this;
    this.player.damager=damager;
    if(!this.godmode && !this.player.blinken)
    {
        if(this.player.y<=450 && this.herzen.length>0)
        {
            var herz=this.herzen[this.herzen.length-1];
            herz.putt();
            this.herzen.splice(-1);
            this.player.blinken=true;
            this.addTimer(2,function(){
                state.player.blinken=false;
                state.player.visible=true;
            });
        }else{
            if( !this.gameoverplayed){
                  //Add Video
                var playtime=7;
                var videoname="gameover";
                
                if(this.player.damager=="wobby")
                {
                    playtime=6;
                    videoname="wobbyeat";
                }else
                if(this.player.damager=="smoke"){
                    playtime=8;
                    videoname="erstinken";
                }
                if(this.player.damager=="water")
                {
                    playtime=6;
                    videoname="water";
                }
                
                this.gameovervideo=this.add.video(videoname);
                this.gameovervideo.addToWorld(0,0);
                this.gameovervideo.play(false);
                
                this.gameoverplayed=true;
                this.bgmusicSound.stop();
                this.bossmusicSound.stop();
                this.bossmusic2Sound.stop();
                this.gameovermusic.play();
                this.world.setBounds(0,0,800,450);
                this.player.visible=false;
                this.addTimer(playtime,function(){onLose();});
            }
        }
    }
}

JackDanger.JackTheRunnerFIXXIE.prototype.mycreate = function() {
    var state=this;
    
    this.gameObjects=new Array();
    this.objectIdsToRemove=new Array();
    this.objectsToAdd=new Array();
    this.beiobjid=0;
    
    this.stage.backgroundColor = '#1A1008';
    this.gameoverplayed=false;
    
    this.background=this.add.tileSprite(0,0,800,450,"bg","");
    this.background.fixedToCamera=true;
    this.background.updateObj=function(dt,state){
        this.tilePosition.x=state.camera.x*-0.1;
    }
    this.addGameObject(this.background);
    
    this.bgmovie=this.add.video("bgmovie");
    this.bgmim=this.bgmovie.addToWorld(0,0);
    this.bgmim.fixedToCamera=true;
    this.bgmim.visible=false;
    
    
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('tiles','tileset');
    this.map.addTilesetImage('datatiles','datatiles');
    this.layer_background=this.map.createLayer("background");
    this.layer_background.resizeWorld();
    this.layer_foreground=this.map.createLayer("foreground");
    this.layer_collision=this.map.createLayer("collision");
    this.layer_collision.visible=false;
    this.map.setCollisionBetween(0,4000,true,"collision");
    
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 700;
    
    
    
    
    
    this.maxBossHealth=50;
    this.bossHealth=this.maxBossHealth;
    
    
    
    //Herzen
    this.herzen=new Array(this.add.sprite(0,0,"herz","0001"),
    this.add.sprite(32,0,"herz","0001"));
    var i;
    for(i=0;i<this.herzen.length;i++)
    {
        var herz=this.herzen[i];
        herz.fixedToCamera=true;
        herz.animations.add("destroy",Phaser.Animation.generateFrameNames("",1,8,"",4),10,false);
        herz.putt=function(){
            var therz=this;
            this.animations.play("destroy");
            state.addTimer(0.8,function(){
                state.removeGameObject(therz);
            });
        }
        this.addGameObject(herz);
    }
    
    //Add Audio
    this.slimeExploSound=this.add.audio("slimeexplo");
    this.hmmSound=this.add.audio("hmm");
    this.fireSound=this.add.audio("fire");
    this.tuerSound=this.add.audio("tuer");
    this.hahaSound=this.add.audio("haha");
    this.bgmusicSound=this.add.audio("bgmusic");
    this.bossmusicSound=this.add.audio("bossmusic");
    this.bossmusic2Sound=this.add.audio("bossmusic2");
    this.gameovermusic=this.add.audio("gameovermusic");
    this.throwSound=this.add.audio("throw");
    
  
    
    //Play Backround music
    this.bgmusicSound.play("",0,1,true);
    
    //Add Player
    var playerstart=this.getMapObjects(this.map,"playerstart")[0];
    
    this.player = this.add.sprite(playerstart.x,playerstart.y-64, "john", "walk0001");
    this.physics.enable(this.player);
    this.camera.follow(this.player);
    this.player.body.setSize(14,64,0,0);
    this.player.anchor.setTo(.5,1);
    this.player.animations.add("walk",["walk0001","walk0002","walk0003","walk0004","walk0005"
    ,"walk0006","walk0007","walk0008","walk0009","walk0010","walk0011","walk0012","walk0013"
    ,"walk0014","walk0015","walk0016","walk0017","walk0018","walk0019"],30,true);
    this.player.animations.add("jump",["walk0022"],1,false);
    this.player.animations.add("stand",["walk0001"],1,false);
    this.player.animations.play("stand");
    this.player.lastJump=false;
    this.player.shootTimeMax=this.fireonstart?0.2:0.5;
    this.player.shootTime=0;
    this.player.blinken=false;
    this.player.lastGround=false;
    this.player.allowFire=this.fireonstart;
    this.player.scale.x=-1;
    this.player.updateObj=function(dt,state){
        state.physics.arcade.collide(this,state.layer_collision);
        var isGround=this.body.onFloor();
        
        if(!isGround&&this.lastGround)
        {
            this.animations.play("jump");
        }
        if(this.blinken)
        {
            this.visible=!this.visible;
        }
        this.body.velocity.x=0;
        
        if ((Pad.isDown(Pad.JUMP)||Pad.isDown(Pad.UP))&&!this.lastJump && isGround) {
            this.body.velocity.y = -320;
            this.animations.play("jump");
            isGround=false;
        }
        
        if(this.shootTime>0)
        {
            this.shootTime-=dt;
        }
        
        if(Pad.isDown(Pad.SHOOT)&& this.shootTime<=0 &&this.allowFire)
        {
            state.addFire(this.x+(this.scale.x<0?5:-5),this.y-45,this.scale.x<0?500:-500);
            this.shootTime=this.shootTimeMax;
        }
        
        if(Pad.isDown(Pad.RIGHT))
        {
            this.body.velocity.x=150;
            this.scale.x=-1;
            if(isGround)
            {
                this.animations.play("walk");
            }
        }
        if(Pad.isDown(Pad.LEFT))
        {
            this.body.velocity.x=-150;
            this.scale.x=1;
            if(isGround)
            {
                this.animations.play("walk");
            }
        }
        
        if(this.body.velocity.x==0 && isGround)
        {
            this.animations.play("stand");
        }
        
        this.lastJump=Pad.isDown(Pad.JUMP);
        if(this.y>500){
            state.damagePlayer("water");
        }
        this.lastGround=isGround;
    }
    this.addGameObject(this.player);
    
    

    //Add Zombies
    var zombiespawns=this.getMapObjects(this.map,"zombie");
    
    for(i=0;i<zombiespawns.length;i++)
    {
        var zombiespawn=zombiespawns[i];
        this.addZombie(zombiespawn.x,zombiespawn.y-64);
    }

    //Add Wobbies
    var wobbiespawns=this.getMapObjects(this.map,"wobby");
    var i;
    for(i=0;i<wobbiespawns.length;i++)
    {
        var wobbiespawn=wobbiespawns[i];
        this.addWobby(wobbiespawn.x,wobbiespawn.y-64);
    }
    
    //Add smokes
    var smokespawns=this.getMapObjects(this.map,"smoke");
    for(i=0;i<smokespawns.length;i++)
    {
        var smokespawn=smokespawns[i];
        this.addSmoke(smokespawn.x+16,smokespawn.y);
    }
    
    //Add Proftriggers
    var proftriggerspawns=this.getMapObjects(this.map,"proftrigger");
    for(i=0;i<proftriggerspawns.length;i++)
    {
        var proftriggerspawn=proftriggerspawns[i];
        this.addProfTrigger(proftriggerspawn.x,proftriggerspawn.y-32);
    }
    
    //Add Boss
    var bossspawn=this.getMapObjects(this.map,"bossspawn")[0];
    this.addBoss(bossspawn.x,bossspawn.y);
    
    if(this.spawnatboss)
    {
        this.player.x=bossspawn.x;
        this.player.y=bossspawn.y-200;
    }

    //Zombies von links
    var backzombiespawns=this.getMapObjects(this.map,"backzombie");
    for(i=0;i<backzombiespawns.length;i++)
    {
        var zombiespawn=backzombiespawns[i];
        this.addBackZombie(zombiespawn.x,zombiespawn.y-64);
    }
    
    //Add Chili
    var chilispawns=this.getMapObjects(this.map,"chili");
    for(i=0;i<chilispawns.length;i++)
    {
        var chilispawn=chilispawns[i];
        this.addChili(chilispawn.x,chilispawn.y-32);
    }
}

JackDanger.JackTheRunnerFIXXIE.prototype.updateObjects = function(dt) {
    var obj;
    var i;
    for(i in this.gameObjects){
        obj=this.gameObjects[i];
        if(obj.updateObj!=null &&(!this.gameoverplayed || obj.type=="timer")){
            obj.updateObj(dt,this);
        }
    }
    
    for(i in this.objectsToAdd){
        obj=this.objectsToAdd[i];
        this.gameObjects.push(obj);
    }
    
    if(this.objectsToAdd.length>0)
        this.objectsToAdd=new Array();
    
    var idToRemove;
    for(i in this.objectIdsToRemove)
    {
        idToRemove=this.objectIdsToRemove[i];
        var j;
        for(j=0;j < this.gameObjects.length;j++){
            obj=this.gameObjects[j];
            if(obj.objid==idToRemove)
            {
                this.gameObjects.splice(j,1);
                if(obj.destroy!=null)
                    obj.destroy();
                break;
            }
        }
    }
    if(this.objectIdsToRemove.length>0)
        this.objectIdsToRemove=new Array();
    
    if(this.gameoverplayed){
        if(Pad.justDown(Pad.JUMP)){
            onLose();
        }
    }
    Pad.clearJustInput();
    
    //console.log("Objcount: "+this.gameObjects.length);
}

JackDanger.JackTheRunnerFIXXIE.prototype.render = function() {
    var obj;
    var i;
    for(i in this.gameObjects){
        obj=this.gameObjects[i];
        if(obj.renderObj!=null){
            obj.renderObj(this);
        }
    }
}

//hier musst du deine Eintragungen vornhemen.
addMyGame("JackTheRunnerFIXXIE",
 "Jack The Runner",
 "fixxiefixx",
 "Besiege den verrückten Professer!",
 "Bewegen",
 "Springen",
 "Feuer spucken",
 JackDanger.JackTheRunnerFIXXIE);