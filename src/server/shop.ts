import {
  BaseFormBuilder,
  ActionFormBuilder,
  MessageFormBuilder,
  ModalFormBuilder,
  showForm,
  setTickTimeout,
  formatNumber,
} from "../catalyst/index.js";
import { Client } from "./client.js";
import { ItemStack } from "@minecraft/server";

interface shopItem {
  name: string, // name of the item
  id: string,   // item type id
  icon?: string,// icon for the item
  price: number,// price of the item
}

const items: shopItem[] = [
  {
    name: 'Iron Ingot',
    id: 'minecraft:iron_ingot',
    icon: 'textures/items/iron_ingot',
    price: 10,
  },
  {
    name: '§bGold Ingot',
    id: 'minecraft:gold_ingot',
    icon: 'textures/items/gold_ingot',
    price: 200,
  },
  {
    name: '§bDiamond',
    id: 'minecraft:diamond',
    icon: 'textures/items/diamond',
    price: 1000,
  },
  {
    name: '§dNetherite Ingot',
    id: 'minecraft:netherite_ingot',
    icon: 'textures/items/netherite_ingot',
    price: 25_000,
  },
  {
    name: '§dEmerald',
    id: 'minecraft:emerald',
    icon: 'textures/items/emerald',
    price: 40_000,
  },
];


export function showShop(plr: Client) {
  const shopForm = new ActionFormBuilder()
    .setId('shopmenu')
    .title('§l§dshop')
    .body('buy items here');

  // set each item
  for (const item of items) {
    shopForm.button(item.name + '\n' + '§r§a$' + formatNumber(item.price) + ' each',
                    item.icon, (ctx) => {

      const itemStack = new ItemStack(item.id);

      const purchaseDialog = new ModalFormBuilder()
        .title('§l§cpurchase item: §r' + item.name)
        .slider('amount', 'amount to buy', 1, itemStack.maxAmount, 1, 1)
        .slider('stacks', 'stacks to buy', 1, 30, 1, 1)
        .cancel((ctx, reason) => {
          ctx.back()
        });

      // submission handler
      purchaseDialog.submit((ctx, res) => {
        const amount = res.amount as number;
        const stacks = res.stacks as number;

        const totalPrice = item.price * amount * stacks;
        const changeMoney = plr.money - totalPrice;

        // player's money is not enough
        if (changeMoney < 0) {
          const insufficientMoneyDialog = new MessageFormBuilder()
            .title('§cinsufficient money')
            .message('you dont have enough money to buy this item!\n' +
                     'price per unit: §a$' + formatNumber(item.price) + '§r\n' +
                     'amount to buy: §6' + amount + '§r\n' +
                     'stacks to buy: §6' + stacks + '§r\n' +
                     'total price: §c$' + formatNumber(totalPrice) + '§r\n' +
                     'your current money: §c$' + formatNumber(plr.money))
            .btn1('go back', (ctx) => {
              ctx.back();
            })
            .btn2('cancel item', (ctx) => {
              ctx.backto('shopmenu');
            })
            .cancel((ctx, reason) => {
              ctx.back();
            });

          // show insufficient money
          ctx.goto(insufficientMoneyDialog);
          return;
        }

        // setup this dialog
        const confirmDialog = new MessageFormBuilder()
          .title('§l§9confirm purchase')
          .message('do you really want to buy: ' + item.name + '§r\n' +
                   'price per unit: §a$' + formatNumber(item.price) + '§r\n' +
                   'amount to buy: §6' + amount + '§r\n' +
                   'stacks to buy: §6' + stacks + '§r\n' +
                   'total price: §c$' + formatNumber(totalPrice) + '§r\n' +
                   'your current money: §e$' + formatNumber(plr.money) + '§r\n' +
                   'your change will be: §e$' + formatNumber(changeMoney))
          .btn1('§ccontinue', (ctx) => {
            // set-up some stuff..
            plr.money -= totalPrice;
            itemStack.amount = amount;
            const inv = plr.player.getComponent('minecraft:inventory').container;

            // give the items
            for (let i = 0; i < stacks; i++) {
              if (inv.emptySlotsCount == 0) // player's inv is full
                plr.player.dimension.spawnItem(itemStack, plr.player.location);
              else
                plr.giveItem(itemStack);
            }

            // send message
            plr.msg('§ayou bought §6' + item.name +
                    '§r§b x' + amount + '§a, ' +
                    '§6' + stacks + '§a stacks ' +
                    'for §c$' + formatNumber(totalPrice));
            ctx.backto('shopmenu');
          })
          .btn2('§acancel', (ctx) => {
            ctx.back();
          })
          .cancel((ctx, reason) => {
            ctx.back();
          });

        // show the confirmation dialog
        ctx.goto(confirmDialog);
      });

      // show this form
      ctx.goto(purchaseDialog);
    });
  }

  // handle cancel
  shopForm.cancel((ctx, reason) => {
    if (reason == 'UserBusy')
      setTickTimeout(() => ctx.goto(shopForm));
    else
      plr.msg('§eshop closed');
  });

  // show this form
  showForm(shopForm, plr.player);
}

