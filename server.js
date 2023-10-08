/**
 * Dinogen Online - Multiplayer Server
 * ©2023 Wilkin Games
 * https://wilkingames.com - https://dinogenonline.com
 */
const chalk = require("chalk");
const log = console.log;
const URL_API = "https://xwilkinx.com/data/dinogen/account.txt";
var settings = require("./settings.json");
var stats = require("./stats.json");
var gameInstance = require("./assets/js/game");
const GameUtil = {
    RandomId: () => 
    {
        return Math.random().toString(36).substring(2, 10);
    },   
    FormatNum: (_num) =>
    {
        if (isNaN(_num) || _num == null)
        {
            return "0";
        }
        return _num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    ConvertToTimeString: (_seconds) =>
    {
        _seconds = Math.max(0, Math.ceil(_seconds));
        var s = _seconds % 60;
        var ms = (_seconds % 1) * 100;
        var m = Math.floor((_seconds % 3600) / 60);
        var h = Math.floor(_seconds / (60 * 60));
        var hourStr = (h == 0) ? "" : doubleDigitFormat(h) + ":";
        var minuteStr = doubleDigitFormat(m) + ":";
        var secondsStr = doubleDigitFormat(s);
        function doubleDigitFormat(_num)
        {
            if (_num < 10) 
            {
                return ("0" + _num);
            }
            return String(_num);
        }
        return hourStr + minuteStr + secondsStr;
    }
}
const MathUtil = {
    Random: (_min, _max) =>
    {
        return Math.floor(Math.random() * (_max - _min + 1)) + _min;
    },
    RandomBoolean: ()  =>
    {
        return Math.random() >= 0.5;
    }
};
const EventUtil = {
    IsHalloween: () =>
    {
        var date = new Date(Date.now());
        return (date.getMonth() == 9 && date.getDate() == 31);
    },
    IsChristmas: () =>
    {
        var date = new Date(Date.now());
        return (date.getMonth() == 11 && date.getDate() == 25);
    },
    IsFriday13th: () =>
    {
        var date = new Date(Date.now());
        return (date.getDate() == 13 && date.getDay() == 5);
    },
    IsGoodFriday: () =>
    {
        var date = new Date(Date.now());
        return (date.getMonth() == 4 && date.getDate() >= 7 && date.getDate() <= 8);
    },
    IsThanksgiving: () =>
    {
        var date = new Date(Date.now());
        return (date.getMonth() == 10 && date.getDate() >= 24 && date.getDate() < 28);
    }
};
const ServerData = {
    VERSION: "1.0.6",
    GAME_VERSION: "1.0.9"
};
const Lobby = {
    COUNTDOWN_INTERMISSION: 10,
    COUNTDOWN_PREPARING: 30,
    COUNTDOWN_STARTING: 3,
    COUNTDOWN_END: 15,
    JOIN_SUCCESS: "LOBBY_JOIN_SUCCESS",
    JOIN_FAIL_LOCKED: "JOIN_FAIL_LOCKED",
    JOIN_FAIL_BANNED: "JOIN_FAIL_BANNED",
    JOIN_FAIL_CAPACITY: "JOIN_FAIL_CAPACITY",
    JOIN_FAIL_ERROR: "JOIN_FAIL_ERROR",
    MAX_PLAYERS: 12,
    TYPE_MIXED: "all",
    TYPE_STANDARD: "standard",
    TYPE_SURVIVAL: "survival",
    TYPE_SCENARIO: "scenario",
    TYPE_GROUND_WAR: "groundWar",
    TYPE_OPEN_WORLD: "openWorld",
    REASON_KICKED: "kicked",
    REASON_CLIENT_QUIT: "client_quit",
    REASON_LEAVE: "leave",
    REASON_PARTY_HOST_LEAVE: "party_host_leave",
    REASON_LOBBY_REMOVED: "lobby_removed"
};
const LobbyState = {
    INTERMISSION: "intermission",
    WAITING_HOST: "waiting_host",
    WAITING: "waiting",
    PREPARING: "preparing",
    STARTING: "starting",
    IN_PROGRESS: "in_progress"
};
const GameMode = {
    SCENARIO: "scenario",
    FREE_FOR_ALL: "deathmatch",
    TEAM_DEATHMATCH: "team_deathmatch",
    DOMINATION: "domination",
    CONQUEST: "conquest",
    TYRANT: "tyrant",
    EVOLUTION: "evolution",
    DINO_RESCUE: "dino_rescue",
    EXTRACTION: "extraction",
    RAPTOR_HUNT: "raptor_hunt",
    HUMANS_VS_DINOSAURS: "humans_vs_dinosaurs",
    DESTRUCTION: "destruction",
    CAPTURE_THE_FLAG: "capture_the_flag",
    SURVIVAL_CHAOS: "survival_chaos",
    SURVIVAL_DINO: "survival_dino",
    SURVIVAL_MILITIA: "survival_militia",
    SURVIVAL_ZOMBIE: "survival_zombie",
    SURVIVAL_CHICKEN: "survival_chicken",
    SURVIVAL_PANDEMONIUM: "survival_pandemonium",
    OPEN_WORLD: "open_world"
};
const Map = {
    RANDOM: "map_random",
    RIVERSIDE: "map_riverside",
    COMPLEX: "map_complex",
    DISTRICT: "map_district",
    SANDSTORM: "map_sandstorm",
    HEXAGON: "map_hexagon",
    FIRING_RANGE: "map_firing_range",
    FIELD: "map_field",
    FACILITY: "map_facility",
    CAMPSITE: "map_campsite",
    VILLA: "map_villa",
    LABORATORY: "map_laboratory",
    OASIS: "map_oasis",
    COMPOUND: "map_compound",
    ATRIUM: "map_atrium",
    GENERATED: "map_generated"
};
const BotSkill = {
    AUTO: -1,
    EASY: 0,
    NORMAL: 1,
    HARD: 2,
    INSANE: 3,
    GOD: 4
};
const GameServer = {
    EVENT_ERROR: 0,
    EVENT_BATCH: 1,
    EVENT_GAME_INIT: 2,
    EVENT_GAME_TIMER: 3,
    EVENT_GAME_PRE_TIMER: 4,
    EVENT_GAME_START: 5,
    EVENT_GAME_END: 6,
    EVENT_GAME_UPDATE: 7,
    EVENT_PLAYER_JOIN: 8,
    EVENT_PLAYER_LEAVE: 9,
    EVENT_PLAYER_UPDATE: 10,
    EVENT_SPAWN_CHARACTER: 11,
    EVENT_OBJECT_UPDATE: 12,
    EVENT_PLAYER_INPUT: 13,
    EVENT_PLAYER_TRIGGER_WEAPON: 14,
    EVENT_PAWN_DAMAGE: 19,
    EVENT_PAWN_DIE: 20,
    EVENT_PAWN_ACTION: 21,
    EVENT_PLAYER_MULTI_KILL: 35,
    EVENT_PLAYER_INTERACT: 38,
    EVENT_PLAYER_UPDATE_INVENTORY: 39,
    EVENT_PLAYER_TRIGGER_EQUIPMENT: 41,
    EVENT_PLAYER_TRIGGER_GRENADE: 43,
    EVENT_KILLFEED_ADD: 45,
    EVENT_MESSAGE_ADD: 46,
    EVENT_SPAWN_OBJECT: 47,
    EVENT_SPAWN_BULLET: 48,
    EVENT_SPAWN_EXPLOSION: 49,
    EVENT_GAME_PAUSE: 50,
    EVENT_REMOVE_OBJECT: 61,
    PAWN_FIRE_WEAPON: 1,
    PAWN_HIT_SHIELD: 2,
    PAWN_START_REVIVE: 3,
    PAWN_END_REVIVE: 4,
    PAWN_SHARED_CRATE: 5,
    PAWN_STOLE_CRATE: 6,
    PAWN_START_INTERACTION: 7,
    PAWN_NO_AMMO: 8,
    PAWN_OPEN_LAPTOP: 9,
    PAWN_ON_FIRE: 10,
    PAWN_STUN: 11,
    PAWN_FLASH: 12,
    PAWN_FREEZE: 13,
    PAWN_SET_JAMMED: 14,
    PAWN_UPDATE_DOOR: 15,
    PAWN_INVESTIGATE: 16,
    PAWN_TROPHY_HIT: 17,
    PAWN_START_SHIELD_COOLDOWN: 18,
    PAWN_END_SHIELD_COOLDOWN: 19,
    PAWN_END_FIRE_DELAY: 20,
    PAWN_END_BOLT_DELAY: 21,
    PAWN_END_THROW_DELAY: 22,
    PAWN_END_EQUIPMENT_DELAY: 23,
    PAWN_END_MELEE_DELAY: 24,
    PAWN_RELOAD_COMPLETE: 25,
    PAWN_CLOSE_LAPTOP: 26,
    PAWN_START_FLAME: 27,
    PAWN_END_FLAME: 28,
    PAWN_RELOAD: 29,
    PAWN_PULL_BOLT: 30,
    PAWN_CANCEL_RELOAD: 31,
    PAWN_CANCEL_BOLT_PULL: 32,
    PAWN_THROW_GRENADE: 33,
    PAWN_USE_STIM: 34,
    PAWN_RECEIVE_STIM: 35,
    PAWN_PLACE_EQUIPMENT: 36,
    PAWN_MELEE_ATTACK: 37,
    PAWN_FIRE_MELEE: 38,
    PAWN_FIRE_ROCKET: 39,
    PAWN_TRIGGER_MINE: 40,
    PAWN_END_INTERACTION: 41,
    PAWN_JUMP: 42,
    PAWN_ON_BOOST: 43,
    PAWN_START_LADDER_CLIMB: 44,
    PAWN_LEAVE_LADDER: 45,
    PAWN_DROP_CRATE: 46,
    PAWN_FLAG: 47,
    PAWN_HIT: 48,
    PAWN_VEHICLE_START: 49,
    PAWN_VEHICLE_LEAVE: 50,
    INV_CLASS_DATA: 1,
    INV_CURRENT_INVENTORY_INDEX: 2,
    INV_FIRE: 3,
    INV_PERK_ADD: 4,
    INV_PERKS: 5,
    INV_PERKS_SET: 6,
    INV_MOD_SET: 7,
    INV_EQUIPMENT_SET: 8,
    INV_EQUIPMENT_ADD: 9,
    INV_AMMO: 10,
    INV_AMMO_ADD: 11,
    INV_MAG: 12,
    INV_MAG_ADD: 13,
    INV_BURSTS: 14,
    INV_BURSTS_ADD: 15,
    INV_ITEM: 16,
    INV_ITEM_ADD: 17,
    INV_ITEM_REPLACE: 18,
    INV_INVENTORY_REPLACE: 19,
    INV_INVENTORY: 21,
    INV_EQUIPMENT: 22
};
const Character = {
    INDEX_MELEE: 2,
    INDEX_EQUIPMENT: 3,
    INDEX_GRENADE: 4,
    STYLE_DINOGEN: "dinogen",
    STYLE_MILITIA: "militia",
    STYLE_JUGGERNAUT: "juggernaut",
    HAIR_COLOUR_BROWN: "HAIR_COLOUR_BROWN",
    HAIR_COLOUR_BROWN_LIGHT: "HAIR_COLOUR_BROWN_LIGHT",
    HAIR_COLOUR_BLACK: "HAIR_COLOUR_BLACK",
    HAIR_COLOUR_BLONDE: "HAIR_COLOUR_BLONDE",
    HAIR_COLOUR_GINGER: "HAIR_COLOUR_GINGER",
    HAIR_COLOUR_GREY: "HAIR_COLOUR_GREY",
    HAIR_COLOUR_WHITE: "HAIR_COLOUR_WHITE",
    HAIR_COLOUR_RED: "HAIR_COLOUR_RED",
    HAIR_COLOUR_BLUE: "HAIR_COLOUR_BLUE",
    HAIR_COLOUR_GREEN: "HAIR_COLOUR_GREEN",
    FACE_DEFAULT: "face0000",
    FACE_TAN: "face0001",
    FACE_DARK: "face0002",
    FACE_FEMALE: "face0009",
    FACE_ZOMBIE_1: "face0003",
    FACE_ZOMBIE_2: "face0004",
    FACE_ZOMBIE_3: "face0005",
    FACE_ZOMBIE_4: "face0006",
    FACE_ZOMBIE_FAT: "face0007",
    FACE_ZOMBIE_EXPLODER: "face0008",
    FACE_ZOMBIE_SPITTER: "face0009",
    FACE_ZOMBIE_SPRINTER: "face0010",
    FACE_ZOMBIE_SPRINTER_BOSS: "face0011",
    FACE_INFESTOR: "face00012",  
    HAIR_SHORT: "hair0000",
    HAIR_BALD: "hair0008",
    HAIR_LONG: "hair0002",
    HAIR_PONYTAIL: "hair0003",
    HAIR_UNDERCUT: "hair0006",
    HAIR_SPIKES: "hair0005",
    HAIR_BUZZED: "hair0004",
    HAIR_FLAT: "hair0001",
    HAIR_STYLED: "hair0007",
    HAIR_HORSESHOE: "hair0009",
    HAIR_MOHAWK: "hair0010",
    BEARD_NONE: "beard0000",
    BEARD_STUBBLE: "beard0001",
    BEARD_FULL: "beard0002",
    BEARD_CIRCLE: "beard0003",
    BEARD_GOATEE: "beard0004",
    BEARD_MOUSTACHE: "beard0005",
    BEARD_SIDEBURNS: "beard0006",
    EYEWEAR_NONE: "eyewear0000",
    EYEWEAR_SHADES: "eyewear0001",
    EYEWEAR_GLASSES: "eyewear0002",
    EYEWEAR_GOGGLES_YELLOW: "eyewear0003",
    EYEWEAR_GOGGLES_ORANGE: "eyewear0004",
    EYEWEAR_GOGGLES_WHITE: "eyewear0005",
    EYEWEAR_GOGGLES_BLACK: "eyewear0006",
    FACEWEAR_NONE: "facewear0000",
    FACEWEAR_MASK: "facewear0001",
    FACEWEAR_SKULLMASK: "facewear0002",
    FACEWEAR_GHILLIE: "facewear0003",
    FACEWEAR_SCARF_OPFOR: "facewear0004",
    FACEWEAR_BALACLAVA: "facewear0005",
    FACEWEAR_SCARF_SPETSNAZ: "facewear0006",
    FACEWEAR_BANDANA: "facewear0007",
    FACEWEAR_GAS_MASK: "facewear0008",
    FACEWEAR_BANDANA_GENERIC: "facewear0009",
    FACEWEAR_GAITER: "facewear0010",
    FACEWEAR_TWOPLAYER: "facewear0019",
    HEAD_ERIC_HELMET: "head0082",
    HEAD_AETIC: "head0089",
    HEAD_NONE: "head0000",
    HEAD_MASK: "head0001",
    HEAD_GAS_MASK: "head0002",
    HEAD_RADIO: "head0003",
    HEAD_US_MASK: "head0004",
    HEAD_US_CAP: "head0005",
    HEAD_US_CAP_BACKWARDS: "head0006",
    HEAD_US_SPEC_OPS: "head0007",
    HEAD_US_HELMET: "head0008",
    HEAD_US_HELMET_TACTICAL: "head0009",
    HEAD_US_BOONIE: "head0010",
    HEAD_US_GHILLIE: "head0011",
    HEAD_GIGN_HELMET: "head0012",
    HEAD_GIGN_HELMET_2: "head0013",
    HEAD_GIGN_CAP: "head0014",
    HEAD_GSG9_HELMET: "head0015",
    HEAD_GSG9_HELMET_2: "head0016",
    HEAD_GSG9_HELMET_3: "head0017",
    HEAD_OPFOR_SCARF: "head0018",
    HEAD_OPFOR_HELMET: "head0019",
    HEAD_OPFOR_HELMET_2: "head0020",
    HEAD_OPFOR_BERET: "head0021",
    HEAD_OPFOR_SHADES: "head0022",
    HEAD_OPFOR_COMMANDER: "head0023",
    HEAD_RU_MASK: "head0024",
    HEAD_RU_HAT: "head0025",
    HEAD_RU_SCARF: "head0026",
    HEAD_RU_TOQUE: "head0027",
    HEAD_RU_BERET: "head0028",
    HEAD_RU_CAP: "head0029",
    HEAD_RU_RECON: "head0030",
    HEAD_RU_HELMET: "head0031",
    HEAD_MILITIA_RADIO: "head0032",
    HEAD_MILITIA_BAND: "head0033",
    HEAD_MILITIA_BANDANA: "head0034",
    HEAD_MILITIA_CAP: "head0035",
    HEAD_MILITIA_SNIPER: "head0036",
    HEAD_JUGGERNAUT_HELMET: "head0037",
    HEAD_RIOT_HELMET: "head0055",
    HEAD_RIOT_HELMET_VISOR_UP: "head0056",
    HEAD_UN_BERET: "head0057",
    HEAD_UN_HELMET: "head0058",
    HEAD_NIGHTVISION: "head0059",
    HEAD_ALTYN_HELMET: "head0060",
    HEAD_ALTYN_HELMET_VISOR_UP: "head0061",
    HEAD_HOOD: "head0062",
    HEAD_BALLISTIC_MASK_BLACK: "head0045",
    HEAD_BALLISTIC_MASK_WHITE: "head0046",
    BODY_DINOGEN: "body0000",
    BODY_MILITIA: "body0001",
    BODY_DINOGEN_RIG: "body0003",
    BODY_DINOGEN_HEAVY: "body0006",
    BODY_MILITIA_RIG: "body0004",
    BODY_MILITIA_HEAVY: "body0007",
    BODY_JUGGERNAUT: "body0002",
    BODY_SHIRTLESS: "body0005",
};
log(chalk.bgBlue("Dinogen Online | Multiplayer Server | " + ServerData.VERSION + " | Game Version: " + ServerData.GAME_VERSION));
var serverStartTime = Date.now();
log("Started:", (new Date(serverStartTime).toString()));
log(settings, "\n");

log(chalk.yellow("Loading modules..."));
const { exec } = require("child_process");
const fs = require("fs");
const hathora = require("@hathora/hathora-cloud-sdk");
const cors = require("cors");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const customParser = require("socket.io-json-parser");
const { Server } = require("socket.io");
const io = new Server(server, {
    parser: customParser,    
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const os = require("os-utils");
//const heapdump = require("heapdump");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const chatLimiter = new RateLimiterMemory({
    points: 5,
    duration: 5
});
const updateLimiter = new RateLimiterMemory({
    points: 60,
    duration: 1
});
const fetch = require("node-fetch");
const smile = require("smile2emoji");
const p2 = require("p2");
const astar = require("javascript-astar");
const shared = require("./assets/json/shared.json");
const bots = require("./assets/json/bots.json");
const openWorld = require("./assets/json/openWorld.json");
const sprites = require("./assets/json/sprites.json");
const weapons_world = require("./assets/images/world/atlas_weapons_world.json");
const weapons = require("./assets/json/weapons.json");
const items = require("./assets/json/items.json");
const vehicles = require("./assets/json/vehicles.json");
const mods = require("./assets/json/mods.json");
const modes = require("./assets/json/modes.json");
const maps = require("./assets/json/maps.json");
var allMaps = [];
for (var i = 0; i < maps.length; i++)
{
    let id = maps[i].id;
    try
    {
        allMaps.push(require("./assets/json/maps/" + id + ".json"));
    }
    catch (e)
    {
        console.warn("Missing map:", id);
    }
}
log("Loaded", allMaps.length, "maps");
log(chalk.green("Done"));

var chatHistory = [];

//Stats
function incrementStat(_id)
{
    if (!stats)
    {
        stats = {};
    }
    if (stats[_id] == null)
    {
        stats[_id] = 0;
    }
    stats[_id]++;
    if (settings.bPersistentStats)
    {
        try
        {
            JSON.stringify(stats);
        }
        catch (e)
        {
            console.warn("Invalid stats JSON:", stats);
        }
        try
        {
            let data = JSON.stringify(stats);
            fs.writeFile("stats.json", data, (e) =>
            {
                if (e) 
                {
                    console.warn(e);
                    return;
                }
            });
        }
        catch (e)
        {
            console.warn(e);
        }
    }
}
function addReportedPlayer(_reportedPlayer, _reporterPlayer)
{
    if (!stats || !_reportedPlayer || !_reporterPlayer)
    {
        return;
    }
    if (!stats.reported)
    {
        stats.reported = [];
    }
    var report = {
        id: getRandomUniqueId(),
        reported: {
            username: _reportedPlayer.username,
            steamId: _reportedPlayer.steamId,
        },
        reporter: {
            username: _reporterPlayer.username,
            steamId: _reporterPlayer.steamId,
        },
        date: Date.now()
    };
    stats.reported.push(report);
    if (settings.bPersistentStats)
    {
        let data = JSON.stringify(stats);
        fs.writeFile("stats.json", data, (e) =>
        {
            if (e) 
            {
                console.warn(e);
                return;
            }
        });
    }
    return report.id;
}
function clearStats()
{
    stats = {};
    log("Stats cleared");
}

app.use(express.static(__dirname + "/public_html"));
app.use(cors({
    origin: "*"
}));

app.get("/", (req, res) =>
{
    var str = "<head>"; 
    str += "<title>[Dinogen Online] " + settings.name + "</title></head><body><h1>Dinogen Online</h1><h3>MULTIPLAYER SERVER</h3>";
    str += "<link href='/styles/server.css' rel='stylesheet'>";
    str += "<b>" + getNumClients() + "</b> online | <b>" + getNumRealClients() + "</b> players";
    str += "<hr>";    
    var upTime = convertMS(Date.now() - serverStartTime);
    str += "<b>Uptime:</b> " + upTime.day + "d " + upTime.hour + "h " + upTime.minute + "m " + upTime.seconds + "s<br>";
    str += "<b>Server Version:</b> " + ServerData.VERSION + "<br>";
    str += "<b>Required Game Version:</b> " + ServerData.GAME_VERSION;
    if (settings && 0)
    {
        str += "<hr>";
        var keys = Object.keys(settings);
        for (var i = 0; i < keys.length; i++)
        {
            var key = keys[i];
            str += "<b>" + key + ":</b> " + settings[key];
            if (i < keys.length - 1)
            {
                str += "<br>";
            }
        }
    }    
    str += "<hr>";
    var keys = Object.keys(stats);
    for (var i = 0; i < keys.length; i++)
    {
        var key = keys[i];
        str += "<b>" + key + ":</b> " + stats[key];
        if (i < keys.length - 1)
        {
            str += "<br>";
        }
    }
    var clients = getClients();
    if (clients.length > 0)
    {
        str += "<hr>";
        str += "<div><table style='width:100%'><tr><th>Index</th><th>Username</th><th>Name</th><th>Steam ID</th><th>Status</th><th>Time Online</th><th>Ping</th></tr>";
        for (let i = 0; i < clients.length; i++)
        {
            let client = clients[i];
            if (client)
            {
                str += "<tr><td>" + i + "</td>";
                let username = (client.username ? ("<a href='https://dinogenonlinedata.w3spaces.com/data.html?uname=" + client.username + "'>" + client.username + "</a>") : "-");
                str += "<td>" + username + (client.bAdmin ? " [ADMIN]" : "") + "</td>";
                str += "<td>" + (client.name ? client.name : "-") + "</td>";
                str += "<td>" + (client.steamId ? ("<a href='https://steamcommunity.com/profiles/" + client.steamId + "'>" + client.steamId + "</a>") : "-") + "</td>";
                str += "<td>";
                str += client.bInGame ? (client.gameModeId ? (client.gameModeId + " on " + client.mapId) : "In Game") : (client.menu ? client.menu : "-");
                str += "</td>";
                str += "<td>";
                str += (client.date ? GameUtil.ConvertToTimeString((Date.now() - client.date) / 1000) : "-");
                str += "</td>";
                str += "<td>";
                if (client.bBot)
                {
                    str += "Bot";
                }
                else if (client.ping != null)
                {
                    str += client.ping + " ms";
                }
                else 
                {
                    str += "-";
                }
                str += "</td>"
                str += "</tr>";
            }
        }
    }
    /*
    if (clients.length > 0)
    {
        str += "<hr>";
        for (var i = 0; i < clients.length; i++)
        {
            var client = clients[i];
            if (client)
            {
                str += i + " | " + client.name + " | " + (client.bBot ? "🤖" : (client.username ? client.username : "Guest")) + (client.ping != null ? (" | " + client.ping + "ms") : "") + "<br>";
            }
        }        
    }
    */
    str += "</body>";
    res.send(str);
});
app.get("/data", (req, res) =>
{
    var data = {
        time: Date.now(),
        version: ServerData.VERSION,
        gameVersion: ServerData.GAME_VERSION,
        name: settings.name,
        country: settings.country,
        region: settings.region,
        host: settings.host,
        numPlayers: getNumClients(),
        maxPlayers: settings.maxPlayers,
        bDisableCustomLobbies: settings.bDisableCustomLobbies,
        bSingleGame: settings.bSingleGame
    };
    if (settings.bSingleGame)
    {
        var lobby = lobbies[0];
        if (lobby && lobby.game)
        {
            data.gameModeId = lobby.gameData.gameModeId;
            data.mapId = lobby.gameData.mapId;
        }
    }
    res.send(data);
});
app.get("/stats", (req, res) =>
{
    res.send(stats);
});
app.get("/settings", (req, res) =>
{
    res.send(settings);
});

io.on("connection", (socket) =>
{   
    if (getNumClients() > settings.maxPlayers)
    {
        socket.emit("showWindow", {
            id: "mp_max_players",
            titleText: "STR_MULTIPLAYER",
            messageText: "STR_SERVER_FULL_DESC",
            type: "TYPE_MESSAGE",
            bShowOkayButton: true
        });
        disconnectSocket(socket, { reason: "max_players" });
        return;
    }

    log(chalk.cyan(socket.id), chalk.green("Connected"));
    incrementStat("playersConnected");

    socket.player = {
        id: (socket.id).substr(2, 6),
        name: "Player",
        level: 0,
        date: Date.now()
    };   

    var serverData = {
        name: settings.name,
        url: settings.url,
        country: settings.country,
        port: settings.port,
        bDisableCustomLobbies: settings.bDisableCustomLobbies == true,
        bSingleGame: settings.bSingleGame == true
    }
    socket.emit("updateServer", serverData); 
    socket.emit("chatHistory", chatHistory);    

    if (settings.welcome)
    {
        sendChatMessageToSocket(socket, {
            bServer: true,
            bDirect: true,
            locText: settings.welcome
        });
    }
    
    socket.on("ping", (_func) =>
    {
        if (typeof _func === "function")
        {
            _func();
        }
    });
    socket.on("vote", (_val) =>
    {
        log(chalk.cyan(socket.id), "vote", _val);
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby)
        {
            var votes = lobby.votes;
            if (votes)
            {
                var index = -1;
                for (var i = 0; i < votes.length; i++)
                {
                    var vote = votes[i];
                    index = vote.players.indexOf(socket.player.id);     
                    if (index >= 0)
                    {
                        var curIndex = i;
                        vote.players.splice(index, 1);                  
                    }
                }
                if (curIndex != _val)
                {
                    var cur = votes[_val];
                    if (cur)
                    {
                        cur.players.push(socket.player.id);
                    }
                }                
                io.to(lobby.id).emit("updateLobby", { votes: getClientVotes(votes) });
            }
        }
    });
    socket.on("createCustomLobby", () =>
    {
        log(chalk.cyan(socket.id), "create custom lobby");
        if (settings.bDisableCustomLobbies)
        {
            socket.emit("showWindow", {
                titleText: "STR_SERVER",
                messageText: "This server has disabled custom lobbies.",
                bShowOkayButton: true
            });
            return;
        }
        if (lobbies.length >= settings.maxLobbies)
        {
            socket.emit("showWindow", {
                titleText: "STR_SERVER",
                messageText: "This server has reached the maximum lobby capacity.",
                bShowOkayButton: true
            });
            return;
        }
        var lobby = createCustomLobby();
        if (lobby)
        {
            joinLobby(socket.player, lobby.id);
            sendChatMessageToAll({
                bServer: true,
                locText: "STR_SERVER_X_CREATED_CUSTOM_LOBBY",
                params: [socket.player.name]
            });
            incrementStat("customLobbiesCreated");
        }
        emitLobbyChange();
    });
    socket.on("join", (_data) =>
    {
        log(chalk.cyan(socket.id), "join", _data);
        if (socket.player.lobbyId)
        {
            return;
        }
        if (_data)
        {
            if (_data.lobbyId)
            {
                var lobby = getLobbyData(_data.lobbyId);
                var res = lobby ? canJoinLobby(lobby.id, socket, _data.type) : Lobby.JOIN_FAIL_ERROR;
                if (lobby && (res == Lobby.JOIN_SUCCESS || socket.player.bAdmin))
                {
                    joinLobby(socket.player, lobby.id);
                }
                else
                {
                    if (!lobby)
                    {
                        socket.emit("showWindow", {
                            titleText: "STR_ERROR",
                            messageText: "STR_LOBBY_NON_EXISTANT_DESC",
                            messageParams: [_data.lobbyId],
                            highlights: [_data.lobbyId],
                            bShowOkayButton: true
                        });
                    }
                    else
                    {
                        switch (res)
                        {
                            case Lobby.JOIN_FAIL_BANNED:
                                socket.emit("showWindow", {
                                    titleText: "STR_CUSTOM_GAME",
                                    messageText: "STR_LOBBY_BANNED_DESC",
                                    bShowOkayButton: true
                                });
                                break;
                            case Lobby.JOIN_FAIL_CAPACITY:
                                socket.emit("showWindow", {
                                    titleText: "STR_CUSTOM_GAME",
                                    messageText: "STR_LOBBY_FULL_DESC",
                                    bShowOkayButton: true
                                });
                                break;
                            default:
                                socket.emit("showWindow", {
                                    titleText: "STR_CUSTOM_GAME",
                                    messageText: "STR_CUSTOM_LOBBY_LOCKED_DESC",
                                    bShowOkayButton: true
                                });
                                break;
                        }                        
                    }
                }
            }
            else if (_data.gameModeId)
            {
                //Join best lobby for game mode
            }
        }
        else
        {
            //Auto join
            var lobbyToJoin = getBestLobby(socket.player);
            if (lobbyToJoin && canJoinLobby(lobbyToJoin.id, socket) == Lobby.JOIN_SUCCESS)
            {
                joinLobby(socket.player, lobbyToJoin.id);
            }
        }
    });
    socket.on("leaveLobby", function ()
    {
        var lobbyId = socket.player.lobbyId;
        if (lobbyId)
        {
            log(socket.id, "Wants to leave lobby", chalk.bgCyan(lobbyId));
            var lobby = getLobbyData(lobbyId);
            if (lobby)
            {
                var party = null; //getParty(socket.player.partyId);
                if (party)
                {
                    if (party.hostPlayerId == socket.player.id)
                    {
                        for (var i = 0; i < party.players.length; i++)
                        {
                            var curSocket = getSocketByPlayerId(party.players[i].id);
                            leaveLobby(curSocket.player, Lobby.REASON_PARTY_HOST_LEAVE);
                        }
                    }
                    else
                    {
                        removePlayerFromParty(socket);
                        leaveLobby(socket.player, Lobby.REASON_LEAVE);
                    }
                }
                else
                {
                    leaveLobby(socket.player, Lobby.REASON_LEAVE);
                }
            }
            else
            {
                console.warn("socket.on(leaveLobby) --> Lobby doesn't exist:", socket.player.lobbyId);
                if (socket.player.lobbyId)
                {
                    leaveLobby(socket.player, Lobby.REASON_LEAVE);
                }
            }
        }
    });
    socket.on("requestQuit", () =>
    {
        var lobbyId = socket.player.lobbyId;
        log(socket.player.id, "Request quit in lobby", chalk.bgCyan(lobbyId));
        var party = getParty(socket.player.partyId);
        if (party)
        {
            if (party.hostPlayerId != socket.player.id)
            {
                removePlayerFromParty(socket);
            }
        }
        var lobby = getLobbyData(lobbyId);
        if (lobby)
        {
            if (lobby.bCustom)
            {
                if (lobby.hostPlayerId == socket.player.id)
                {
                    setLobbyState(lobbyId, LobbyState.WAITING_HOST);
                    io.to(lobbyId).emit("updateLobby", getClientLobbyData(lobby));
                }
                else
                {
                    leaveLobby(socket.player, Lobby.REASON_CLIENT_QUIT);
                    if (settings.bSingleGame)
                    {
                        disconnectSocket(socket, { reason: Lobby.REASON_CLIENT_QUIT });
                    }
                }
            }
            else
            {
                var party = getParty(socket.player.partyId);
                if (party)
                {
                    if (party.hostPlayerId == socket.player.id && party.players.length > 1)
                    {
                        removePlayerFromParty(socket);
                    }
                }
                leaveLobby(socket.player, Lobby.REASON_CLIENT_QUIT);
                if (settings.bSingleGame)
                {
                    disconnectSocket(socket, { reason: Lobby.REASON_CLIENT_QUIT });
                }
            }            
        }
        else
        {
            disconnectSocket(socket, { reason: Lobby.REASON_CLIENT_QUIT });
        }
    });
    socket.on("lobbies", (_data) =>
    {
        var lobbies = getLobbyListForSocket(socket);
        socket.emit("lobbies", lobbies);
    });
    socket.on("clearStats", (_data) =>
    {
        if (socket.player.bAdmin)
        {
            clearStats();
            sendChatMessageToAll({
                bServer: true,
                messageText: "Server stats have been reset."
            });
        }
    });
    socket.on("banPlayer", (_val) =>
    {
        log(socket.id, "wants to ban", _val);
        if (socket.player.bAdmin)
        {
            if (!isBanned(_val))
            {
                settings.banned.push(_val);
                let data = JSON.stringify(settings, null, "\t");
                fs.writeFile("settings.json", data, (e) =>
                {
                    if (e) 
                    {
                        console.warn(e);
                        return;
                    }
                    log("Data written to file");
                    sendChatMessageToAll({
                        bServer: true,
                        bCritical: true,
                        messageText: _val + " has been banned from the server."
                    });
                });
                let banSocket = getSocketByUsername(_val);
                if (banSocket)
                {
                    banSocket.disconnect();
                    disconnectSocket(banSocket, { reason: Lobby.REASON_KICKED });
                }
            }
            else 
            {
                log("Already added to banned list");
            }
        }
        else
        {
            console.warn("Insufficient privileges");
        }
    });
    socket.on("kickPlayer", (_id) =>
    {
        log(socket.id, "wants to kick", _id);
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby)
        {
            if (socket.player.bAdmin || socket.player.bLobbyHost)
            {
                for (var i = 0; i < lobby.players.length; i++)
                {
                    let player = lobby.players[i];
                    if (player.id == _id)
                    {
                        if (player.bAdmin)
                        {
                            sendChatMessageToSocket(socket, {
                                bServer: true,
                                bDirect: true,
                                locText: "STR_SERVER_VOTEKICK_ADMIN"
                            });
                        }
                        else
                        {
                            leaveLobby(player, Lobby.REASON_KICKED);
                        }
                        break;
                    }
                }
            }
        }
        else if (socket.player.bAdmin)
        {
            var toKick = getSocketByPlayerId(_id);
            if (toKick)
            {
                disconnectSocket(toKick, { reason: Lobby.REASON_KICKED });
            }
        }
    });
    socket.on("kickIdlePlayers", () =>
    {
        log(socket.id, "wants to kick idle players");
        if (socket.player.bAdmin || socket.player.bLobbyHost)
        {
            var lobby = getLobbyData(socket.player.lobbyId);
            if (lobby)
            {
                kickIdlePlayers(lobby);
            }
        }
    });
    socket.on("reportPlayer", (_id) =>
    {
        log(socket.id, "wants to report", _id);
        var reportedSocket = getSocketByPlayerId(_id);
        if (reportedSocket)
        {
            
        }
    });
    socket.on("chat", (_message) =>
    {
        if (!socket.player)
        {
            return;
        }
        try
        {
            if (socket.player.bAdmin)
            {
                handleChatMessage(socket, _message);
            }
            else
            {
                chatLimiter.consume(socket.id).
                    then(() =>
                    {
                        handleChatMessage(socket, _message);
                    }).
                    catch(r =>
                    {
                        sendChatMessageToSocket(socket, {
                            bServer: true,
                            bDirect: true,
                            messageText: "You've sent too many messages."
                        });
                    });
            }
        }
        catch (e)
        {
            console.warn("Error while sending chat message:", e);
        }
    });
    socket.on("update", (_data) =>
    {
        //Check if player is banned from account server
        var bCheckAccountServer = true;
        if (bCheckAccountServer)
        {
            if (_data.steamId || _data.username)
            {
                fetch(URL_API).then((res) =>
                {
                    res.text().then((res) =>
                    {
                        let api = res + "api/";
                        fetch(api + "isBanned?username=" + (_data.steamId ? _data.steamId : _data.username)).then((res) =>
                        {
                            try
                            {
                                res.json().then((res) =>
                                {
                                    if (res.bBanned)
                                    {
                                        log(chalk.red("Player is banned"), _data.username, _data.steamId);
                                        socket.emit("showWindow", {
                                            id: "mp_banned",
                                            titleText: "STR_MULTIPLAYER",
                                            messageText: "STR_BANNED_DESC",
                                            type: "TYPE_MESSAGE",
                                            bShowOkayButton: true
                                        });
                                        disconnectSocket(socket, { reason: "banned" });
                                    }
                                    else
                                    {
                                        log(chalk.green("Player is not banned"));
                                    }
                                });
                            }
                            catch (e)
                            {
                                console.warn(e);
                            }
                        });
                    });
                });
            }
        }
        updateLimiter.consume(socket.id).
            then(() =>
            {
                updatePlayerData(socket, _data);
            }).
            catch(r =>
            {
                console.warn("Exceeded update limiter");
            });
    });
    socket.on("latency", (_ms) => 
    {
        socket.player.ping = _ms;
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby && lobby.game)
        {
            lobby.game.setPlayerPing(socket.player.id, socket.player.ping);
        }
    });
    socket.on("startGame", () => 
    {
        log(chalk.cyan(socket.id), "start game");
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby)
        {
            if (lobby.state != LobbyState.STARTING)
            {
                setLobbyState(socket.player.lobbyId, LobbyState.STARTING);
            }
        }
    });
    socket.on("cancelGame", () => 
    {
        log(chalk.cyan(socket.id), "cancel game");
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby)
        {
            if (lobby.state == LobbyState.STARTING)
            {
                setLobbyState(socket.player.lobbyId, lobby.bCustom ? LobbyState.WAITING_HOST : LobbyState.WAITING);
            }
        }
    });
    socket.on("stopGame", () => 
    {
        log(chalk.cyan(socket.id), "stop game");
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby)
        {
            if (socket.player.bAdmin)
            {
                setLobbyState(lobby.id, lobby.bCustom ? LobbyState.WAITING_HOST : LobbyState.WAITING);
            }
        }
    });
    socket.on("setPlayerTeam", (_data) =>
    {
        log(chalk.cyan(socket.id), _data);
        var socket2 = getSocketByPlayerId(_data.id);
        if (socket2)
        {
            socket2.player.desiredTeam = _data.team;
            var lobby = getLobbyData(socket.player.lobbyId);
            if (lobby)
            {
                io.to(lobby.id).emit("updateLobby", { players: lobby.players });
            }
        }
    });
    socket.on("updateGameSettings", (_data) => 
    {
        log(chalk.cyan(socket.id), _data);
        if (!_data)
        {
            return;
        }
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby && (socket.player.bAdmin || socket.player.bLobbyHost))
        {
            if (_data.scenario !== undefined)
            {
                if (lobby.gameData.scenario)
                {
                    log("Resetting all settings");
                    lobby.gameData.settings = {};
                }
            }
            var bEmitChange = false; //TODO
            var changed = [];
            var gameData = lobby.gameData;
            var keys = Object.keys(_data);
            for (var i = 0; i < keys.length; i++)
            {
                var key = keys[i];
                var value = _data[key];
                if (key == "settings")
                {                    
                    var settingsKeys = Object.keys(_data.settings);
                    for (var j = 0; j < settingsKeys.length; j++)
                    {
                        var settingsKey = settingsKeys[j];
                        var settingsValue = _data.settings[settingsKey];
                        if (gameData.settings[settingsKey] !== settingsValue)
                        {
                            changed.push(settingsKey);
                            switch (settingsKey)
                            {
                                case "bPublic":
                                    bEmitChange = true;
                                    //gameData.settings[settingsKey] = settingsValue;      
                                    lobby.bPublic = settingsValue == true;
                                    break;
                                default:
                                    gameData.settings[settingsKey] = settingsValue;
                                    break;
                            }
                        }
                        //gameData.settings[settingsKey] = settingsValue;
                    }
                }
                else
                {
                    switch (key)
                    {
                        case "scenario":
                            if (value)
                            {
                                gameData.scenario = clone(value);
                                var scenario = gameData.scenario;
                                if (scenario)
                                {
                                    var maxPlayers = gameData.maxPlayers;
                                    gameData.settings = scenario.settings ? scenario.settings : {};
                                    gameData.tiles = scenario.tiles ? scenario.tiles : null;
                                    lobby.gameData.maxPlayers = maxPlayers;
                                    gameData.mapId = scenario.mapId;
                                    gameData.gameModeId = scenario.gameModeId ? scenario.gameModeId : GameMode.SCENARIO;
                                }
                                else
                                {
                                    console.warn("Invalid scenario value");
                                }
                            }
                            else
                            {
                                delete gameData.scenario;
                                delete gameData.settings.preGameTimer;
                                delete gameData.settings.bUseDefaultMapObjects;
                                delete gameData.tiles;
                            }
                            bEmitChange = true;
                            break;
                        case "maxPlayers":
                            lobby.maxPlayers = Math.max(1, Math.min(Lobby.MAX_PLAYERS, value));
                            gameData.maxPlayers = lobby.maxPlayers;
                            bEmitChange = true;
                            break;
                        case "bPublic":
                            lobby.bPublic = value == true;
                            gameData.bPublic = lobby.bPublic;
                            bEmitChange = true;
                            break;
                        case "gameModeId":
                            if (!getGameMode(value))
                            {
                                console.warn("Invalid game mode", value);
                                return;
                            }
                            break;
                    }
                    if (lobby.gameData[key] !== value)
                    {
                        changed.push(key);
                    }
                    lobby.gameData[key] = value;
                }
            }
            var mode = getGameMode(lobby.gameData.gameModeId);
            lobby.bTeamSelection = lobby.bCustom && (mode.bTeam == true || gameData.settings.bTeam);
            io.to(lobby.id).emit("updateLobby", {
                bTeamSelection: lobby.bTeamSelection,
                gameData: lobby.gameData
            });
            if (changed.length > 0)
            {
                sendChatMessageToLobby(lobby.id, {
                    bServer: true,
                    locText: "STR_SERVER_SETTINGS_CHANGED_X",
                    params: [changed.length],
                    changed: changed
                });
            }
            if (bEmitChange)
            {
                emitLobbyChange(lobby);
            }
        }
    });
    socket.on("requestEvent", (_data) =>
    {
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby)
        {
            var game = lobby.game;
            if (game)
            {
                switch (_data.eventId)
                {
                    case GameServer.EVENT_PLAYER_UPDATE:
                    case GameServer.EVENT_PLAYER_TRIGGER_EQUIPMENT:
                    case GameServer.EVENT_PLAYER_TRIGGER_GRENADE:
                    case GameServer.EVENT_PLAYER_TRIGGER_WEAPON:
                    case GameServer.EVENT_PLAYER_INPUT:
                        if (_data.playerId)
                        {
                            if (_data.playerId != socket.player.id && !socket.player.bAdmin)
                            {
                                return;
                            }
                        }
                        else
                        {
                            _data.playerId = socket.player.id;
                        }
                        break;
                }
                game.requestEvent(_data);
            }
        }
    });
    socket.on("requestRestart", () =>
    {
        log(chalk.cyan(socket.id), "request restart");
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby)
        {
            if (socket.player.bAdmin || lobby.hostPlayerId == socket.player.id)
            {
                setLobbyState(lobby.id, LobbyState.WAITING);
                setLobbyState(lobby.id, LobbyState.STARTING);
            }
        }
    });
    socket.on("requestGame", () =>
    {
        log(chalk.cyan(socket.id), "request game");
        var lobby = getLobbyData(socket.player.lobbyId);
        if (lobby)
        {
            var game = lobby.game;
            if (game && game.bInit)
            {
                var items = [];
                items.push(game.getInitEventData());
                game.addPlayer(clone(socket.player));
                items.push(game.getGameModeEventData());
                
                var gamePlayers = game.getPlayers();
                for (var i = 0; i < gamePlayers.length; i++)
                {
                    var ps = gamePlayers[i];
                    if (ps.id != socket.player.id)
                    {
                        items.push({
                            eventId: GameServer.EVENT_PLAYER_JOIN,
                            player: clone(ps),
                            bSilent: true
                        });
                    }
                }

                if (game.matchInProgress())
                {
                    items.push(game.getGameStartEventData());
                }

                var all = game.getObjectsEventData();
                for (var i = 0; i < all.length; i++)
                {
                    items.push(all[i]);
                }
                log(items.length, "events");
                socket.emit("gameEvent", {
                    eventId: GameServer.EVENT_BATCH,
                    lobbyId: lobby.id,
                    items: items
                });                
            }
            socket.player.bReady = true;
            if (lobby.gameData.scenario)
            {
                checkLobbyReady(lobby);
            }
            var players = lobby.players;
            if (players.length > lobby.maxPlayers)
            {
                log("Remove a bot...");
                for (var i = 0; i < players.length; i++)
                {
                    let player = players[i];
                    if (player.bBot)
                    {
                        log(i, player.name);
                        leaveLobby(player, Lobby.REASON_KICKED);
                        break;
                    }
                }
            }   
            if (settings.bSingleGame && settings.welcome)
            {
                sendChatMessageToSocket(socket, {
                    bServer: true,
                    bDirect: true,
                    locText: settings.welcome
                });
            }
        }
    });
    socket.on("requestChat", () =>
    {
        socket.emit("receiveChat", history)
    });
    socket.on("disconnect", () =>
    {
        log(chalk.cyan(socket.id), chalk.red("Disconnected"));
        leaveLobby(socket.player, socket.disconnectReason);
        //emitPlayerList();
        io.emit("playerDisconnected", socket.player.id);
        if (settings.bKillServerWhenNoPlayers)
        {
            if (!getNumRealClients())
            {
                log("No more players, killing server in 3 seconds...");
                setTimeout(() =>
                {
                    if (!getNumRealClients())
                    {
                        process.exit();
                    }
                }, 3000);
            }
        }
    });
});

