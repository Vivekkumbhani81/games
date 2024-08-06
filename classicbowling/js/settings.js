var CANVAS_WIDTH = 790;
var CANVAS_HEIGHT = 1410;

var CANVAS_WIDTH_HALF = CANVAS_WIDTH * 0.5;
var CANVAS_HEIGHT_HALF = CANVAS_HEIGHT * 0.5;

var EDGEBOARD_X = 150;
var EDGEBOARD_Y = 212;

var DISABLE_SOUND_MOBILE = false;
var FONT_GAME = "Arial";
var SECONDARY_FONT = "blackplotanregular";

var MS_FADE_SOUNDTRACK = 750;

var FPS = 30;

var FPS_DESKTOP = 60;

var FPS_TIME = 1 / FPS;

var ROLL_BALL_RATE = 60 / FPS;

var TIME_REFRESH_DIRECTION = 0.05;

var TIME_RESET_LAUNCH = 3;

var DIRECTION_VELOCITY = -2;

var DIRECTION_CHARACTER_VELOCITY = 6;

var LAUNCH_TURN = 10;

var TURNS_BOARD_POS = {
    x: 0,
    y: 362
};

var NUM_SPRITE_MONITOR = 52;

var NUM_SPRITE_PLAYER = 36;

var CHARACTER_START_POS = {
    x: 40,
    y: 702
};

var STATE_LOADING = 0;
var STATE_MENU = 1;
var STATE_HELP = 1;
var STATE_GAME = 3;

var ON_MOUSE_DOWN = 0;
var ON_MOUSE_UP = 1;
var ON_MOUSE_OVER = 2;
var ON_MOUSE_OUT = 3;
var ON_DRAG_START = 4;
var ON_DRAG_END = 5;
var ON_TWEEN_ENDED = 6;
var ON_BUT_NO_DOWN = 7;
var ON_BUT_YES_DOWN = 8;

var STEP_RATE = 1;

var TEXT_SIZE = [80, 100, 130];

var TEXT_EXCELLENT_COLOR = ["#fff", "#5d96fe"];

var TEXT_COLOR = "#ffffff";

var TEXT_COLOR_STROKE = "#000000";

var TIME_INTERVAL_STROBE = 0.2;

var PHYSICS_ACCURACY = 3;

var BALL_VELOCITY_MULTIPLIER = 1;

var PHYSICS_STEP = 1 / (FPS * STEP_RATE);

var STATE_INIT = 0;
var STATE_PLAY = 1;
var STATE_FINISH = 2;
var STATE_PAUSE = 3;

var TIME_REFRESH_POSITION;

var MONITOR_STRIKE = 0;
var MONITOR_SPARE = 1;
var MONITOR_GUTTER = 2;

var BALL_MASS = 7 * 7;

var BALL_RADIUS = 12.5;

var BALL = 0;

var PINS = 1;

var WALL = 2;

var FLOOR = 3;

var CHANNEL = 4;

var PINS_FLOOR = 4;

var WALL_TRACK = 5;

var SIDE_PINS_FLOOR = 6;

var BALL_LINEAR_DAMPING = 0.0;

var OFFSET_BALL_POS_X = 10;

var OBJECT;

var MIN_BALL_VEL_ROTATION = 0.1;

var FOV = 40;

var INTERVAL_SHOOT = 1;

var DIRECTION = 0;

var POWER = 1;

var EFFECT = 2;

var EFFECT_POWER_RATE = -(0.4 * STEP_RATE);

var MIN_FORCE_BALL_GUTTER = -30;

var MAX_EFFECT_ANGLE = 45;

var MONITOR_WAIT_TIME = 1;

var LIMIT_HAND_RANGE_POS = {
    x: 35.2
};

var POSITION_BALL = {
    x: 0,
    y: 900,
    z: -7 + BALL_RADIUS
};

var GOAL_LINE_POS = {
    x: 0,
    y: 31,
    z: -2.7
};

var HAND_KEEPER_SIZE = {
    width: 1.8,
    depth: 0.5,
    height: 1.5
};

var WALL_PINS_SIZE = {
    width: 80,
    depth: 1,
    height: 150
};

var WALL_PINS_DOWN_SIZE = {
    width: 80,
    depth: 100,
    height: 1
};

var WALL_PINS_FORWARD_SIZE = {
    width: 80,
    depth: 2,
    height: 77
};

var WALL_PINS_POSITION = {
    x: 0,
    y: -1105,
    z: -27
};

var WALL_TRACK_POSITION = {
    x: 0,
    y: 0,
    z: 20
};

var WALL_TRACK_SIZE = {
    width: 1,
    depth: 905,
    height: 100,
    offsetX: 82
};

var ROOF_TRACK_SIZE = {
    width: 82,
    depth: 70,
    height: 1,
    offsetY: -835
};

var SIDE_WALL_PINS_SIZE = {
    width: 1,
    depth: 100,
    height: 150
};

var FLOOR_PINS_SIZE = {
    width: 53,
    depth: 875,
    height: 20
};

var FLOOR_WALL_PINS_SIZE = {
    width: 80,
    depth: 1,
    height: 100
};

var FLOOR_WALL_PINS_POSITION = {
    x: 0,
    y: -765,
    z: 20
};

var FLOOR_PINS_POSITION = {
    x: 0,
    y: -39,
    z: -29
};

var PINS_BINDER_PROPERTIES = {
    width: 75,
    depth: 2,
    height: 25
};

var PINS_BINDER_POSITION = {
    x: 0,
    y: -750,
    z: 10
};

var SENSOR_POSITION = {
    x: 0,
    y: -1005,
    z: -175
};

var SENSOR_SIZE = {
    width: 75,
    depth: 95,
    height: 1
};

