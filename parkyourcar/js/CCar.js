function CCar(iCarType, _bIsPlayer) {
    var _bDestroying;
    var _bReady = false;
    var _bCrashing = false;
    var _bUpPressed = false;
    var _bDownPressed = false;
    var _bLeftPressed = false;
    var _bRightPressed = false;
    var _bPlayer = false;
    var _bCarParked = false;
    var _bChangedDir = false;

    var _iSpeed = 0;
    var _iMaxSpeed = 0;
    var _iMaxReverseSpeed = 0;
    var _iAcceleration = 0;
    var _iGroundFriction = 0.95;
    var _iSteering = 0;
    var _iMaxSteering = 0;
    var _iSteeringAcceleration = 0;
    var _iSteeringFriction = 0;
    var _iXSpeed = 0;
    var _iYSpeed = 0;
    var _iStartRotation = 0;
    var _iStartingEnergy = 100;
    var _iCurEnergy = 0;
    var _iWeightPercent = 0;
    var _iMaxWheelSteer = 0;
    var _iStartX = 0;
    var _iStartY = 0;
    var _iHitDamage = 0;

    var _oWheel1;
    var _oWheel2;
    var _oWheel3;
    var _oWheel4;
    var _oRearLightSx;
    var _oRearLightDx;
    var _oCarMc;
    var _oContainer;
    var _oCarRectangle;
    var _oWheelSprite = s_oSpriteLibrary.getSprite('wheel');
    var _oCarSprite = s_oSpriteLibrary.getSprite('car_' + iCarType);
    var _oSelectSprite;
    var _oSelectCar;

    this.init = function(iCarType, _bIsPlayer) {
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oRearLightSx = createBitmap(s_oSpriteLibrary.getSprite('rear_light'));
        _oRearLightSx.x = _oCarSprite.width / 4;
        _oRearLightSx.y = _oCarSprite.height - 2;
        _oContainer.addChild(_oRearLightSx);
        _oRearLightDx = createBitmap(s_oSpriteLibrary.getSprite('rear_light'));
        _oRearLightDx.x = _oCarSprite.width - (_oCarSprite.width / 4) - 2;
        _oRearLightDx.y = _oCarSprite.height - 2;
        _oContainer.addChild(_oRearLightDx);
        _oRearLightSx.visible = false;
        _oRearLightDx.visible = false;

        if (_bIsPlayer) {
            _oWheel1 = createBitmap(_oWheelSprite);
            _oWheel1.x = 5;
            _oWheel1.y = 20;
            _oWheel1.regX = _oWheelSprite.width / 2;
            _oWheel1.regY = _oWheelSprite.height / 2;
            _oContainer.addChild(_oWheel1);

            _oWheel2 = createBitmap(_oWheelSprite);
            _oWheel2.x = _oCarSprite.width - 5;
            _oWheel2.y = 20;
            _oWheel2.regX = _oWheelSprite.width / 2;
            _oWheel2.regY = _oWheelSprite.height / 2;
            _oContainer.addChild(_oWheel2);

            _oWheel3 = createBitmap(_oWheelSprite);
            _oWheel3.x = 5;
            _oWheel3.y = _oCarSprite.height - 20;
            _oWheel3.regX = _oWheelSprite.width / 2;
            _oWheel3.regY = _oWheelSprite.height / 2;
            _oContainer.addChild(_oWheel3);

            _oWheel4 = createBitmap(_oWheelSprite);
            _oWheel4.x = _oCarSprite.width - 5;
            _oWheel4.y = _oCarSprite.height - 20;
            _oWheel4.regX = _oWheelSprite.width / 2;
            _oWheel4.regY = _oWheelSprite.height / 2;
            _oContainer.addChild(_oWheel4);
        }

        _oCarMc = createBitmap(_oCarSprite);
        _oContainer.addChild(_oCarMc);

        _oContainer.regX = _oCarSprite.width / 2;
        _oContainer.regY = 35;
        _iCurEnergy = _iStartingEnergy;

        _oContainer.visible = true;

        //Initializing the car infos
        switch (iCarType) {
            case 1:
            case 7:
            case 13:
                this.Car1init();
                break;
            case 2:
            case 8:
            case 14:
                _oContainer.addChild(_oSelectCar);
                this.Car2init();
                break;
            case 3:
            case 9:
            case 15:
                this.Car3init();
                break;
            case 4:
            case 10:
            case 16:
                this.Car4init();
                break;
            case 5:
            case 11:
            case 17:
                this.Car5init();
                _oContainer.regY = 40;
                break;
            case 6:
            case 12:
            case 18:
                this.Car6init();
                _oContainer.regY = 60;
                if (_bIsPlayer) {
                    _oWheel1.x = 6;
                    _oWheel1.y = 22;

                    _oWheel2.x = _oCarSprite.width - 6;
                    _oWheel2.y = 22;

                    _oWheel3.x = 6;
                    _oWheel3.y = _oCarSprite.height - 22;

                    _oWheel4.x = _oCarSprite.width - 6;
                    _oWheel4.y = _oCarSprite.height - 22;
                }
                break;
        }


        _oContainer.rotation = _iStartRotation;

        _bReady = true;
    };

    this.check = function(oDropArea) {

        var iOffset1 = _oContainer.localToGlobal(_oWheel1.x, _oWheel1.y);
        var iOffset2 = _oContainer.localToGlobal(_oWheel2.x, _oWheel2.y);
        var iOffset3 = _oContainer.localToGlobal(_oWheel3.x, _oWheel3.y);
        var iOffset4 = _oContainer.localToGlobal(_oWheel4.x, _oWheel4.y);

        var pWheel1 = oDropArea.globalToLocal(iOffset1.x, iOffset1.y);
        var pWheel2 = oDropArea.globalToLocal(iOffset2.x, iOffset2.y);
        var pWheel3 = oDropArea.globalToLocal(iOffset3.x, iOffset3.y);
        var pWheel4 = oDropArea.globalToLocal(iOffset4.x, iOffset4.y);

        var oDropRect = oDropArea.getBounds();

        if (oDropRect.contains(pWheel1.x, pWheel1.y) && oDropRect.contains(pWheel2.x, pWheel2.y) && oDropRect.contains(pWheel3.x, pWheel3.y) && oDropRect.contains(pWheel4.x, pWheel4.y)) {
            s_oGame.carParked();
            _bCarParked = true;
            return;
        }
    };

    this.Car1init = function() {
        _iMaxSpeed = 28;
        _iMaxReverseSpeed = -3;
        _iAcceleration = 0.45;
        _iMaxSteering = 2;
        _iSteeringAcceleration = 0.1;
        _iSteeringFriction = 0.98;
        _iHitDamage = 15;
        _iMaxWheelSteer = 40;
    };

    this.Car2init = function() {
        _iMaxSpeed = 8;
        _iMaxReverseSpeed = -3;
        _iAcceleration = 0.25;
        _iMaxSteering = 2;
        _iSteeringAcceleration = 0.1;
        _iSteeringFriction = 0.98;
        _iHitDamage = 10;
        _iMaxWheelSteer = 40;
    };

    this.Car3init = function() {
        _iMaxSpeed = 8;
        _iMaxReverseSpeed = -3;
        _iAcceleration = 0.25;
        _iMaxSteering = 2;
        _iSteeringAcceleration = 0.1;
        _iSteeringFriction = 0.98;
        _iHitDamage = 10;
        _iMaxWheelSteer = 40;
    };

    this.Car4init = function() {
        _iMaxSpeed = 28;
        _iMaxReverseSpeed = -3;
        _iAcceleration = 0.45;
        _iMaxSteering = 2;
        _iSteeringAcceleration = 0.1;
        _iSteeringFriction = 0.98;
        _iHitDamage = 15;
        _iMaxWheelSteer = 40;
    };

    this.Car5init = function() {
        _iMaxSpeed = 28;
        _iMaxReverseSpeed = -3;
        _iAcceleration = 0.45;
        _iMaxSteering = 2;
        _iSteeringAcceleration = 0.1;
        _iSteeringFriction = 0.98;
        _iHitDamage = 15;
        _iMaxWheelSteer = 40;
    };

    this.Car6init = function() {
        _iMaxSpeed = 8;
        _iMaxReverseSpeed = -3;
        _iAcceleration = 0.15;
        _iMaxSteering = 2;
        _iSteeringAcceleration = 0.1;
        _iSteeringFriction = 0.98;
        _iHitDamage = 15;
        _iMaxWheelSteer = 40;
    };

    this.unload = function() {
        this.unload();
    };

    this.initInfo = function(iX, iY, iRot) {
        _oContainer.x = _iStartX = iX;
        _oContainer.y = _iStartY = iY;

        _oContainer.rotation = _iStartRotation = iRot;

        _oCarRectangle = new CCollisionRectangle(_oCarSprite, _oContainer.x, _oContainer.y, _oContainer.regX, _oContainer.regY, _oContainer.rotation);
    };

    this._reset = function() {
        _bUpPressed = false;
        _bDownPressed = false;
        _bLeftPressed = false;
        _bRightPressed = false;
        _iSpeed = 0;
        _iSteering = 0;
        _iXSpeed = 0;
        _iYSpeed = 0;
        _iGroundFriction = 0.95;

        _bDestroying = false;
    };

    this.resetPos = function() {
        this._reset();

        _oContainer.x = _iStartX;
        _oContainer.y = _iStartY;
        _oContainer.rotation = _iStartRotation;
        _iStartingEnergy = 100;
        _iCurEnergy = 0;
    };

    this.select = function() {
        _bPlayer = true;

        //selection the "select car" sprite
        switch (iCarType) {
            case 1:
            case 7:
            case 13:
            case 2:
            case 8:
            case 14:
            case 3:
            case 9:
            case 15:
                _oSelectSprite = s_oSpriteLibrary.getSprite("select_car_1");
                var oData = {
                    images: [_oSelectSprite],
                    framerate: 20,
                    // width, height & registration point of each sprite
                    frames: {
                        width: 76,
                        height: 130,
                        regX: 38,
                        regY: 50
                    },
                    animations: {
                        idle: [0, 19, "idle"]
                    }
                };
                var oSpriteSheet = new createjs.SpriteSheet(oData);

                _oSelectCar = createSprite(oSpriteSheet, "idle", 0, 0, 76, 130);
                _oSelectCar.x = _oContainer.x;
                _oSelectCar.y = _oContainer.y;
                s_oStage.addChild(_oSelectCar);
                break;
            case 4:
            case 10:
            case 16:
                _oSelectSprite = s_oSpriteLibrary.getSprite("select_car_2");
                var oData = {
                    images: [_oSelectSprite],
                    framerate: 20,
                    // width, height & registration point of each sprite
                    frames: {
                        width: 76,
                        height: 110,
                        regX: 38,
                        regY: 48
                    },
                    animations: {
                        idle: [0, 19, "idle"]
                    }
                };
                var oSpriteSheet = new createjs.SpriteSheet(oData);

                _oSelectCar = createSprite(oSpriteSheet, "idle", 0, 0, 76, 110);
                _oSelectCar.x = _oContainer.x;
                _oSelectCar.y = _oContainer.y;
                s_oStage.addChild(_oSelectCar);
                break;
            case 5:
            case 11:
            case 17:
                _oSelectSprite = s_oSpriteLibrary.getSprite("select_car_4");
                var oData = {
                    images: [_oSelectSprite],
                    framerate: 20,
                    // width, height & registration point of each sprite
                    frames: {
                        width: 66,
                        height: 130,
                        regX: 33,
                        regY: 53
                    },
                    animations: {
                        idle: [0, 19, "idle"]
                    }
                };
                var oSpriteSheet = new createjs.SpriteSheet(oData);

                _oSelectCar = createSprite(oSpriteSheet, "idle", 0, 0, 66, 130);
                _oSelectCar.x = _oContainer.x;
                _oSelectCar.y = _oContainer.y;
                s_oStage.addChild(_oSelectCar);
                break;
            case 6:
            case 12:
            case 18:
                _oSelectSprite = s_oSpriteLibrary.getSprite("select_car_3");
                var oData = {
                    images: [_oSelectSprite],
                    framerate: 20,
                    // width, height & registration point of each sprite
                    frames: {
                        width: 89,
                        height: 210,
                        regX: 44,
                        regY: 70
                    },
                    animations: {
                        idle: [0, 19, "idle"]
                    }
                };
                var oSpriteSheet = new createjs.SpriteSheet(oData);

                _oSelectCar = createSprite(oSpriteSheet, "idle", 0, 0, 89, 210);
                _oSelectCar.x = _oContainer.x;
                _oSelectCar.y = _oContainer.y;
                s_oStage.addChild(_oSelectCar);
                break;
        }
        _oSelectCar.rotation = _iStartRotation;
    };

    this.moveLeft = function(bValue) {
        if (bValue) {
            _bRightPressed = false;
        }
        _bLeftPressed = bValue;
    };

    this.getX = function() {
        return _oSelectCar.x;
    };

    this.getY = function() {
        return _oSelectCar.y;
    };

    this.getRegX = function() {
        return _oContainer.regX;
    };

    this.getRegY = function() {
        return _oContainer.regY;
    };

    this.moveRight = function(bValue) {
        if (bValue) {
            _bLeftPressed = false;
        }
        _bRightPressed = bValue;
    };

    this.moveUp = function(bValue) {
        if (bValue) {
            _bDownPressed = false;
        }
        _bUpPressed = bValue;
    };

    this.moveDown = function(bValue) {
        if (bValue) {
            _bUpPressed = false;
        }
        _bDownPressed = bValue;
    };

    this.seeOnStage = function(iX, iY, oContainer) {
        oContainer.addChild(_oCarMc);
        _oCarMc.x = iX;
        _oCarMc.y = iY;
        _oCarMc.regX = _oContainer.regX;
        _oCarMc.regY = _oContainer.regY;
        _oCarMc.rotation = _oContainer.rotation;
        _oWheel1.visible = false;
        _oWheel2.visible = false;
        _oWheel3.visible = false;
        _oWheel4.visible = false;
    };

    this.seeOnStageGameOver = function(iX, iY, oContainer) {
        oContainer.addChild(_oCarMc);

        _oCarMc.regX = _oContainer.regX;
        _oCarMc.regY = _oContainer.regY;
        if (iCarType === 6 || iCarType === 12 || iCarType === 18) {
            _oCarMc.x = iX + 60;
            _oCarMc.y = iY + 10;
            _oCarMc.rotation = 90;
        } else {
            _oCarMc.x = iX;
            _oCarMc.y = iY;
            _oCarMc.rotation = _oContainer.rotation;
        }
        _oWheel1.visible = false;
        _oWheel2.visible = false;
        _oWheel3.visible = false;
        _oWheel4.visible = false;
    };

    this.getBitmap = function() {
        return _oCarMc;
    };

    this.getSpeed = function() {
        return _iSpeed;
    };

    this.getEnergy = function() {
        return _iCurEnergy;
    };

    this.isCrashing = function() {
        return _bCrashing;
    };

    this.isDestroying = function() {
        return _bDestroying;
    };

    this.getEnergyPercLost = function() {
        return (_iCurEnergy * _iStartingEnergy) / 100;
    };

    this.isReady = function() {
        return _bReady;
    };

    this.getRectangle = function() {
        return _oCarRectangle.getBox();
    };

    this.getVector = function(oBox) {
        return _oCarRectangle.prepareVector(oBox);
    };

    this.checkCollision = function(oOtherBox, oOtherBoxVector) {
        if (!_oCarRectangle.refresh(oOtherBox, oOtherBoxVector)) {

            if (!_bCrashing) {
                _iCurEnergy -= _iHitDamage * Math.abs(_iSpeed < 0.5 ? 0.5 : _iSpeed);
                _bCrashing = true;
            }

            return false;
        } else {
            return true;
        }
    };

    this.update = function() {

        if (_oRearLightDx === null) {
            return;
        }

        if (!_bPlayer) {
            return;
        }

        if (_bUpPressed) {
            //check if below speedMax
            if (_iSpeed < _iMaxSpeed) {
                //speed up
                _iSpeed += _iAcceleration;
                //check if above speedMax
                if (_iSpeed > _iMaxSpeed) {
                    //reset to speedMax
                    _iSpeed = _iMaxSpeed;
                }
            }
        }

        if (_bDownPressed) {
            //check if below speedMaxReverse
            if (_iSpeed > _iMaxReverseSpeed) {
                //speed up (in reverse)
                _iSpeed -= _iAcceleration;
                //check if above speedMaxReverse
                if (_iSpeed < _iMaxReverseSpeed) {
                    //reset to speedMaxReverse
                    _iSpeed = _iMaxReverseSpeed;
                }
            }
        }

        if (_bLeftPressed) {
            //turn left
            _iSteering -= _iSteeringAcceleration;
            //check if above steeringMax
            if (_iSteering > _iMaxSteering) {
                //reset to steeringMax
                _iSteering = _iMaxSteering;
            }
        }

        if (_bRightPressed) {
            //turn right
            _iSteering += _iSteeringAcceleration;
            //check if above steeringMax
            if (_iSteering < -_iMaxSteering) {
                //reset to steeringMax
                _iSteering = -_iMaxSteering;
            }
        }

        // friction    
        _iSpeed *= _iGroundFriction;

        // prevent drift
        if (_iSpeed > -MIN_SPEED_OFFSET && _iSpeed < MIN_SPEED_OFFSET) {
            _iSpeed = 0;
            _oSelectCar.visible = true;
        } else {
            _oSelectCar.visible = false;
        }

        if (_bCrashing) {
            if (!_bChangedDir) {
                _iSpeed = -_iSpeed;
                _iGroundFriction = _iGroundFriction - 0.2;
                _bChangedDir = true;
            }

            if (_iSpeed > -MIN_SPEED_OFFSET && _iSpeed < MIN_SPEED_OFFSET) {
                _iSpeed = 0;
                _bCrashing = false;
                _bChangedDir = false;
                _iGroundFriction = _iGroundFriction + 0.2;
                s_oGame.setCanMoveTrue();
            }
        }

        // calculate velocity based on speed
        _iXSpeed = Math.sin(_oContainer.rotation * Math.PI / 180) * _iSpeed;
        _iYSpeed = Math.cos(_oContainer.rotation * Math.PI / 180) * -_iSpeed;

        if (_iSpeed !== 0 && !(_iXSpeed > -0.09 && _iXSpeed < 0.09)) {
            // update position	
            _oContainer.x += _iXSpeed;
            _oSelectCar.x += _iXSpeed;
        }

        if (_iSpeed !== 0 && !(_iYSpeed > -0.09 && _iYSpeed < 0.09)) {
            _oContainer.y += _iYSpeed;
            _oSelectCar.y += _iYSpeed;
        }

        if (_iXSpeed < 0.09 && _iXSpeed > -0.09 && _iYSpeed < 0.09 && _iYSpeed > -0.09 && !_bCarParked) {
            s_oGame.checkDropArea();
        }
        if (_iSpeed < 0) {
            _oRearLightDx.visible = true;
            _oRearLightSx.visible = true;
        } else {
            _oRearLightDx.visible = false;
            _oRearLightSx.visible = false;
        }

        // prevent steering drift (right)
        if (_iSteering > 0) {
            // check if steering value is really low, set to 0
            if (_iSteering < 0.05) {
                _iSteering = 0;
            }
        }
        // prevent steering drift (left)
        else if (_iSteering < 0) {
            // check if steering value is really low, set to 0
            if (_iSteering > -0.05) {
                _iSteering = 0;
            }
        }

        // apply steering friction
        _iSteering = _iSteering * _iSteeringFriction;

        // make car go straight after driver stops turning
        _iSteering -= (_iSteering * 0.1);


        // rotate
        var iTotalSteering = _iSteering * _iSpeed;
        _oContainer.rotation += iTotalSteering;
        _oSelectCar.rotation += iTotalSteering;

        if (_iSpeed !== 0 && !(_iXSpeed > -0.09 && _iXSpeed < 0.09) || _iSpeed !== 0 && !(_iYSpeed > -0.09 && _iYSpeed < 0.09)) {
            // update position	
            _oCarRectangle.move(_iXSpeed, _iYSpeed);
            _oCarRectangle.applySteering(iTotalSteering);
        }

        //WHEEL STEERING
        var iPerc = _iMaxWheelSteer * _iSteering;
        _oWheel1.rotation = iPerc;
        _oWheel2.rotation = iPerc;

    };

    this.init(iCarType, _bIsPlayer);
};