var lobbies = [];

//Initial lobby setup
if (settings.hathora)
{
    initHathoraGame();
}
else if (settings.bSingleGame)
{
    //Create lobby for single game server    
    let singleGameData = settings.singleGameData;
    if (singleGameData)
    {      
        if (singleGameData.lobbyType == "custom")
        {
            createCustomLobby();
        }
        else if (singleGameData.lobbyType)
        {
            createPublicLobby(singleGameData.lobbyType);
        }
        else if (singleGameData.scenario)
        {
            createPublicLobby(Lobby.TYPE_MIXED, settings.maxPlayers); //TODO
        }
        else if (singleGameData.gameModeId)
        {
            let singleLobby = createPublicLobby(Lobby.TYPE_OPEN_WORLD, settings.maxPlayers);
            singleLobby.gameData.gameModeId = singleGameData.gameModeId;
            singleLobby.gameData.mapId = singleGameData.mapId;
            singleLobby.maxPlayers = settings.maxPlayers;
            if (singleGameData.settings)
            {
                singleLobby.gameData.settings = singleGameData.settings;
            }
        }
        else
        {
            console.warn("Invalid singleGameData");
            createPublicLobby(Lobby.TYPE_MIXED, settings.maxPlayers);
        }
    }
    else
    {
        console.warn("Missing singleGameData");
        createPublicLobby(Lobby.TYPE_MIXED, settings.maxPlayers);
    }
}
else if (settings.publicLobbies)
{
    for (var i = 0; i < settings.publicLobbies.length; i++)
    {
        let lobby = settings.publicLobbies[i];
        switch (lobby)
        {
            case Lobby.TYPE_MIXED:
            case Lobby.TYPE_STANDARD:
            case Lobby.TYPE_SURVIVAL:
            case Lobby.TYPE_SCENARIO:
            case Lobby.TYPE_GROUND_WAR:
                createPublicLobby(lobby);
                break;
            default:
                console.warn("Unsupported public lobby type:", lobby);
                break;
        }        
    }    
}

