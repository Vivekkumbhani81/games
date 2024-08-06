function CSelectTeam() {

    var _iTeamSelected = 0;

    var _oPlayerContainer;
    var _oPlayer;

    var _oLevelText;

    var _oTeamSelectedText;

    var _oButContinue;
    var _oButtonTeam4;
    var _oButtonTeam7;
    var _oButtonTeam2;
    var _oButtonTeam3;
    var _oButtonTeam5;
    var _oButtonTeam6;
    var _oButtonTeam1;
    var _oButtonTeam0;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _oBg;
    var _oButExit;
    var _oAudioToggle;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosContinue;
    var _pStartPosFullscreen;

    this._init = function() {

        s_iTeamSelected = 0;
        s_szTeamSelectedSprite = "swimmer_0";

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_select_team'));
        s_oStage.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite('select_challenge');
        var oBox = createBitmap(oSprite);
        oBox.x = CANVAS_WIDTH / 2;
        oBox.y = CANVAS_HEIGHT / 2;
        oBox.regX = oSprite.width / 2;
        oBox.regY = oSprite.height / 2;
        s_oStage.addChild(oBox);

        _oLevelText = new createjs.Text(TEXT_SWIMMER, " 20px " + FONT, "#ffffff");
        _oLevelText.x = CANVAS_WIDTH / 2 - 180;
        _oLevelText.y = 128;
        _oLevelText.textAlign = "left";
        _oLevelText.textBaseline = "alphabetic";
        _oLevelText.lineWidth = 1000;
        s_oStage.addChild(_oLevelText);

        _oTeamSelectedText = new createjs.Text(TEXT_TEAM_0, " 20px " + FONT, "#ffffff");
        _oTeamSelectedText.x = CANVAS_WIDTH / 2 - 180;
        _oTeamSelectedText.y = 155;
        _oTeamSelectedText.textAlign = "left";
        _oTeamSelectedText.textBaseline = "alphabetic";
        _oTeamSelectedText.lineWidth = 1000;
        s_oStage.addChild(_oTeamSelectedText);

        var oGlowSprite = s_oSpriteLibrary.getSprite("glow");

        var oGlow = createBitmap(oGlowSprite);
        oGlow.x = PLAYER_X_POSITION_IN_SELECTION;
        oGlow.y = PLAYER_Y_POSITION_IN_SELECTION - 1;
        oGlow.regX = oGlowSprite.width / 2;
        oGlow.regY = oGlowSprite.height / 2;
        s_oStage.addChild(oGlow);

        var oSprite = s_oSpriteLibrary.getSprite('but_continue_small');
        _pStartPosContinue = {
            x: (CANVAS_WIDTH / 2 + 340),
            y: CANVAS_HEIGHT - 148
        };
        _oButContinue = new CGfxButton(_pStartPosContinue.x, _pStartPosContinue.y, oSprite, s_oStage);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onButNextRelease, this);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH - (oSprite.height / 2) - 10,
            y: (oSprite.height / 2) + 10
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oExitX = CANVAS_WIDTH - (oSprite.width / 2) - 90;
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

        _oPlayerContainer = new createjs.Container();
        s_oStage.addChild(_oPlayerContainer);

        this.showIdleAnimation(PLAYER_X_POSITION_IN_SELECTION, PLAYER_Y_POSITION_IN_SELECTION, s_szTeamSelectedSprite);

        var oSpriteTeam0 = s_oSpriteLibrary.getSprite('flag_swimmer_0');
        _oButtonTeam0 = new CToggle((CANVAS_WIDTH / 2) - 180, (CANVAS_HEIGHT / 2) - 100, oSpriteTeam0, false);
        _oButtonTeam0.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, TEAM_0);

        var oSpriteTeam1 = s_oSpriteLibrary.getSprite('flag_swimmer_1');
        _oButtonTeam1 = new CToggle((CANVAS_WIDTH / 2) - 180, (CANVAS_HEIGHT / 2) - 20, oSpriteTeam1, true);
        _oButtonTeam1.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, TEAM_1);

        var oSpriteTeam2 = s_oSpriteLibrary.getSprite('flag_swimmer_2');
        _oButtonTeam2 = new CToggle((CANVAS_WIDTH / 2) - 180, (CANVAS_HEIGHT / 2) + 60, oSpriteTeam2, true);
        _oButtonTeam2.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, TEAM_2);

        var oSpriteTeam3 = s_oSpriteLibrary.getSprite('flag_swimmer_3');
        _oButtonTeam3 = new CToggle((CANVAS_WIDTH / 2) - 180, (CANVAS_HEIGHT / 2) + 145, oSpriteTeam3, true);
        _oButtonTeam3.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, TEAM_3);

        var oSpriteTeam4 = s_oSpriteLibrary.getSprite('flag_swimmer_4');
        _oButtonTeam4 = new CToggle((CANVAS_WIDTH / 2) + 180, (CANVAS_HEIGHT / 2) - 100, oSpriteTeam4, true);
        _oButtonTeam4.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, TEAM_4);

        var oSpriteTeam5 = s_oSpriteLibrary.getSprite('flag_swimmer_5');
        _oButtonTeam5 = new CToggle((CANVAS_WIDTH / 2) + 180, (CANVAS_HEIGHT / 2) - 20, oSpriteTeam5, true);
        _oButtonTeam5.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, TEAM_5);

        var oSpriteTeam6 = s_oSpriteLibrary.getSprite('flag_swimmer_6');
        _oButtonTeam6 = new CToggle((CANVAS_WIDTH / 2) + 180, (CANVAS_HEIGHT / 2) + 60, oSpriteTeam6, true);
        _oButtonTeam6.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, TEAM_6);

        var oSpriteTeam7 = s_oSpriteLibrary.getSprite('flag_swimmer_7');
        _oButtonTeam7 = new CToggle((CANVAS_WIDTH / 2) + 180, (CANVAS_HEIGHT / 2) + 145, oSpriteTeam7, true);
        _oButtonTeam7.addEventListenerWithParams(ON_MOUSE_UP, this._onModeToggle, this, TEAM_7);

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this._onModeToggle = function(iData) {
        var szTeam;
        switch (iData) {

            case TEAM_0:
                {
                    _oButtonTeam0.setActive(false);
                    _oButtonTeam1.setActive(true);
                    _oButtonTeam2.setActive(true);
                    _oButtonTeam3.setActive(true);
                    _oButtonTeam4.setActive(true);
                    _oButtonTeam5.setActive(true);
                    _oButtonTeam6.setActive(true);
                    _oButtonTeam7.setActive(true);
                    _iTeamSelected = TEAM_0;
                    _oTeamSelectedText.text = TEXT_TEAM_0;
                    szTeam = "swimmer_0";
                    break;
                }
            case TEAM_1:
                {
                    _oButtonTeam0.setActive(true);
                    _oButtonTeam1.setActive(false);
                    _oButtonTeam2.setActive(true);
                    _oButtonTeam3.setActive(true);
                    _oButtonTeam4.setActive(true);
                    _oButtonTeam5.setActive(true);
                    _oButtonTeam6.setActive(true);
                    _oButtonTeam7.setActive(true);
                    _iTeamSelected = TEAM_1;
                    _oTeamSelectedText.text = TEXT_TEAM_1;
                    szTeam = "swimmer_1";
                    break;
                }
            case TEAM_2:
                {
                    _oButtonTeam0.setActive(true);
                    _oButtonTeam1.setActive(true);
                    _oButtonTeam2.setActive(false);
                    _oButtonTeam3.setActive(true);
                    _oButtonTeam4.setActive(true);
                    _oButtonTeam5.setActive(true);
                    _oButtonTeam6.setActive(true);
                    _oButtonTeam7.setActive(true);
                    _iTeamSelected = TEAM_2;
                    _oTeamSelectedText.text = TEXT_TEAM_2;
                    szTeam = "swimmer_2";
                    break;
                }
            case TEAM_3:
                {
                    _oButtonTeam0.setActive(true);
                    _oButtonTeam1.setActive(true);
                    _oButtonTeam2.setActive(true);
                    _oButtonTeam3.setActive(false);
                    _oButtonTeam4.setActive(true);
                    _oButtonTeam5.setActive(true);
                    _oButtonTeam6.setActive(true);
                    _oButtonTeam7.setActive(true);
                    _iTeamSelected = TEAM_3;
                    _oTeamSelectedText.text = TEXT_TEAM_3;
                    szTeam = "swimmer_3";
                    break;
                }
            case TEAM_4:
                {
                    _oButtonTeam0.setActive(true);
                    _oButtonTeam1.setActive(true);
                    _oButtonTeam2.setActive(true);
                    _oButtonTeam3.setActive(true);
                    _oButtonTeam4.setActive(false);
                    _oButtonTeam5.setActive(true);
                    _oButtonTeam6.setActive(true);
                    _oButtonTeam7.setActive(true);
                    _iTeamSelected = TEAM_4;
                    _oTeamSelectedText.text = TEXT_TEAM_4;
                    szTeam = "swimmer_4";
                    break;
                }
            case TEAM_5:
                {
                    _oButtonTeam0.setActive(true);
                    _oButtonTeam1.setActive(true);
                    _oButtonTeam2.setActive(true);
                    _oButtonTeam3.setActive(true);
                    _oButtonTeam4.setActive(true);
                    _oButtonTeam5.setActive(false);
                    _oButtonTeam6.setActive(true);
                    _oButtonTeam7.setActive(true);
                    _iTeamSelected = TEAM_5;
                    _oTeamSelectedText.text = TEXT_TEAM_5;
                    szTeam = "swimmer_5";
                    break;
                }
            case TEAM_6:
                {
                    _oButtonTeam0.setActive(true);
                    _oButtonTeam1.setActive(true);
                    _oButtonTeam2.setActive(true);
                    _oButtonTeam3.setActive(true);
                    _oButtonTeam4.setActive(true);
                    _oButtonTeam5.setActive(true);
                    _oButtonTeam6.setActive(false);
                    _oButtonTeam7.setActive(true);
                    _iTeamSelected = TEAM_6;
                    _oTeamSelectedText.text = TEXT_TEAM_6;
                    szTeam = "swimmer_6";
                    break;
                }
            case TEAM_7:
                {
                    _oButtonTeam0.setActive(true);
                    _oButtonTeam1.setActive(true);
                    _oButtonTeam2.setActive(true);
                    _oButtonTeam3.setActive(true);
                    _oButtonTeam4.setActive(true);
                    _oButtonTeam5.setActive(true);
                    _oButtonTeam6.setActive(true);
                    _oButtonTeam7.setActive(false);
                    _iTeamSelected = TEAM_7;
                    _oTeamSelectedText.text = TEXT_TEAM_7;
                    szTeam = "swimmer_7";
                    break;
                }
        }
        this.showIdleAnimation(PLAYER_X_POSITION_IN_SELECTION, PLAYER_Y_POSITION_IN_SELECTION, szTeam);
        s_iTeamSelected = _iTeamSelected;
        s_szTeamSelectedSprite = szTeam;
    };

    this.showIdleAnimation = function(iX, iY, szTeam) {
        s_oStage.removeChild(_oPlayer);

        var oPlayerSprite = s_oSpriteLibrary.getSprite(szTeam + "_pose");

        _oPlayer = createBitmap(oPlayerSprite);
        _oPlayer.x = iX;
        _oPlayer.y = iY;
        _oPlayer.regX = oPlayerSprite.width / 2;
        _oPlayer.regY = oPlayerSprite.height / 2;

        s_oStage.addChild(_oPlayer);
    };

    this._onExit = function() {
        s_oMain.gotoMenu();
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this.unload = function() {
        if (_fRequestFullScreen && inIframe() === false) {
            _oButFullscreen.unload();
        }

        _oButtonTeam4.unload();
        _oButtonTeam7.unload();
        _oButtonTeam5.unload();
        _oButtonTeam2.unload();
        _oButtonTeam6.unload();
        _oButtonTeam3.unload();
        _oButtonTeam1.unload();
        _oButtonTeam0.unload();

        s_oSelectTeam = null;
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

    this._onButNextRelease = function() {
        this.unload();

        s_oMain.gotoModeSelect();
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

    s_oSelectTeam = this;

    this._init();

};

var s_oSelectTeam = null;