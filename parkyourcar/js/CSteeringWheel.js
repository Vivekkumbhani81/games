function CSteeringWheel(oPos, oContainer) {
    var _iX;
    var _iY;

    var _oCotnainer = oContainer;

    var _oSteeringWheel;
    var _oLeftSteeringWheelShape;
    var _oRightSteeringWheelShape;

    this._init = function() {
        _iX = oPos.x;
        _iY = oPos.y;

        var oSteeringWheelSprite = s_oSpriteLibrary.getSprite('steering_wheel');
        _oSteeringWheel = createBitmap(oSteeringWheelSprite);
        _oSteeringWheel.x = _iX;
        _oSteeringWheel.y = _iY;
        _oSteeringWheel.regX = oSteeringWheelSprite.width / 2;
        _oSteeringWheel.regY = oSteeringWheelSprite.height / 2;
        _oCotnainer.addChild(_oSteeringWheel);

        _oLeftSteeringWheelShape = new createjs.Shape();
        _oLeftSteeringWheelShape.graphics.beginFill("#ff0000").drawRect(0, 0, 100, 130);
        _oLeftSteeringWheelShape.x = _iX - 100;
        _oLeftSteeringWheelShape.y = _iY - 65;
        _oLeftSteeringWheelShape.alpha = 0.01;
        _oCotnainer.addChild(_oLeftSteeringWheelShape);
        _oLeftSteeringWheelShape.on("mousedown", this.onLeftSteeringWheelDown);
        _oLeftSteeringWheelShape.on("pressup", this.onLeftSteeringWheelUp);

        _oRightSteeringWheelShape = new createjs.Shape();
        _oRightSteeringWheelShape.graphics.beginFill("#ff00ff").drawRect(0, 0, 100, 130);
        _oRightSteeringWheelShape.x = _iX;
        _oRightSteeringWheelShape.y = _iY - 65;
        _oRightSteeringWheelShape.alpha = 0.01;
        _oCotnainer.addChild(_oRightSteeringWheelShape);
        _oRightSteeringWheelShape.on("mousedown", this.onRightSteeringWheelDown);
        _oRightSteeringWheelShape.on("pressup", this.onRightSteeringWheelUp);

    };

    this.setPosition = function(iNewX, iNewY) {
        _oSteeringWheel.x = iNewX;
        _oLeftSteeringWheelShape.x = iNewX - 100;
        _oRightSteeringWheelShape.x = iNewX;
    };

    this.setScale = function(iScaleValue) {
        _oSteeringWheel.scaleX = iScaleValue;
        _oSteeringWheel.scaleY = iScaleValue;
    };

    this.onLeftSteeringWheelDown = function() {
        createjs.Tween.get(_oSteeringWheel, {
            override: true
        }).to({
            rotation: -90
        }, (500)).call(function() {});
        s_oGame.onLeftSteeringWheelDown();
    };

    this.onLeftSteeringWheelUp = function() {
        createjs.Tween.get(_oSteeringWheel, {
            override: true
        }).to({
            rotation: 0
        }, (500)).call(function() {});
        s_oGame.onLeftSteeringWheelUp();
    };

    this.onRightSteeringWheelDown = function() {
        createjs.Tween.get(_oSteeringWheel, {
            override: true
        }).to({
            rotation: 90
        }, (500)).call(function() {});
        s_oGame.onRightSteeringWheelDown();
    };

    this.onRightSteeringWheelUp = function() {
        createjs.Tween.get(_oSteeringWheel, {
            override: true
        }).to({
            rotation: 0
        }, (500)).call(function() {});
        s_oGame.onRightSteeringWheelUp();
    };

    this.unload = function() {
        _oCotnainer.removeChildren(_oSteeringWheel, _oLeftSteeringWheelShape, _oRightSteeringWheelShape);
        _oLeftSteeringWheelShape.off("mousedown", this.onLeftSteeringWheelDown);
        _oLeftSteeringWheelShape.off("pressup", this.onLeftSteeringWheelUp);
        _oRightSteeringWheelShape.off("mousedown", this.onRightSteeringWheelDown);
        _oRightSteeringWheelShape.off("pressup", this.onRightSteeringWheelUp);
    };

    this._init();

}