//Multiplayer dummies
var dummies = [];
if (!settings.bDisableDummies)
{
    var dummyTimeout;
    var minDummies = 5;
    var maxDummies = 25;
    var numDummies = MathUtil.Random(minDummies, maxDummies);
    for (var i = 0; i < numDummies; i++)
    {
        addDummy(MathUtil.Random(0, 3), bots[MathUtil.Random(0, bots.length - 1)]);
    }
    startDummyAutomation();
}

function startDummyAutomation()
{
    var ms = 1000 * 30; //Randomly add/remove a dummy every 30 seconds
    dummyTimeout = setTimeout(() =>
    {
        var dummy = dummies[MathUtil.Random(0, dummies.length - 1)];
        if (dummies.length <= minDummies)
        {
            addDummy(MathUtil.Random(BotSkill.EASY, BotSkill.INSANE), bots[MathUtil.Random(0, bots.length - 1)]);
        }
        else if (dummies.length >= maxDummies)
        {
            removeDummy(dummy);
        }
        else
        {
            if (MathUtil.RandomBoolean())
            {                
                removeDummy(dummy);
            }
            else
            {
                addDummy(MathUtil.Random(BotSkill.EASY, BotSkill.INSANE), bots[MathUtil.Random(0, bots.length - 1)]);
            }
        }
        startDummyAutomation();
    }, ms);
}

function stopDummyAutomation()
{
    log("Stop dummy automation");
    if (dummyTimeout)
    {
        clearTimeout(dummyTimeout);
    }
}

function addDummy(_botSkill, _name)
{
    var bot = getBot(_botSkill);
    bot.bDummy = true;
    bot.id = getRandomUniqueId();
    bot.name = (_name ? _name : "Server Bot") + MathUtil.Random(1, 999);
    bot.latency = MathUtil.Random(10, 100);
    bot.classes = clone(shared.classes);
    var faces = [
        Character.FACE_DEFAULT,
        Character.FACE_DEFAULT,
        Character.FACE_DEFAULT,
        Character.FACE_DEFAULT,
        Character.FACE_TAN,
        Character.FACE_DARK
    ];
    bot.classes.assault.avatar.dinogen.face = faces[MathUtil.Random(0, faces.length - 1)];
    var hairs = [
        Character.HAIR_BALD,
        Character.HAIR_SHORT,
        Character.HAIR_LONG,
        Character.HAIR_MOHAWK,
        Character.HAIR_PONYTAIL,
        Character.HAIR_STYLED,
        Character.HAIR_UNDERCUT,
        Character.HAIR_HORSESHOE
    ];
    bot.classes.assault.avatar.dinogen.hair = hairs[MathUtil.Random(0, hairs.length - 1)];
    var colours = [
        Character.HAIR_COLOUR_BROWN,
        Character.HAIR_COLOUR_BROWN_LIGHT,
        Character.HAIR_COLOUR_BLACK,
        Character.HAIR_COLOUR_BLONDE,
        Character.HAIR_COLOUR_GINGER
    ];
    bot.classes.assault.avatar.dinogen.hairColour = colours[MathUtil.Random(0, colours.length - 1)];
    var facewears = [
        Character.FACEWEAR_NONE,
        Character.FACEWEAR_NONE,
        Character.FACEWEAR_NONE,
        Character.FACEWEAR_NONE,
        Character.FACEWEAR_GAITER,
        Character.FACEWEAR_MASK,
        Character.FACEWEAR_BALACLAVA
    ];
    bot.classes.assault.avatar.dinogen.facewear = facewears[MathUtil.Random(0, facewears.length - 1)];
    var heads = [
        Character.HEAD_NONE,
        Character.HEAD_US_HELMET,
        Character.HEAD_US_HELMET_TACTICAL,
        Character.HEAD_OPFOR_HELMET,
        Character.HEAD_OPFOR_HELMET_2
    ];
    bot.classes.assault.avatar.dinogen.head = heads[MathUtil.Random(0, heads.length - 1)];
    bot.classes.preferredClass = "assault";
    dummies.push(bot);    
    //emitPlayerList();
    io.emit("playerConnected", bot);
    return bot;
}

function removeDummy(_dummy)
{
    var index = dummies.indexOf(_dummy);
    if (index >= 0)
    {
        dummies.splice(index, 1);
        io.emit("playerDisconnected", _dummy.id);
    }
}

function createPublicLobby(_type, _maxPlayers)
{
    var gameModeId = GameMode.FREE_FOR_ALL;
    var gameData = {
        gameModeId: gameModeId,
        mapId: Map.RANDOM,
        settings: {
            timeLimit: 10,
            scoreLimit: 100,
            allowFactions: "all",
            respawnTime: 5,
            bSpawnProtection: true,
            bMapVehicles: true,
            bMapObjects: true,
            bMapWeapons: true,
            bots: 8,
            botSkill: BotSkill.AUTO,
            botFaction: "all",
            updateRate: 60
        }
    };
    if (_maxPlayers > 0)
    {
        var maxPlayers = _maxPlayers;
    }
    else
    {
        maxPlayers = 12;
        switch (_type)
        {
            case Lobby.TYPE_MIXED:
            case Lobby.TYPE_STANDARD:
                break;
            case Lobby.TYPE_SURVIVAL:
            case Lobby.TYPE_SCENARIO:
                maxPlayers = 8;
                break;
            case Lobby.TYPE_GROUND_WAR:                
                maxPlayers = 16;
                gameData.settings.bots = maxPlayers;
                break;
            case Lobby.TYPE_OPEN_WORLD:
                maxPlayers = 16;
                gameData.settings = {
                    maxSubSteps: 1,
                    tolerance: 0.9,
                    iterations: 1,
                    spawnProtectionTime: 3,
                    bots: 0,
                    bSpawnProtection: true,
                    respawnTime: 30
                };
                break;
            default:
                console.warn("Unsupported lobby type:", _type);
                _type = Lobby.TYPE_MIXED;
                break;
        }
    }
    if (settings.bDisableBots)
    {
        gameData.settings.bots = 0;
    }
    var lobby = {        
        id: getRandomUniqueId(),
        bPublic: true,
        type: _type,
        state: LobbyState.WAITING,
        players: [],
        maxPlayers: maxPlayers,
        chat: [],
        gameData: gameData
    }
    gameData.maxPlayers = lobby.maxPlayers;    
    if (settings.bAllowVotes)
    {
        initVotes(lobby);
    }
    lobbies.push(lobby);
    switch (_type)
    {
        case Lobby.TYPE_SCENARIO:
            gameData.bots = 0;
            break;
        default:
            setLobbyState(lobby.id, LobbyState.STARTING);
            break;
    }
    emitLobbyChange();
    return lobby;
}

