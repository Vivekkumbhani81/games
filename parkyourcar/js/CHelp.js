function CHelp() {

    var _oParent = this;

    var _oBg;
    var _oGroup1;

    var _oMsgTextOutline;
    var _oMsgText;

    var _oHelpSprite;
    var _oHelpSpriteCursor;
    var _oButPlay;

    var _oAccelerator;
    var _oHelpSpriteAcceleratorCursor;
    var _oReverse;
    var _oHelpSpriteReverseCursor;


    this._init = function() {

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        _oGroup1 = new createjs.Container();
        _oGroup1.alpha = 0;

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        s_oStage.addChild(_oBg);



        if (!s_bMobile) {
            _oMsgTextOutline = new CTLText(_oGroup1,
                CANVAS_WIDTH / 2 - 250, (CANVAS_HEIGHT / 2) + 15, 500, 100,
                50, "center", "#730358", FONT, 1,
                0, 0,
                TEXT_MOVE_DESKTOP,
                true, true, true,
                false);

            _oMsgTextOutline.setOutline(3);

            _oMsgText = new CTLText(_oGroup1,
                CANVAS_WIDTH / 2 - 250, (CANVAS_HEIGHT / 2) + 15, 500, 100,
                50, "center", "#fff", FONT, 1,
                0, 0,
                TEXT_MOVE_DESKTOP,
                true, true, true,
                false);

            _oHelpSprite = createBitmap(s_oSpriteLibrary.getSprite('arrow_keys'));
            _oHelpSprite.x = CANVAS_WIDTH / 2 - 100;
            _oHelpSprite.y = CANVAS_HEIGHT / 2 - 130;
            _oGroup1.addChild(_oHelpSprite);
        } else {
            var oMsgTextOutline = new createjs.Text(TEXT_MOVE_MOBILE, " 25px " + FONT, "#730358");
            oMsgTextOutline.x = CANVAS_WIDTH / 2 - 200;
            oMsgTextOutline.y = (CANVAS_HEIGHT / 2) + 110;
            oMsgTextOutline.textAlign = "center";
            oMsgTextOutline.textBaseline = "alphabetic";
            oMsgTextOutline.lineWidth = 400;
            oMsgTextOutline.outline = 3;
            _oGroup1.addChild(oMsgTextOutline);

            var oMsgText = new createjs.Text(TEXT_MOVE_MOBILE, " 25px " + FONT, "#ffffff");
            oMsgText.x = CANVAS_WIDTH / 2 - 200;
            oMsgText.y = (CANVAS_HEIGHT / 2) + 110;
            oMsgText.textAlign = "center";
            oMsgText.textBaseline = "alphabetic";
            oMsgText.lineWidth = 400;
            _oGroup1.addChild(oMsgText);

            var oSteeringWheelSprite = s_oSpriteLibrary.getSprite('steering_wheel')

            _oHelpSprite = createBitmap(oSteeringWheelSprite);
            _oHelpSprite.x = CANVAS_WIDTH / 2 - 200;
            _oHelpSprite.y = CANVAS_HEIGHT / 2 - 40;
            _oHelpSprite.regX = oSteeringWheelSprite.width / 2;
            _oHelpSprite.regY = oSteeringWheelSprite.height / 2;
            _oHelpSpriteCursor = createBitmap(s_oSpriteLibrary.getSprite('help_touch'));
            _oHelpSpriteCursor.x = CANVAS_WIDTH / 2 - 230;
            _oHelpSpriteCursor.y = CANVAS_HEIGHT / 2 - 40;
            _oGroup1.addChild(_oHelpSprite, _oHelpSpriteCursor);
            this.moveCursorRight();

            var oMsgTextOutline = new createjs.Text(TEXT_MOVE_MOBILE2, " 25px " + FONT, "#730358");
            oMsgTextOutline.x = CANVAS_WIDTH / 2;
            oMsgTextOutline.y = (CANVAS_HEIGHT / 2) + 110;
            oMsgTextOutline.textAlign = "center";
            oMsgTextOutline.textBaseline = "alphabetic";
            oMsgTextOutline.lineWidth = 400;
            oMsgTextOutline.outline = 3;
            _oGroup1.addChild(oMsgTextOutline);

            var oMsgText = new createjs.Text(TEXT_MOVE_MOBILE2, " 25px " + FONT, "#ffffff");
            oMsgText.x = CANVAS_WIDTH / 2;
            oMsgText.y = (CANVAS_HEIGHT / 2) + 110;
            oMsgText.textAlign = "center";
            oMsgText.textBaseline = "alphabetic";
            oMsgText.lineWidth = 400;
            _oGroup1.addChild(oMsgText);

            var oAcceleratorSprite = s_oSpriteLibrary.getSprite('accelerator');
            _oAccelerator = new CToggle(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50, oAcceleratorSprite, true, s_oStage);
            _oAccelerator.setClickable(false);
            _oHelpSpriteAcceleratorCursor = createBitmap(s_oSpriteLibrary.getSprite('help_touch'));
            _oHelpSpriteAcceleratorCursor.x = CANVAS_WIDTH / 2 - 30;
            _oHelpSpriteAcceleratorCursor.y = CANVAS_HEIGHT / 2 - 80;
            _oGroup1.addChild(_oHelpSpriteAcceleratorCursor);
            this.pressAccelerator();

            var oMsgTextOutline = new createjs.Text(TEXT_MOVE_MOBILE1, " 25px " + FONT, "#730358");
            oMsgTextOutline.x = CANVAS_WIDTH / 2 + 200;
            oMsgTextOutline.y = (CANVAS_HEIGHT / 2) + 100;
            oMsgTextOutline.textAlign = "center";
            oMsgTextOutline.textBaseline = "alphabetic";
            oMsgTextOutline.lineWidth = 400;
            oMsgTextOutline.outline = 3;
            _oGroup1.addChild(oMsgTextOutline);

            var oMsgText = new createjs.Text(TEXT_MOVE_MOBILE1, " 25px " + FONT, "#ffffff");
            oMsgText.x = CANVAS_WIDTH / 2 + 200;
            oMsgText.y = (CANVAS_HEIGHT / 2) + 100;
            oMsgText.textAlign = "center";
            oMsgText.textBaseline = "alphabetic";
            oMsgText.lineWidth = 400;
            _oGroup1.addChild(oMsgText);

            var oReverseSprite = s_oSpriteLibrary.getSprite('breacker');
            _oReverse = new CToggle(CANVAS_WIDTH / 2 + 200, CANVAS_HEIGHT / 2 - 50, oReverseSprite, true, s_oStage);
            _oReverse.setClickable(false);
            _oHelpSpriteReverseCursor = createBitmap(s_oSpriteLibrary.getSprite('help_touch'));
            _oHelpSpriteReverseCursor.x = CANVAS_WIDTH / 2 + 170;
            _oHelpSpriteReverseCursor.y = CANVAS_HEIGHT / 2 - 80;
            _oGroup1.addChild(_oHelpSpriteReverseCursor);
            this.pressReverse();
        }

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton((CANVAS_WIDTH / 2), CANVAS_HEIGHT / 2 + 180, oSprite, s_oStage, s_oStage);
        _oButPlay.setScale(0.5)
        s_oStage.addChild(_oGroup1);

        this.show();
    };

    this._initListener = function() {
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onExit, this);
    };

    this.moveCursorRight = function() {
        var oParent = this;
        _oHelpSpriteCursor.scaleX = 1;
        _oHelpSpriteCursor.scaleY = 1;
        createjs.Tween.get(_oHelpSprite).to({
            rotation: 0
        }, 1000).call(function() {});
        createjs.Tween.get(_oHelpSpriteCursor).to({
            x: CANVAS_WIDTH / 2 - 180
        }, 1000).call(function() {
            _oHelpSpriteCursor.scaleX = 0.9;
            _oHelpSpriteCursor.scaleY = 0.9;
            createjs.Tween.get(_oHelpSprite).to({
                rotation: 90
            }, 1000).call(function() {
                oParent.moveCursorLeft();
            });
        });
    };

    this.moveCursorLeft = function() {
        var oParent = this;
        _oHelpSpriteCursor.scaleX = 1;
        _oHelpSpriteCursor.scaleY = 1;
        createjs.Tween.get(_oHelpSprite).to({
            rotation: 0
        }, 1000).call(function() {});
        createjs.Tween.get(_oHelpSpriteCursor).to({
            x: CANVAS_WIDTH / 2 - 270
        }, 1000).call(function() {
            _oHelpSpriteCursor.scaleX = 0.9;
            _oHelpSpriteCursor.scaleY = 0.9;
            createjs.Tween.get(_oHelpSprite).to({
                rotation: -90
            }, 1000).call(function() {
                oParent.moveCursorRight();
            });
        });
    };

    this.pressAccelerator = function() {
        var oParent = this;

        createjs.Tween.get(_oHelpSpriteAcceleratorCursor).to({
            scaleX: 0.9,
            scaleY: 0.9
        }, 1000).call(function() {
            _oAccelerator.setActive(false);
            setTimeout(function() {
                oParent.releaseAccelerator();
            }, 1000);
        });
    };

    this.releaseAccelerator = function() {
        var oParent = this;

        _oAccelerator.setActive(true);
        createjs.Tween.get(_oHelpSpriteAcceleratorCursor).to({
            scaleX: 1,
            scaleY: 1
        }, 1000).call(function() {
            oParent.pressAccelerator();
        });
    };

    this.pressReverse = function() {
        var oParent = this;

        createjs.Tween.get(_oHelpSpriteReverseCursor).to({
            scaleX: 0.9,
            scaleY: 0.9
        }, 1000).call(function() {
            _oReverse.setActive(false);
            setTimeout(function() {
                oParent.releaseReverse();
            }, 1000);
        });
    };

    this.releaseReverse = function() {
        var oParent = this;
        _oReverse.setActive(true);
        createjs.Tween.get(_oHelpSpriteReverseCursor).to({
            scaleX: 1,
            scaleY: 1
        }, 1000).call(function() {
            oParent.pressReverse();
        });
    };

    this.show = function() {

        createjs.Tween.get(_oGroup1).to({
            alpha: 1
        }, 500).call(function() {
            _oParent._initListener();
        });
    };

    this._onExit = function() {
        _oParent.unload();
        s_oMain.gotoGame(0);
    };

    this.unload = function() {

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

    };

    this._init();

    return this;
}