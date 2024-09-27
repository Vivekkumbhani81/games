function CLevelMenu() {

    var _bNumActive;


    var _aLevels = new Array();
    var _oModeNumOff;
    var _oModeNumOn;

    var _oLevelSettings;
    var _aLevelNum;

    var _oBg;
    var _oButExit;
    var _oAudioToggle;

    var _pStartPosExit;
    var _pStartPosAudio;

    this._init = function() {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        _oLevelSettings = new CLevelSettings();
        _aLevelNum = _oLevelSettings.getNumLevels();

        _bNumActive = false;

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        s_oStage.addChild(_oBg);

        var oLevelTextOutline = new CTLText(s_oStage,
            CANVAS_WIDTH / 2 - 250, 120, 500, 70,
            50, "center", "#730358", FONT, 1,
            0, 0,
            TEXT_LEVEL,
            true, true, false,
            false);

        oLevelTextOutline.setOutline(4);

        var oLevelText = new CTLText(s_oStage,
            CANVAS_WIDTH / 2 - 250, 120, 500, 70,
            50, "center", "#fff", FONT, 1,
            0, 0,
            TEXT_LEVEL,
            true, true, false,
            false);

        var oModePos = {
            x: CANVAS_WIDTH / 2,
            y: 175
        };

        var offset_x = 0;
        var offset_y = 50;


        for (var i = 0; i < _aLevelNum; i++, offset_x += 100) {
            if (offset_x > 400) {
                offset_x = 0;
                offset_y += 100;
            }

            if (i < s_iLastLevel) {
                _aLevels.push(new CLevelBut((oModePos.x - 200) + offset_x, oModePos.y + offset_y, s_oSpriteLibrary.getSprite('level_sprite'), true, i + 1));
            } else {
                _aLevels.push(new CLevelBut((oModePos.x - 200) + offset_x, oModePos.y + offset_y, s_oSpriteLibrary.getSprite('level_sprite'), false, i + 1));
            }
            if (i === 0) {
                _aLevels[i].addEventListenerWithParams(ON_MOUSE_UP, this._onClickHelp, this, i);
            } else {
                _aLevels[i].addEventListenerWithParams(ON_MOUSE_UP, this._onClick, this, i);
            }

            s_bFirstTime = true;
        }


        var oExitX;

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - (oSprite.height / 2) - 10,
            y: (oSprite.height / 2) + 10
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        oExitX = CANVAS_WIDTH - (oSprite.width / 2) - 70;
        _pStartPosAudio = {
            x: oExitX,
            y: (oSprite.height / 2) + 10
        };

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

    };

    this.unload = function() {
        for (var i = 0; i < _aLevelNum; i++) {
            _aLevels[i].unload();
        }
        s_oLevelMenu = null;
        s_oStage.removeAllChildren();
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }
    };

    this._onNumModeToggle = function(iData) {
        if (iData === NUM_ACTIVE) {
            _bNumActive = true;
            _oModeNumOff.setActive(false);
            _oModeNumOn.setActive(true);

        } else {
            _bNumActive = false;
            _oModeNumOff.setActive(true);
            _oModeNumOn.setActive(false);
        }
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onClick = function(i) {
        var level = i;
        var clickable = _aLevels[i].ifClickable();
        if (clickable) {
            s_oLevelMenu.unload();
            s_oMain.gotoGame(level);
        }
    };

    this._onClickHelp = function(i) {

        var clickable = _aLevels[i].ifClickable();
        if (clickable) {
            s_oLevelMenu.unload();
            s_oMain.gotoHelp();
        }
    };

    this._onExit = function() {
        s_oLevelMenu.unload();

        s_oMain.gotoMenu();
        $(s_oMain).trigger("end_level");
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };


    s_oLevelMenu = this;
    this._init();



};

var s_oLevelMenu = null;