function createCustomLobby()
{
    var gameData = {
        gameModeId: GameMode.FREE_FOR_ALL,
        mapId: Map.RANDOM,
        settings: {
            timeLimit: 10,
            scoreLimit: 100,
            respawnTime: 5,
            allowFactions: "all",
            bSpawnProtection: true,
            bMapVehicles: true,
            bMapObjects: true,
            bMapWeapons: true,
            bHardcore: false,
            bUnlimitedAmmo: false,
            bots: 0,
            botTeam: BotSkill.AUTO,
            botSkill: 0,
            botFaction: "all",
            updateRate: 60
        }
    };
    var lobby = {
        id: getRandomUniqueId(),
        bPublic: true,
        bCustom: true,
        bTeamSelection: false,
        state: LobbyState.WAITING_HOST,
        players: [],
        maxPlayers: Lobby.MAX_PLAYERS,
        chat: [],
        gameData: gameData
    }
    lobbies.push(lobby);    
    return lobby;
}

function triggerServerInfo(_lobbyId)
{
    if (MathUtil.RandomBoolean())
    {
        var rand = MathUtil.Random(0, 4);
        switch (rand)
        {
            case 0:
                var msg = "STR_SERVER_X_GAMES";
                var params = [stats.games ? stats.games : 0];
                break;
            case 1:
                msg = "STR_SERVER_X_PLAYER_KILLS";
                params = [stats.kills ? stats.kills : 0];
                break;
            case 2:
                msg = "STR_SERVER_X_DINOSAUR_KILLS";
                params = [stats.dinoKills ? stats.dinoKills : 0];
                break;
            case 3:
                msg = "STR_SERVER_X_HELI_KILLS";
                params = [stats.heliKills ? stats.heliKills : 0];
                break;
            case 4:
                msg = "STR_SERVER_X_EGG_KILLS";
                params = [stats.eggKills ? stats.eggKills : 0];
                break;
        }
    }
    else
    {
        msg = settings.info[MathUtil.Random(0, settings.info.length - 1)]
    }
    sendChatMessageToLobby(_lobbyId, {
        bServer: true,
        locText: msg,
        params: params
    });
}

function isTeamGameMode(_id)
{
    if (modes)
    {
        for (var i = 0; i < modes.length; i++)
        {
            var mode = modes[i];
            if (mode.id == _id)
            {
                return mode.bTeam;
            }
        }
    }
    return false;
}

function isSurvivalGameMode(_id)
{
    if (modes)
    {
        for (var i = 0; i < modes.length; i++)
        {
            var mode = modes[i];
            if (mode.id == _id)
            {
                return mode.bSurvival;
            }
        }
    }
    return false;
}

function removeBotsFromLobby(_lobbyId)
{
    var lobbyData = getLobbyData(_lobbyId);
    if (lobbyData)
    {
        var players = lobbyData.players;
        var num = 0;
        for (var i = players.length - 1; i >= 0; i--)
        {
            var player = players[i];
            if (player.bBot && !player.bDummy)
            {
                players.splice(i, 1);
                num++;
            }
        }
        if (num > 0)
        {
            log("Removed", num, "bots from", chalk.bgCyan(_lobbyId));
        }
    }
}

function initVotes(_lobby)
{
    if (!_lobby)
    {
        console.warn("initVotes - invalid lobby");
        return;
    }
    switch (_lobby.type)
    {
        case Lobby.TYPE_OPEN_WORLD:
            _lobby.votes = [
                {
                    id: GameMode.OPEN_WORLD,
                    mapId: Map.GENERATED,
                    players: []
                }
            ];
            break;

        case Lobby.TYPE_SCENARIO:
            _lobby.votes = [];
            try
            {
                log("Fetching featured scenarios...");
                var gameModes = [];
                fetch(URL_API).then((res) =>
                {
                    res.text().then((res) =>
                    {
                        let api = res + "api/";
                        fetch(api + "getFeaturedScenarios?data=1").then((res) =>
                        {
                            log("Retrieved scenarios");
                            res.json().then((res) =>
                            {
                                log("Converted to JSON");
                                var scenarios = res.scenarios;
                                log(scenarios.length, "scenarios");
                                for (var i = 0; i < scenarios.length; i++)
                                {
                                    let cur = scenarios[i].scenario;
                                    if (cur.settings.bAllowGameModeSelection)
                                    {
                                        cur.gameModeId = getRandomGameModeId();
                                    }
                                    if (cur.settings.bAllowMapSelection)
                                    {
                                        cur.mapId = getRandomMapId();
                                    }
                                    gameModes.push({
                                        id: GameMode.SCENARIO,
                                        scenario: cur
                                    });
                                }
                                shuffleArray(gameModes);
                                for (var i = 0; i < Math.min(3, gameModes.length); i++)
                                {
                                    let vote = gameModes[i];
                                    vote.mapId = vote.scenario.mapId;
                                    vote.players = [];
                                    _lobby.votes.push(vote);
                                }
                                io.to(_lobby.id).emit("updateLobby", { votes: getClientVotes(_lobby.votes) });
                            });
                        });
                    });
                });
            }
            catch (e)
            {
                console.warn(e);
            }
            break;
        default:
            _lobby.votes = getVotes(_lobby.type);
            break;
    }
}

function getVotes(_type)
{
    var votes = [];
    if (_type == Lobby.TYPE_GROUND_WAR)
    {
        var maps = [
            Map.RIVERSIDE,
            Map.COMPLEX,
            Map.DISTRICT,
            Map.SANDSTORM,
            Map.FACILITY,
            Map.CAMPSITE,
            Map.VILLA,
            Map.LABORATORY,
            Map.OASIS,
            Map.COMPOUND,
            Map.ATRIUM
        ];
    }
    else
    {
        maps = [
            Map.RIVERSIDE,
            Map.COMPLEX,
            Map.DISTRICT,
            Map.SANDSTORM,
            Map.FIRING_RANGE,
            Map.HEXAGON,
            Map.FACILITY,
            Map.CAMPSITE,
            Map.VILLA,
            Map.LABORATORY,
            Map.OASIS,
            Map.COMPOUND,
            Map.ATRIUM
        ];
    }
    var gameModes = [];
    switch (_type)
    {
        case Lobby.TYPE_SCENARIO:
            break;
        case Lobby.TYPE_STANDARD:
            for (var i = 0; i < modes.length; i++)
            {
                let mode = modes[i];
                if (!mode.bSurvival && !mode.bHidden && mode.id != GameMode.HUMANS_VS_DINOSAURS)
                {
                    gameModes.push({ id: mode.id });
                }
            }
            break;
        case Lobby.TYPE_GROUND_WAR:
            let groundWarModes = [
                GameMode.CAPTURE_THE_FLAG,
                GameMode.DOMINATION,
                GameMode.DESTRUCTION,
                GameMode.RAPTOR_HUNT,
                GameMode.EVOLUTION,
                GameMode.DINO_RESCUE,
                GameMode.EXTRACTION
            ];
            for (var i = 0; i < groundWarModes.length; i++)
            {
                gameModes.push({ id: groundWarModes[i] });
            }
            break;
        case Lobby.TYPE_SURVIVAL:
            for (var i = 0; i < modes.length; i++)
            {
                let mode = modes[i];
                if (mode.bSurvival && !mode.bHidden)
                {
                    gameModes.push({ id: mode.id });
                }
            }
            gameModes.push({ id: GameMode.SURVIVAL_PANDEMONIUM });
            if (MathUtil.Random(1, 2) == 1)
            {
                gameModes.push({ id: GameMode.SURVIVAL_ZOMBIE });
            }
            if (MathUtil.Random(1, 2) == 1)
            {
                gameModes.push({ id: GameMode.SURVIVAL_CHICKEN });
            }
            break;
        default:
            for (var i = 0; i < modes.length; i++)
            {
                let mode = modes[i];
                if (!mode.bHidden)
                {
                    gameModes.push({ id: mode.id });
                }
            }
            gameModes.push({ id: GameMode.SURVIVAL_PANDEMONIUM });
            if (MathUtil.Random(1, 2) == 1)
            {
                gameModes.push({ id: GameMode.SURVIVAL_ZOMBIE });
            }
            if (MathUtil.Random(1, 2) == 1)
            {
                gameModes.push({ id: GameMode.SURVIVAL_CHICKEN });
            }
            break;
    }
    shuffleArray(gameModes);
    if (!settings.bDisableEvents)
    {
        if (EventUtil.IsHalloween())
        {
            switch (_type)
            {
                case Lobby.TYPE_MIXED:
                case Lobby.TYPE_SURVIVAL:
                    let firstItem = gameModes[0];
                    firstItem.id = GameMode.SURVIVAL_ZOMBIE;
                    firstItem.bEvent = true;
                    firstItem.eventText = "Halloween Event 🎃";
                    break;
            }
        }
        else if (EventUtil.IsThanksgiving())
        {
            switch (_type)
            {
                case Lobby.TYPE_MIXED:
                case Lobby.TYPE_SURVIVAL:
                    let firstItem = gameModes[0];
                    firstItem.id = GameMode.SURVIVAL_CHICKEN;
                    firstItem.bEvent = true;
                    firstItem.eventText = "Thanksgiving Event 🦃";
                    break;
            }
        }
        else if (EventUtil.IsGoodFriday())
        {
            switch (_type)
            {
                case Lobby.TYPE_MIXED:
                case Lobby.TYPE_SURVIVAL:
                    let firstItem = gameModes[0];
                    firstItem.id = GameMode.SURVIVAL_CHICKEN;
                    firstItem.bEvent = true;
                    firstItem.eventText = "Good Friday Event";
                    break;
            }
        }
        else if (EventUtil.IsChristmas())
        {
            switch (_type)
            {
                case Lobby.TYPE_MIXED:
                case Lobby.TYPE_SURVIVAL:
                    let firstItem = gameModes[0];
                    firstItem.id = MathUtil.RandomBoolean() ? GameMode.SURVIVAL_ZOMBIE : GameMode.SURVIVAL_CHICKEN;
                    firstItem.bEvent = true;
                    firstItem.eventText = "Christmas Event 🎄";
                    break;
            }
        }
        else if (EventUtil.IsFriday13th())
        {
            switch (_type)
            {
                case Lobby.TYPE_MIXED:
                case Lobby.TYPE_SURVIVAL:
                    let firstItem = gameModes[0];
                    firstItem.id = GameMode.SURVIVAL_ZOMBIE;
                    firstItem.bEvent = true;
                    firstItem.eventText = "Friday the 13th";
                    break;
            }
        }
    }
    for (var i = 0; i < Math.min(3, gameModes.length); i++)
    {        
        let vote = gameModes[i];
        if (vote.scenario)
        {
            vote.mapId = vote.scenario.mapId;
        }
        else
        {
            let mapIndex = MathUtil.Random(0, maps.length - 1);
            vote.mapId = vote.mapId ? vote.mapId : maps[mapIndex];
            maps.splice(mapIndex, 1);
        }
        vote.players = [];
        votes.push(vote);        
    }
    return votes;
}

function getLobbyEvent(_lobby)
{
    if (_lobby)
    {
        var votes = _lobby.votes;
        if (votes)
        {
            for (var i = 0; i < votes.length; i++)
            {
                let vote = votes[i];
                if (vote.bEvent)
                {
                    return vote;
                }
            }
        }
    }
    return null;
}

function kickIdlePlayers(_lobby)
{
    if (_lobby)
    {
        var players = _lobby.players;
        if (players)
        {
            for (var i = 0; i < players.length; i++)
            {
                let player = players[i];
                if (!player.bBot && !player.bReady)
                {
                    leaveLobby(player, Lobby.REASON_KICKED);
                }
            }
            checkLobbyReady(_lobby);
        }
    }
}

function resetLobby(_lobby)
{
    if (!_lobby)
    {
        console.warn("Invalid lobby reference", _lobby);
        return;
    }
    delete _lobby.numReady;
    delete _lobby.numPlayers;
    resetPlayers(_lobby.players);
    removeBotsFromLobby(_lobby.id);
    var players = _lobby.players;
    if (players)
    {
        for (var i = 0; i < players.length; i++)
        {
            let p = players[i];
            if (p.votekicks)
            {
                delete p.votekicks;
            }
            io.emit("updatePlayer", p);
        }
        io.to(_lobby.id).emit("updateLobby", { players: players });
    }
}

async function resetLobbyVotes(_lobby)
{
    if (_lobby.votes)
    {
        initVotes(_lobby);
        io.to(_lobby.id).emit("updateLobby", { players: _lobby.players, votes: getClientVotes(_lobby.votes) });
    }
}

function getClientVotes(_votes)
{
    if (_votes)
    {
        var clientVotes = clone(_votes);
        if (clientVotes.scenario)
        {
            clientVotes.scenario = {
                name: clientVotes.scenario.name,
                desc: clientVotes.scenario.desc
            }
        }
        return clientVotes;
    }
    return _votes;
}

function checkLobbyReady(_lobby)
{
    try
    {
        if (_lobby && _lobby.players)
        {
            var numReady = 0;
            var numPlayers = getNumRealPlayersInLobby(_lobby.id);
            var players = _lobby.players;
            for (var i = 0; i < players.length; i++)
            {
                let player = players[i];
                if (!player.bBot && player.bReady)
                {
                    numReady++;
                }
            }
            log(numReady, "of", numPlayers, "ready");
            _lobby.numReady = numReady;
            _lobby.numPlayers = numPlayers;
            io.to(_lobby.id).emit("updateLobby", {
                numReady: numReady,
                numPlayers: numPlayers
            });
            if (numReady >= numPlayers || !numPlayers)
            {
                var res = initGame(_lobby, _lobby.gameData);
                if (res)
                {
                    var items = [];
                    var game = _lobby.game;
                    items.push(game.getInitEventData());
                    for (var i = 0; i < players.length; i++)
                    {
                        var ps = clone(players[i]);
                        game.addPlayer(ps);
                        items.push({
                            eventId: GameServer.EVENT_PLAYER_JOIN,
                            player: ps,
                            bSilent: true
                        });
                    }
                    items.push(game.getGameModeEventData());
                    io.to(_lobby.id).emit("gameEvent", {
                        eventId: GameServer.EVENT_BATCH,
                        lobbyId: _lobby.id,
                        items: items
                    });
                }
            }
        }
    }
    catch (e)
    {
        console.warn(e);
    }
}

function resetPlayers(_players)
{
    if (_players)
    {
        for (var i = 0; i < _players.length; i++)
        {
            resetPlayer(_players[i]);
        }
        _players.sort(function (a, b)
        {
            if (a.bLobbyHost) return -1;
            if (b.bLobbyHost) return 1;
            if (a.bPartyHost) return -1;
            if (b.bPartyHost) return 1;
            return 0;
        });
    }
}

function resetPlayer(_player)
{
    delete _player.bInGame;
    delete _player.team;
    delete _player.bReady;  
    delete _player.bMuted;
}

function getNumPlayersOnTeam(_lobby, _team)
{
    var num = 0;
    if (_lobby)
    {
        var players = _lobby.players;
        for (var i = 0; i < players.length; i++)
        {
            var player = players[i];
            if (player.team == _team)
            {
                num++;
            }
        }
    }
    return num;
}

function getNumRealPlayersInLobby(_lobbyId)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        var numPlayers = 0;
        var players = lobby.players;
        for (var i = 0; i < players.length; i++)
        {
            let player = players[i];
            if (!player.bBot || player.bDummy)
            {
                numPlayers++;
            }
        }
        return numPlayers;
    }
    return 0;
}

function getNumRealTeamPlayersInLobby(_lobbyId)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        var numPlayers = 0;
        var parties = {};
        var players = lobby.players;
        for (var i = 0; i < players.length; i++)
        {
            var player = players[i];
            if (!player.bBot || player.bDummy)
            {
                if (player.partyId)
                {
                    if (!parties[player.partyId])
                    {
                        numPlayers++;
                    }
                    parties[player.partyId] = true;
                }
                else
                {
                    numPlayers++;
                }
            }
        }
        return numPlayers;
    }
    return 0;
}

function setLobbyTeams(_lobby)
{
    if (!_lobby)
    {
        log("Invalid lobby data!");
        return;
    }
    var gameModeId = _lobby.gameData.gameModeId;
    var bTeamGameMode = isTeamGameMode(gameModeId);
    if (_lobby.gameData.scenario)
    {
        bTeamGameMode = bTeamGameMode || _lobby.gameData.scenario.settings.bTeam == true;
    }
    var settings = _lobby.gameData.settings;
    var players = _lobby.players;
    if (players)
    {
        var bActAsCustom = _lobby.bCustom && _lobby.state != LobbyState.IN_PROGRESS;
        if (!bActAsCustom)
        {
            //Sort players into teams for public lobbies
            if (bTeamGameMode)
            {
                players.sort((a, b) =>
                {
                    if (!a.partyId) return 1;
                    if (!b.partyId) return -1;
                    if (a.partyId < b.partyId) return -1;
                    if (a.partyId > b.partyId) return 1;
                    return 0;
                });

                var parties = [];
                var partyPlayers = [];
                var lonePlayers = [];
                for (var i = 0; i < players.length; i++)
                {
                    var player = players[i];
                    if (player.partyId && getNumPlayersInParty(player.partyId) > 1)
                    {
                        if (parties.indexOf(player.partyId) == -1)
                        {
                            parties.push(player.partyId);
                        }
                        player.team = parties.indexOf(player.partyId) % 2 == 0 ? 0 : 1;
                        partyPlayers.push(player);
                    }
                    else 
                    {
                        lonePlayers.push(player);
                    }
                }

                lonePlayers.sort((a, b) =>
                {
                    if (a.prestige < b.prestige) return 1;
                    if (a.prestige > b.prestige) return -1;
                    if (a.level < b.level) return 1;
                    if (a.level > b.level) return -1;
                    return 0;
                });

                for (var i = 0; i < lonePlayers.length; i++)
                {
                    if (getNumPlayersOnTeam(_lobby, 0) > getNumPlayersOnTeam(_lobby, 1))
                    {
                        lonePlayers[i].team = 1;
                    }
                    else
                    {
                        lonePlayers[i].team = 0;
                    }
                }
                players = partyPlayers.concat(lonePlayers);

                players.sort((a, b) =>
                {
                    if (a.team < b.team) return -1;
                    if (a.team > b.team) return 1;
                    return 0;
                });
                _lobby["players"] = players;
            }
        }
        var bUseDesiredTeam = _lobby.bTeamSelection || (bActAsCustom && bTeamGameMode);
        var randomIndex = MathUtil.Random(0, players.length - 1);
        var bUsePreferred = false;
        for (var i = 0; i < players.length; i++)
        {
            var player = players[i];
            switch (gameModeId)
            {
                case GameMode.SCENARIO:
                    player.team = 0;
                    var scenario = _lobby.gameData.scenario;
                    if (scenario.settings.bDeathmatch || scenario.gameModeId == GameMode.FREE_FOR_ALL)
                    {
                        player.team = i;
                    }
                    else if (_lobby.gameData.settings.bTeam && player.desiredTeam != null)
                    {
                        player.team = player.desiredTeam;
                    }
                    bUsePreferred = true;
                    break;
                case GameMode.FREE_FOR_ALL:
                    player.team = i;
                    bUsePreferred = true;
                    break;
                case GameMode.SURVIVAL_CHAOS:
                case GameMode.SURVIVAL_DINO:
                case GameMode.SURVIVAL_MILITIA:
                case GameMode.SURVIVAL_ZOMBIE:
                case GameMode.SURVIVAL_CHICKEN:
                case GameMode.SURVIVAL_PANDEMONIUM:
                case GameMode.OPEN_WORLD:
                    player.team = 0;
                    bUsePreferred = true;
                    break;
                default:
                    if (!bActAsCustom)
                    {
                        if (gameModeId == GameMode.TYRANT)
                        {
                            player.team = i == randomIndex ? 1 : 0;
                        }
                    }
                    if (bUseDesiredTeam)
                    {
                        if (player["desiredTeam"] != null)
                        {
                            player["team"] = Math.min(1, player["desiredTeam"]);
                        }
                        else
                        {
                            if (player["bBot"] && settings["botTeam"] >= 0)
                            {
                                player["team"] = settings["botTeam"];
                            }
                            else
                            {
                                player["team"] = getBestTeam(players);
                            }
                        }
                    }
                    else
                    {
                        if (player["team"] == null)
                        {
                            player["team"] = MathUtil.Random(0, 1);
                        }
                    }
                    bUsePreferred = false;
                    break;
            }
            var scenario = _lobby.gameData.scenario;
            if (scenario)
            {
                if (scenario.settings.bDeathmatch)
                {
                    player.team = i;
                }
                else if (scenario.settings.bTeam && player.desiredTeam != null)
                {
                    player.team = player.desiredTeam;
                }
            }
        }        
        players.sort(function (a, b)
        {
            if (a.team < b.team) return -1;
            if (a.team > b.team) return 1;
            return 0;
        });
        io.to(_lobby.id).emit("updateLobby", { players: players });
    }
}

