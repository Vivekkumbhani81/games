function CMenu() {
    var _oBg;
    var _oLogo;
    var _oButPlay;
    var _oButContinue;
    var _oFade;
    var _oAudioToggle;
    //var _oButCredits;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oResetPanel = null;

    var _pStartPosAudio;
    var _pStartPosInfo;
    var _pStartPosFullscreen;

    this._init = function() {

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        _oLogo = createBitmap(s_oSpriteLibrary.getSprite('logo'));
        _oLogo.x = CANVAS_WIDTH / 2 - 350;
        _oLogo.y = 40;
        s_oStage.addChild(_oLogo);


        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((CANVAS_WIDTH / 2 + 220), CANVAS_HEIGHT / 2 + 80, oSprite, s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

        if (getItem("park_your_car_level_reached") !== null) {
            s_iLastLevel = getItem("park_your_car_level_reached");
            s_aScores = JSON.parse(getItem("Scores"));
            _oButPlay.setPosition(CANVAS_WIDTH / 2 - 200, CANVAS_HEIGHT - 80);

            var oSpriteContinue = s_oSpriteLibrary.getSprite('but_continue');
            _oButContinue = new CGfxButton(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT - 80, oSpriteContinue, s_oStage);
            _oButContinue.addEventListener(ON_MOUSE_UP, this._onButContinueRelease, this);
            _oButContinue.pulseAnimation();
        } else {
            _oButPlay.setPosition(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 80);
            _oButPlay.pulseAnimation();
            s_oMain.resetArrayScores();
        }

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {
                x: CANVAS_WIDTH - (oSprite.height / 2) - 10,
                y: (oSprite.height / 2) + 10
            };
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }


        var oSpriteInfo = s_oSpriteLibrary.getSprite("but_credits");
        _pStartPosInfo = {
            x: (oSpriteInfo.height / 2) + 10,
            y: (oSpriteInfo.height / 2) + 10
        };
        /*
        _oButCredits = new CGfxButton(_pStartPosInfo.x, _pStartPosInfo.y, oSpriteInfo, s_oStage);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onButInfoRelease, this);
        */

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled) {
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {
                x: _pStartPosInfo.x + oSprite.width / 2 - 10,
                y: oSprite.height / 2 + 10
            };

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oFade).to({
            alpha: 0
        }, 1000).call(function() {
            _oFade.visible = false;
        });

        if (!s_bStorageAvailable) {
            new CMsgBox(TEXT_ERR_LS, s_oStage);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);

    };

    this.unload = function() {
        _oButPlay.unload();
        _oButPlay = null;
        _oFade.visible = false;
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.unload();
        }
        //_oButCredits.unload();
        s_oStage.removeAllChildren();
        s_oMenu = null;
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
        //_oButCredits.setPosition(_pStartPosInfo.x + iNewX,_pStartPosInfo.y + iNewY);
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onButPlayRelease = function() {
        if (getItem("park_your_car_level_reached") === null) {
            this.unload();

            s_oMain.resetArrayScores();
            s_oMain.gotoLevelMenu();

            $(s_oMain).trigger("start_session");
        } else {
            if (_oResetPanel === null) {
                _oResetPanel = new CConfirmPanel(TEXT_RESET, 0);
                _oResetPanel.addEventListener(ON_BUT_NO_DOWN, this._onButNo, this);
                _oResetPanel.addEventListener(ON_BUT_YES_DOWN, this._onButYes, this);
            }
        }
    };

    this._onButContinueRelease = function() {
        this.unload();
        s_oMain.gotoLevelMenu();
    };

    this._onButInfoRelease = function() {
        new CCreditsPanel();
    };

    this.resetFullscreenBut = function() {
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };

    this._onFullscreenRelease = function() {
        if (s_bFullscreen) {
            _fCancelFullScreen.call(window.document);
        } else {
            _fRequestFullScreen.call(window.document.documentElement);
        }

        sizeHandler();
    };

    this._onButNo = function() {
        _oResetPanel.unload();
        _oResetPanel = null;
    };

    this._onButYes = function() {
        clearAllItem();
        this.unload();

        s_iLastLevel = 1;
        s_oMain.resetArrayScores();

        s_oMain.gotoLevelMenu();
    };

    s_oMenu = this;

    this._init();
}

var s_oMenu = null;