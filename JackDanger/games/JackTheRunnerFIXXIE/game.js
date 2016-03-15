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
    
    this.load.tilemap('map',"map.json",null,Phaser.Tilemap.TILED_JSON);
    
    this.load.image("tileset");
    this.load.image("datatiles");
    this.load.image("player");
    this.load.image("fire");
    this.load.image("chili");
    this.load.image("bar");
    this.load.image("bg","bg.jpg");
    
    this.load.audio("slimeexplo",["slimeexplo.ogg","slimeexplo.mp3"]);
    this.load.audio("hmm",["hmm.ogg","hmm.mp3"]);
    this.load.audio("fire",["fire.ogg","fire.mp3"]);
    this.load.audio("haha",["haha.ogg","haha.mp3"]);
    this.load.audio("tuer",["tuer.ogg","tuer.mp3"]);
    this.load.audio("bgmusic",["bgmusic.ogg","bgmusic.mp3"]);
    this.load.audio("bossmusic",["bossmusic.ogg","bossmusic.mp3"]);
    this.load.audio("bossmusic2",["bossmusic2.ogg","bossmusic2.mp3"]);
    this.load.audio("throw",["throw.wav"]);
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
    prof.targetx=(prof.arenamax.x+prof.arenamin.x)*0.5;
    prof.targety=(prof.arenamax.y+prof.arenamin.y)*0.5;
    prof.movespeed=100;
    prof.animations.play("wobbing");
    prof.zombiespawnen=false;
    prof.pipes=this.getMapObjects(this.map,"slimepipe");
    prof.updateObj=function(dt,state){
        if(state.physics.arcade.overlap(this,state.player))
        {
            state.damagePlayer();
        }
        switch(this.phase){
            case 0://Zum Ziel fliegen
                this.x=state.moveTowards(this.x,this.targetx,dt*this.movespeed);
                this.y=state.moveTowards(this.y,this.targety,dt*this.movespeed);
                if(Math.abs(this.targetx-this.x)<1 && Math.abs(this.targety-this.y)<1){
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
                            this.targetx+=150;
                        }else{
                            this.targetx-=150;
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
                        this.movespeed=Math.random()*80+40;
                        this.phase=0;
                    break;
                    
                    case 1://Gegner spawnen
                        this.phase=2;
                        this.timer=1;
                        if(this.zombiespawnen)
                        {
                            this.zombiespawnen=false;
                            this.pipeobj=this.pipes[Math.floor(Math.random()*this.pipes.length)];
                            if(state.bossHealth>10){
                                this.timer=1.5;
                                state.addZombie(this.pipeobj.x+32,this.pipeobj.y);
                            }
                            else{
                               this.timer=1.7;
                               state.addWobby(this.pipeobj.x+32,this.pipeobj.y);
                            }    

                        }
                        
                    break;
                    case 2:
                        this.phase=3;
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
                if(this.y+100>state.player.y)
                {
                    this.y-=200*dt;
                }else
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
        }
    }
    var treffercounter=20;
    prof.objDamage=function(){
        
            state.damageBoss();
            if(state.bossHealth>0)
            {
                this.tint="0xFF0000";
                var sprite=this;
                state.addTimer(0.1,function(){
                    sprite.tint="0xFFFFFF";
                });
                //Zur Mitte fliegen
                /*this.targetx=(this.arenamax.x+this.arenamin.x)*0.5;
                this.targety=(this.arenamax.y+this.arenamin.y)*0.5-80;;
                this.movespeed=100;
                this.phase=0;*/
                if(treffercounter--<=0)
                {
                    this.zombiespawnen=true;
                    treffercounter=20;
                }
            }else{
                state.addSlimeexplo(this.x,this.y);
                state.removeGameObject(this);
                state.addTimer(2,function(){
                    state.bgmusicSound.stop();
                    state.bossmusicSound.stop();
                    state.bossmusic2Sound.stop();
                    state.world.setBounds(0,0,800,450);
                    onVictory();
                });
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
                    state.addBubbleProf(this.x,this.y);
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
                this.pipeobj=this.pipes[Math.floor(Math.random()*this.pipes.length)];
                if(state.bossHealth>10){
                    this.timer=1.5;
                    state.addZombie(this.pipeobj.x+32,this.pipeobj.y);
                }
                else{
                   this.timer=1.7;
                   state.addWobby(this.pipeobj.x+32,this.pipeobj.y);
                }                   
                
                if(this.zanz++<4)
                {
                    
                    this.phase=2;
                 
                }else{
                this.timer=3;
                this.phase=4;
                this.zanz=0;
                }
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
            state.player.allowFire=true;
            state.removeGameObject(this);
        }
    }
    this.addGameObject(chili);
}