function getBestTeam(_players)
{
    if (_players)
    {
        var arr = [
            {
                team: 0,
                num: 0
            },
            {
                team: 1,
                num: 0
            }
        ];
        for (var i = 0; i < _players.length; i++)
        {
            var player = _players[i];
            if (player.team !== null)
            {
                var obj = arr[player.team];
                if (obj)
                {
                    obj.num++;
                }
            }
        }
        arr.sort(function (a, b) { return a.num - b.num });
        return arr[0].team;
    }
    return 0;
}

function getNumBotsInLobby(_lobbyId)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        var numBots = 0;
        var players = lobby.players;
        for (var i = 0; i < players.length; i++)
        {
            var player = players[i];
            if (player.bBot && !player.bDummy)
            {
                numBots++;
            }
        }
        return numBots;
    }
    return 0;
}

function getNumDummiesInLobby(_lobbyId)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        var numDummies = 0;
        var players = lobby.players;
        for (var i = 0; i < players.length; i++)
        {
            var player = players[i];
            if (player.bDummy)
            {
                numDummies++;
            }
        }
        return numDummies;
    }
    return 0;
}

function getNumPlayersInParty(_id)
{
    var party = getParty(_id);
    if (party)
    {
        return party.players.length;
    }
    return 1;
}

function canJoinLobby(_lobbyId, _socket, _type)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        if (!_socket.player)
        {
            return Lobby.JOIN_FAIL_ERROR;
        }
        var numBots = getNumBotsInLobby(lobby.id);
        var numInParty = getNumPlayersInParty(_socket.player.partyId);
        if (((lobby.players.length - numBots) + numInParty) > lobby.maxPlayers)
        {
            return Lobby.JOIN_FAIL_CAPACITY;
        }
        else if (lobby.state == LobbyState.STARTING && lobby.type != Lobby.TYPE_SCENARIO)
        {
            return Lobby.JOIN_FAIL_LOCKED;
        }
        else
        {
            if (!lobbyCanAcceptPlayers(_lobbyId, numInParty))
            {
                if (_socket.player.bAdmin || _type == "invite")
                {
                    return Lobby.JOIN_SUCCESS;
                }
                return Lobby.JOIN_FAIL_LOCKED;
            }
            if (lobby.bannedPlayers && lobby.bannedPlayers.indexOf(_socket.player.id) >= 0)
            {
                return Lobby.JOIN_FAIL_BANNED;
            }
            return Lobby.JOIN_SUCCESS;
        }
    }
    return Lobby.JOIN_FAIL_ERROR;
}

function lobbyCanAcceptPlayers(_lobbyId, _numPlayers = 1)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        if (lobby.state == LobbyState.STARTING && lobby.type != Lobby.TYPE_SCENARIO)
        {
            return false;
        }
        var numBots = getNumBotsInLobby(lobby.id);
        if ((lobby.players.length - numBots) + _numPlayers > lobby.maxPlayers)
        {
            return false;
        }
        if (lobby.bCustom)
        {
            if (lobby.gameData && !lobby.bPublic)
            {
                return false;
            }
        }
        var game = lobby.game;
        if (game)
        {
            return game.canAcceptNewPlayers();
        }
        else
        {
            return true;
        }
    }
    return false;
}

function joinLobby(_player, _lobbyId)
{
    if (_player.lobbyId)
    {
        leaveLobby(_player, Lobby.REASON_LEAVE);
    }
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        var socket = getSocketByPlayerId(_player.id);
        if (socket)
        {
            socket.join(_lobbyId);            
        }
        _player.lobbyId = _lobbyId;
        _player.lobbyType = lobby.type;
        _player.bCustom = lobby.bCustom;
        var players = lobby.players;
        players.push(_player);
        var gameData = lobby.gameData;
        if (lobby.bCustom && players.length == 1)
        {
            lobby.hostPlayerId = _player.id;
            _player.bLobbyHost = true;
            _player.team = 0;
        }
        else
        {
            switch (lobby.gameData.gameModeId)
            {
                case GameMode.SCENARIO:
                    _player.team = 0;
                    if (gameData.settings.bDeathmatch)
                    {
                        var availableTeams = [];
                        for (var i = 0; i < lobby.maxPlayers; i++)
                        {
                            availableTeams.push(i);
                        }
                        for (var i = 0; i < players.length; i++)
                        {
                            let curTeam = players[i].team;
                            if (curTeam != null)
                            {
                                availableTeams.splice(availableTeams.indexOf(curTeam), 1);
                            }
                        }
                        _player.team = availableTeams[0];
                    }
                    break;
                case GameMode.TYRANT:
                case GameMode.SURVIVAL_DINO:
                case GameMode.SURVIVAL_MILITIA:
                case GameMode.SURVIVAL_CHAOS:
                case GameMode.SURVIVAL_ZOMBIE:
                case GameMode.SURVIVAL_CHICKEN:
                case GameMode.SURVIVAL_PANDEMONIUM:
                case GameMode.OPEN_WORLD:
                    _player.team = 0;
                    break;
                case GameMode.FREE_FOR_ALL:
                    var availableTeams = [];
                    for (var i = 0; i < lobby.maxPlayers + 1; i++)
                    {
                        availableTeams.push(i);
                    }
                    for (var i = 0; i < players.length; i++)
                    {
                        let curTeam = players[i].team;
                        if (curTeam != null)
                        {
                            availableTeams.splice(availableTeams.indexOf(curTeam), 1);
                        }
                    }
                    _player.team = availableTeams[0];
                    break;
                default:
                    var playersPerTeam = [0, 0];
                    var partyTeam = null;
                    for (var i = 0; i < players.length - 1; i++)
                    {
                        let curPlayer = players[i];
                        if (curPlayer.team != undefined)
                        {
                            playersPerTeam[curPlayer.team]++;
                        }
                        if (_player.partyId && curPlayer.partyId == _player.partyId)
                        {
                            partyTeam = curPlayer.team;
                        }
                    }
                    if (partyTeam != null)
                    {
                        _player.team = partyTeam;
                    }
                    else
                    {
                        if (playersPerTeam[0] > playersPerTeam[1])
                        {
                            _player.team = 1;
                        }
                        else if (playersPerTeam[0] < playersPerTeam[1])
                        {
                            _player.team = 0;
                        }
                        else
                        {
                            var game = lobby.game;
                            if (game)
                            {
                                _player.team = game.getNewPlayerDesiredTeam();
                            }
                            else
                            {
                                _player.team = MathUtil.Random(0, 1);
                            }
                        }
                    }
                    break;
            }                
        }
        if (!lobby.bCustom && lobby.state == LobbyState.WAITING && lobby.players.length >= 1)
        {
            setLobbyState(lobby.id, LobbyState.PREPARING);
        }
        if (_player.team == null)
        {
            _player.team = 0;
        }
        _player.desiredTeam = _player.team;
        if (!lobby.game)
        {
            delete _player.team;
        }
        log(lobby.players.length, "in lobby", chalk.bgCyan(lobby.id), lobby.bCustom);  
        if (socket)
        {
            try
            {
                socket.emit("joinLobby", getClientLobbyData(lobby));
            }
            catch (e)
            {
                console.warn(e);
                disconnectSocket(socket, { reason: "error" });
                return;
            }
            io.emit("updatePlayer", socket.player);
        }
        io.to(lobby.id).emit("updateLobby", { players: lobby.players });
        if (lobby.game)
        {
            if (socket)
            {
                var gameData = lobby.gameData;
                if (gameData.scenario)
                {
                    gameData.gameModeId = gameData.scenario.gameModeId;
                    gameData.mapId = gameData.scenario.mapId;
                }
                socket.emit("prepareGame", gameData);
                setTimeout(() =>
                {
                    enterGame(socket);
                }, 2000);
            }
            else
            {
                lobby.game.addPlayer(clone(_player));
            }
        }
        else
        {
            sendChatMessageToLobby(lobby.id, {
                locText: "STR_X_JOINED",
                params: [_player.name]
            });
        }
        emitPlayerList(_player);
        if (!lobby.bCustom && getNumRealPlayers(lobby.players) >= lobby.maxPlayers)
        {
            if (lobbies.length >= settings.maxLobbies)
            {
                log("Lobby limit reached");
            }
            else if (!hasOpenPublicLobby(lobby.type))
            {
                createPublicLobby(lobby.type);
            }
        }        
    }
}

function hasOpenPublicLobby(_type)
{
    for (var i = 0; i < lobbies.length; i++)
    {
        let lobby = lobbies[i];
        if (!lobby.bCustom && lobby.type == _type)
        {
            let numPlayers = getNumRealPlayers(lobby.players);
            if (numPlayers < lobby.maxPlayers)
            {
                return true;
            }
        }
    }
    return false;
}

function sendChatMessageToLobby(_lobbyId, _data)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        if (lobby.chat.length > 50)
        {
            lobby.chat.splice(0, 1);
        }
        _data.date = Date.now();
        lobby.chat.push(_data);
        io.to(lobby.id).emit("chat", _data);
    }
}

function sendChatMessageToSocket(_socket, _data)
{
    if (_socket)
    {
        _data.date = Date.now();
        _socket.emit("chat", _data);
    }
}

function sendChatMessageToAll(_data, _bIncludePlayersInLobby = false)
{
    _data.date = Date.now();
    if (chatHistory.length >= 50)
    {
        chatHistory.splice(0, 1);
    }
    chatHistory.push(_data);
    for (const [_, socket] of io.of("/").sockets)
    {
        if (!socket.player.lobbyId || _bIncludePlayersInLobby)
        {
            socket.emit("chat", _data);
        }
    }    
}

function enterGame(_socket)
{
    if (_socket)
    {
        if (_socket.player)
        {
            _socket.player.bInGame = true;
        }
        _socket.emit("enterGame");
    }
}

function removeLobby(_id)
{
    log("Removing lobby: " + chalk.bgCyan(_id));
    var lobby = getLobbyData(_id);
    if (lobby)
    {
        if (!lobby.players)
        {
            log("Lobby is already destroyed");
            return;
        }
        if (lobby.interval)
        {
            clearInterval(lobby.interval);
        }
        if (lobby.infoInterval)
        {
            clearInterval(lobby.infoInterval);
        }
        //removeBotsFromLobby(_id);
        var players = lobby.players;
        for (var i = players.length - 1; i >= 0; i--)
        {
            var curPlayer = players[i];
            log(curPlayer.id, curPlayer.lobbyId);
            if (curPlayer)
            {
                if (curPlayer.lobbyId)
                {
                    leaveLobby(curPlayer, Lobby.REASON_LOBBY_REMOVED);
                }
            }
            else
            {
                console.warn(i, _id, "Invalid player in lobby:", curPlayer);
            }
        }
        destroyLobbyGame(lobby.id);
        index = lobbies.indexOf(lobby);
        if (index >= 0)
        {
            lobbies.splice(index, 1);
        }
        else
        {
            //console.warn("Invalid lobby index");
        }
        var keys = Object.keys(lobby);
        for (var i = 0; i < keys.length; i++)
        {
            delete lobby[keys[i]];
        }
        log("Lobby has been removed");
        emitLobbyChange();
    }
}

function setLobbyState(_lobbyId, _state)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        destroyLobbyGame(lobby.id);
        delete lobby.voteskips;
        delete lobby.kickTimer;
        lobby.timer = -1;
        lobby.state = _state;
        lobby.chat = [];
        if (lobby.interval)
        {
            clearInterval(lobby.interval);
        }
        if (lobby.infoInterval)
        {
            clearInterval(lobby.infoInterval);
        }
        if (lobby.kickInterval)
        {
            clearInterval(lobby.kickInterval);
        }
        log(chalk.magenta(lobby.id), lobby.state);
        switch (_state)
        {
            case LobbyState.IN_PROGRESS:
                incrementStat("games");
                var gameData = lobby.gameData;
                if (gameData.mapId == Map.RANDOM)
                {
                    var arr = [
                        Map.RIVERSIDE,
                        Map.COMPLEX,
                        Map.DISTRICT,
                        Map.SANDSTORM,
                        Map.FIRING_RANGE,
                        Map.HEXAGON
                    ];
                    gameData.mapId = arr[MathUtil.Random(0, arr.length - 1)];
                }                
                gameData.bMultiplayer = true;
                gameData.lobbyId = lobby.id;
                gameData.bCustomLobby = lobby.bCustom;
                gameData.data = {
                    p2: p2,
                    astar: astar.astar,
                    astarGraph: astar.Graph,
                    shared: shared,
                    sprites: sprites,
                    weapons_world: weapons_world,
                    weapons: weapons,
                    items: items,
                    vehicles: vehicles,
                    mods: mods,
                    modes: modes,
                    maps: allMaps,
                    bots: bots,
                    openWorld: openWorld,
                    callbacks: {
                        error: (_data) =>
                        {
                            log("A game error occurred", _data);
                            var endTimer = _data ? _data.endTimer : null;
                            onEndGame(lobby.id, endTimer != null ? endTimer : 3);
                        },
                        chat: (_data) =>
                        {
                            sendChatMessageToLobby(lobby.id, _data);
                        },
                        onPlayerKill: () =>
                        {
                            incrementStat("kills");
                        },
                        onDinoKill: () =>
                        {
                            incrementStat("dinoKills");
                        },
                        onHeliKill: () =>
                        {
                            incrementStat("heliKills");
                        },
                        onVehicleKill: () =>
                        {
                            incrementStat("vehicleKills");
                        },
                        onEggKill: () =>
                        {
                            incrementStat("eggKills");
                        }
                    }
                };
                startGame(lobby.id, gameData);
                if (settings.info)
                {
                    lobby.infoInterval = setInterval(() =>
                    {
                        triggerServerInfo(lobby.id);
                    }, 60000);
                    for (var i = 0; i < lobby.players.length; i++)
                    {
                        var curPlayer = lobby.players[i];
                        curPlayer.bInGame = true;
                        curPlayer.gameModeId = gameData.gameModeId;
                        curPlayer.menu = null;
                    }
                }
                break;
            case LobbyState.STARTING:
                lobby.timer = Lobby.COUNTDOWN_STARTING;
                lobby.interval = setInterval(() =>
                {
                    lobby.timer--;
                    if (lobby.timer < 0)
                    {
                        setLobbyState(lobby.id, LobbyState.IN_PROGRESS);
                    }
                    else
                    {
                        io.to(lobby.id).emit("updateLobby", { timer: lobby.timer });
                    }
                }, 1000);
                gameData = lobby.gameData;
                if (settings.bAllowVotes && lobby.votes)
                {                    
                    var votes = lobby.votes;
                    if (Array.isArray(votes))
                    {
                        votes.sort((a, b) =>
                        {
                            if (a.players.length > b.players.length) return -1;
                            if (a.players.length < b.players.length) return 1;
                            return 0;
                        });
                        var winningVote = votes[0];
                        gameData.gameModeId = winningVote.id;
                        if (winningVote.mapId)
                        {
                            gameData.mapId = winningVote.mapId;
                        }
                        let scenario = winningVote.scenario;
                        if (scenario)
                        {
                            gameData.scenario = scenario;
                            gameData.settings = scenario.settings ? scenario.settings : {};
                            gameData.tiles = scenario.tiles ? scenario.tiles : null;
                            gameData.mapId = scenario.mapId;
                            gameData.gameModeId = scenario.gameModeId ? scenario.gameModeId : GameMode.SCENARIO;
                        }
                    }
                    else
                    {
                        console.warn(votes);
                    }
                }
                if (!lobby.bCustom && lobby.type != Lobby.TYPE_SCENARIO && lobby.type != Lobby.TYPE_OPEN_WORLD)
                {
                    var defaultSettings = shared.defaultGameSettings[gameData.gameModeId];
                    if (defaultSettings)
                    {
                        var keys = Object.keys(defaultSettings);
                        for (var i = 0; i < keys.length; i++)
                        {
                            var key = keys[i];
                            gameData.settings[key] = defaultSettings[key];
                        }
                    }
                    let modeData = getGameMode(gameData.gameModeId);
                    let worldTypes = [null, null, "night", "dawn"];
                    gameData.settings.worldType = worldTypes[MathUtil.Random(0, worldTypes.length - 1)];
                    delete gameData.settings.boxes;
                    delete gameData.settings.forest;
                    if (!modeData.bSurvival && modeData.id != GameMode.OPEN_WORLD)
                    {
                        let boxes = [null, null, 600];
                        gameData.settings.boxes = boxes[MathUtil.Random(0, boxes.length - 1)];
                        if (gameData.gameModeId == GameMode.RAPTOR_HUNT)
                        {
                            let forest = [400, 600, 800];
                            gameData.settings.forest = forest[MathUtil.Random(0, forest.length - 1)];
                        }
                    }
                }
                if (isSurvivalGameMode(gameData.gameModeId) && gameData.settings.bHardcore)
                {
                    gameData.settings.bHardcore = false;
                    if (!lobby.bCustom)
                    {
                        gameData.settings.bMapVehicles = false;
                        gameData.settings.bMapWeapons = false;
                    }
                }
                var numBots = gameData.settings.bots;                
                if (!lobby.bCustom)
                {
                    if (isSurvivalGameMode(gameData.gameModeId))
                    {
                        numBots = Math.min(numBots, 2);
                    }
                }
                if (gameData.scenario && !gameData.scenario.settings.bAllowGameModeSelection)
                {
                    numBots = 0;
                }
                console.log("Add", numBots, "bots to lobby");
                var avg = getAveragePlayerLevel(lobby.players);
                var desiredBotSkill = Math.floor(avg / 30);
                for (i = 0; i < numBots; i++)
                {
                    if (lobby.players.length < lobby.maxPlayers)
                    {
                        let botSkill = gameData.settings.botSkill;
                        if (botSkill == BotSkill.AUTO || !lobby.bCustom)
                        {
                            if (isSurvivalGameMode(gameData.gameModeId))
                            {
                                botSkill = Math.max(desiredBotSkill, BotSkill.HARD);
                            }
                            else
                            {
                                botSkill = Math.min(desiredBotSkill, BotSkill.HARD);
                            }
                        }
                        let bot = getBot(botSkill);
                        bot.lobbyId = lobby.id;
                        bot.name = bots[MathUtil.Random(0, bots.length - 1)] + " (" + getBotSkillString(botSkill) + ")";
                        lobby.players.push(bot);
                    }
                    else
                    {
                        break;
                    }
                }
                setLobbyTeams(lobby);
                break;
            case LobbyState.PREPARING:
                resetLobby(lobby);
                lobby.timer = Lobby.COUNTDOWN_PREPARING;
                lobby.interval = setInterval(() =>
                {
                    lobby.timer--;
                    if (lobby.timer < 0)
                    {
                        setLobbyState(lobby.id, LobbyState.STARTING);
                    }
                    else
                    {
                        io.to(lobby.id).emit("updateLobby", { timer: lobby.timer });
                    }
                }, 1000);
                break;
            case LobbyState.INTERMISSION:
                resetLobby(lobby);
                resetLobbyVotes(lobby);
                lobby.timer = Lobby.COUNTDOWN_INTERMISSION;
                lobby.interval = setInterval(() =>
                {
                    lobby.timer--;
                    if (lobby.timer < 0)
                    {
                        setLobbyState(lobby.id, LobbyState.PREPARING);
                    }
                    else
                    {
                        io.to(lobby.id).emit("updateLobby", { timer: lobby.timer });
                    }
                }, 1000);
                if (!lobby.bCustom)
                {
                    if (getNumRealPlayers(lobby.players) == 0)
                    {
                        var lobbies = getLobbiesByType(lobby.type);
                        if (lobbies.length > 1)
                        {
                            log("Removing extra public lobby:", lobby.type);
                            removeLobby(lobby.id);
                        }
                    }
                }
                break; 
            case LobbyState.WAITING:
            case LobbyState.WAITING_HOST:   
                resetLobby(lobby);
                break;
        }
        io.to(lobby.id).emit("updateLobby", { state: lobby.state, chat: lobby.chat, timer: lobby.timer });
        emitLobbyChange(lobby);
    }
}