/*
 var FLOOR_PINS_SIZE = {width: 53, depth: 78, height: 20};
 var FLOOR_PINS_POSITION = {x: 0, y: -839, z: -29}; 
 */

var WALL_TRACK_DEPTH_SIZE = {
    width: 100,
    depth: 1,
    height: 100
};

var WALL_TRACK_DEPTH_POSITION = {
    x: 0,
    y: -914,
    z: 0
};

var FLOOR_PINS_SIDE_PROPERTIES = {
    width: 15,
    depth: FLOOR_PINS_SIZE.depth,
    height: 1,
    rot: Math.radians(0)
};

var PIN_PROPERTY = {
    radius_top: 8,
    radius_bottom: 7,
    height: 50,
    segments: 7,
    mass: 1.5875 * 1.5875,
    linearDamping: 0.01,
    angularDamping: 0.5
};

var PIN_DIAMETER = PIN_PROPERTY.radius_top * 2;

var BALL_PROPERTY = {
    mass: BALL_MASS,
    linearDamping: 0.0,
    angularDamping: 0.05
};

var OFFSET_TRACK_POSITION = {
    x: 0,
    y: 0,
    z: -9
};

var PINS_POSITION_Z = OFFSET_TRACK_POSITION.z + PIN_PROPERTY.height * 0.5;

var FIRST_PIN_POSITION = -810;

var DISTANCE_PIN_OFFSET = 0.75;

var MIN_VELOCITY_PINS = 0.1;

var DISTANCE_PIN_Y = -5;

var PIN_BINDER_TO_Y = -950;

var PINS_POSITION = [{
        x: 0,
        y: FIRST_PIN_POSITION,
        z: PINS_POSITION_Z
    }, {
        x: PIN_DIAMETER * DISTANCE_PIN_OFFSET,
        y: FIRST_PIN_POSITION + DISTANCE_PIN_Y - PIN_DIAMETER,
        z: PINS_POSITION_Z
    },
    {
        x: -PIN_DIAMETER * DISTANCE_PIN_OFFSET,
        y: FIRST_PIN_POSITION + DISTANCE_PIN_Y - PIN_DIAMETER,
        z: PINS_POSITION_Z
    }, {
        x: -PIN_DIAMETER * DISTANCE_PIN_OFFSET * 2,
        y: FIRST_PIN_POSITION + (DISTANCE_PIN_Y - PIN_DIAMETER) * 2,
        z: PINS_POSITION_Z
    },
    {
        x: 0,
        y: FIRST_PIN_POSITION + (DISTANCE_PIN_Y - PIN_DIAMETER) * 2,
        z: PINS_POSITION_Z
    }, {
        x: PIN_DIAMETER * DISTANCE_PIN_OFFSET * 2,
        y: FIRST_PIN_POSITION + (DISTANCE_PIN_Y - PIN_DIAMETER) * 2,
        z: PINS_POSITION_Z
    },
    {
        x: PIN_DIAMETER * DISTANCE_PIN_OFFSET * 3,
        y: FIRST_PIN_POSITION + (DISTANCE_PIN_Y - PIN_DIAMETER) * 3,
        z: PINS_POSITION_Z
    }, {
        x: PIN_DIAMETER * DISTANCE_PIN_OFFSET,
        y: FIRST_PIN_POSITION + (DISTANCE_PIN_Y - PIN_DIAMETER) * 3,
        z: PINS_POSITION_Z
    },
    {
        x: -PIN_DIAMETER * DISTANCE_PIN_OFFSET,
        y: FIRST_PIN_POSITION + (DISTANCE_PIN_Y - PIN_DIAMETER) * 3,
        z: PINS_POSITION_Z
    }, {
        x: -PIN_DIAMETER * DISTANCE_PIN_OFFSET * 3,
        y: FIRST_PIN_POSITION + (DISTANCE_PIN_Y - PIN_DIAMETER) * 3,
        z: PINS_POSITION_Z
    }
];

var OFFSET_FIELD_Y = 35;
var OFFSET_FIELD_X = 35;

var MAX_LAUNCH_FORCE = (BALL_MASS * 100) * 2;

var MIN_LAUNCH_FORCE = BALL_MASS * 0.8;

var FORCE_RATE = 2.5 * BALL_MASS;

var PINS_REFLECTION_LIMIT = 0.35;

var BALL_SCALE_FACTOR = 0.14;

var PIN_ALPHA_FACTOR = 0.9;

var PIN_SCALE_FACTOR = 0.3;

var SHADOW_SCALE_FACTOR = 18.5;

var FADE_PIN_FACTOR = WALL_TRACK_DEPTH_POSITION.y - 0.01;

var BOARD_SCALE_F = 0.25;

var PIN_REF_REGY_FACTOR = 20;

var BUFFER_ANIM_MONITOR = 20 * (FPS / 30);

var BUFFER_ANIM_PLAYER = FPS / 20;

var SHOW_3D_RENDER = false;

var SHOW_DEPTH_TRACK_MODEL = false;

var CAMERA_TEST_TRACKBALL = true;

var CAMERA_TEST_TRANSFORM = false;

var PIN_TEST = false;

var SHOW_PROXY_COLLISION = false;

var CAMERA_TEST_LOOK_AT = {
    x: 0,
    y: -500,
    z: -100
};

var OPACITY_INTENSITY_3D = 1;

var PINS_PROPERTIES_TEST = {
    x: 0,
    y: 250,
    z: PINS_POSITION_Z + 20
};

var BALL_Z_FORCE_RANGE = {
    min: 3,
    max: 10
};


var CAMERA_PROPERTIES = {
    x: 0,
    y: 1500,
    z: 300,
    rot_x: 105,
    rot_y: 180,
    rot_z: 0
};
var NEAR = 10,
    FAR = 4000;


var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;