JackDanger.JackTheRunnerFIXXIE.prototype.addZombie = function(x,y) {
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
            if(this.x-state.player.x<450 && !this.firstfall)
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



JackDanger.JackTheRunnerFIXXIE.prototype.addWobby = function(x,y) {
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
                state.damagePlayer();
            }
            
            var isGround=this.body.onFloor();
            if(isGround)
                this.firstfall=false;
            
            
            this.body.velocity.x=0;
            var playerDistX=Math.abs(state.player.x-this.x);
            if(this.x-state.player.x<450 && !this.firstfall)
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
                this.width=state.bossbar.width;
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
    
    this.bosstext = game.add.bitmapText(game.width / 2, 450-32, "testfont", "", 18);
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

JackDanger.JackTheRunnerFIXXIE.prototype.damagePlayer=function()
{
    if(!this.godmode){
        this.bgmusicSound.stop();
        this.bossmusicSound.stop();
        this.bossmusic2Sound.stop();
        this.world.setBounds(0,0,800,450);
        onLose();
    }
}

JackDanger.JackTheRunnerFIXXIE.prototype.mycreate = function() {
    this.stage.backgroundColor = '#1A1008';
    
    this.background=this.add.tileSprite(0,0,800,450,"bg","");
    this.background.fixedToCamera=true;
    this.background.updateObj=function(dt,state){
        this.tilePosition.x=state.camera.x*-0.1;
    }
    
    
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
    
    this.gameObjects=new Array();
    this.objectIdsToRemove=new Array();
    this.objectsToAdd=new Array();
    this.beiobjid=0;
    
    
    
    this.maxBossHealth=25;
    this.bossHealth=this.maxBossHealth;
    
    //Add Audio
    this.slimeExploSound=this.add.audio("slimeexplo");
    this.hmmSound=this.add.audio("hmm");
    this.fireSound=this.add.audio("fire");
    this.tuerSound=this.add.audio("tuer");
    this.hahaSound=this.add.audio("haha");
    this.bgmusicSound=this.add.audio("bgmusic");
    this.bossmusicSound=this.add.audio("bossmusic");
    this.bossmusic2Sound=this.add.audio("bossmusic2");
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
    this.player.animations.add("stand",["walk0021"],1,false);
    this.player.animations.play("stand");
    this.player.lastJump=false;
    this.player.shootTimeMax=0.3;
    this.player.shootTime=0;
    this.player.lastGround=false;
    this.player.allowFire=false;
    this.player.updateObj=function(dt,state){
        state.physics.arcade.collide(this,state.layer_collision);
        var isGround=this.body.onFloor();
        
        if(!isGround&&this.lastGround)
        {
            this.animations.play("jump");
        }
        
        this.body.velocity.x=0;
        
        if (Pad.isDown(Pad.JUMP)&&!this.lastJump && isGround) {
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
            state.damagePlayer();
        }
        this.lastGround=isGround;
    }
    this.addGameObject(this.player);
    
    this.addGameObject(this.background);

    //Add Zombies
    var zombiespawns=this.getMapObjects(this.map,"zombie");
    var i;
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
        if(obj.updateObj!=null){
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
 "Besiege den verrückten Professer",
 "Bewegen",
 "Springen",
 "Schiessen",
 JackDanger.JackTheRunnerFIXXIE);