function getBotSkillString(_botSkill)
{
    switch (_botSkill)
    {
        case BotSkill.AUTO:
            return "Auto";
        case BotSkill.EASY:
            return "Easy";
        case BotSkill.NORMAL:
            return "Normal";
        case BotSkill.HARD:
            return "Hard";
        case BotSkill.INSANE:
            return "Insane";
        default:
            return "God";
    }
}

function getClientLobbyData(_lobby)
{
    var data = null;
    if (_lobby)
    {
        data = {};
        var keys = Object.keys(_lobby);
        for (var i = 0; i < keys.length; i++)
        {
            let key = keys[i];
            switch (key)
            {
                case "game":
                case "infoInterval":
                case "interval":
                case "kickInterval":
                    break;                
                default:
                    data[key] = _lobby[key];
                    break;
            }
        }
    }
    return data;
}

function getLobbyPlayerIndex(_players, _id)
{
    for (var i = 0; i < _players.length; i++)
    {
        if (_players[i].id == _id)
        {
            return i;
        }
    }
    return -1;
}

function banPlayerFromLobby(_lobby, _playerId)
{
    if (_lobby && _playerId)
    {
        if (!_lobby.bannedPlayers)
        {
            _lobby.bannedPlayers = [];
        }
        _lobby.bannedPlayers.push(_playerId);
    }
}

function leaveLobby(_player, _reason)
{
    var lobby = getLobbyData(_player.lobbyId);
    if (lobby)
    {
        if (lobby.votes)
        {
            for (var i = 0; i < lobby.votes.length; i++)
            {
                var lobbyPlayers = lobby.votes[i].players;
                var index = lobbyPlayers.indexOf(_player.id);
                if (index >= 0)
                {
                    lobbyPlayers.splice(index, 1);
                }
            }
        }
        if (lobby.voteskips)
        {
            var skipIndex = lobby.voteskips.indexOf(_player.id);
            if (skipIndex >= 0)
            {
                lobby.voteskips.splice(skipIndex, 1);
            }
        }
        if (lobby.game)
        {
            lobby.game.requestEvent({
                eventId: GameServer.EVENT_PLAYER_LEAVE,
                playerId: _player.id,
                reason: _reason
            });
        }
        var index = getLobbyPlayerIndex(lobby.players, _player.id);
        if (index >= 0)
        {
            lobby.players.splice(index, 1);
        }
        else
        {
            console.warn("Invalid index", index);
        }
        _player.lobbyId = null;
        delete _player.lobbyType;
        delete _player.bLobbyHost;
        delete _player.bCustom;
        resetPlayer(_player);
        var socket = getSocketByPlayerId(_player.id);
        if (socket)
        {
            socket.emit("leaveLobby", _reason);
            socket.leave(lobby.id);
            io.emit("updatePlayer", socket.player);
        }
        io.to(lobby.id).emit("updateLobby", { players: lobby.players });
        log(lobby.players.length, "in lobby");
        if (lobby.players.length == 0)
        {
            if (lobby.bCustom)
            {
                removeLobby(lobby.id);
            }
            else if (lobby.type == Lobby.TYPE_SCENARIO)
            {
                setLobbyState(lobby.id, LobbyState.WAITING);
            }
        }
        else
        {
            if (lobby.bCustom && lobby.hostPlayerId == _player.id)
            {
                if (!_player.partyId)
                {
                    io.to(lobby.id).emit("showWindow", {
                        titleText: "STR_CUSTOM_LOBBY_DISBANDED",
                        messageText: "STR_HOST_LEFT_DESC",
                        bShowOkayButton: true
                    });
                }
                removeLobby(lobby.id);
            }
            else
            {
                if (lobby.game)
                {
                    if (_reason != Lobby.REASON_KICKED && !lobby.bCustom && getNumBotsInLobby(lobby.id) < lobby.gameData.settings.bots && lobby.players.length < lobby.maxPlayers)
                    {
                        log("Add a bot");
                        let avg = getAveragePlayerLevel(lobby.players);
                        let desiredBotSkill = Math.floor(avg / 30);
                        if (isSurvivalGameMode(lobby.gameData.gameModeId))
                        {
                            var botSkill = Math.max(desiredBotSkill, BotSkill.HARD);
                        }
                        else
                        {
                            botSkill = Math.min(desiredBotSkill, BotSkill.HARD);
                        }
                        let bot = getBot(botSkill);
                        bot.name = bots[MathUtil.Random(0, bots.length - 1)] + " (" + getBotSkillString(botSkill) + ")";
                        joinLobby(bot, lobby.id);
                    }                    
                }
                else 
                {
                    switch (_reason)
                    {
                        case Lobby.REASON_KICKED:
                            var str = "STR_X_KICKED";
                            break;
                        case "timed_out":
                            str = "STR_X_TIMED_OUT";
                            break;
                        default:
                            str = "STR_X_LEFT";
                            break;
                    }
                    sendChatMessageToLobby(lobby.id, {
                        locText: str,
                        params: [_player.name]
                    });
                }
            }
        }
    }
    else
    {
        log("[leaveLobby] Player isn't in lobby", chalk.yellow(_player.name));
    }
    if (!_player.bBot)
    {
        emitPlayerList(_player);
    }
    if (settings.bSingleGame)
    {
        disconnectSocket(socket, { reason: Lobby.REASON_CLIENT_QUIT });
    }
}

function startGame(_lobbyId, _gameData)
{  
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        destroyLobbyGame(_lobbyId);
        var bClearCache = false;
        if (bClearCache)
        {          
            log(chalk.yellow("Clear game cache"));
            if (gameInstance)
            {
                delete gameInstance.GameInstance;
            }
            delete require.cache[require.resolve("./assets/js/game")];
            delete require.cache["./assets/js/game"];  
            gameInstance = require("./assets/js/game");
        }
        lobby.game = new gameInstance.GameInstance();
        lobby.gameData = _gameData;
        var players = clone(lobby.players);
        _gameData.players = players;
        if (_gameData.scenario)
        {
            var kickTimerMax = 30;
            lobby.kickTimer = kickTimerMax;
            io.to(lobby.id).emit("updateLobby", { kickTimer: lobby.kickTimer, kickTimerMax: kickTimerMax });
            lobby.kickInterval = setInterval(() =>
            {
                lobby.kickTimer--;
                io.to(lobby.id).emit("updateLobby", { kickTimer: lobby.kickTimer, kickTimerMax: kickTimerMax });
                if (lobby.kickTimer <= 0)
                {
                    clearInterval(lobby.kickInterval);
                    kickIdlePlayers(lobby);
                }
            }, 1000);
        }
        else
        {
            initGame(lobby, _gameData);
        }
        var gameData = clone(lobby.gameData);
        gameData.players = players;
        io.to(lobby.id).emit("prepareGame", gameData);
        setTimeout(() =>
        {
            io.to(lobby.id).emit("enterGame");
        }, 3000);
    }
}

async function initHathoraGame()
{
    try
    {
        let appId = settings.hathora.appId;
        let token = settings.hathora.token;
        let roomClient = new hathora.RoomV1Api(new hathora.Configuration({
            headers: { Authorization: "Bearer " + token }
        }));
        let processId = process.env.HATHORA_PROCESS_ID;
        log("HATHORA_PROCESS_ID -->", processId);

        let rooms = await roomClient.getActiveRoomsForProcess(appId, processId);
        let room = rooms[0];
        log("Room", room);

        let lobbyClient = new hathora.LobbyV2Api();
        log("Getting lobby info...");
        let info = await lobbyClient.getLobbyInfo(appId, room.roomId);
        log(info);

        let initialConfig = info.initialConfig;
        if (initialConfig)
        {
            if (initialConfig.host)
            {
                settings.host = initialConfig.host;
                //settings.admins.push(initialConfig.host);
            }
            settings.name = initialConfig.name;
            settings.region = initialConfig.region;
            settings.maxPlayers = initialConfig.maxPlayers;
            settings.bDisableBots = initialConfig.bDisableBots;
            if (initialConfig.lobbyType == "custom")
            {
                createCustomLobby();
            }
            else
            {
                createPublicLobby(initialConfig.lobbyType);
            }
        }
    }
    catch (e)
    {
        console.warn(e);
    }
}

function initGame(_lobby, _gameData)
{
    if (_lobby)
    {
        var game = _lobby.game;
        if (!game)
        {
            console.warn("Invalid game reference");
            return;
        }
        if (!game.bInit)
        {
            game.init(_gameData, (_data) =>
            {
                if (_data)
                {
                    var bLobbyExists = getLobbyData(_lobby.id) != null;
                    var bHasPlayers = getNumRealPlayers(_lobby.players) > 0;
                    if (bLobbyExists && bHasPlayers)
                    {
                        io.to(_lobby.id).emit("gameEvent", _data);
                    }
                }
            });
            game.setEndCallback(onEndGame);
            _lobby.gameData = _gameData;
            return true;
        }
        else
        {
            log("Game already initialized");
        }
    }
    return false;
}

function onEndGame(_lobbyId, _timer = Lobby.COUNTDOWN_END)
{  
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {        
        if (_timer > 0)
        {
            lobby.timer = _timer; //Lobby.COUNTDOWN_END;
            if (lobby.interval)
            {
                clearInterval(lobby.interval);
            }
            lobby.interval = setInterval(() =>
            {
                var lobby = getLobbyData(_lobbyId);
                if (lobby)
                {
                    lobby.timer--;
                    if (lobby.timer < 0)
                    {
                        setLobbyState(_lobbyId, lobby.bCustom ? LobbyState.WAITING_HOST : LobbyState.INTERMISSION);
                    }
                    else
                    {
                        io.to(lobby.id).emit("updateLobby", { timer: lobby.timer });
                    }
                }
            }, 1000);
        }
        else
        {
            setLobbyState(_lobbyId, lobby.bCustom ? LobbyState.WAITING_HOST : LobbyState.INTERMISSION);
        }
    }
}

function destroyLobbyGame(_lobbyId)
{
    var lobby = getLobbyData(_lobbyId);
    if (lobby)
    {
        var game = lobby.game;
        if (game)
        {
            game.destroy();
            delete lobby.game;
        }
    }
}

