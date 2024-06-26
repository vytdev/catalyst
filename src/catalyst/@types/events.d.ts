import { commandEntry } from "../core/command.js";
import { commandToken } from "./commands";
import { Plugin } from "../core/plugin.js";
import {
  ChatSendBeforeEvent,
  //DataDrivenEntityTriggerBeforeEvent,
  EffectAddBeforeEvent,
  EntityRemoveBeforeEvent,
  ExplosionBeforeEvent,
  //ItemDefinitionTriggeredBeforeEvent,
  ItemUseBeforeEvent,
  ItemUseOnBeforeEvent,
  //PistonActivateBeforeEvent,
  PlayerBreakBlockBeforeEvent,
  PlayerInteractWithBlockBeforeEvent,
  PlayerInteractWithEntityBeforeEvent,
  PlayerLeaveBeforeEvent,
  PlayerPlaceBlockBeforeEvent,
  BlockExplodeAfterEvent,
  ButtonPushAfterEvent,
  ChatSendAfterEvent,
  DataDrivenEntityTriggerAfterEvent,
  EffectAddAfterEvent,
  EntityDieAfterEvent,
  EntityHealthChangedAfterEvent,
  EntityHitBlockAfterEvent,
  EntityHitEntityAfterEvent,
  EntityHurtAfterEvent,
  EntityLoadAfterEvent,
  EntityRemoveAfterEvent,
  EntitySpawnAfterEvent,
  ExplosionAfterEvent,
  ItemCompleteUseAfterEvent,
  //ItemDefinitionTriggeredAfterEvent,
  ItemReleaseUseAfterEvent,
  ItemStartUseAfterEvent,
  ItemStartUseOnAfterEvent,
  ItemStopUseAfterEvent,
  ItemStopUseOnAfterEvent,
  ItemUseAfterEvent,
  ItemUseOnAfterEvent,
  LeverActionAfterEvent,
  MessageReceiveAfterEvent,
  PistonActivateAfterEvent,
  PlayerBreakBlockAfterEvent,
  PlayerDimensionChangeAfterEvent,
  PlayerInteractWithBlockAfterEvent,
  PlayerInteractWithEntityAfterEvent,
  PlayerJoinAfterEvent,
  PlayerLeaveAfterEvent,
  PlayerPlaceBlockAfterEvent,
  PlayerSpawnAfterEvent,
  PressurePlatePopAfterEvent,
  PressurePlatePushAfterEvent,
  ProjectileHitBlockAfterEvent,
  ProjectileHitEntityAfterEvent,
  TargetBlockHitAfterEvent,
  TripWireTripAfterEvent,
  WeatherChangeAfterEvent,
  WorldInitializeAfterEvent,
  WatchdogTerminateBeforeEvent,
  ScriptEventCommandMessageAfterEvent,
} from "@minecraft/server";

/**
 * default events (generic parameter for EventManager)
 */
