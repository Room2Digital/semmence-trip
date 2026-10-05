# -*- coding: utf-8 -*-
# Day bags — what comes off the main pack for a specific day out.
# Each item is either a reference to something already on the main list (ref=id)
# or a one-off for that day.

DAYBAGS = [
 dict(
  id="rottnest",
  name="Rottnest Island",
  date="2027-01-02",
  dates="Sat 2 Jan",
  bag="Lockable daypack",
  where="Fremantle → Thomson Bay",
  note=("Ferry out 09:00 from O'Connor Landing, e-bikes 09:30–15:30 from Pedal & Flipper, "
        "ferry back 16:00. Booking 2G6JZV, 3 adults, same-day return — the fare includes the "
        "island admission. Be at the terminal by 08:30; boarding closes 08:50."),
  warn=("Six hours on a bike in peak Australian summer with almost no shade, and you're "
        "drinking. This is the single most sunburn-and-dehydration-prone day of the whole trip. "
        "The bikes are due back at 15:30 and the last ferry is 16:00 — that is 30 minutes of "
        "margin, so do the drinking at Hotel Rottnest at the end, near the jetty, not at a "
        "far bay."),
  items=[
   dict(name="Larq bottle, filled", ref="larq", g=500, crit=True,
        note="Filling stations at Thomson Bay, Geordie Bay and The Basin, with long stretches "
             "between them. Freeze it the night before."),
   dict(name="Water, a second 1.5 litres", ref=None, g=1500, crit=True,
        note="One litre is not six hours on a bike in an Australian summer."),
   dict(name="Body suncream", ref="suncream", g=200, crit=True,
        note="Before you leave the ferry, then again at every beach stop."),
   dict(name="Face suncream", ref="suncream-face", g=50, crit=True),
   dict(name="Microfibre towel, large", ref="towel-lg", g=340, crit=True),
   dict(name="Mini shower gel", ref="showergel", g=60,
        note="For the rinse before drinks at Hotel Rottnest."),
   dict(name="Mini face wash", ref="facewash", g=90),
   dict(name="Moisturiser", ref="moisturiser", g=100),
   dict(name="Roll-on deodorant", ref="deodorant", g=100),
   dict(name="Hat", ref="hats", g=100, crit=True,
        note="Has to stay on at bike speed. A strap, or wear it backwards."),
   dict(name="Sunglasses", ref="sunglasses-daily", g=120, crit=True),
   dict(name="Swim shorts — worn under", ref="swim", g=100, crit=True,
        note="Changing facilities are thin away from the settlement."),
   dict(name="Dry bag", ref="drybag", g=120, crit=True,
        note="Phone, wallet and keys while you swim. Bags are not watched at the bays."),
   dict(name="Power bank", ref="brick-sm", g=200,
        note="Maps, photos and the return ferry QR all live on your phone."),
   dict(name="Card and some cash", ref="cards", g=20,
        note="Take a bit of the AUD 200 float — this is the sort of day it exists for."),
   dict(name="T-shirt, dry", ref="tees", g=150, crit=True,
        note="You will be salty, sunburnt and damp at 16:00 and the ferry air con is cold."),
   dict(name="Shorts, dry", ref="shorts", g=200, crit=True),
   dict(name="2 boxers", ref="boxers", g=70, crit=True),
   dict(name="1 socks", ref="socks-white", g=40),
   dict(name="Sliders", ref="sliders", g=280,
        note="For after the bikes go back. Six hours in cycling shoes is enough."),
   dict(name="Snacks", ref=None, g=200,
        note="Food away from Thomson Bay is essentially nothing."),
   dict(name="Plasters", ref="plasters", g=30,
        note="Saddle soreness and a blister from wet feet in dry shoes are the likely two."),
   dict(name="Ferry booking 2G6JZV", ref=None, g=0, crit=True,
        note="Saved offline. Show the barcode to the crew at the vessel."),
  ],
 ),
 dict(
  id="cricket",
  name="BBL at Optus Stadium",
  date="2026-12-26",
  dates="Sat 26 Dec",
  bag="Sling bag only",
  where="Perth Scorchers v Melbourne Stars",
  note=("18:15 to 22:15, Boxing Day. Four tickets at A$74 each, bought through Ticketmaster — "
        "they live in the Ticketmaster app, so have it installed and logged in before you go."),
  warn=("Bag rules are enforced: nothing larger than 40 x 30 cm, and some events ban backpacks "
        "entirely. Take the sling, not the daypack. A sealed or empty water bottle is fine, "
        "glass and cans are not."),
  items=[
   dict(name="Tickets in the Ticketmaster app", ref=None, g=0, crit=True,
        note="Downloaded before you leave — stadium wifi at a full house is not something to rely on."),
   dict(name="Phone", ref="phone", g=220, crit=True),
   dict(name="Mini charger brick", ref="brick-sm", g=200,
        note="18:15 to 22:15 with the tickets on your phone."),
   dict(name="Decanted suncream", ref="suncream-tr", g=80, crit=True,
        note="A 18:15 start in December still has hours of sun on you."),
   dict(name="Sunglasses", ref="sunglasses-daily", g=120),
   dict(name="Card", ref="cards", g=20, note="The stadium is cashless."),
  ],
 ),
]
