# -*- coding: utf-8 -*-
# What to buy once you land, rather than carry.
# Perth first, then the Thailand top-up.

SHOPPING = [
 dict(
  id="perth",
  name="Perth, first few days",
  when="From 20 Nov",
  where="Coles or Woolworths · Chemist Warehouse · BWS or Liquorland",
  note=("You have seven weeks here and a kitchen at the Sebel, so this is a proper shop, "
        "not a top-up. No protein powder and no blender: the daily smoothie comes from "
        "Boost, where protein is already in the menu option."),
  items=[
   dict(name="Aftersun or aloe",
        note="Perth in December catches everyone once. Cheaper here than regretting it."),
   dict(name="Washing machine pods",
        note="The Sebel is self-service, so you need your own for the first stretch. "
             "Thailand is paid-for and you won't need these there — don't buy a big box."),
   dict(name="Dryer sheets",
        note="Only worth it if the machine is a washer-dryer or there's a dryer in the "
             "building. Worth checking on arrival before you buy."),
   dict(name="Milk", note="First shop. The Sebel has a kitchen."),
   dict(name="Eggs", note=""),
   dict(name="Breakfast and kitchen basics",
        note="Cereal, bread — whatever stops you buying breakfast out every day for four "
             "weeks. No coffee: there's no machine, so that's a cafe purchase."),
   dict(name="Spreadable butter", note=""),
   dict(name="Vegemite",
        note="Yeast extract, same family as Marmite but saltier, darker and less sweet. "
             "Spread it far thinner than you would Marmite."),
   dict(name="Kitchen roll", note=""),
   dict(name="Six pack of beer",
        note="Not in Coles or Woolworths — WA supermarkets don't sell alcohol. "
             "Liquorland, BWS or Dan Murphy's, usually attached to the same centre."),
  ],
 ),
 dict(
  id="thailand",
  name="Thailand top-up",
  when="From 7 Jan",
  where="7-Eleven, Boots or any pharmacy",
  note=("Deliberately short. Everything here is cheap, everywhere, and carrying it from "
        "Australia is pointless — especially with the cases going into storage on the 10th."),
  items=[
   dict(name="DEET insect repellent", crit=True,
        note="Stronger and cheaper than anything you'd bring. Khao Sok is jungle on water "
             "and the lake is worst at dusk."),
   dict(name="Suncream top-up",
        note="You'll have burned through the decanted 100 ml by Samui."),
   dict(name="Elephant pants", crit=True,
        note="Your temple trousers. Buy them in Bangkok on the 11th, before the Grand Palace "
             "and Wat Phra Kaew — the dress code is enforced at the gate, not politely overlooked."),
   dict(name="Small dry bag, if you haven't bought one at home",
        note="Beach shops in Samui and Krabi sell them everywhere. Needed before Khao Sok on the 17th."),
   dict(name="Cheap flip-flops",
        note="The pair you leave behind. Beach, boat and bathroom."),
  ],
 ),
]
