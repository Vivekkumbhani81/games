function CPanelTutorial() {

    var _oContainer;
    var _oPanel;
    var _oButNext;
    var _oButBack;
    var _oButSkip;
    var _iCurrentPage;
    var _oContainerPage;
    var _iLastPag;

    this.init = function() {
        s_oGame.setPause(true);
        _iLastPag = 2;
        var oSprite;
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(-(CANVAS_WIDTH / 2), -(CANVAS_HEIGHT / 2), CANVAS_WIDTH, CANVAS_HEIGHT);
        shape.alpha = 0.7;
        shape.on("mousedown", this.onOver, this);
        _oContainerPage = new createjs.Container();
        _iCurrentPage = 0;
        _oContainer = new createjs.Container();
        _oContainer.x = CANVAS_WIDTH / 2;
        _oContainer.y = CANVAS_HEIGHT / 2;
        _oContainer.addChild(shape);
        _oContainer.alpha = 0;
        oSprite = s_oSpriteLibrary.getSprite("msg_box");
        _oPanel = new createBitmap(oSprite);
        _oPanel.regX = oSprite.width / 2;
        _oPanel.regY = oSprite.height / 2;
        _oPanel.alpha = 0.8;
        _oContainer.addChild(_oPanel);
        s_oStage.addChild(_oContainer);
        oSprite = s_oSpriteLibrary.getSprite("skip_arrow");
        _oButNext = new CGfxButton(420, 0, oSprite, _oContainer);
        _oButNext.addEventListener(ON_MOUSE_DOWN, this.onButNext, this);
        oSprite = s_oSpriteLibrary.getSprite("skip_arrow_left");
        _oButBack = new CGfxButton(-420, 0, oSprite, _oContainer);
        _oButBack.addEventListener(ON_MOUSE_DOWN, this.onButBack, this);
        _oButSkip = new CGfxButton(0, _oContainer.getBounds().height / 2 - 80, s_oSpriteLibrary.getSprite("but_next"), _oContainer);
        _oButSkip.addEventListener(ON_MOUSE_DOWN, this.onButSkip, this);
        this.loadPage(_iCurrentPage);
        new createjs.Tween.get(_oContainer).to({
            alpha: 1
        }, 500);

    };

    this.loadPage = function(iPage) {
        var oText;
        var oSprite;
        var oImage0;
        var oImage1;
        var oImage2;
        var oImage3;
        var oText1;
        var oText2;
        switch (iPage) {


            case 0:
                oText = new createjs.Text(TEXT_TUTORIAL_1, " 35px " + PRIMARY_FONT, "#FFFFFF");
                oText.lineWidth = 650;
                oText.y = -200;
                oText.textAlign = "center";
                if (s_bMobile) {
                    oSprite = s_oSpriteLibrary.getSprite("arrow");
                    oImage0 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                    oImage0.x = -oSprite.width / 2 - 220;
                    oImage0.y = -40;
                    oImage1 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                    oImage1.rotation = 180;
                    oImage1.x = oSprite.width / 2 + 211;
                    oImage1.y = 139;
                } else if (s_b2Players) {
                    oSprite = s_oSpriteLibrary.getSprite("key_w");
                    oImage0 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                    oImage0.x = -250;
                    oImage0.y = 0;
                    oSprite = s_oSpriteLibrary.getSprite("key_s");
                    oImage1 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                    oImage1.x = -150;
                    oImage1.y = 0;
                    oSprite = s_oSpriteLibrary.getSprite("key_up");
                    oImage2 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                    oImage2.x = +52;
                    oImage2.y = 0;
                    oSprite = s_oSpriteLibrary.getSprite("key_down");
                    oImage3 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                    oImage3.x = +150;
                    oImage3.y = 0;
                    oText1 = new createjs.Text(TEXT_TUTORIAL_PLAYER + " 1", " 40px " + PRIMARY_FONT, "#FFFFFF");
                    oText1.textAlign = "center";
                    oText1.x = -147;
                    oText1.y = -60;
                    oText2 = new createjs.Text(TEXT_TUTORIAL_PLAYER + " 2", " 40px " + PRIMARY_FONT, "#FFFFFF");
                    oText2.textAlign = "center";
                    oText2.x = +150;
                    oText2.y = -60;
                    _oContainerPage.addChild(oImage2, oImage3, oText1, oText2);
                } else {
                    oSprite = s_oSpriteLibrary.getSprite("key_w");
                    oImage0 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                    oImage0.x = -55 - 200;
                    oImage0.y = 0;
                    oSprite = s_oSpriteLibrary.getSprite("key_s");
                    oImage1 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                    oImage1.x = -55 + 200;
                    oImage1.y = 0;
                }
                _oContainerPage.addChild(oText, oImage0, oImage1);
                _oContainer.addChild(_oContainerPage);
                break;

            case 1:
                if (!s_bMobile) {
                    oText = new createjs.Text(TEXT_TUTORIAL_3, " 35px " + PRIMARY_FONT, "#FFFFFF");
                    oText.lineWidth = 600;
                    oText.y = -220;
                } else {
                    oText = new createjs.Text(TEXT_TUTORIAL_4, " 35px " + PRIMARY_FONT, "#FFFFFF");
                    oText.lineWidth = 600;
                    oText.y = -220;
                }

                oText.textAlign = "center";

                oSprite = s_oSpriteLibrary.getSprite("but_kickoff");
                oImage0 = new createBitmap(oSprite, oSprite.width, oSprite.height);
                oImage0.x = -oSprite.width / 2;
                oImage0.y = -60;
                _oContainerPage.addChild(oText, oImage0);
                break;

            case 2:
                oText = new createjs.Text(TEXT_TUTORIAL_2, " 35px " + PRIMARY_FONT, "#FFFFFF");
                oText.lineWidth = 600;
                oText.y = -65;
                oText.textAlign = "center";
                _oContainerPage.addChild(oText);
                break;
        }
    };

    this.onButNext = function() {
        if (_iCurrentPage === _iLastPag) {
            _iCurrentPage = 0;
        } else {
            _iCurrentPage++;
        }
        _oContainerPage.removeAllChildren();
        this.loadPage(_iCurrentPage);
    };

    this.onButBack = function() {
        if (_iCurrentPage === 0) {
            _iCurrentPage = _iLastPag;
        } else {
            _iCurrentPage--;
        }
        _oContainerPage.removeAllChildren();
        this.loadPage(_iCurrentPage);
    };

    this.onButSkip = function() {
        new createjs.Tween.get(_oContainer).to({
            alpha: 0
        }, 500).call(function() {
            s_oStage.removeChild(_oContainer);
            s_oGame.setPause(false);
        });
    };

    this.onOver = function() {

    };

    this.init();
}