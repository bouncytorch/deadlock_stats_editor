import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';

const ADDON_NAME = process.env.ADDON_NAME || app.getName();

const PATH_CSDK = process.env.PATH_CSDK || path.join(app.isPackaged ? process.resourcesPath : process.cwd(), 'assets/csdk');
const PATH_OUT  = process.env.OUT_PATH  || path.join(process.cwd(), 'output');
const PATH_RES  = process.env.RES_PATH  || path.join(process.cwd(), 'output/cache');

const VDATA_ABILITIES_URL = process.env.VDATA_ABILITIES_URL
    || 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-Deadlock/refs/heads/master/game/citadel/pak01_dir/scripts/abilities.vdata';
const VDATA_HEROES_URL = process.env.VDATA_HEROES_URL
    || 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-Deadlock/refs/heads/master/game/citadel/pak01_dir/scripts/heroes.vdata';

const RESOURCECOMPILER_PATH = path.join(PATH_CSDK, 'game/bin_tools/win64/resourcecompiler.exe');
const CONTENT_PATH          = path.join(PATH_CSDK, 'content/citadel_addons', ADDON_NAME);
const GAME_PATH             = path.join(PATH_CSDK, 'game/citadel_addons', ADDON_NAME);

const VDATA_ABILITIES_CACHE_PATH = path.join(PATH_RES, 'abilities.vdata');
const VDATA_HEROES_CACHE_PATH = path.join(PATH_RES, 'heroes.vdata');
const JSON_ABILITIES_PATH = path.join(PATH_RES, 'json/abilities');
const JSON_HEROES_PATH = path.join(PATH_RES, 'json/heroes');

// Verify CSDK paths.
for (const path of [PATH_CSDK, RESOURCECOMPILER_PATH]) {
    if (!fs.existsSync(path))
        throw new Error(`CSDK 12 is invalid/missing. Path "${path}" does not exist. Verify your CSDK 12 installation.`);
}

// Make necessary generated paths.
[PATH_OUT, PATH_RES, CONTENT_PATH, GAME_PATH, JSON_HEROES_PATH, JSON_ABILITIES_PATH]
    .forEach((path) => fs.mkdirSync(path, { recursive: true }));

