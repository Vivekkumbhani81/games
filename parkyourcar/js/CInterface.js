function CInterface() {
    var _iPerc = 100;

    var _oAudioToggle;
    var _oButExit;
    var _oButRestart;

    var _oHelpPanel = null;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosRestart;
    var _pStartPosFullscreen;

    var _bUserControl;

    var _oSteeringWheel;
    var _oSteeringWheelPos;
    var _oAccelerator;
    var _oAcceleratorPos;
    var _oReverse;
    var _oReversePos;
    var _oHealtBar;
    var _oHealtBarContainer;
    var _pHealtBarPos = {
        x: 264,
        y: CANVAS_HEIGHT - 146
    };
    var _pHealtBarContainerPos = {
        x: 260,
        y: CANVAS_HEIGHT - 70
    };
    var _oHealtMask;
    var _iMaskWidth;
    var _iMaskHeight;
    var _oTimeSprite;
    var _oTimeSpritePos = {
        x: CANVAS_WIDTH / 2 - 265,
        y: 5
    };
    var _oTimeText;
    var _oTimeTextStroke;
    var _oTimePos = {
        x: CANVAS_WIDTH / 2 - 205,
        y: 50
    };
    var _oScoreText;
    var _oScoreTextStroke;
    var _oScorePos = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT - 10
    };
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function() {
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

            _pStartPosFullscreen = {
                x: _pStartPosAudio.x - oSprite.width / 2 + 10,
                y: _pStartPosAudio.y
            };
        } else {
            _pStartPosFullscreen = {
                x: oExitX,
                y: (oSprite.height / 2) + 10
            };
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled) {
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');


            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _pStartPosRestart = {
            x: 40,
            y: (oSprite.height / 2) + 10
        };

        var oSprite = s_oSpriteLibrary.getSprite('but_restart');
        _oButRestart = new CGfxButton(_pStartPosRestart.x, _pStartPosRestart.y, oSprite, s_oStage);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);

        _oScoreTextStroke = new createjs.Text("SCORE: 0", "40px " + FONT, "#600101");
        _oScoreTextStroke.x = _oScorePos.x;
        _oScoreTextStroke.y = _oScorePos.y;
        _oScoreTextStroke.textAlign = "center";
        _oScoreTextStroke.textBaseline = "alphabetic";
        _oScoreTextStroke.outline = 4;
        s_oStage.addChild(_oScoreTextStroke);

        _oScoreText = new createjs.Text("SCORE: 0", "40px " + FONT, "#ffffff");
        _oScoreText.x = _oScorePos.x;
        _oScoreText.y = _oScorePos.y;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "alphabetic";
        s_oStage.addChild(_oScoreText);

        _oTimeTextStroke = new createjs.Text("00:00", "40px " + FONT, "#600101");
        _oTimeTextStroke.x = _oTimePos.x;
        _oTimeTextStroke.y = _oTimePos.y;
        _oTimeTextStroke.textAlign = "left";
        _oTimeTextStroke.textBaseline = "alphabetic";
        _oTimeTextStroke.outline = 4;
        s_oStage.addChild(_oTimeTextStroke);

        _oTimeText = new createjs.Text("00:00", "40px " + FONT, "#ffffff");
        _oTimeText.x = _oTimePos.x;
        _oTimeText.y = _oTimePos.y;
        _oTimeText.textAlign = "left";
        _oTimeText.textBaseline = "alphabetic";
        s_oStage.addChild(_oTimeText);

        _oTimeSprite = createBitmap(s_oSpriteLibrary.getSprite('time'));
        _oTimeSprite.x = _oTimeSpritePos.x;
        _oTimeSprite.y = _oTimeSpritePos.y;
        s_oStage.addChild(_oTimeSprite);

        var oHealtSprite = s_oSpriteLibrary.getSprite('energy_bar');
        _oHealtBarContainer = createBitmap(oHealtSprite);

        _oHealtBarContainer.x = _pHealtBarContainerPos.x;
        _oHealtBarContainer.y = _pHealtBarContainerPos.y;
        _oHealtBarContainer.regY = oHealtSprite.height;
        s_oStage.addChild(_oHealtBarContainer);

        var oHealtSprite = s_oSpriteLibrary.getSprite('healt');
        _oHealtBar = createBitmap(oHealtSprite);
        _iMaskWidth = oHealtSprite.width - 6;
        _iMaskHeight = oHealtSprite.height;

        _oHealtBar.x = _pHealtBarPos.x;
        _oHealtBar.y = _pHealtBarPos.y;
        _oHealtBar.regY = oHealtSprite.height;
        _oHealtBar.alpha = 0.9;
        s_oStage.addChild(_oHealtBar);
        _oHealtMask = new createjs.Shape();
        _oHealtMask.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(_oHealtBar.x + 3, _oHealtBar.y, _iMaskWidth, -_iMaskHeight + 3);


        _oHealtMask.regY = _oHealtBar.regY - _iMaskHeight;

        s_oStage.addChild(_oHealtMask);

        _oHealtBar.mask = _oHealtMask;

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshTime = function(iValue) {
        _oTimeTextStroke.text = iValue;
        _oTimeText.text = iValue;
    };

    this.refreshScore = function(iScore) {
        _oScoreTextStroke.text = "SCORE: " + iScore;
        _oScoreText.text = "SCORE: " + iScore;
    };

    this.spawnGraphicControl = function() {

        _oSteeringWheelPos = {
            x: 125,
            y: 450
        };
        _oSteeringWheel = new CSteeringWheel(_oSteeringWheelPos, s_oStage)

        _oAcceleratorPos = {
            x: CANVAS_WIDTH - 50,
            y: 450
        };
        var oAcceleratorSprite = s_oSpriteLibrary.getSprite('accelerator');
        _oAccelerator = new CToggle(_oAcceleratorPos.x, _oAcceleratorPos.y, oAcceleratorSprite, true, s_oStage);
        _oAccelerator.addEventListener(ON_MOUSE_DOWN, this._onAcceleratorPress, this);
        _oAccelerator.addEventListener(ON_MOUSE_UP, this._onAcceleratorRelease, this);

        _oReversePos = {
            x: CANVAS_WIDTH - 175,
            y: 450
        };
        var oReverseSprite = s_oSpriteLibrary.getSprite('breacker');
        _oReverse = new CToggle(_oReversePos.x, _oReversePos.y, oReverseSprite, true, s_oStage);
        _oReverse.addEventListener(ON_MOUSE_DOWN, this._onReversePress, this);
        _oReverse.addEventListener(ON_MOUSE_UP, this._onReverseRelease, this);
        _bUserControl = true;

        if (s_bTablet) {
            _oSteeringWheel.setScale(0.9);
            _oAcceleratorPos = {
                x: CANVAS_WIDTH - 55,
                y: 470
            };
            _oAccelerator.setPosition(_oAcceleratorPos.x, _oAcceleratorPos.y);
            _oAccelerator.setScale(0.7);
            _oReversePos = {
                x: CANVAS_WIDTH - 115,
                y: 470
            };
            _oReverse.setPosition(_oReversePos.x, _oReversePos.y);
            _oReverse.setScale(0.7);
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this._onReversePress = function() {
        s_oGame.onReversePress();
        _oReverse.setActive(false);
    };

    this._onReverseRelease = function() {
        s_oGame.onReverseRelease();
        _oReverse.setActive(true);
    };

    this._onAcceleratorPress = function() {
        s_oGame.onAcceleratorPress();
        _oAccelerator.setActive(false);
    };

    this._onAcceleratorRelease = function() {
        s_oGame.onAcceleratorRelease();
        _oAccelerator.setActive(true);
    };

    this.unload = function() {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.unload();
        }
        _oButExit.unload();
        _oButRestart.unload();

        if (_oHelpPanel !== null) {
            _oHelpPanel.unload();
        }
        s_oInterface = null;
    };

    this.refreshMask = function(iPerc) {
        _iPerc = iPerc;
        _oHealtMask.graphics.clear();
        var iNewMaskHeight = Math.floor((_iPerc * _iMaskHeight) / 100);
        _oHealtMask.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(_oHealtBar.x + 3, _oHealtBar.y, _iMaskWidth, -iNewMaskHeight + 3);
    };

    this.refreshButtonPos = function(iNewX, iNewY) {
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }

        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y + iNewY);
        }
        _oButRestart.setPosition(_pStartPosRestart.x + iNewX, iNewY + _pStartPosRestart.y);

        if ((_pHealtBarPos.x + iNewX) < 336) {
            _oHealtBar.x = _pHealtBarPos.x + iNewX;
            _oHealtBarContainer.x = _pHealtBarContainerPos.x + iNewX;
            this.refreshMask(_iPerc);
        } else {
            _oHealtBar.x = 336;
            _oHealtBarContainer.x = 332;
            this.refreshMask(_iPerc);
        }
        if (_bUserControl) {
            _oSteeringWheel.setPosition(_oSteeringWheelPos.x + iNewX, _oSteeringWheelPos.y);
            _oAccelerator.setPosition(_oAcceleratorPos.x - iNewX, _oAcceleratorPos.y);
            _oReverse.setPosition(_oReversePos.x - iNewX, _oReversePos.y);
        }
    };

    this._onButHelpRelease = function() {
        _oHelpPanel = new CHelpPanel();
    };

    this.onExitFromHelp = function() {
        _oHelpPanel.unload();
    };

    this._onAudioToggle = function() {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onExit = function() {
        s_oGame.onExit();
    };

    this._onRestart = function() {
        s_oGame.onRestart();
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

    s_oInterface = this;

    this._init();

    return this;
}

var s_oInterface = null;