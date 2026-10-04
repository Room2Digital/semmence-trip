# -*- coding: utf-8 -*-
# What to buy once you land, rather than carry.
# Perth first, then the Thailand top-up.

SHOPPING = [
 dict(
  id="perth",
  name="Perth, first few days",
  when="From 20 Nov",
  where="Coles or Woolworths · Chemist Warehouse · any sports shop",
  note=("You have seven weeks here and a kitchen at the Sebel, so this is a proper shop, "
        "not a top-up. Chemist Warehouse is substantially cheaper than a supermarket for "
        "toiletries and supplements — it's the one worth a dedicated trip."),
  items=[
   dict(name="Protein powder", crit=True,
        note="Chemist Warehouse or a sports shop beats the supermarket on price. Buy a tub "
             "sized for seven weeks — you won't be taking it to Thailand, so don't over-buy."),
   dict(name="Shampoo, conditioner, body wash",
        note="Only if the toiletries waiting for you don't already cover it."),
   dict(name="Aftersun or aloe",
        note="Perth in December catches everyone once. Cheaper here than regretting it."),
   dict(name="Laundry pods or sheets",
        note="The Sebel is self-service, so you need your own for the first stretch. "
             "Thailand is paid-for and you won't need these there."),
   dict(name="Reusable shopping bag",
        note="Supermarkets charge for bags and you're here seven weeks."),
   dict(name="Milk", note="First shop. The Sebel has a kitchen."),
   dict(name="Eggs", note=""),
   dict(name="Breakfast and kitchen basics",
        note="Coffee, cereal, bread — whatever stops you buying breakfast out every day "
             "for four weeks."),
   dict(name="Insect repellent, if yours is mild",
        note="Perth doesn't need much. Buy the serious DEET in Thailand instead, where it's "
             "stronger and cheaper."),
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
