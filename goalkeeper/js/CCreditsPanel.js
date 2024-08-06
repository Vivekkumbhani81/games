function CCreditsPanel() {

    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    var _oMsgTextOutline;

    var _oHitArea;

    var _oLink;
    var _oLinkOutline;

    var _pStartPosExit;

    var _oContainer;

    this._init = function() {
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');

        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#000").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.5;
        _oHitArea.on("click", this._onLogoButRelease);
        _oHitArea.cursor = "pointer";
        _oContainer.addChild(_oHitArea);

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oContainer.addChild(_oBg);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {
            x: CANVAS_WIDTH * 0.5 + 380,
            y: 180
        };
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);


        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "50px " + FONT_GAME, "#ffffff");
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.x = CANVAS_WIDTH / 2;
        _oMsgText.y = 280;
        _oContainer.addChild(_oMsgText);

        _oLink = new createjs.Text("CBC KIDS", "50px " + FONT_GAME, "#ffffff");
        _oLink.textAlign = "center";
        _oLink.textBaseline = "alphabetic";
        _oLink.x = CANVAS_WIDTH / 2;
        _oLink.y = 520;
        _oContainer.addChild(_oLink);

    };

    this.unload = function() {
        _oHitArea.off("click", this._onLogoButRelease);

        _oButExit.unload();
        _oButExit = null;

        s_oStage.removeChild(_oContainer);
    };

    this._onLogoButRelease = function() {
        window.open("http://www.codethislab.com/index.php?&l=en", "_blank");
    };

    this._init();


}