function handleChatMessage(_socket, _message)
{
    log(chalk.cyan(_socket.id), "chat", _socket.player.lobbyId ? "<" + _socket.player.lobbyId + ">" : "<all>", _message);
    if (_socket.player.bMuted)
    {
        sendChatMessageToSocket(_socket, {
            bServer: true,
            bDirect: true,
            messageText: "You have been muted."
        });
        return;
    }
    if (!_message || !_message.length || !_message.trim().length || !_message.replace(/\s/g, '').length)
    {
        return;
    }
    var message = smile.checkText(_message);
    var msg = {
        playerText: _socket.player.name,
        level: _socket.player.level,
        prestige: _socket.player.prestige,
        playerId: _socket.player.id,
        username: _socket.player.username,
        clan: _socket.player.clan,
        messageText: message
    };
    var bAdmin = _socket.player.bAdmin;
    var args = message.split(" ");
    if (args && args.length > 0)
    {
        var lobby = getLobbyData(_socket.player.lobbyId);
        var bCommand = true;
        if (_socket.player.lobbyId)
        {
            sendChatMessageToLobby(_socket.player.lobbyId, msg);
        }
        else
        {
            sendChatMessageToAll(msg);
        }
        switch (args[0])
        {
            case "/install":
                if (bAdmin)
                {
                    try
                    {
                        log("Attempting npm install...");
                        exec("npm install", (error, stdout, stderr) =>
                        {
                            log(error, stdout, stderr);
                            if (error)
                            {
                                console.warn(error.message);
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bCritical: true,
                                    messageText: error.message,
                                    bMonospace: true
                                }, true);
                                return;
                            }
                            if (stderr)
                            {
                                log(stderr);
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: stderr,
                                    bMonospace: true
                                }, true);
                            }
                            log(stdout);
                            sendChatMessageToAll({
                                bServer: true,
                                messageText: stdout,
                                bMonospace: true
                            }, true);
                        });
                    }
                    catch (e)
                    {
                        console.warn(e);
                    }
                }
                break;
            case "/updateGame":
                if (bAdmin)
                {
                    try
                    {
                        if (gameInstance)
                        {
                            delete gameInstance.GameInstance;
                        }
                        delete require.cache[require.resolve("./assets/js/game")];
                        delete require.cache["./assets/js/game"];
                        gameInstance = require("./assets/js/game");
                        sendChatMessageToAll({
                            bServer: true,
                            messageText: "Game cache has been reset.",
                        }, true);
                    }
                    catch (e)
                    {
                        console.warn(e);
                        sendChatMessageToSocket(_socket, {
                            bServer: true,
                            bCritical: true,
                            messageText: e.message,
                            bMonospace: true
                        }, true);
                    }
                }
                break;
            case "/updateServer":
                if (bAdmin)
                {
                    try
                    {
                        log("Attempting git pull...");
                        exec("git pull", (error, stdout, stderr) =>
                        {
                            log(error, stdout, stderr);
                            if (error)
                            {
                                console.warn(error.message);
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bCritical: true,
                                    messageText: error.message,
                                    bMonospace: true
                                }, true);
                                return;
                            }
                            if (stderr)
                            {
                                log(stderr);
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: stderr,
                                    bMonospace: true
                                }, true);
                            }
                            log(stdout);
                            sendChatMessageToAll({
                                bServer: true,
                                messageText: stdout,
                                bMonospace: true
                            }, true);
                        });
                    }
                    catch (e)
                    {
                        console.warn(e);
                    }
                }
                break;

            case "/restartServer":
                if (bAdmin)
                {
                    let time = parseInt(args[1]);
                    if (!isNaN(time) && time > 0)
                    {
                        let restartTimer = time;
                        sendChatMessageToAll({
                            bServer: true,
                            messageText: "Server will restart in " + restartTimer + " seconds"
                        }, true);
                        setInterval(() =>
                        {
                            restartTimer--;
                            if (restartTimer <= 10 || restartTimer % (restartTimer >= 300 ? 60 : 30) == 0)
                            {
                                sendChatMessageToAll({
                                    bServer: true,
                                    messageText: "Server will restart in " + restartTimer + " seconds"
                                }, true);
                            }
                            if (restartTimer < 0)
                            {
                                process.exit(0);
                            }
                        }, 1000);
                    }
                    else
                    {
                        process.exit(0);
                    }
                }
                break;

            case "/end":
                if (bAdmin && lobby)
                {
                    if (lobby.game)
                    {
                        lobby.game.requestEvent({
                            eventId: GameServer.EVENT_GAME_END,
                            winningTeam: parseInt(args[1])
                        });
                    }
                }
                break;

            case "/stop":
                if (bAdmin && lobby)
                {
                    setLobbyState(lobby.id, lobby.bCustom ? LobbyState.WAITING_HOST : LobbyState.WAITING);
                }
                break;

            case "/start":
                if (bAdmin && lobby)
                {
                    setLobbyState(lobby.id, LobbyState.WAITING);
                    setLobbyState(lobby.id, LobbyState.STARTING);
                }
                break;

            case "/resetLobby":
                if (bAdmin && lobby)
                {
                    if (lobby.interval)
                    {
                        clearInterval(lobby.interval);
                    }
                    setLobbyState(lobby.id, LobbyState.WAITING);
                }
                break;

            case "/resetLobbyVotes":
                if (bAdmin && lobby)
                {
                    resetLobbyVotes(lobby);
                }
                break;

            case "/createLobby":
                if (bAdmin)
                {
                    createPublicLobby(args[1]);
                }
                break;

            case "/dummy":
                if (bAdmin)
                {
                    addDummy(MathUtil.Random(BotSkill.EASY, BotSkill.INSANE), bots[MathUtil.Random(0, bots.length - 1)]);
                }
                break;

            case "/kill":
                if (lobby && lobby.game)
                {
                    if (bAdmin || lobby.bCustom)
                    {
                        lobby.game.killPawn(args[1] ? args[1] : _socket.player.id);
                    }
                }
                break;

            case "/spectate":
                if (lobby && lobby.game)
                {
                    lobby.game.serverAction(_socket.player.id, args);
                }
                break;

            case "/join":
                if (bAdmin && canJoinLobby(args[1], _socket) == Lobby.JOIN_SUCCESS)
                {
                    joinLobby(_socket.player, args[1]);
                }
                break;

            case "/time":
                sendChatMessageToSocket(_socket, {
                    bServer: true,
                    bDirect: true,
                    messageText: (new Date(Date.now())).toString()
                });
                break;

            case "/server":
                var info = "";
                var upTime = convertMS(Date.now() - serverStartTime);
                info += "Uptime: " + upTime.day + "d " + upTime.hour + "h " + upTime.minute + "m " + upTime.seconds + "s";
                info += "\n" + getNumClients() + " connected / " + lobbies.length + " lobbies / " + getLobbiesInProgress() + " games in progress";
                info += "\n" + (settings.bAllowVotes ? "☑" : "☐") + " Map Voting";
                info += "  •  " + (settings.bAllowVotekick ? "☑" : "☐") + " Votekick";
                info += "  •  " + (settings.bAllowVoteskip ? "☑" : "☐") + " Voteskip";
                sendChatMessageToSocket(_socket, {
                    bServer: true,
                    bDirect: true,
                    messageText: "Fetching server details..."
                });
                os.cpuUsage((r) =>
                {
                    info += "\n" + os.platform() + " - " + os.cpuCount() + " CPUs";
                    info += "\nCPU Usage: " + Math.round(r * 100) + "%";
                    info += "\nMemory Usage: " + Math.round(os.freemem()) + " MB of " + Math.round(os.totalmem()) + " MB (" + Math.round(os.freememPercentage() * 100) + "%)";
                    var mem = process.memoryUsage();
                    var keys = []; //["rss", "heapTotal", "heapUsed"];
                    for (var i = 0; i < keys.length; i++)
                    {
                        var key = keys[i];
                        if (mem[key])
                        {
                            info += "\n" + key + ": " + toMB(mem[key]);
                        }
                    }
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        messageText: settings.name + " (Server v" + ServerData.VERSION + " - Game v" + ServerData.GAME_VERSION + ") \n" + info
                    });
                });
                break;

            case "/version":
                sendChatMessageToSocket(_socket, {
                    bServer: true,
                    bDirect: true,
                    messageText: settings.name + "\nServer: v" + ServerData.VERSION + "\nRequired Game Version: v" + ServerData.GAME_VERSION
                });
                break;

            case "/lobby":
                if (lobby)
                {
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        messageText: "Lobby ID: " + lobby.id + "\nType: " + (lobby.bCustom ? "Custom" : lobby.type) + "\nState: " + lobby.state + "\nMax Players: " + lobby.maxPlayers + "\nLobby is " + (lobby.bPublic ? "public" : "private 🔒")
                    });
                }
                break;

            case "/tickRate":
                if (lobby && lobby.game)
                {
                    sendChatMessageToLobby(lobby.id, {
                        bServer: true,
                        messageText: "Current tick rate: " + (lobby.game.game.gameSettings.tickRate ? lobby.game.game.gameSettings.tickRate : 60)
                    });
                }
                break;

            case "/heapdump":
                /*
                if (bAdmin)
                {
                    heapdump.writeSnapshot(function (e, filename)
                    {
                        log("Dump written to", filename);
                        sendChatMessageToSocket(_socket, {
                            bServer: true,
                            bDirect: true,
                            messageText: "Dump written to " + filename
                        });
                    });
                }
                */
                break;

            case "/setSetting":
                if (lobby && lobby.bCustom)
                {
                    if (bAdmin)
                    {
                        lobby.gameData.settings[args[1]] = args[2];
                    }
                }
                break;

            case "/host":
                if (lobby && lobby.bCustom)
                {
                    if (_socket.player.bLobbyHost || bAdmin)
                    {
                        var index = args[1];
                        if (index >= 0)
                        {
                            var oldHost = getPlayerById(lobby.hostPlayerId);
                            var newHost = lobby.players[index];
                            if (newHost)
                            {
                                newHost.bLobbyHost = true;
                                lobby.hostPlayerId = newHost.id;
                                if (oldHost)
                                {
                                    delete oldHost.bLobbyHost;
                                }
                                io.to(lobby.id).emit("updateLobby", {
                                    hostPlayerId: newHost.id,
                                    players: lobby.players
                                });
                            }
                            sendChatMessageToLobby(lobby.id, {
                                bServer: true,
                                messageText: newHost.name + " is now the lobby host"
                            });
                        }
                    }
                }
                break;

            case "/settings":
                if (lobby)
                {
                    var str = "";
                    var keys = Object.keys(lobby.gameData.settings);
                    for (var i = 0; i < keys.length; i++)
                    {
                        var key = keys[i];
                        if (i > 0)
                        {
                            str += "\n";
                        }
                        str += key + "=" + lobby.gameData.settings[key];
                    }
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        messageText: str
                    });
                }
                break;

            case "/createPublicLobby":
                if (bAdmin)
                {
                    let numLobbies = parseInt(args[1]);
                    if (!isNaN(numLobbies) && numLobbies > 0)
                    {
                        for (var i = 0; i < numLobbies; i++)
                        {
                            let newLobby = createPublicLobby(args[2] ? args[2] : Lobby.TYPE_MIXED);
                            setLobbyState(newLobby.id, LobbyState.IN_PROGRESS);
                            setLobbyState(newLobby.id, LobbyState.STARTING);
                        }
                    }
                }
                break;

            case "/createLobby":
                if (bAdmin)
                {
                    newLobby = createPublicLobby(args[1] ? args[1] : Lobby.TYPE_MIXED);
                }
                break;

            case "/removeLobby":
                if (bAdmin)
                {
                    if (lobby)
                    {
                        removeLobby(lobby.id);
                    }
                    else
                    {
                        let lobbyToRemove = getLobbyData(args[1]);
                        if (lobbyToRemove)
                        {
                            removeLobby(lobbyToRemove.id);
                        }
                    }
                }
                break;

            case "/removeAllLobbies":
                if (bAdmin)
                {
                    let numRemoved = 0;
                    for (var i = lobbies.length - 1; i >= 0; i--)
                    {
                        let curLobby = lobbies[i];
                        if (curLobby)
                        {
                            removeLobby(curLobby.id);
                            numRemoved++;
                        }
                    }
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        messageText: numRemoved + " lobbies removed"
                    });
                }
                break;

            case "/removeExtraLobbies":
                if (bAdmin)
                {
                    let numRemoved = 0;
                    for (var i = lobbies.length - 1; i >= 0; i--)
                    {
                        let curLobby = lobbies[i];
                        if (curLobby)
                        {
                            if (!curLobby.bCustom && getNumRealPlayers(curLobby.players) == 0)
                            {
                                let typeLobbies = getLobbiesByType(curLobby.type);
                                if (typeLobbies.length > 1)
                                {
                                    log("Removing extra public lobby:", curLobby.type);
                                    removeLobby(curLobby.id);
                                    numRemoved++;
                                }
                            }
                        }
                    }
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        messageText: numRemoved + " lobbies removed"
                    });
                }
                break;

            case "/admin":
                if (_socket.player.bAdmin)
                {
                    var str = "ADMIN DASHBOARD\n";
                    if (stats.reported)
                    {
                        str += stats.reported.length + " Reports\n";
                        for (var i = 0; i < stats.reported.length; i++)
                        {
                            let report = stats.reported[i];
                            str += "  " + i + " [" + report.id + "] " + report.reported.username + " reported by " + report.reporter.username + "\n   -> " + Date(report.date) + "\n";
                        }
                    }
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        messageText: str,
                        bMonospace: true
                    });
                }
                else
                {
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        messageText: "You must be an admin to view the Admin Dashboard."
                    });
                }
                break;

            case "/stats":
                if (stats)
                {
                    var str = "Server stats:\n";
                    var keys = Object.keys(stats);
                    for (var i = 0; i < keys.length; i++)
                    {
                        let key = keys[i];
                        switch (key)
                        {
                            case "reported":
                                break;
                            default:
                                str += key + ": " + GameUtil.FormatNum(stats[key]);
                                if (i < keys.length - 1)
                                {
                                    str += "\n";
                                }
                                break;
                        }
                    }
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        messageText: str
                    });
                }
                break;

            case "/help":
                var help = "Common commands:\n/server\n/votekick\n/voteskip\n/kick\n/report";
                sendChatMessageToSocket(_socket, {
                    bServer: true,
                    bDirect: true,
                    messageText: help
                });
                break;

            case "/report":
                if (lobby)
                {
                    let index = parseInt(args[1], 10);
                    if (!isNaN(index))
                    {
                        var player = getPlayerByIndex(lobby, index);
                    }
                    else
                    {
                        player = getPlayerByString(lobby, args[1]);
                    }
                    if (player)
                    {
                        if (player.bAdmin)
                        {
                            sendChatMessageToLobby(lobby.id, {
                                bServer: true,
                                messageText: "You can't report an admin."
                            });
                        }
                        else if (player.bBot)
                        {
                            sendChatMessageToLobby(lobby.id, {
                                bServer: true,
                                messageText: "You can't report a bot."
                            });
                        }
                        else if (player.id == _socket.player.id)
                        {
                            sendChatMessageToLobby(lobby.id, {
                                bServer: true,
                                messageText: "You can't report yourself."
                            });
                        }
                        else
                        {
                            var reportId = addReportedPlayer(player, _socket.player);
                            if (reportId)
                            {
                                sendChatMessageToLobby(lobby.id, {
                                    bServer: true,
                                    messageText: player.name + " has been reported. Report ID: " + reportId
                                });
                            }
                        }
                    }
                }
                break;

            case "/clearReports":
                if (bAdmin)
                {
                    if (stats)
                    {
                        stats.reports = [];
                    }
                }
                break;

            case "/mute":
                if (lobby)
                {
                    if (bAdmin || _socket.player.bLobbyHost)
                    {
                        let index = parseInt(args[1], 10);
                        if (!isNaN(index))
                        {
                            var player = getPlayerByIndex(lobby, index);
                        }
                        else
                        {
                            player = getPlayerByString(lobby, args[1]);
                        }
                        if (player)
                        {
                            if (player.id == _socket.player.id)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: "You can't mute yourself."
                                });
                            }
                            else if (player.bAdmin)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: "You can't mute an admin."
                                });
                            }
                            else 
                            {
                                player.bMuted = !player.bMuted;
                                sendChatMessageToLobby(lobby.id, {
                                    bServer: true,
                                    messageText: player.name + " has been " + (player.bMuted ? "muted" : "unmuted") + "."
                                });
                            }
                        }
                    }
                }
                break;

            case "/ban":
                if (lobby)
                {
                    if (bAdmin || _socket.player.bLobbyHost)
                    {
                        let index = parseInt(args[1], 10);
                        if (!isNaN(index))
                        {
                            var player = getPlayerByIndex(lobby, index);
                        }
                        else
                        {
                            player = getPlayerByString(lobby, args[1]);
                        }
                        if (player)
                        {
                            if (player.id == _socket.player.id)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: "You can't ban yourself from a lobby."
                                });
                            }
                            else if (player.bAdmin)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: "You can't ban an admin from a lobby."
                                });
                            }
                            else if (player.bModerator)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: "You can't ban a moderator from a lobby."
                                });
                            }
                            else
                            {
                                banPlayerFromLobby(lobby, player.id);
                                leaveLobby(player, Lobby.REASON_KICKED);                                
                            }
                        }
                    }
                }
                break;

            case "/kick":
                if (lobby)
                {
                    if (bAdmin || _socket.player.bLobbyHost)
                    {
                        let index = parseInt(args[1], 10);
                        if (!isNaN(index))
                        {
                            var player = getPlayerByIndex(lobby, index);
                        }
                        else
                        {
                            player = getPlayerByString(lobby, args[1]);
                        }
                        if (player)
                        {
                            if (player.bAdmin)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: "You can't kick an admin."
                                });
                            }
                            else if (player.bModerator)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    messageText: "You can't kick a moderator."
                                });
                            }
                            else if (player.id != _socket.player.id)
                            {
                                leaveLobby(player, Lobby.REASON_KICKED);
                            }
                        }
                    }
                }
                break;

            case "/bot":
                if (bAdmin && lobby)
                {
                    var bot = getBot(args[2] != null ? parseInt(args[2]) : BotSkill.AUTO);
                    bot.name = bots[MathUtil.Random(0, bots.length - 1)];
                    bot.team = args[1] != null ? parseInt(args[1], 10) : getBestTeam(lobby.players);
                    joinLobby(bot, lobby.id);
                }
                break;

            case "/rules":
                if (settings.rules)
                {
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        locText: settings.rules
                    });
                }
                break;

            case "/players":
                if (lobby)
                {
                    sendChatMessageToSocket(_socket, {
                        bServer: true,
                        bDirect: true,
                        locText: lobby.players.length == 1 ? "STR_X_PLAYER" : "STR_X_PLAYERS",
                        params: [lobby.players.length],
                        players: lobby.players
                    });
                }
                break;

            case "/lobbies":
                var str = "Lobbies:";
                for (var i = 0; i < lobbies.length; i++)
                {
                    let curLobby = lobbies[i];
                    if (curLobby.bPublic || bAdmin)
                    {
                        str += "\n" + curLobby.id + " | " + (curLobby.bCustom ? "custom" : curLobby.type);
                    }
                }
                sendChatMessageToSocket(_socket, {
                    bServer: true,
                    bDirect: true,
                    messageText: str
                });
                break;

            case "/voteskip":
                if (lobby && !lobby.bCustom)
                {
                    if (settings.bAllowVoteskip)
                    {
                        if (lobby.game)
                        {
                            if (!lobby.voteskips)
                            {
                                lobby.voteskips = [];
                            }
                            if (lobby.voteskips.indexOf(_socket.player.id) == -1)
                            {
                                lobby.voteskips.push(_socket.player.id);
                            }
                            var numReal = Math.max(1, getNumRealPlayers(lobby.players));
                            sendChatMessageToLobby(lobby.id, {
                                bServer: true,
                                locText: "STR_SERVER_VOTESKIP_X_X",
                                params: [lobby.voteskips.length, numReal]
                            });
                            if (lobby.voteskips.length >= numReal)
                            {
                                lobby.game.requestEvent({
                                    eventId: GameServer.EVENT_GAME_END
                                });
                            }
                        }
                        else
                        {
                            sendChatMessageToSocket(_socket, {
                                bServer: true,
                                bDirect: true,
                                locText: "STR_SERVER_VOTESKIP_GAME"
                            });
                        }
                    }
                    else
                    {
                        sendChatMessageToSocket(_socket, {
                            bServer: true,
                            bDirect: true,
                            locText: "STR_SERVER_VOTESKIP_DISABLED"
                        });
                    }
                }
                break;

            case "/votekick":
                if (lobby && !lobby.bCustom)
                {
                    if (settings.bAllowVotekick)
                    {
                        let index = parseInt(args[1], 10);
                        if (!isNaN(index))
                        {
                            var playerToKick = getPlayerByIndex(lobby, index);
                        }
                        else
                        {
                            playerToKick = getPlayerByString(lobby, args[1]);
                        }
                        if (playerToKick)
                        {
                            if (playerToKick.id == _socket.player.id)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    locText: "STR_SERVER_VOTEKICK_SELF"
                                });
                            }
                            else if (playerToKick.bAdmin)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    locText: "STR_SERVER_VOTEKICK_ADMIN"
                                });
                            }
                            else if (playerToKick.bModerator)
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    locText: "STR_SERVER_VOTEKICK_MODERATOR"
                                });
                            }
                            else
                            {
                                if (playerToKick.votekicks == null)
                                {
                                    playerToKick.votekicks = {};
                                }
                                playerToKick.votekicks[_socket.player.id] = 1;
                                var numVotes = Object.keys(playerToKick.votekicks).length;
                                var numPlayers = getNumRealPlayersInLobby(lobby.id);
                                var kickNum = Math.min(numPlayers, Math.floor(numPlayers * 0.5) + 1);
                                sendChatMessageToLobby(lobby.id, {
                                    bServer: true,
                                    locText: "STR_SERVER_VOTEKICK_VOTES_AGAINST_X_X_X",
                                    params: [playerToKick.name, numVotes, kickNum]
                                });
                                if (numVotes >= kickNum)
                                {
                                    var voteSocket = getSocketByPlayerId(playerToKick.id);
                                    if (voteSocket)
                                    {
                                        disconnectSocket(voteSocket, { reason: Lobby.REASON_KICKED });
                                    }
                                    else
                                    {
                                        leaveLobby(playerToKick, Lobby.REASON_KICKED);
                                    }
                                }
                            }
                        }
                        else
                        {
                            if (!isNaN(index) && typeof index === "number")
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    locText: "STR_SERVER_VOTEKICK_NOT_FOUND"
                                });
                            }
                            else
                            {
                                sendChatMessageToSocket(_socket, {
                                    bServer: true,
                                    bDirect: true,
                                    locText: "STR_SERVER_VOTEKICK_INVALID"
                                });
                            }
                        }
                    }
                    else
                    {
                        sendChatMessageToSocket(_socket, {
                            bServer: true,
                            bDirect: true,
                            locText: "STR_SERVER_VOTEKICK_DISABLED"
                        });
                    }
                }
                break;

            case "/disconnect":
                disconnectSocket(_socket);
                break;

            case "/leave":
                leaveLobby(_socket.player, Lobby.REASON_CLIENT_QUIT);
                break;

            default:
                bCommand = false;
                if (bAdmin)
                {
                    if (lobby && lobby.game)
                    {
                        lobby.game.serverAction(_socket.player.id, args);
                    }
                }
                break;
        }
    }
}

