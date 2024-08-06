function CLevelMenu() {

    var _iModeSelected = s_iModeSelected;


    var _bNumActive;

    var _oLevelText;
    var _aLevels = new Array();
    var _oModeNumOff;
    var _oModeNumOn;

    var _oBg;
    var _oButExit;
    var _oAudioToggle;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;

    this._init = function() {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_select_team'));
        s_oStage.addChild(_oBg);

        _bNumActive = false;

        var oSprite = s_oSpriteLibrary.getSprite('select_challenge');
        _oBg = createBitmap(oSprite);
        _oBg.x = CANVAS_WIDTH / 2;
        _oBg.y = CANVAS_HEIGHT / 2;
        _oBg.regX = oSprite.width / 2;
        _oBg.regY = oSprite.height / 2;
        s_oStage.addChild(_oBg);

        _oLevelText = new createjs.Text(TEXT_CHALLENGE, " 20px " + FONT, "#ffffff");
        _oLevelText.x = CANVAS_WIDTH / 2 - 180;
        _oLevelText.y = 128;
        _oLevelText.textAlign = "left";
        _oLevelText.textBaseline = "alphabetic";
        _oLevelText.lineWidth = 1000;
        s_oStage.addChild(_oLevelText);

        var oModePos = {
            x: CANVAS_WIDTH / 2 - 240,
            y: 215
        };

        var offset_x = 0;
        var offset_y = 50;

        for (var i = 0; i < s_oCityInfos.getNumLevels(); i++, offset_x += 120) {
            if (offset_x > 500) {
                offset_x = 0;
                offset_y += 175;
            }
            var oCityName = s_oCityInfos.getCityName(i);
            var oCityRewards = s_oCityInfos.getRewards(i);

            //x, y, sprite, bActive, level, name_level, rewards
            if (i < s_iLevelReached) {
                _aLevels.push(new CLevelBut(oModePos.x + offset_x, oModePos.y + offset_y, s_oSpriteLibrary.getSprite('level_sprite'), true, i + 1, oCityName, oCityRewards));
            } else {
                _aLevels.push(new CLevelBut(oModePos.x + offset_x, oModePos.y + offset_y, s_oSpriteLibrary.getSprite('level_sprite'), false, i + 1, oCityName, oCityRewards));
            }

            _aLevels[i].addEventListenerWithParams(ON_MOUSE_UP, this._onClick, this, i);
            _aLevels[i].addEventListenerWithParams(ON_MOUSE_DOWN, this._onMouseDown, this, i);


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

        oExitX = CANVAS_WIDTH - (oSprite.width / 2) - 90;
        _pStartPosAudio = {
            x: oExitX,
            y: (oSprite.height / 2) + 10
        };

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && inIframe() === false) {
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {
                x: oSprite.width / 4 + 10,
                y: _pStartPosExit.y
            };

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

    };

    this.unload = function() {
        for (var i = 0; i < s_oCityInfos.getNumLevels(); i++) {
            _aLevels[i].unload();
        }

        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.unload();
        }

        s_oLevelMenu = null;
        s_oStage.removeAllChildren();
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
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

    this._onMouseDown = function(i) {
        _aLevels[i].scaleText();
    };

    this._onClick = function(i) {
        var level = i;
        var clickable = _aLevels[i].ifClickable();
        if (clickable) {
            s_oLevelMenu.unload();
            s_oMain.gotoGame(_iModeSelected, level);
        }
    };

    this._onExit = function() {
        s_oLevelMenu.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };

    this.resetFullscreenBut = function() {
        _oButFullscreen.setActive(s_bFullscreen);
    };

    this._onFullscreenRelease = function() {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }

        sizeHandler();
    };

    s_oLevelMenu = this;
    this._init();

};

var s_oLevelMenu = null;