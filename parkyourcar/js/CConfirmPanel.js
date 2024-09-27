function CConfirmPanel(szText) {
    var _iButtonY = 70;

    var _oParent = this;

    var _aCbCompleted = new Array();
    var _aCbOwner = new Array();
    var _aParams = new Array();

    var _oBg;
    var _oContainer;

    var _szText = szText;
    var _oMsgText;

    var _oButNo;
    var _oButYes;

    this._init = function() {

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');

        _oContainer = new createjs.Container();

        _oBg = createBitmap(oSpriteBg);
        _oBg.on("mousedown", this._onClick);
        _oContainer.addChild(_oBg);

        _oMsgText = new CTLText(_oContainer,
            CANVAS_WIDTH / 2 - 250, 120, 500, 200,
            50, "center", "#600101", FONT, 1,
            0, 0,
            _szText,
            true, true, true,
            false);



        _oButNo = new CGfxButton(CANVAS_WIDTH / 2 - 180, 380, s_oSpriteLibrary.getSprite('but_no'), _oContainer);
        _oButNo.pulseAnimation();

        _oButYes = new CGfxButton(CANVAS_WIDTH / 2 + 180, 380, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);

        s_oStage.addChild(_oContainer);

        this.show();
    };

    this._initListener = function() {
        _oButNo.addEventListener(ON_MOUSE_DOWN, this.buttonNoDown, this);
        _oButYes.addEventListener(ON_MOUSE_DOWN, this.buttonYesDown, this);
    };

    this.addEventListener = function(iEvent, cbCompleted, cbOwner) {
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.buttonNoDown = function() {

        if (_aCbCompleted[ON_BUT_NO_DOWN]) {
            _aCbCompleted[ON_BUT_NO_DOWN].call(_aCbOwner[ON_BUT_NO_DOWN], _aParams);
        }
    };

    this.buttonYesDown = function() {

        if (_aCbCompleted[ON_BUT_YES_DOWN]) {
            _aCbCompleted[ON_BUT_YES_DOWN].call(_aCbOwner[ON_BUT_YES_DOWN], _aParams);
        }
    };

    this._onClick = function() {

    };

    this.show = function() {
        _oContainer.alpha = 0;
        createjs.Tween.get(_oContainer).to({
            alpha: 1
        }, 500, createjs.Ease.quadOut).call(function() {
            _oParent._initListener();
        });
    };

    this.unload = function() {
        _oBg.off("mousedown", this._onClick);
        createjs.Tween.get(_oContainer).to({
            alpha: 0
        }, 500).call(function() {
            s_oStage.removeChild(_oContainer);
        });

    };

    this._init();

    s_oVariousHelp = this;

    return this;
}

var s_oVariousHelp = null;