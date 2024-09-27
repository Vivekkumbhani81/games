function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;

    var _oPreloader;
    var _oMenu;
    var _oLevelMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function() {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);

        s_bMobile = isMobile();

        s_bTablet = isTablet();

        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function(e) {
                return false;
            });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = 30;

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();


    };

    this.preloaderReady = function() {
        this._loadImages();

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }


        _bUpdate = true;
    };

    this.soundLoaded = function() {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
    };

    this._initSounds = function() {
        Howler.mute(!s_bAudioActive);


        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'car_parked',
            loop: false,
            volume: 1,
            ingamename: 'car_parked'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'but_press',
            loop: false,
            volume: 1,
            ingamename: 'but_press'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'crash',
            loop: false,
            volume: 1,
            ingamename: 'crash'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'select_car',
            loop: false,
            volume: 1,
            ingamename: 'select_car'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'arrival_lose',
            loop: false,
            volume: 1,
            ingamename: 'arrival_lose'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'arrival_win',
            loop: false,
            volume: 1,
            ingamename: 'arrival_win'
        });
        s_aSoundsInfo.push({
            path: './sounds/',
            filename: 'soundtrack',
            loop: true,
            volume: 1,
            ingamename: 'soundtrack'
        });

        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for (var i = 0; i < s_aSoundsInfo.length; i++) {
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }

    };

    this.tryToLoadSound = function(oSoundInfo, bDelay) {

        setTimeout(function() {
            s_aSounds[oSoundInfo.ingamename] = new Howl({
                src: [oSoundInfo.path + oSoundInfo.filename + '.mp3'],
                autoplay: false,
                preload: true,
                loop: oSoundInfo.loop,
                volume: oSoundInfo.volume,
                onload: s_oMain.soundLoaded,
                onloaderror: function(szId, szMsg) {
                    for (var i = 0; i < s_aSoundsInfo.length; i++) {
                        if (szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id) {
                            s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                            break;
                        }
                    }
                },
                onplayerror: function(szId) {
                    for (var i = 0; i < s_aSoundsInfo.length; i++) {
                        if (szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id) {
                            s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {

                                s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                if (s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null) {
                                    setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
                                }

                            });
                            break;
                        }
                    }

                }
            });


        }, (bDelay ? 200 : 0));


    };


    this._loadImages = function() {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("asphalt", "./sprites/asphalt.jpg");

        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");

        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.png");
        s_oSpriteLibrary.addSprite("logo", "./sprites/logo.png");
        s_oSpriteLibrary.addSprite("baloon_mc", "./sprites/baloon_mc.png");

        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_preloader.jpg");
        s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");

        s_oSpriteLibrary.addSprite("steering_wheel", "./sprites/steering_wheel.png");
        s_oSpriteLibrary.addSprite("wheel_bar", "./sprites/wheel_bar.png");
        s_oSpriteLibrary.addSprite("accelerator", "./sprites/accelerator.png");
        s_oSpriteLibrary.addSprite("breacker", "./sprites/breacker.png");

        s_oSpriteLibrary.addSprite("wheel", "./sprites/wheel.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");

        //init bgs menu
        for (var i = 0; i < NUM_LEVELS; i++) {
            s_oSpriteLibrary.addSprite("bg_game" + i, "./sprites/levels/level" + i + "/bg_game.jpg");
            s_oSpriteLibrary.addSprite("fg_game" + i, "./sprites/levels/level" + i + "/fg_game.png");
            s_oSpriteLibrary.addSprite("lights" + i, "./sprites/levels/level" + i + "/lights.png");
        }
        //init cars
        for (var i = 1; i <= NUM_CARS; i++) {
            s_oSpriteLibrary.addSprite("car_" + i, "./sprites/cars/car" + i + "_mc.png");
        }
        //init containers
        for (var i = 1; i <= NUM_CONTAINERS; i++) {
            s_oSpriteLibrary.addSprite("container" + i, "./sprites/container/container" + i + ".png");
        }
        //init bars
        for (var i = 1; i <= 4; i++) {
            s_oSpriteLibrary.addSprite("bar" + i, "./sprites/bar/bar" + i + ".png");
        }
        //init dividers
        for (var i = 1; i <= 3; i++) {
            s_oSpriteLibrary.addSprite("divider" + i, "./sprites/divider/divider" + i + ".png");
        }
        //init flowers
        for (var i = 1; i < 3; i++) {
            s_oSpriteLibrary.addSprite("flowers" + i, "./sprites/flowers/flowers" + i + ".png");
        }
        //init garbages
        for (var i = 1; i <= 3; i++) {
            s_oSpriteLibrary.addSprite("garbage_bin" + i, "./sprites/garbage_bin/garbage_bin" + i + ".png");
        }
        //init houses
        for (var i = 1; i <= 5; i++) {
            s_oSpriteLibrary.addSprite("house" + i, "./sprites/house/house" + i + ".png");
        }
        //init boxes
        for (var i = 1; i < 3; i++) {
            s_oSpriteLibrary.addSprite("box" + i, "./sprites/box/box" + i + ".png");
        }
        //init car indicator
        for (var i = 1; i <= 4; i++) {
            s_oSpriteLibrary.addSprite("select_car_" + i, "./sprites/select_car/select_car_" + i + ".png");
        }
        //init sidewalks
        for (var i = 1; i <= 6; i++) {
            s_oSpriteLibrary.addSprite("sidewalk_" + i, "./sprites/sidewalk/sidewalk_" + i + ".png");
        }
        //init trashes
        for (var i = 1; i <= 2; i++) {
            s_oSpriteLibrary.addSprite("trash" + i, "./sprites/trash/trash" + i + ".png");
        }
        //init drop areas
        for (var i = 1; i <= 4; i++) {
            s_oSpriteLibrary.addSprite("drop_area_" + i, "./sprites/drop_area/drop_area_" + i + ".png");
        }

        s_oSpriteLibrary.addSprite("rear_light", "./sprites/rear_light.png");

        s_oSpriteLibrary.addSprite("healt", "./sprites/healt.png");
        s_oSpriteLibrary.addSprite("energy_bar", "./sprites/energy_bar.png");

        s_oSpriteLibrary.addSprite("arrow_keys", "./sprites/arrow_keys.png");
        s_oSpriteLibrary.addSprite("help_touch", "./sprites/help_touch.png");

        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("time", "./sprites/time.png");
        s_oSpriteLibrary.addSprite("level_sprite", "./sprites/level_sprite.png");
        s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_continue.png");

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function() {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
    };

    this._onAllImagesLoaded = function() {

    };


    this._onRemovePreloader = function() {
        _oPreloader.unload();

        try {
            saveItem("ls_available", "ok");
        } catch (evt) {
            // localStorage not defined
            s_bStorageAvailable = false;
        }

        s_oSoundtrack = playSound("soundtrack", 1, true);

        this.gotoMenu();


    };

    this.gotoMenu = function() {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoLevelMenu = function() {
        _oLevelMenu = new CLevelMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function(iLevel) {
        _oGame = new CGame(_oData, iLevel);
        _iState = STATE_GAME;

        $(s_oMain).trigger("game_start");
    };

    this.gotoHelp = function() {
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };

    this.resetArrayScores = function() {
        s_aScores = new Array();
        for (var i = 0; i < NUM_LEVELS; i++) {
            s_aScores[i] = 0;
        }
    };

    this.stopUpdate = function() {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            Howler.mute(true);
        }

    };

    this.startUpdate = function() {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            if (s_bAudioActive) {
                Howler.mute(false);
            }
        }

    };

    this._update = function(event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;

    _oData = oData;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;

    s_bAudioActive = oData.audio_enable_on_startup;


    this.initContainer();
}
var s_bMobile;
var s_bTablet;
var s_bAudioActive = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack = null;
var s_oCanvas;
var s_bIsIphone = false;
var s_bFullscreen = false;
var s_iLastLevel = 1;
var s_aScores = new Array();
var s_bStorageAvailable = true;
var s_aSounds;
var s_aSoundsInfo;