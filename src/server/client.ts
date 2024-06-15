import { Player, system, world } from "@minecraft/server";
import { Database, events, message, msToString, formatNumber } from "../catalyst/index.js";
import { smpName } from "./index.js";
import { ranks } from "./ranks.js";

/**
 * map of online clients
 */
export const clients = new Map<string, Client>();

/**
 * @class Client
 * the Client, player handler class
 */
export class Client {
  /**
   * @constructor
   * creates a new Client instance
   * @param player the player
   * @throws this can throw errors
   */
  constructor(player: Player) {
    if (clients.has(player.id)) throw "Player already initialized!";
    this.player = player;
    clients.set(player.id, this);

    // load player db
    this.db = new Database('local_player', player);
    this.db.load();

    // a new player!
    if (!this.db.get('joined')) {
      message(`§eWelcome §6${player.name}§e to the server!`);
      this.db.set('joined', Date.now());
      this.db.set('rank', 0);
      this.db.set('money', 1000);
      this.db.set('playtime', 0);
      this.db.set('kills', 0);
      this.db.set('deaths', 0);
      this.db.set('bounty', 0);
      this.db.save();
    }
  }

  /**
   * the player this class handles
   */
  public readonly player: Player;
  /**
   * database of player
   */
  public readonly db: Database<any>;

  /**
   * the player's entity id
   */
  public get id(): string { return this.player.id; }
  /**
   * the player's name
   */
  public get name(): string { return this.player.name; }

  // player's db values
  /** rank */
  public get rank(): number { this.db.load(); return this.db.get('rank', 0); }
  public set rank(v: number) { this.db.load(); this.db.set('rank', v); this.db.save(); }
  /** money */
  public get money(): number { this.db.load(); return this.db.get('money', 0); }
  public set money(v: number) { this.db.load(); this.db.set('money', v); this.db.save(); }
  /** playtime (in ticks) */
  public get playtime(): number { this.db.load(); return this.db.get('playtime', 0); }
  public set playtime(v: number) { this.db.load(); this.db.set('playtime', v); this.db.save(); }
  /** kills */
  public get kills(): number { this.db.load(); return this.db.get('kills', 0); }
  public set kills(v: number) { this.db.load(); this.db.set('kills', v); this.db.save(); }
  /** deaths */
  public get deaths(): number { this.db.load(); return this.db.get('deaths', 0); }
  public set deaths(v: number) { this.db.load(); this.db.set('deaths', v); this.db.save(); }
  /** bounty */
  public get bounty(): number { this.db.load(); return this.db.get('bounty', 0); }
  public set bounty(v: number) { this.db.load(); this.db.set('bounty', v); this.db.save(); }

  /**
   * additional text on sidebar
   */
  public sidebarTail: string = "";
}

/**
 * get client by name
 * @param name the name of client
 * @returns client class, or undefined
 */
export function getClientByName(name: string): Client | undefined {
  // find client
  let client;

  clients.forEach(v => {
    if (v.name == name) client = v;
  });

  // create new client class for player
  if (!client) {
    const player = world.getAllPlayers()?.find(v => v.name == name);
    if (!player) return;
    client = new Client(player);
  }

  return client;
}

// player joined
events.on("afterPlayerSpawn", ev => {
  if (!ev.initialSpawn) return;
  const client = new Client(ev.player);
  // welcome the player
  ev.player.onScreenDisplay.setTitle(`§bWelcome!`);
  ev.player.onScreenDisplay.updateSubtitle(`§7${ev.player.name}`);

});

// player left
events.on("beforePlayerLeave", ev => {
  const client = clients.get(ev.player.id);
  // save player db
  client.db.save();
  // remove from the online map
  clients.delete(ev.player.id);
});

// for updating deaths and kills of players
events.on("afterEntityDie", ev => {
  // add deaths
  if (ev.deadEntity.typeId != "minecraft:player") return;
  const deadPlayer = clients.get(ev.deadEntity.id);
  deadPlayer.deaths++;
  // add kills
  if (ev.damageSource.damagingEntity?.typeId != "minecraft:player") return;
  const killer = clients.get(ev.damageSource.damagingEntity.id);
  killer.kills++;
});

// update sidebar
system.runInterval(() => {
  // get the date
  const d = new Date();
  const date =
    (d.getMonth() + 1).toString().padStart(2, '0') + '/' +
    d.getDate().toString().padStart(2, '0') + '/' +
    d.getFullYear().toString();

  clients.forEach(v => {
    // update playtime
    v.db.set('playtime', v.db.get('playtime', 0) + 1)
    v.db.save();
    // update stats
    v.player.onScreenDisplay.setActionBar(
      `§b§l${smpName} SMP§r §7(${date})\n` +
      `§7  Name: §1${v.name}\n` +
      `§7  Rank: ${ranks[v.rank]?.name || "§8Unknown"}\n` +
      `§7  Money: §a$${formatNumber(v.money)}\n` +
      `§7  Playtime: §3${msToString(v.playtime * 50)}\n` +
      `§7  Kills: §d${formatNumber(v.kills)}\n` +
      `§7  Deaths: §4${formatNumber(v.deaths)}\n` +
      `§7  Bounty: §e$${formatNumber(v.bounty)}\n` +
      v.sidebarTail
    );
  });
});

