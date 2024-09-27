function CGame(oData, iLevel) {
    var _iLevel = iLevel;
    var _iCurHealt = 0;
    var _iTotalScore = 0;
    var _iLevelScore = 0;
    var _iTimeInLevel;

    var _oCurSelectedCar;
    var _oCurSelectedCarBitmap;
    var _oDropArea;
    var _oDropAreaType;

    var _bCanMove = false;
    var _bUpdate = false;

    var _aLevelObjects;
    var _aObstacles = new Array();
    var _aCarsBitmap = new Array();
    var _aObstaclesRectangle = new Array();
    var _aObstaclesVector = new Array();

    var _oLevelSettings;
    var _oBaloonCrash;
    var _oInterface;
    var _oEndPanel = null;
    var _oAsphaltBG = null;

    this._init = function() {
        _iTimeInLevel = LEVEL_TIME;

        for (var i = 0; i < _iLevel; i++) {
            _iTotalScore += s_aScores[i];
        }

        _oAsphaltBG = new createjs.Shape();
        s_oStage.addChild(_oAsphaltBG);
        _oAsphaltBG.x = 0;
        _oAsphaltBG.y = 0;
        _oAsphaltBG.graphics.beginBitmapFill(s_oSpriteLibrary.getSprite('asphalt'), 'repeat').drawRect(0, 0, canvas.width, canvas.height);

        $(s_oMain).trigger("start_level", _iLevel);
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game' + _iLevel));
        oBg.x = 330;
        oBg.y = 40;
        s_oStage.addChild(oBg);

        _oLevelSettings = new CLevelSettings();
        _aLevelObjects = _oLevelSettings.getLevelObjects(_iLevel);

        this._placeDropArea();

        for (var i = 0; i < _aLevelObjects.length; i++) {
            _aObstacles.push();
            var oObstacleSprite = s_oSpriteLibrary.getSprite(_aLevelObjects[i].mc);
            var oObstacle = createBitmap(oObstacleSprite);
            oObstacle.x = _aLevelObjects[i].x + oObstacleSprite.width / 2;
            oObstacle.y = _aLevelObjects[i].y + oObstacleSprite.height / 2;
            oObstacle.regX = oObstacleSprite.width / 2;
            oObstacle.regY = oObstacleSprite.height / 2;
            if (_aLevelObjects[i].visible) {
                s_oStage.addChild(oObstacle);
            }
            var oApp = new CCollisionRectangle(oObstacleSprite, oObstacle.x, oObstacle.y, (oObstacleSprite.width / 2), (oObstacleSprite.height / 2), 0);
            _aObstaclesRectangle.push(oApp.getBox());
            _aObstaclesVector.push(oApp.prepareVector(_aObstaclesRectangle[_aObstaclesRectangle.length - 1]));
        }
        this._placeCars();

        var oFg = createBitmap(s_oSpriteLibrary.getSprite('fg_game' + _iLevel));
        oFg.x = 275;
        oFg.y = -20;
        s_oStage.addChild(oFg); //Draws on canvas
        var oLightsBg = createBitmap(s_oSpriteLibrary.getSprite('lights' + _iLevel));
        oLightsBg.x = 300;
        oLightsBg.y = 15;
        s_oStage.addChild(oLightsBg); //Draws on canvas

        _oInterface = new CInterface();
        _oInterface.refreshScore(_iTotalScore);

        if (!s_bMobile) {
            document.onkeydown = onKeyDown;
            document.onkeyup = onKeyUp;
        } else {
            _oInterface.spawnGraphicControl();
        }
        _bUpdate = _bCanMove = true;

        var oSprite = s_oSpriteLibrary.getSprite('baloon_mc');
        _oBaloonCrash = createBitmap(oSprite);
        _oBaloonCrash.regX = oSprite.width / 2;
        _oBaloonCrash.regY = oSprite.height / 2;
        _oBaloonCrash.visible = false;
        s_oStage.addChild(_oBaloonCrash);
    };

    function onKeyDown(evt) {
        if (!evt) {
            evt = window.event;
        }

        if (_bCanMove === true) {
            if (evt.keyCode === LEFT_DIR) { //left
                _oCurSelectedCar.moveLeft(true);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === UP_DIR) { //up
                _oCurSelectedCar.moveUp(true);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === RIGHT_DIR) { //right
                _oCurSelectedCar.moveRight(true);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === DOWN_DIR) { //down
                _oCurSelectedCar.moveDown(true);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === SPACEBAR) {
                evt.preventDefault();
                return false;
            }
        }
    };

    function onKeyUp(evt) {
        if (!evt) {
            evt = window.event;
        }

        if (_bCanMove === true) {
            if (evt.keyCode === LEFT_DIR) { //left
                _oCurSelectedCar.moveLeft(false);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === UP_DIR) { //up
                _oCurSelectedCar.moveUp(false);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === RIGHT_DIR) { //right
                _oCurSelectedCar.moveRight(false);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === DOWN_DIR) { //down
                _oCurSelectedCar.moveDown(false);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === SPACEBAR) {
                evt.preventDefault();
                return false;
            }
        }
    };

    this._placeDropArea = function() {
        _oDropAreaType = _oLevelSettings.getDropArea(_iLevel);
        var oDropAreaSprite = s_oSpriteLibrary.getSprite("drop_area_" + _oDropAreaType.mc);
        oDropAreaSprite.x = _oDropAreaType.x;
        oDropAreaSprite.y = _oDropAreaType.y;

        var oData = {
            images: [oDropAreaSprite],
            framerate: 30,
            // width, height & registration point of each sprite
            frames: {
                width: _oDropAreaType.width,
                height: _oDropAreaType.height,
                regX: 0,
                regY: 0
            },
            animations: {
                idle: [0, 39, "idle"]
            }
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oDropArea = createSprite(oSpriteSheet, "idle", 0, 0, _oDropAreaType.width, _oDropAreaType.height);
        _oDropArea.x = _oDropAreaType.x;
        _oDropArea.y = _oDropAreaType.y;
        s_oStage.addChild(_oDropArea);
    };

    this._placeCars = function() {

        _aCarsBitmap = new Array();
        var aCarInfos = _oLevelSettings.getCarInfos(_iLevel);

        var oPos;
        var oCar;
        if (aCarInfos !== null) {
            for (var i = 0; i < aCarInfos.length; i++) {
                oCar = new CCar(aCarInfos[i].type, false);

                oPos = {
                    x: _oLevelSettings.getCarX(_iLevel, i),
                    y: _oLevelSettings.getCarY(_iLevel, i)
                };
                oCar.initInfo(oPos.x, oPos.y, aCarInfos[i].rot, false);
                _aCarsBitmap.push(oCar.getBitmap());
                _aObstaclesRectangle.push(oCar.getRectangle());
                _aObstaclesVector.push(oCar.getVector(_aObstaclesRectangle[_aObstaclesRectangle.length - 1]));
            }
        }

        var oMyCarInfos = _oLevelSettings.getMyCarInfos(_iLevel);
        oCar = new CCar(oMyCarInfos.type, true);
        oPos = {
            x: _oLevelSettings.getMyCarX(_iLevel),
            y: _oLevelSettings.getMyCarY(_iLevel)
        };
        oCar.initInfo(oPos.x, oPos.y, oMyCarInfos.rot);

        this.carSelected(oCar);
        _oCurSelectedCarBitmap = oCar.getBitmap();
    };

    this.carSelected = function(oCar) {
        playSound("select_car", 1, false);
        _oCurSelectedCar = oCar;
        _oCurSelectedCar.select();
    };

    this.checkDropArea = function() {
        _oCurSelectedCar.check(_oDropArea);
    };


    this.carParked = function() {

        playSound("car_parked", 1, false);

        if (_iTimeInLevel > 0) {
            _iLevelScore += Math.floor((_iTimeInLevel) / 1000);
        }

        var iLevelScore = Math.ceil(_iLevelScore + (_iCurHealt / 10));
        s_aScores[iLevel] = iLevelScore;
        iLevel++;
        s_iLastLevel = iLevel + 1;

        _iTotalScore += iLevelScore;

        _bUpdate = false;

        //SAVE PROGRESS
        saveItem("park_your_car_level_reached", s_iLastLevel);
        saveItem("Scores", JSON.stringify(s_aScores));

        if (_iLevel < _oLevelSettings.getNumLevels() - 1) {
            _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
            _oEndPanel.show(_iLevelScore, _iTotalScore, _oCurSelectedCar, _oDropArea, _oDropAreaType.mc);
        } else {
            _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
            _oEndPanel.endGame(_iLevelScore, _iTotalScore, _oCurSelectedCar, _oDropArea, _oDropAreaType.mc);
        }

    };

    this.gameOver = function() {
        _bUpdate = false;
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.gameOver(_iTotalScore, _oCurSelectedCar);
    };

    this.onLeftSteeringWheelDown = function() {
        //LEFT;
        _oCurSelectedCar.moveLeft(true);
    };

    this.onLeftSteeringWheelUp = function() {
        //LEFT;
        _oCurSelectedCar.moveLeft(false);
    };

    this.onRightSteeringWheelDown = function() {
        //RIGHT;
        _oCurSelectedCar.moveRight(true);
    };

    this.onRightSteeringWheelUp = function() {
        //RIGHT;
        _oCurSelectedCar.moveRight(false);
    };

    this.onAcceleratorPress = function() {
        if (!_oCurSelectedCar.isCrashing()) {
            _oCurSelectedCar.moveUp(true);
        }
    };

    this.onAcceleratorRelease = function() {
        _oCurSelectedCar.moveUp(false);
    };

    this.onReversePress = function() {
        if (!_oCurSelectedCar.isCrashing()) {
            _oCurSelectedCar.moveDown(true);
        }
    };

    this.onReverseRelease = function() {
        _oCurSelectedCar.moveDown(false);
    };

    this.unload = function() {
        _aObstaclesRectangle = [];
        _aCarsBitmap = [];
        _aLevelObjects = [];
        _aObstaclesVector = [];

        _oInterface.unload();

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };

    this.onExit = function() {
        this.unload();
        setVolume("soundtrack", 1);
        s_oMain.gotoMenu();
        var iLevelLength = _oLevelSettings.getNumLevels();

        if (_iLevel < iLevelLength) {
            $(s_oMain).trigger("end_level", _iLevel);
        }
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };

    this.onRestart = function() {
        this.unload();

        $(s_oMain).trigger("restart_level", _iLevel);
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_level", _iLevel);

        s_oMain.gotoGame(_iLevel);
    };

    this.onNextLevel = function() {
        this.unload();
        $(s_oMain).trigger("end_level", _iLevel);

        s_oMain.gotoGame(_iLevel + 1);

        $(s_oMain).trigger("show_interlevel_ad");
    };

    this.setCanMoveTrue = function() {
        _bCanMove = true;
    };

    this.update = function() {
        if (_bUpdate) {
            _oCurSelectedCar.update();

            _iTimeInLevel -= s_iTimeElaps;
            if (_iTimeInLevel > 0) {
                _oInterface.refreshTime(formatTime(_iTimeInLevel));
            }

            if (_aObstaclesRectangle.length > 0 && !_oBaloonCrash.visible) {
                for (var i = 0; i < _aObstaclesRectangle.length; i++) {
                    if (!_oCurSelectedCar.checkCollision(_aObstaclesRectangle[i], _aObstaclesVector[i])) {
                        _bCanMove = false;
                        _oCurSelectedCar.moveLeft(false);
                        _oCurSelectedCar.moveUp(false);
                        _oCurSelectedCar.moveRight(false);
                        _oCurSelectedCar.moveDown(false);

                        _oBaloonCrash.visible = true;
                        _oBaloonCrash.x = _oCurSelectedCar.getX();
                        _oBaloonCrash.y = _oCurSelectedCar.getY();

                        playSound("crash", 1, false);

                        var xShifting = 10;
                        var yShifting = 30;
                        createjs.Tween.get(_oBaloonCrash).to({
                            x: _oBaloonCrash.x + Math.round(Math.random() * xShifting),
                            y: _oBaloonCrash.y + Math.round(Math.random() * yShifting)
                        }, 50).call(function() {
                            createjs.Tween.get(_oBaloonCrash).to({
                                x: _oBaloonCrash.x + Math.round(Math.random() * xShifting * 0.8),
                                y: _oBaloonCrash.y + (-Math.round(Math.random() * yShifting * 0.8))
                            }, 50).call(function() {
                                createjs.Tween.get(_oBaloonCrash).to({
                                    x: _oBaloonCrash.x + Math.round(Math.random() * xShifting * 0.6),
                                    y: _oBaloonCrash.y + Math.round(Math.random() * yShifting * 0.6)
                                }, 50).call(function() {
                                    createjs.Tween.get(_oBaloonCrash).to({
                                        x: _oBaloonCrash.x + Math.round(Math.random() * xShifting * 0.4),
                                        y: _oBaloonCrash.y + (-Math.round(Math.random() * yShifting * 0.4))
                                    }, 50).call(function() {
                                        createjs.Tween.get(_oBaloonCrash).to({
                                            y: _oBaloonCrash.y,
                                            x: _oBaloonCrash.x
                                        }, 150).call(function() {
                                            _oBaloonCrash.visible = false;

                                        });
                                    });
                                });
                            });
                        });
                        var iEnergyLost = _oCurSelectedCar.getEnergyPercLost();
                        _oInterface.refreshMask(iEnergyLost);
                        _iCurHealt = _oCurSelectedCar.getEnergy();
                        if (_iCurHealt <= 0) {
                            this.gameOver();
                        }
                    }
                }
            }
        }
    };

    s_oGame = this;

    LEVEL_TIME = oData.level_time;
    MIN_SPEED_OFFSET = oData.min_speed_offset;

    _oParent = this;
    this._init();
}

var s_oGame;