function updatePlayerData(_socket, _data)
{    
    if (_data)
    {
        log(chalk.cyan(_socket.id), "update", Object.keys(_data).length);        
        if (_data.version)
        {
            var requiredVersion = ServerData.GAME_VERSION.split(".");
            var clientVersion = _data.version.split(".");
            if (parseInt(clientVersion[0]) < parseInt(requiredVersion[0]) || parseInt(clientVersion[1]) < parseInt(requiredVersion[1]) || parseInt(clientVersion[2]) < parseInt(requiredVersion[2]))
            {
                _socket.emit("showWindow", {
                    id: "mp_mismatch",
                    titleText: "STR_MULTIPLAYER",
                    messageText: "STR_VERSION_MISMATCH_DESC",
                    messageParams: [_data.version, ServerData.GAME_VERSION],
                    version: _data.version,
                    required: Server.GAME_VERSION,
                    type: "TYPE_MESSAGE",
                    bShowOkayButton: true,
                    yesText: "STR_UPDATE",
                    yesData: {
                        rightIcon: "⧉"
                    },
                    yesURL: "https://dinogenonline.com"
                });
                disconnectSocket(_socket, { reason: "version_mismatch", version: _data.version, gameVersion: ServerData.GAME_VERSION });
                return;
            }
        }
        if ((settings.admins && settings.admins.indexOf(_data.username) >= 0) || _data.username == "xwilkinx")
        {
            _socket.player.bAdmin = true;
        }
        if ((settings.moderators && settings.moderators.indexOf(_data.username) >= 0) || _data.username == "xwilkinx")
        {
            _socket.player.bModerator = true;
        }
        if (_data.name)
        {
            _socket.player.name = _data.name;
        }
        if (_data.clan !== undefined)
        {
            _socket.player.clan = _data.clan;
        }
        if (_data.username !== undefined)
        {
            _socket.player.username = _data.username;
        }
        if (_data.level)
        {
            if (!_socket.player.level)
            {
                var bInit = true;
            }
            _socket.player.level = _data.level;
        }
        if (_data.prestige != null)
        {
            _socket.player.prestige = _data.prestige;
        }
        if (_data.xp != null)
        {
            _socket.player.xp = _data.xp;
        }
        if (_data.currentClass)
        {
            _socket.player.currentClass = _data.currentClass;
        }        
        if (_data.classes)
        {
            _socket.player.classes = _data.classes;
        }
        if (_data.class)
        {
            _socket.player.classes[_data.class.id] = _data.class.data;
        }
        if (_data.dinosaurs)
        {
            _socket.player.dinosaurs = _data.dinosaurs;
        }
        if (_data.dinosaur)
        {
            _socket.player.dinosaurs[_data.dinosaur.id] = _data.dinosaur;
        }
        if (_data.preferredClass)
        {
            _socket.player.classes.preferredClass = _data.preferredClass;
        }
        if (_data.preferredFaction)
        {
            _socket.player.classes.preferredFaction = _data.preferredFaction;
        }
        if (_data.menu !== undefined)
        {
            _socket.player.menu = _data.menu;
        }
        if (_data.steamId)
        {
            _socket.player.steamId = _data.steamId;
        }
        if (_data.badges)
        {
            _socket.player.badges = _data.badges;
        }
        if (isBanned(_data.username) || isBanned(_data.steamId))
        {
            console.warn(chalk.red("Player is banned"), _socket.player);
            _socket.emit("showWindow", {
                id: "mp_banned",
                titleText: "STR_MULTIPLAYER",
                messageText: "STR_BANNED_DESC",
                type: "TYPE_MESSAGE",
                bShowOkayButton: true
            });
            disconnectSocket(_socket, { reason: "banned" });
            return;
        }        
        if (!validateClient(_socket.player))
        {
            console.warn(chalk.red("Validation failed"), _socket.player);
            _socket.emit("showWindow", {
                id: "mp_validation_failed",
                titleText: "STR_MULTIPLAYER",
                messageText: "STR_CLIENT_VALIDATION_FAILED_DESC",
                type: "TYPE_MESSAGE",
                bShowOkayButton: true
            });
            disconnectSocket(_socket, { reason: "validation_failed" });
            return;
        }        
        var lobby = getLobbyData(_socket.player.lobbyId);
        if (lobby)
        {
            io.to(lobby.id).emit("updateLobby", { players: lobby.players });
            var game = lobby.game;
            if (game)
            {
                game.updatePlayer(_socket.player);
            }
        }
        //First client update
        if (bInit)
        {
            _socket.emit("players", getPlayerList());
            if (settings.bSingleGame)
            {
                try
                {
                    let lobby = lobbies[0];
                    if (lobby)
                    {
                        joinLobby(_socket.player, lobby.id);
                    }
                }
                catch (e)
                {
                    console.warn(e);
                }
            }
        }
        io.emit("playerConnected", _socket.player);
        io.emit("updatePlayer", _socket.player);
    }
}

function getRequiredXPForLevel(_level)
{
    //Note: this must match client PlayerUtil.GetRequiredXPForLevel
    var xp = 0;
    for (var i = 1; i < _level + 1; i++)
    {
        if (i <= 1)
        {
            xp += 0;
        }
        else if (i == 2)
        {
            xp += 1000;
        }
        else
        {
            xp += (50 * (i * 15));
        }
    }
    return xp;
}

async function validateClient(_player)
{
    try
    {        
        var maxLevel = 100;
        var maxPrestige = 10;
        if (_player.level == null || _player.level > maxLevel)
        {
            return false;
        }
        if (_player.prestige == null || _player.prestige > maxPrestige)
        {
            console.warn("Invalid prestige", _player.prestige);
            return false;
        }
        if (_player.level > 1)
        {
            var requiredXP = getRequiredXPForLevel(_player.level - 1);
            if (_player.xp < requiredXP)
            {
                console.warn("Invalid xp", _player.xp, _player.level, requiredXP);
            }
        }
        if (_player.classes)
        {
            var classes = ["assault", "commando", "support", "hunter"];
            for (var i = 0; i < classes.length; i++)
            {
                var cur = _player.classes[classes[i]];
                if (cur)
                {
                    if (!isValidClassItem(cur.primary.id) || !isValidClassItem(cur.secondary.id))
                    {
                        if (!_player.bAdmin)
                        {
                            return false;
                        }
                    }
                }
                else
                {
                    return false;
                }
            }
        }
        else
        {
            return false;
        }
    }
    catch (e)
    {
        console.error(e);
        return false;
    }
    return true;
}

function isValidClassItem(_id)
{
    var wpn = getWeaponData(_id);
    if (wpn)
    {
        if (wpn.bHidden || wpn.bVehicle || wpn.bSurvival)
        {
            return false;
        }
    }
    else
    {
        return false;
    }
    return true;
}

function getWeaponData(_id)
{
    for (var i = 0; i < weapons.length; i++)
    {
        var wpn = weapons[i];
        if (wpn.id == _id)
        {
            return wpn;
        }
    }
    return null;
}

function getRequiredXPForLevel(_level)
{
    if (_level <= 1)
    {
        return 0;
    }
    return getRequiredXPForLevel(_level - 1) + (50 * (_level * 15));
}

function getParty(_id)
{
    if (!_id)
    {
        return null;
    }
    return null; //parties[_id];
}

function getLobbiesByType(_type)
{
    var arr = [];
    for (var i = 0; i < lobbies.length; i++)
    {
        let lobby = lobbies[i];
        if (lobby.type == _type)
        {
            arr.push(lobby);
        }
    }
    return arr;
}

function getLobbyData(_lobbyId)
{
    if (!_lobbyId)
    {
        return null;
    }
    for (var i = 0; i < lobbies.length; i++)
    {
        if (lobbies[i].id == _lobbyId)
        {
            return lobbies[i];
        }
    }
    return null;
}

function getAveragePlayerLevel(_players)
{
    if (!_players || _players.length == 0)
    {
        return 1;
    }
    var sum = 0;
    for (var i = 0; i < _players.length; i++)
    {
        var player = _players[i];
        if (!player.bBot)
        {
            sum += player.level;
            if (player.prestige >= 1)
            {
                sum += 100 * player.prestige;
            }            
        }
    }
    return Math.round(sum / _players.length);
}

function getBot(_botSkill)
{
    var level = 1;
    var botSkill = Math.min(_botSkill, BotSkill.GOD);
    if (_botSkill == BotSkill.AUTO)
    {
        _botSkill = MathUtil.Random(BotSkill.EASY, BotSkill.HARD);
        botSkill = _botSkill;
    }
    switch (botSkill)
    {
        case 0:
            level = MathUtil.Random(1, 9);
            break;
        case 1:
            level = MathUtil.Random(10, 49);
            break;
        case 2:
            level = MathUtil.Random(50, 74);
            break;
        case 3:
            level = MathUtil.Random(75, 99);
            break;
        case 4:
            level = 100;
            break;
    }
    var player = {
        id: getRandomUniqueId(),
        name: "Bot",
        bBot: true,
        botSkill: botSkill,
        level: level
    };
    return player;
}

function showWindowForSockets(_ids, _windowData)
{
    if (_ids)
    {
        for (var i = 0; i < _ids.length; i++)
        {
            var socket = getSocketByPlayerId(_ids[i]);
            if (socket)
            {
                socket.emit("showWindow", _windowData);
            }
        }
    }
}

function disconnectSocket(_socket, _data)
{
    if (_socket)
    {
        _socket.emit("disconnectInfo", _data);
        _socket.disconnectReason = _data ? _data.reason : null;
        _socket.disconnect();
    }
}

function getNumRealPlayers(_players)
{
    if (_players)
    {
        var num = 0;
        for (var i = 0; i < _players.length; i++)
        {
            var ps = _players[i];
            if (!ps.bBot)
            {
                num++;
            }
        }
        return num;
    }
    return 0;
}

function getNumClients()
{
    var num = 0;
    io._nsps.forEach((namespace) =>
    {
        num += namespace.sockets.size;
    });
    num += dummies ? dummies.length : 0;
    return num;
}

function getNumRealClients()
{
    var num = 0;
    io._nsps.forEach((namespace) =>
    {
        num += namespace.sockets.size;
    });
    return num;
}

function getClients()
{
    var arr = [];
    for (const [_, socket] of io.of("/").sockets)
    {
        arr.push(socket.player);
    }
    arr = arr.concat(dummies);
    return arr;
}

function getLobbyListForSocket(_socket)
{
    var arr = [];
    for (var i = 0; i < lobbies.length; i++)
    {
        var cur = lobbies[i];
        if (!cur.bPublic)
        {
            continue;
        }
        var data = getLobbyDataForSocket(_socket, cur);
        arr.push(data);
    }
    return arr;
}

function getLobbyDataForSocket(_socket, _lobby)
{
    if (!_lobby.players)
    {
        return null;
    }
    var bPublic = _lobby.bPublic;
    var scenarioData = null;
    if (_lobby.gameData.scenario)
    {
        var scenario = _lobby.gameData.scenario;
        scenarioData = {
            name: scenario.name,
            desc: scenario.desc,
            author: scenario.author
        }
    }
    var data = {
        id: _lobby.id,
        type: _lobby.type,
        bPublic: bPublic,
        bCustom: _lobby.bCustom == true,
        scenario: scenarioData,
        numPlayers: _lobby.players.length,
        numBots: getNumBotsInLobby(_lobby.id),
        maxPlayers: _lobby.maxPlayers,
        gameModeId: _lobby.gameData.gameModeId,
        state: _lobby.state,
        bCanJoin: _socket ? (canJoinLobby(_lobby.id, _socket) == Lobby.JOIN_SUCCESS) : false
    };
    if (_lobby.gameData && _lobby.state == LobbyState.IN_PROGRESS)
    {
        data.mapId = _lobby.gameData.mapId;
        data.gameModeId = _lobby.gameData.gameModeId;
        try
        {
            if (_lobby.game && _lobby.game.game)
            {
                var game = _lobby.game.game;
                if (game)
                {
                    var gameModeData = game.gameModeData;
                    if (gameModeData)
                    {
                        if (game.gameTimer)
                        {
                            data.gameTimer = game.gameTimer;
                        }
                        if (game.bSurvival)
                        {
                            data.wave = gameModeData.wave;
                        }
                        else
                        {
                            data.scores = gameModeData.scores;
                        }
                    }
                }
            }
        }
        catch (e)
        {
            console.warn(e);
        }
    }
    if (_lobby.bCustom)
    {
        var hostSocket = getSocketByPlayerId(_lobby.hostPlayerId);
        if (hostSocket)
        {
            data.host = hostSocket.player;
        }
    }
    var event = getLobbyEvent(_lobby);
    if (event)
    {
        data.event = event;
    }
    return data;
}

function toMB(_val)
{
    return Number((_val / 1024 / 1024 * 100) / 100).toFixed(2) + " MB";
}

function getBestLobby()
{
    var arr = [];
    for (var i = 0; i < lobbies.length; i++)
    {
        var cur = lobbies[i];
        if (cur.bPublic)
        {
            arr.push({
                id: cur.id,
                players: cur.players.length,
                realPlayers: getNumRealPlayersInLobby(cur.id),
                value: cur.gameData.scenario ? 0 : 1
            });
        }
    }
    arr.sort((a, b) =>
    {
        if (a.value > b.value) return -1;
        if (a.value < b.value) return 1;
        if (a.realPlayers > b.realPlayers) return -1;
        if (a.realPlayers < b.realPlayers) return 1;
        if (a.players > b.players) return -1;
        if (a.players < b.players) return 1;
        return 0;
    });
    return arr.length > 0 ? arr[0] : null;
}

function emitLobbyChange(_lobby = null)
{
    //TODO: Optimize this
    for (const [_, socket] of io.of("/").sockets)
    {
        if (_lobby)
        {
            socket.emit("lobbyData", getLobbyDataForSocket(socket, _lobby));
        }
        else
        {
            socket.emit("lobbies", getLobbyListForSocket(socket));
        }
    }
}

function getPlayerList()
{
    var arr = dummies ? clone(dummies) : [];
    for (const [_, socket] of io.of("/").sockets)
    {
        arr.push(socket.player);
    }
    return arr;
}

function emitPlayerList(_player)
{
    var allPlayers = getPlayerList();
    for (const [_, socket] of io.of("/").sockets)
    {
        if (_player)
        {
            socket.emit("updatePlayer", _player);
        }
        else
        {
            socket.emit("players", allPlayers);
        }
    }
}

function getGameMode(_id)
{
    for (var i = 0; i < modes.length; i++)
    {
        var mode = modes[i];
        if (mode.id == _id)
        {
            return mode;
        }
    }
    return null;
}

function getPlayerByIndex(_lobby, _index)
{
    if (_lobby)
    {
        if (_index != null && !isNaN(_index) && typeof _index === "number")
        {
            var player = _lobby.players[_index];
            if (player)
            {
                return player;
            }
        }
    }
    return null;
}

function getPlayerByString(_lobby, _str)
{
    if (_lobby)
    {
        if (_str != null && typeof _str === "string")
        {
            var players = _lobby.players;
            for (var i = 0; i < players.length; i++)
            {
                let player = players[i];
                if (player.name.indexOf(_str) == 0)
                {
                    return player;
                }
            }
        }
    }
    return null;
}

function getSocketByPlayerId(_val)
{
    for (const [_, socket] of io.of("/").sockets)
    {
        if (socket.player.id == _val)
        {
            return socket;
        }
    }
    return null;
}

function getPlayerById(_id)
{
    for (const [_, socket] of io.of("/").sockets)
    {
        if (socket.player.id == _val)
        {
            return socket.player;
        }
    }
    return null;
}

function getSocketByUsername(_val)
{
    for (const [_, socket] of io.of("/").sockets)
    {
        if (socket.player.username == _val)
        {
            return socket;
        }
    }
    return null;
}

function getVotesAgainstPlayer(_id)
{
    var socket = getSocketByPlayerId(_id);
    if (socket)
    {
        if (socket.player.votekicks)
        {
            var keys = Object.keys(socket.player.votekicks);
            return keys.length;
        }
    }
    return 0;
}

function getLobbiesInProgress()
{
    var num = 0;
    for (var i = 0; i < lobbies.length; i ++)
    {
        let lobby = lobbies[i];
        if (lobby && lobby.state == LobbyState.IN_PROGRESS)
        {
            num++;
        }
    }
    return num;
}

function getRandomUniqueId()
{
    return Math.random().toString(36).substr(2, 4);
}

function getRandomGameModeId()
{
    var modes = [
        GameMode.FREE_FOR_ALL,
        GameMode.TEAM_DEATHMATCH,
        GameMode.DOMINATION,
        GameMode.TYRANT,
        GameMode.EVOLUTION,
        GameMode.RAPTOR_HUNT,
        GameMode.HUMANS_VS_DINOSAURS,
        GameMode.DESTRUCTION,
        GameMode.CAPTURE_THE_FLAG,
        GameMode.SURVIVAL_CHAOS,
        GameMode.SURVIVAL_DINO,
        GameMode.SURVIVAL_MILITIA,
        GameMode.SURVIVAL_PANDEMONIUM
    ];
    return modes[MathUtil.Random(0, modes.length - 1)];
}

function getRandomMapId()
{
    var maps = [
        Map.RIVERSIDE,
        Map.COMPLEX,
        Map.DISTRICT,
        Map.SANDSTORM,
        Map.FIRING_RANGE,
        Map.HEXAGON,
        Map.CAMPSITE,
        Map.VILLA,
        Map.LABORATORY,
        Map.OASIS,
        Map.COMPOUND,
        Map.ATRIUM
    ];
    return maps[MathUtil.Random(0, maps.length - 1)];
}

function shuffleArray(array)
{
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex)
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function clone(_data)
{
    return JSON.parse(JSON.stringify(_data));
}

function convertMS(milliseconds)
{
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}

function isBanned(_val)
{
    if (settings && settings.banned)
    {
        return settings.banned.indexOf(_val) == 0;
    }
    return false;
}

server.listen(process.env.PORT || settings.port, () =>
{
    log("\nListening on " + server.address().family + " " + chalk.inverse(server.address().address) + ":" + chalk.inverse(server.address().port) + "\n");
});

//Auto restart app
if (settings.maxUptimeHours > 0)
{
    log(chalk.yellow("\nMax Uptime Enabled"));
    log("Server will stop after", settings.maxUptimeHours, "hours")
    var iterations = 0;
    var iterationTime = 3600000;
    setInterval(function ()
    {
        iterations++;
        if (getLobbiesInProgress().length == 0 || getNumClients() == 0 || iterations >= settings.maxUptimeHours)
        {
            log("Max uptime reached");
            process.exit(0);
        }
    }, iterationTime);
}