const JSON_BLACKLIST_DEFAULTS = [
    'hero_astro|ability_drifter_hunger',
    'hero_astro|ability_magician_cloneturret',
    'hero_astro|abilityw_power_jump',
    'hero_atlas|ability_crackshot',
    'hero_atlas|ability_magician_cloneturret',
    'hero_atlas|ability_vampirebat_lovebites',
    'hero_bebop|ability_afterburn',
    'hero_bebop|ability_crackshot',
    'hero_bebop|ability_drifter_hunger',
    'hero_bebop|ability_magician_cloneturret',
    'hero_bebop|ability_mirage_djinn_mark',
    'hero_bebop|ability_power_jump',
    'hero_bebop|ability_power_surge',
    'hero_bebop|ability_vampirebat_lovebites',
    'hero_bebop|citadel_ability_hornet_leap',
    'hero_bookworm|ability_power_jump',
    'hero_chrono|ability_bullet_flurry',
    'hero_chrono|ability_crackshot',
    'hero_chrono|ability_drifter_hunger',
    'hero_chrono|ability_magician_cloneturret',
    'hero_chrono|ability_mirage_djinn_mark',
    'hero_chrono|ability_power_jump',
    'hero_chrono|ability_vampirebat_lovebites',
    'hero_doorman|ability_drifter_hunger',
    'hero_doorman|ability_magician_cloneturret',
    'hero_doorman|ability_power_jump',
    'hero_drifter|ability_crackshot',
    'hero_drifter|ability_magician_cloneturret',
    'hero_drifter|ability_vampirebat_lovebites',
    'hero_dynamo|ability_magician_cloneturret',
    'hero_dynamo|ability_power_jump',
    'hero_forge|ability_bullet_flurry',
    'hero_forge|ability_crackshot',
    'hero_forge|ability_drifter_hunger',
    'hero_forge|ability_magician_cloneturret',
    'hero_forge|ability_mirage_djinn_mark',
    'hero_forge|ability_power_jump',
    'hero_forge|ability_power_surge',
    'hero_forge|ability_vampirebat_lovebites',
    'hero_forge|citadel_ability_hornet_leap',
    'hero_frank|ability_crackshot',
    'hero_frank|ability_magician_cloneturret',
    'hero_frank|ability_mirage_djinn_mark',
    'hero_frank|ability_power_jump',
    'hero_frank|ability_vampirebat_lovebites',
    'hero_ghost|ability_magician_cloneturret',
    'hero_ghost|ability_power_jump',
    'hero_gigawatt|ability_bullet_flurry',
    'hero_gigawatt|ability_crackshot',
    'hero_gigawatt|ability_magician_cloneturret',
    'hero_gigawatt|ability_mirage_djinn_mark',
    'hero_gigawatt|ability_power_jump',
    'hero_gigawatt|ability_vampirebat_lovebites',
    'hero_haze|ability_crackshot',
    'hero_haze|ability_drifter_hunger',
    'hero_haze|ability_magician_cloneturret',
    'hero_haze|ability_mirage_djinn_mark',
    'hero_haze|ability_power_jump',
    'hero_haze|ability_power_surge',
    'hero_haze|ability_vampirebat_lovebites',
    'hero_haze|citadel_ability_hornet_leap',
    'hero_hornet|ability_crackshot',
    'hero_hornet|ability_magician_cloneturret',
    'hero_hornet|ability_mirage_djinn_mark',
    'hero_hornet|ability_power_jump',
    'hero_hornet|ability_vampirebat_lovebites',
    'hero_inferno|ability_crackshot',
    'hero_inferno|ability_drifter_hunger',
    'hero_inferno|ability_magician_cloneturret',
    'hero_inferno|ability_mirage_djinn_mark',
    'hero_inferno|ability_power_jump',
    'hero_inferno|ability_power_surge',
    'hero_inferno|ability_vampirebat_lovebites',
    'hero_inferno|citadel_ability_hornet_leap',
    'hero_kelvin|ability_magician_cloneturret',
    'hero_kelvin|ability_power_jump',
    'hero_krill|ability_bullet_flurry',
    'hero_krill|ability_crackshot',
    'hero_krill|ability_magician_cloneturret',
    'hero_krill|ability_mirage_djinn_mark',
    'hero_krill|ability_power_jump',
    'hero_krill|ability_vampirebat_lovebites',
    'hero_lash|ability_bullet_flurry',
    'hero_lash|ability_crackshot',
    'hero_lash|ability_magician_cloneturret',
    'hero_lash|ability_power_jump',
    'hero_lash|ability_vampirebat_lovebites',
    'hero_magician|ability_power_jump',
    'hero_mirage|ability_crackshot',
    'hero_mirage|ability_drifter_hunger',
    'hero_mirage|ability_magician_cloneturret',
    'hero_mirage|ability_power_jump',
    'hero_nano|ability_bullet_flurry',
    'hero_nano|ability_crackshot',
    'hero_nano|ability_magician_cloneturret',
    'hero_nano|ability_power_jump',
    'hero_nano|ability_vampirebat_lovebites',
    'hero_nano|citadel_ability_hornet_leap',
    'hero_orion|ability_magician_cloneturret',
    'hero_punkgoat|ability_crackshot',
    'hero_punkgoat|ability_drifter_hunger',
    'hero_punkgoat|ability_magician_cloneturret',
    'hero_punkgoat|ability_mirage_djinn_mark',
    'hero_punkgoat|ability_power_jump',
    'hero_punkgoat|ability_power_surge',
    'hero_punkgoat|ability_vampirebat_lovebites',
    'hero_punkgoat|citadel_ability_hornet_leap',
    'hero_shiv|ability_crackshot',
    'hero_shiv|ability_power_jump',
    'hero_shiv|ability_vampirebat_lovebites',
    'hero_synth|ability_crackshot',
    'hero_synth|ability_magician_cloneturret',
    'hero_synth|ability_power_jump',
    'hero_synth|ability_vampirebat_lovebites',
    'hero_tengu|ability_crackshot',
    'hero_tengu|ability_drifter_hunger',
    'hero_tengu|ability_magician_cloneturret',
    'hero_tengu|ability_mirage_djinn_mark',
    'hero_tengu|ability_power_jump',
    'hero_tengu|ability_power_surge',
    'hero_tengu|ability_vampirebat_lovebites',
    'hero_tengu|citadel_ability_hornet_leap',
    'hero_vampirebat|ability_crackshot',
    'hero_vampirebat|ability_magician_cloneturret',
    'hero_vampirebat|ability_power_jump',
    'hero_viper|ability_bullet_flurry',
    'hero_viper|ability_crackshot',
    'hero_viper|ability_drifter_hunger',
    'hero_viper|ability_magician_cloneturret',
    'hero_viper|ability_mirage_djinn_mark',
    'hero_viper|ability_power_surge',
    'hero_viper|ability_vampirebat_lovebites',
    'hero_viper|citadel_ability_hornet_leap',
    'hero_viscous|ability_magician_cloneturret',
    'hero_warden|ability_crackshot',
    'hero_warden|ability_stacking_damage',
    'hero_warden|ability_magician_cloneturret',
    'hero_warden|ability_power_jump',
    'hero_wraith|ability_crackshot',
    'hero_wraith|ability_drifter_hunger',
    'hero_wraith|ability_magician_cloneturret',
    'hero_wraith|ability_mirage_djinn_mark',
    'hero_wraith|ability_power_jump',
    'hero_wraith|ability_power_surge',
    'hero_wraith|ability_vampirebat_lovebites',
    'hero_wraith|citadel_ability_hornet_leap'
];
