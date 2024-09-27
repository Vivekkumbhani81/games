function CLevelSettings() {

    var _aCarInfos = new Array();
    var _aMyCarInfos = new Array();
    var _aObjectInLevel = new Array();
    var _aDropAreas = new Array();

    this._init = function() {
        this._initLevelObjects();
        this._initCarInfos();
        this._initDropAreas();
    };

    this._initLevelObjects = function() {

        _aObjectInLevel.push([{
                x: 331,
                y: -175,
                width: 46,
                height: 500,
                mc: "sidewalk_5",
                visible: false
            },
            {
                x: 369,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 984,
                y: 50,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 332,
                y: 493,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 310,
                y: 215,
                width: 146,
                height: 110,
                mc: "house3",
                visible: true
            },
            {
                x: 425,
                y: 330,
                width: 20,
                height: 160,
                mc: "bar3",
                visible: true
            },
            {
                x: 750,
                y: 450,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            },
            {
                x: 830,
                y: 450,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 401,
                y: -175,
                width: 46,
                height: 500,
                mc: "sidewalk_5",
                visible: false
            },
            {
                x: 399,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 984,
                y: 50,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 328,
                y: 493,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 310,
                y: 220,
                width: 146,
                height: 110,
                mc: "house3",
                visible: true
            },
            {
                x: 425,
                y: 335,
                width: 20,
                height: 160,
                mc: "bar3",
                visible: true
            },
            {
                x: 750,
                y: 450,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            },
            {
                x: 830,
                y: 450,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            },
            {
                x: 910,
                y: 450,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 330,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_5",
                visible: false
            },
            {
                x: 361,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 985,
                y: -180,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 331,
                y: 495,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 883,
                y: 220,
                width: 146,
                height: 110,
                mc: "house4",
                visible: true
            },
            {
                x: 893,
                y: 335,
                width: 20,
                height: 160,
                mc: "bar3",
                visible: true
            },
            {
                x: 900,
                y: 175,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            },
            {
                x: 910,
                y: 90,
                width: 32,
                height: 32,
                mc: "trash1",
                visible: true
            },
            {
                x: 944,
                y: 90,
                width: 32,
                height: 32,
                mc: "trash1",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 825,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 985,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 361,
                y: 495,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 330,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_5",
                visible: false
            },
            {
                x: 572,
                y: 40,
                width: 110,
                height: 146,
                mc: "house5",
                visible: true
            },
            {
                x: 685,
                y: 155,
                width: 160,
                height: 20,
                mc: "bar4",
                visible: true
            },
            {
                x: 390,
                y: 310,
                width: 44,
                height: 73,
                mc: "garbage_bin2",
                visible: true
            },
            {
                x: 590,
                y: 193,
                width: 75,
                height: 34,
                mc: "flowers1",
                visible: true
            },
            {
                x: 850,
                y: 90,
                width: 34,
                height: 75,
                mc: "flowers2",
                visible: true
            },
            {
                x: 420,
                y: 120,
                width: 34,
                height: 75,
                mc: "flowers1",
                visible: true
            },
            {
                x: 535,
                y: 120,
                width: 32,
                height: 32,
                mc: "trash2",
                visible: true
            },
            {
                x: 535,
                y: 155,
                width: 32,
                height: 32,
                mc: "trash2",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 331,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 985,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 361,
                y: 495,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 330,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_2",
                visible: false
            },
            {
                x: 520,
                y: 318,
                width: 339,
                height: 31,
                mc: "divider3",
                visible: true
            },
            {
                x: 885,
                y: 220,
                width: 146,
                height: 110,
                mc: "house4",
                visible: true
            },
            {
                x: 890,
                y: 335,
                width: 20,
                height: 160,
                mc: "bar3",
                visible: true
            },
            {
                x: 935,
                y: 120,
                width: 44,
                height: 73,
                mc: "garbage_bin3",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 588,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 985,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 361,
                y: 495,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 330,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_2",
                visible: false
            },
            {
                x: 543,
                y: 40,
                width: 110,
                height: 146,
                mc: "house1",
                visible: true
            },
            {
                x: 380,
                y: 61,
                width: 160,
                height: 20,
                mc: "bar1",
                visible: true
            },
            {
                x: 936,
                y: 296,
                width: 44,
                height: 73,
                mc: "garbage_bin3",
                visible: true
            },
            {
                x: 570,
                y: 190,
                width: 32,
                height: 32,
                mc: "trash1",
                visible: true
            },
            {
                x: 610,
                y: 190,
                width: 32,
                height: 32,
                mc: "trash1",
                visible: true
            },
            {
                x: 570,
                y: 285,
                width: 34,
                height: 75,
                mc: "flowers2",
                visible: true
            },
            {
                x: 675,
                y: 170,
                width: 34,
                height: 75,
                mc: "flowers2",
                visible: true
            },
            {
                x: 815,
                y: 90,
                width: 34,
                height: 75,
                mc: "flowers2",
                visible: true
            },
            {
                x: 815,
                y: 170,
                width: 34,
                height: 75,
                mc: "flowers2",
                visible: true
            },
            {
                x: 675,
                y: 415,
                width: 34,
                height: 75,
                mc: "flowers2",
                visible: true
            },
            {
                x: 675,
                y: 370,
                width: 75,
                height: 34,
                mc: "flowers1",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 351,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 985,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 809,
                y: 495,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: -72,
                y: 495,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 330,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_2",
                visible: false
            },
            {
                x: 750,
                y: 395,
                width: 110,
                height: 146,
                mc: "house1",
                visible: true
            },
            {
                x: 580,
                y: 395,
                width: 160,
                height: 20,
                mc: "bar1",
                visible: true
            },
            {
                x: 880,
                y: 440,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            },
            {
                x: 510,
                y: 450,
                width: 32,
                height: 32,
                mc: "trash2",
                visible: true
            },
            {
                x: 770,
                y: 355,
                width: 75,
                height: 34,
                mc: "flowers1",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 350,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 985,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 355,
                y: 495,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 330,
                y: -303,
                width: 46,
                height: 500,
                mc: "sidewalk_2",
                visible: false
            },
            {
                x: 330,
                y: 360,
                width: 46,
                height: 500,
                mc: "sidewalk_2",
                visible: false
            },
            {
                x: 375,
                y: 200,
                width: 20,
                height: 160,
                mc: "bar3",
                visible: true
            },
            {
                x: 400,
                y: 195,
                width: 75,
                height: 34,
                mc: "flowers1",
                visible: true
            },
            {
                x: 825,
                y: 195,
                width: 75,
                height: 34,
                mc: "flowers1",
                visible: true
            },
            {
                x: 480,
                y: 197,
                width: 339,
                height: 31,
                mc: "divider3",
                visible: true
            },
            {
                x: 480,
                y: 350,
                width: 339,
                height: 31,
                mc: "divider3",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 352,
                y: 3,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 1017,
                y: 3,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 630,
                y: 527,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: -200,
                y: 527,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: -9,
                y: 249,
                width: 46,
                height: 500,
                mc: "sidewalk_2",
                visible: false
            },
            {
                x: 460,
                y: 521,
                width: 160,
                height: 20,
                mc: "bar1",
                visible: true
            }
        ]);

        _aObjectInLevel.push([{
                x: 356,
                y: 40,
                width: 656,
                height: 46,
                mc: "sidewalk_1",
                visible: false
            },
            {
                x: 995,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_3",
                visible: false
            },
            {
                x: 538,
                y: 510,
                width: 656,
                height: 46,
                mc: "sidewalk_4",
                visible: false
            },
            {
                x: 320,
                y: 40,
                width: 46,
                height: 500,
                mc: "sidewalk_2",
                visible: false
            },
            {
                x: 655,
                y: 80,
                width: 172,
                height: 70,
                mc: "container1",
                visible: true
            },
            {
                x: 685,
                y: 320,
                width: 172,
                height: 70,
                mc: "container1",
                visible: true
            },
            {
                x: 825,
                y: 80,
                width: 172,
                height: 70,
                mc: "container3",
                visible: true
            },
            {
                x: 610,
                y: 335,
                width: 70,
                height: 172,
                mc: "container6",
                visible: true
            },
            {
                x: 360,
                y: 505,
                width: 160,
                height: 20,
                mc: "bar4",
                visible: true
            },
            {
                x: 618,
                y: 273,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            },
            {
                x: 698,
                y: 273,
                width: 73,
                height: 44,
                mc: "garbage_bin1",
                visible: true
            }
        ]);


    };

    this._initCarInfos = function() {
        _aCarInfos = new Array();

        _aCarInfos.push(null);

        _aCarInfos.push([{
                x: 917,
                y: 151,
                type: 9,
                rot: 25
            },
            {
                x: 655,
                y: 154,
                type: 10,
                rot: 25
            }
        ]);

        _aCarInfos.push([{
                x: 511,
                y: 155,
                type: 15,
                rot: -155
            },
            {
                x: 576,
                y: 154,
                type: 8,
                rot: -155
            },
            {
                x: 700,
                y: 160,
                type: 9,
                rot: -155
            },
            {
                x: 830,
                y: 160,
                type: 3,
                rot: -155
            },
            {
                x: 788,
                y: 297,
                type: 4,
                rot: -90
            }
        ]);

        _aCarInfos.push([{
                x: 955,
                y: 347,
                type: 5,
                rot: 0
            },
            {
                x: 650,
                y: 425,
                type: 7,
                rot: 0
            },
            {
                x: 475,
                y: 345,
                type: 2,
                rot: -90
            }
        ]);

        _aCarInfos.push([{
                x: 829,
                y: 134,
                type: 1,
                rot: 0
            },
            {
                x: 772,
                y: 133,
                type: 5,
                rot: 0
            },
            {
                x: 568,
                y: 131,
                type: 3,
                rot: 0
            },
            {
                x: 690,
                y: 285,
                type: 6,
                rot: -90
            },
            {
                x: 409,
                y: 398,
                type: 4,
                rot: 0
            }
        ]);

        _aCarInfos.push([{
                x: 410,
                y: 330,
                type: 12,
                rot: 0
            },
            {
                x: 616,
                y: 252,
                type: 10,
                rot: 90
            },
            {
                x: 798,
                y: 386,
                type: 2,
                rot: 0
            },
            {
                x: 860,
                y: 426,
                type: 13,
                rot: 0
            },
            {
                x: 892,
                y: 138,
                type: 14,
                rot: 0
            }
        ]);

        _aCarInfos.push([{
                x: 594,
                y: 130,
                type: 2,
                rot: 0
            },
            {
                x: 819,
                y: 130,
                type: 9,
                rot: 0
            },
            {
                x: 875,
                y: 130,
                type: 5,
                rot: 0
            },
            {
                x: 620,
                y: 250,
                type: 12,
                rot: -90
            },
            {
                x: 525,
                y: 376,
                type: 3,
                rot: 0
            }
        ]);

        _aCarInfos.push([{
                x: 870,
                y: 277,
                type: 16,
                rot: 0
            },
            {
                x: 940,
                y: 435,
                type: 17,
                rot: 56
            }
        ]);

        _aCarInfos.push([{
                x: 428,
                y: 122,
                type: 8,
                rot: 180
            },
            {
                x: 598,
                y: 120,
                type: 9,
                rot: -175
            },
            {
                x: 708,
                y: 110,
                type: 15,
                rot: -7.5
            },
            {
                x: 827,
                y: 93,
                type: 1,
                rot: 0
            },
            {
                x: 972,
                y: 110,
                type: 12,
                rot: 0
            },
            {
                x: 427,
                y: 250,
                type: 10,
                rot: 0
            },
            {
                x: 672,
                y: 280,
                type: 13,
                rot: 0
            },
            {
                x: 765,
                y: 260,
                type: 2,
                rot: 0
            },
            {
                x: 825,
                y: 275,
                type: 11,
                rot: 0
            },
            {
                x: 944,
                y: 280,
                type: 16,
                rot: 0
            },
            {
                x: 484,
                y: 365,
                type: 5,
                rot: 0
            },
            {
                x: 538,
                y: 403,
                type: 17,
                rot: 180
            },
            {
                x: 596,
                y: 380,
                type: 4,
                rot: 0
            },
            {
                x: 766,
                y: 407,
                type: 3,
                rot: 180
            },
            {
                x: 935,
                y: 375,
                type: 7,
                rot: 0
            }
        ]);

        _aCarInfos.push([{
                x: 614,
                y: 115,
                type: 7,
                rot: 60
            },
            {
                x: 580,
                y: 445,
                type: 6,
                rot: 180
            },
            {
                x: 465,
                y: 135,
                type: 12,
                rot: 48
            }
        ]);

        //INFO FOR PLAYER CAR
        _aMyCarInfos = new Array();

        _aMyCarInfos.push({
            x: 570,
            y: 440,
            type: 2,
            rot: 90
        });
        _aMyCarInfos.push({
            x: 520,
            y: 415,
            type: 1,
            rot: 90
        });
        _aMyCarInfos.push({
            x: 820,
            y: 422,
            type: 5,
            rot: -90
        });
        _aMyCarInfos.push({
            x: 743,
            y: 250,
            type: 9,
            rot: 180
        });
        _aMyCarInfos.push({
            x: 815,
            y: 419,
            type: 8,
            rot: -90
        });
        _aMyCarInfos.push({
            x: 461,
            y: 155,
            type: 8,
            rot: 166
        });
        _aMyCarInfos.push({
            x: 680,
            y: 337,
            type: 10,
            rot: 40
        });
        _aMyCarInfos.push({
            x: 473,
            y: 280,
            type: 15,
            rot: 90
        });
        _aMyCarInfos.push({
            x: 400,
            y: 430,
            type: 14,
            rot: 24
        });
        _aMyCarInfos.push({
            x: 450,
            y: 340,
            type: 18,
            rot: 0
        });
    };

    this._initDropAreas = function() {
        _aDropAreas = new Array();

        _aDropAreas.push({
            mc: 1,
            width: 55,
            height: 133,
            x: 701,
            y: 85
        });

        _aDropAreas.push({
            mc: 2,
            width: 124,
            height: 124,
            x: 725,
            y: 87
        });

        _aDropAreas.push({
            mc: 2,
            width: 124,
            height: 124,
            x: 708,
            y: 87
        });

        _aDropAreas.push({
            mc: 3,
            width: 133,
            height: 55,
            x: 388,
            y: 433
        });

        _aDropAreas.push({
            mc: 1,
            width: 55,
            height: 133,
            x: 632,
            y: 87
        });

        _aDropAreas.push({
            mc: 1,
            width: 55,
            height: 133,
            x: 925,
            y: 87
        });

        _aDropAreas.push({
            mc: 1,
            width: 55,
            height: 133,
            x: 508,
            y: 87
        });

        _aDropAreas.push({
            mc: 3,
            width: 133,
            height: 55,
            x: 408,
            y: 107
        });

        _aDropAreas.push({
            mc: 1,
            width: 55,
            height: 133,
            x: 511,
            y: 200
        });

        _aDropAreas.push({
            mc: 4,
            width: 203,
            height: 77,
            x: 683,
            y: 423
        });

    };

    this.getCarInfos = function(iLevel) {
        return _aCarInfos[iLevel];
    };

    this.getMyCarInfos = function(iLevel) {
        return _aMyCarInfos[iLevel];
    };

    this.getLevelObjects = function(iLevel) {
        return _aObjectInLevel[iLevel];
    };

    this.getDropArea = function(iLevel) {
        return _aDropAreas[iLevel];
    };

    this.getCarX = function(iLevel, i) {
        return _aCarInfos[iLevel][i].x;
    };

    this.getCarY = function(iLevel, i) {
        return _aCarInfos[iLevel][i].y;
    };

    this.getMyCarX = function(iLevel) {
        return _aMyCarInfos[iLevel].x;
    };

    this.getMyCarY = function(iLevel) {
        return _aMyCarInfos[iLevel].y;
    };

    this.getNumLevels = function(i) {
        return _aMyCarInfos.length;
    };
    this._init();

    return this;
};