export type defaultEvents = {
  // world beforeEvents
  "beforeChatSend": [ChatSendBeforeEvent],
  //"beforeDataDrivenEntityTriggerEvent": [DataDrivenEntityTriggerBeforeEvent],
  "beforeEffectAdd": [EffectAddBeforeEvent],
  "beforeEntityRemove": [EntityRemoveBeforeEvent],
  "beforeExplosion": [ExplosionBeforeEvent],
  //"beforeItemDefinitionEvent": [ItemDefinitionTriggeredBeforeEvent],
  "beforeItemUse": [ItemUseBeforeEvent],
  "beforeItemUseOn": [ItemUseOnBeforeEvent],
  //"beforePistonActivate": [PistonActivateBeforeEvent],
  "beforePlayerBreakBlock": [PlayerBreakBlockBeforeEvent],
  "beforePlayerInteractWithBlock": [PlayerInteractWithBlockBeforeEvent],
  "beforePlayerInteractWithEntity": [PlayerInteractWithEntityBeforeEvent],
  "beforePlayerLeave": [PlayerLeaveBeforeEvent],
  "beforePlayerPlaceBlock": [PlayerPlaceBlockBeforeEvent],
  // world afterEvents
  "afterBlockExplode": [BlockExplodeAfterEvent],
  "afterButtonPush": [ButtonPushAfterEvent],
  "afterChatSend": [ChatSendAfterEvent],
  "afterDataDrivenEntityTriggerEvent": [DataDrivenEntityTriggerAfterEvent],
  "afterEffectAdd": [EffectAddAfterEvent],
  "afterEntityDie": [EntityDieAfterEvent],
  "afterEntityHealthChanged": [EntityHealthChangedAfterEvent],
  "afterEntityHitBlock": [EntityHitBlockAfterEvent],
  "afterEntityHitEntity": [EntityHitEntityAfterEvent],
  "afterEntityHurt": [EntityHurtAfterEvent],
  "afterEntityLoad": [EntityLoadAfterEvent],
  "afterEntityRemove": [EntityRemoveAfterEvent],
  "afterEntitySpawn": [EntitySpawnAfterEvent],
  "afterExplosion": [ExplosionAfterEvent],
  "afterItemCompleteUse": [ItemCompleteUseAfterEvent],
  //"afterItemDefinitionEvent": [ItemDefinitionTriggeredAfterEvent],
  "afterItemReleaseUse": [ItemReleaseUseAfterEvent],
  "afterItemStartUse": [ItemStartUseAfterEvent],
  "afterItemStartUseOn": [ItemStartUseOnAfterEvent],
  "afterItemStopUse": [ItemStopUseAfterEvent],
  "afterItemStopUseOn": [ItemStopUseOnAfterEvent],
  "afterItemUse": [ItemUseAfterEvent],
  "afterItemUseOn": [ItemUseOnAfterEvent],
  "afterLeverAction": [LeverActionAfterEvent],
  "afterMessageReceive": [MessageReceiveAfterEvent],
  "afterPistonActivate": [PistonActivateAfterEvent],
  "afterPlayerBreakBlock": [PlayerBreakBlockAfterEvent],
  "afterPlayerDimensionChange": [PlayerDimensionChangeAfterEvent],
  "afterPlayerInteractWithBlock": [PlayerInteractWithBlockAfterEvent],
  "afterPlayerInteractWithEntity": [PlayerInteractWithEntityAfterEvent],
  "afterPlayerJoin": [PlayerJoinAfterEvent],
  "afterPlayerLeave": [PlayerLeaveAfterEvent],
  "afterPlayerPlaceBlock": [PlayerPlaceBlockAfterEvent],
  "afterPlayerSpawn": [PlayerSpawnAfterEvent],
  "afterPressurePlatePop": [PressurePlatePopAfterEvent],
  "afterPressurePlatePush": [PressurePlatePushAfterEvent],
  "afterProjectileHitBlock": [ProjectileHitBlockAfterEvent],
  "afterProjectileHitEntity": [ProjectileHitEntityAfterEvent],
  "afterTargetBlockHit": [TargetBlockHitAfterEvent],
  "afterTripWireTrip": [TripWireTripAfterEvent],
  "afterWeatherChange": [WeatherChangeAfterEvent],
  "afterWorldInitialize": [WorldInitializeAfterEvent],
  // system beforeEvents
  "beforeWatchdogTerminate": [WatchdogTerminateBeforeEvent],
  // system afterEvents
  "afterScriptEventReceive": [ScriptEventCommandMessageAfterEvent],

  // custom command events
  "commandRun": [commandToken[], ChatSendBeforeEvent | null],
  "commandRegistered": [commandEntry],
  "commandDeregistered": [string],
  "commandPrefixChanged": [string, string],
  // plugin events
  "pluginLoaded": [Plugin],
  "pluginUnloaded": [Plugin],
  "pluginRegistered": [Plugin],
};
