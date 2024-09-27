function CEndPanel(oSpriteBg) {

    var _oBg;
    var _oGroup;

    var _oMsgText;
    var _oMsgTextStroke;
    var _oScoreText;
    var _oScoreTextStroke;
    var _oTotalScoreText;
    var _oTotalScoreTextStroke;

    this._init = function(oSpriteBg) {
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible = false;
        s_oStage.addChild(_oGroup);


        _oBg = createBitmap(oSpriteBg);
        _oGroup.addChild(_oBg);



        _oScoreTextStroke = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) + 30, 540, 60,
            50, "center", "#600101", FONT, 1,
            0, 0,
            " ",
            true, true, false,
            false);


        _oScoreTextStroke.setOutline(4);

        _oScoreText = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) + 30, 540, 60,
            50, "center", "#fff", FONT, 1,
            0, 0,
            " ",
            true, true, false,
            false);

        _oTotalScoreTextStroke = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) + 100, 540, 60,
            50, "center", "#600101", FONT, 1,
            0, 0,
            " ",
            true, true, false,
            false);

        _oTotalScoreTextStroke.setOutline(4);

        _oTotalScoreText = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) + 100, 540, 60,
            50, "center", "#fff", FONT, 1,
            0, 0,
            " ",
            true, true, false,
            false);

    };

    this._initListener = function() {
        _oGroup.on("mousedown", this._onExit);
    };

    this._initListenerEnd = function() {
        _oGroup.on("mousedown", this._onEndGame);
    };

    this.show = function(iLevelScore, iTotalScore, oCar, oParkArea, iType) {
        playSound("arrival_win", 1, false);
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        _oMsgTextStroke = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) - 160, 540, 60,
            50, "center", "#600101", FONT, 1,
            0, 0,
            TEXT_NEXT_LEVEL,
            true, true, false,
            false);

        _oMsgTextStroke.setOutline(4);

        _oMsgText = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) - 160, 540, 60,
            50, "center", "#fff", FONT, 1,
            0, 0,
            TEXT_NEXT_LEVEL,
            true, true, false,
            false);


        var iXParkAreaOffset = Math.abs(oParkArea.x - oCar.getX());
        var iYPArkAreaOffset = Math.abs(oParkArea.y - oCar.getY());

        var _iModifierX = 0;
        var _iModifierY = 0;

        var oPos = {
            x: (CANVAS_WIDTH / 2),
            y: (CANVAS_HEIGHT / 2 - 60)
        };

        _oGroup.addChild(oParkArea);
        switch (iType) {
            case 1:
                oParkArea.x = oPos.x - iXParkAreaOffset;
                oParkArea.y = oPos.y - iYPArkAreaOffset + 10;
                break;
            case 2:
                oParkArea.x = oPos.x - iXParkAreaOffset;
                oParkArea.y = oPos.y - iYPArkAreaOffset + 10;
                break;
            case 3:
                _iModifierX = -20;
                _iModifierY = +30;
                oParkArea.x = oPos.x - iXParkAreaOffset + _iModifierX;
                oParkArea.y = oPos.y - iYPArkAreaOffset + _iModifierY;
                break;
            case 4:
                oParkArea.x = oPos.x - iXParkAreaOffset;
                oParkArea.y = oPos.y - iYPArkAreaOffset;
                break;
        }
        oCar.seeOnStage(oPos.x + _iModifierX, oPos.y + _iModifierY, _oGroup);

        _oScoreTextStroke.refreshText(TEXT_SCORE + iLevelScore);

        _oScoreText.refreshText(TEXT_SCORE + iLevelScore);

        _oTotalScoreTextStroke.refreshText(TEXT_TOTAL_SCORE + iTotalScore);

        _oTotalScoreText.refreshText(TEXT_TOTAL_SCORE + iTotalScore);


        _oGroup.visible = true;

        var oParent = this;
        createjs.Tween.get(_oGroup).to({
            alpha: 1
        }, 500).call(function() {
            oParent._initListener();
        });

        $(s_oMain).trigger("share_event", iTotalScore);
        $(s_oMain).trigger("save_score", iTotalScore);
    };

    this.endGame = function(iLevelScore, iTotalScore, oCar, oParkArea, iType) {
        playSound("arrival_win", 1, false);
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);
        var iXParkAreaOffset = Math.abs(oParkArea.x - oCar.getX());
        var iYPArkAreaOffset = Math.abs(oParkArea.y - oCar.getY());

        _oMsgTextStroke = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) - 160, 540, 120,
            50, "center", "#600101", FONT, 1,
            0, 0,
            TEXT_ALL_LEVELS_COMPLETED,
            true, true, true,
            false);

        _oMsgTextStroke.setOutline(4);

        _oMsgText = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) - 160, 540, 120,
            50, "center", "#fff", FONT, 1,
            0, 0,
            TEXT_ALL_LEVELS_COMPLETED,
            true, true, true,
            false);


        var iXParkAreaOffset = Math.abs(oParkArea.x - oCar.getX());
        var iYPArkAreaOffset = Math.abs(oParkArea.y - oCar.getY());

        var oPos = {
            x: (CANVAS_WIDTH / 2 - 30),
            y: (CANVAS_HEIGHT / 2)
        };

        _oGroup.addChild(oParkArea);
        switch (iType) {
            case 1:
                oParkArea.x = oPos.x - iXParkAreaOffset;
                oParkArea.y = oPos.y - iYPArkAreaOffset + 10;
                break;
            case 2:
                oParkArea.x = oPos.x - iXParkAreaOffset;
                oParkArea.y = oPos.y - iYPArkAreaOffset + 10;
                break;
            case 3:
                oParkArea.x = oPos.x - iXParkAreaOffset;
                oParkArea.y = oPos.y - iYPArkAreaOffset;
                break;
            case 4:
                oParkArea.x = oPos.x - iXParkAreaOffset;
                oParkArea.y = oPos.y - iYPArkAreaOffset;
                break;
        }
        oCar.seeOnStage(oPos.x, oPos.y, _oGroup);

        _oScoreTextStroke.refreshText(TEXT_SCORE + iLevelScore);

        _oScoreText.refreshText(TEXT_SCORE + iLevelScore);


        _oTotalScoreTextStroke.refreshText(TEXT_TOTAL_SCORE + iTotalScore);

        _oTotalScoreText.refreshText(TEXT_TOTAL_SCORE + iTotalScore);


        _oGroup.visible = true;

        var oParent = this;
        createjs.Tween.get(_oGroup).to({
            alpha: 1
        }, 500).call(function() {
            oParent._initListenerEnd();
        });

        $(s_oMain).trigger("share_event", iTotalScore);
        $(s_oMain).trigger("save_score", iTotalScore);
    };

    this.gameOver = function(iTotalScore, oCar) {

        playSound("arrival_lose", 1, false);
        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);

        _oMsgTextStroke = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) - 160, 540, 100,
            50, "center", "#600101", FONT, 1,
            0, 0,
            TEXT_GAME_OVER,
            true, true, true,
            false);

        _oMsgTextStroke.setOutline(4);

        _oMsgText = new CTLText(_oGroup,
            CANVAS_WIDTH / 2 - 270, (CANVAS_HEIGHT / 2) - 160, 540, 100,
            50, "center", "#fff", FONT, 1,
            0, 0,
            TEXT_GAME_OVER,
            true, true, true,
            false);



        var oPos = {
            x: (CANVAS_WIDTH / 2 - 30),
            y: (CANVAS_HEIGHT / 2 + 20)
        };
        oCar.seeOnStageGameOver(oPos.x, oPos.y, _oGroup);

        var oSprite = s_oSpriteLibrary.getSprite('baloon_mc');
        var oBaloonCrash = createBitmap(s_oSpriteLibrary.getSprite('baloon_mc'));
        oBaloonCrash.x = oPos.x + 50;
        oBaloonCrash.y = oPos.y - 50;
        oBaloonCrash.regX = oSprite.width / 2;
        oBaloonCrash.regY = oSprite.height / 2;
        _oGroup.addChild(oBaloonCrash); //Draws on canvas

        _oTotalScoreTextStroke.refreshText(TEXT_TOTAL_SCORE + iTotalScore);

        _oTotalScoreText.refreshText(TEXT_TOTAL_SCORE + iTotalScore);


        _oGroup.visible = true;

        var oParent = this;
        createjs.Tween.get(_oGroup).to({
            alpha: 1
        }, 500).call(function() {
            oParent._initListenerEnd();
        });

        $(s_oMain).trigger("share_event", iTotalScore);
        $(s_oMain).trigger("save_score", iTotalScore);
    };

    this._onExit = function() {
        _oGroup.off("mousedown", this._onExit);
        s_oStage.removeChild(_oGroup);

        s_oGame.onNextLevel();
    };

    this._onEndGame = function() {
        _oGroup.off("mousedown", this._onEndGame);
        s_oStage.removeChild(_oGroup);

        s_oGame.onExit();
    };

    this._init(oSpriteBg);

    return this;
}