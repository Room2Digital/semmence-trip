# -*- coding: utf-8 -*-
# The six flights. Nothing else — the stays are not legs, and neither are the
# surface hops (Samui to Khao Sok to Krabi), because nothing gets repacked for
# a car or a longtail. This file is only for the days a bag changes hands.
#
# Each leg holds a list of bags. Every bag has a mode, which is what the sash
# on the tile says and the only thing that really matters at the airport:
#
#   cabin    comes on board with you
#   checked  goes in the hold
#   worn     on your body, not in a bag
#   left     not on this leg at all (in storage, or handed over)
#
# key=1     a leg where the bags genuinely change hands
# stored=1  the suitcases are in Smilelugg for this leg, so anything with
#           fate="store" is filtered out of the available pool.


def P(n, note="", add=False, inside=None):
    """inside = the contents of a container (a washbag). They render as their
    own tickable lines nested under it, rather than being listed in its note."""
    d = dict(n=n)
    if note:
        d["note"] = note
    if add:
        d["add"] = True
    if inside:
        d["inside"] = inside
    return d


def B(bag, mode, items, note="", ids=None):
    """ids lists the items.py ids this bag accounts for on this leg.
    build.py uses it to prove nothing in the inventory has been forgotten."""
    d = dict(bag=bag, mode=mode, items=items, note=note)
    if ids:
        d["ids"] = ids
    return d


LEGS = [
    dict(
        id="lon-per",
        name="London – Perth",
        dates="19–20 Nov",
        where="LGW → DOH → PER",
        via="QR 330 · QR 900 · Qatar Business",
        key=1,
        note=(
            "About 26 hours door to door, and it starts at the Gatwick hotel on the 18th — "
            "so the cabin bag has to cover that night without opening a suitcase. Qatar "
            "Business gives you 40 kg checked and two cabin pieces at 15 kg plus a personal "
            "item, so all three carry-ons travel with you. Qsuite: pyjamas and bedding provided. "
            "This is the one leg where the entire inventory is in play, so every item you own "
            "for this trip is listed below."
        ),
        do=[
            P("Collect the Sainsbury's travel money", "Order STM30429677 — THB 25,000 and AUD 200, £707.30, already paid. Count it at the counter."),
            P("Buy the small dry bag and the goggles", "The last two outstanding items."),
            P("Download offline maps", "Perth, Bangkok, Samui, Krabi. Plus WhatsApp, Line, GetYourGuide and Bolt on your apps page."),
        ],
        bags=[
            B("SL", "cabin", [
                P("Passport — trackable holder"),
                P("Driving licence, physical card", "Needed for the Avis hire car on 29 Dec. Photos and photocopies are refused."),
                P("Bank cards x2", "Two providers, so one being blocked is not the end of it."),
                P("Cash — GBP float", "Gatwick, and the taxi home on the 24th."),
                P("Cash — THB 25,000", "Ref STM30429677. Split it between here and a case — not 25,000 in one pocket."),
                P("Cash — AUD 200", "Emergency float. Australia is effectively cashless."),
                P("Phone"),
                P("AirPods Pro"),
                P("Power bank, small", "Cabin only, never checked."),
                P("Global SIM — 2 months", "Already organised, covers both countries."),
                P("Sunglasses — daily pair"),
                P("Snacks"),
                P("Thai notepad"),
                P("Thailand Digital Arrival Card", "Complete it online 4–6 Jan. Save the QR offline."),
                P("Australian ETA"),
                P("Travel insurance — policy and 24hr number"),
                P("All 8 flight confirmations", "Saved offline."),
                P("Accommodation confirmations", "Saved offline."),
                P("Baggage receipts — JQ71 and TG206"),
                P("Smilelugg receipt — 14XIWBX4"),
                P("Bangkok taxi — booking 911245279"),
                P("Phone apps page", "WhatsApp, Line, GetYourGuide, Bolt, Ticketmaster."),
            ],
               ids=["passport","licence","cards","cash-gbp","cash-thb","cash-aud","phone",
                    "airpods","brick-sm","esim","sunglasses-daily","snacks","notepad","tdac","eta-aus",
                    "insurance","flights-off","hotels-off","bag-conf","storage-receipt","taxi-conf","apps"]),

            B("BP", "cabin", [
                P("iPad Air", "The main one, not the one being handed over in Phuket."),
                P("Sony over-ear headphones", "The flight you bought them for."),
                P("USB-C dongle"),
                P("HDMI cable"),
                P("Fold-up 3-in-1 charger", "Watch, phone and AirPods from one plug."),
                P("Extendable USB-C cable"),
                P("Mouth tape"),
                P("Eye mask"),
                P("Earplugs"),
                P("Compression socks", "Worth it on a 26-hour door to door."),
                P("Larq bottle, empty", "Fill it after security."),
            ],
               ids=["ipad-air","sony","dongle","hdmi","compression","larq",
                    "charger-3in1","cable-ext","mouthtape","eyemask","earplugs"]),

            B("CB", "cabin", [
                P("Two mini washbags", "The non-liquids. Anything under 100 ml lives in the clear liquids bag below.", inside=[
                    P("Travel facewash"),
                    P("Electric shaver", "The cable is in Suitcase 2 — it only needs charging every few days."),
                    P("Electric toothbrush"),
                    P("Moisturiser", "Three sectors of dry cabin air, and a shave before landing."),
                    P("Paracetamol"),
                    P("Imodium"),
                    P("Ibuprofen"),
                ]),
                P("Clear 1L liquids bag", "Cleared twice, Gatwick and Doha. Pull it out before you join the queue.", inside=[
                    P("Mini toothpaste"),
                    P("Mini shaving foam"),
                    P("Aftershave atomiser"),
                    P("Roll-on deodorant", "The one you are using. Two spares are in Suitcase 2."),
                    P("Hand sanitiser"),
                    P("Lip balm with SPF"),
                ]),
                P("Prescription medication", "Original packaging. Cabin, never the hold."),
                P("MacBook Air", "You are working from Perth from 23 Nov."),
                P("60W USB-C mains supply", "The one that charges the Air. The fold-up 3-in-1 will not."),
                P("Mouse"),
                P("2 boxers"),
                P("2 white socks"),
                P("2 T-shirts"),
                P("1 gym top"),
                P("1 gym shorts"),
                P("1 gym socks"),
                P("1 swim shorts"),
                P("Running shoes"),
                P("Microfibre towel, mini"),
            ],
               ids=["washbag-mini","facewash","shaver","etoothbrush","moisturiser",
                    "paracetamol","imodium","ibuprofen",
                    "liquids-bag","toothpaste-mini","shave-foam","aftershave","deodorant",
                    "sanitiser","lipbalm","prescriptions",
                    "mba","mouse","plug-uk","running","towel-sm"]),

            B("L1", "checked", [
                P("8 nice shirts"),
                P("12 T-shirts", "Minus the 2 already in the cabin bag."),
                P("6 shorts"),
                P("1 trousers"),
                P("8 boxers", "Minus the 2 in the cabin bag."),
                P("8 white socks", "Minus the 2 in the cabin bag."),
                P("3 gym socks"),
                P("3 gym tops"),
                P("2 gym shorts"),
                P("2 swim shorts", "One of them is in the cabin bag."),
                P("Belt"),
                P("3 hats"),
                P("1 gym hat"),
                P("Hoodie", "Not worn. You want it for the flight home in January, not this one."),
                P("Tracksuit bottoms", "Same — it comes back out on the 23rd."),
                P("Windbreaker", "Packs to nothing. It is what stands between you and a British 06:35 landing."),
                P("Sunglasses — 4 pairs in a travel case", "The cheap ones. The daily pair stays on you."),
                P("Old trainers"),
                P("Sandals"),
                P("Sliders"),
                P("Microfibre towel, large"),
            ],
               ids=["shirts-nice","tees","shorts","trousers","boxers","socks-white","socks-gym","gym-tops",
                    "gym-shorts","swim","belt","hats","hat-gym","hoodie","tracksuit","windbreaker",
                    "sunglasses","trainers-old","sandals","sliders","towel-lg"]),

            B("L2", "checked", [
                P("Large fold-out washbag", "Everything that is not on you.", inside=[
                    P("Suncream — full size", "Buy the big Australian bottle on arrival as well."),
                    P("Travel suncream", "All the suncream travels together in the case."),
                    P("Roll-on deodorant — 2 spare"),
                    P("Shaver cable", "Not USB-C at both ends, so nothing else will charge it. In the case, not on you."),
                    P("Mosquito spray", "Buy stronger DEET in Bangkok; this covers you until then."),
                    P("Eye cream"),
                    P("Nail clippers"),
                    P("5 decant bottles, 100 ml", "Filled in Phuket before the full-size goes into storage."),
                    P("Small medical pouch"),
                    P("Motion sickness tablets", "You need these for the 06:00 Donsak ferry on 17 Jan, and this case is in Bangkok storage from the 10th. Move them to the mini washbag at the Phuket repack."),
                    P("Antihistamine"),
                    P("Antiseptic cream"),
                    P("Plasters and blister plasters", "Dragon Crest on 21 Jan. Same storage problem as the motion sickness tablets."),
                    P("Rehydration sachets"),
                    P("Athlete's foot cream"),
                ]),
                P("MacBook Pro", "For the Phuket handover. In the case, not the cabin bag."),
                P("iPad mini", "Same handover."),
                P("Nintendo Switch"),
                P("PS5 controller", "Remote play on the plane home. Starlink will cover you."),
                P("Switch HDMI cable"),
                P("Universal travel adapter with USB-C"),
                P("3 TSA padlocks"),
                P("Luggage scales", "What gets the cabin bag under 7 kg in Phuket."),
                P("4 packing cubes", "Pre-pack these: Cube 1 clothing, Cube 2 gym and footwear, Cube 3 kit."),
                P("Lockable daypack"),
                P("2 dirty laundry bags"),
                P("5 bin bags"),
                P("Small dry bag", "Still to buy."),
                P("Swimming goggles", "Still to buy."),
            ],
               ids=["washbag-lg","suncream","suncream-tr","deodorant-spare","cable-shaver",
                    "decant","mozzie","eyecream","nail",
                    "medkit","motion","antihistamine","antiseptic","plasters","rehydration","athletes",
                    "mbp","ipad-mini","switch","ps5-pad","hdmi-switch","adapter-universal",
                    "locks","scales","cubes","daypack","laundry-bag","binbags","drybag","goggles"]),

            B("worn", "worn", [
                P("Apple Watch", "On your wrist on every leg. It never goes in a bag."),
                P("Nice trainers", "Wear the bulkiest footwear rather than packing it."),
                P("T-shirt"),
                P("Light trousers"),
                P("Qatar pyjamas — nothing to pack", "Given to you on board and they do not take them back, so you have them from the 19th. That is your sleepwear for the whole trip."),
            ],
               ids=["trainers-nice","pyjamas","watch"]),
        ],
    ),
    dict(
        id="per-hkt",
        name="Perth – Phuket",
        dates="7 Jan",
        where="PER → HKT",
        via="JQ 71 · Jetstar · 07:25",
        key=1,
        note=(
            "Very early start from Scarborough. You have 40 kg of hold baggage prepaid across "
            "as many bags as you like, so check all three — both cases AND the cabin bag — and "
            "walk on with just the backpack and sling. Jetstar cabin is two items, 7 kg combined, "
            "and they weigh it at the gate."
        ),
        do=[
            P("Pack the night of the 5th", "Not the morning of the 7th. The flight is at 07:25."),
            P("Pre-pack the three cubes", "Cube 1 clothing, Cube 2 gym and footwear, Cube 3 kit. This is what makes the Phuket repack ten minutes instead of an hour."),
            P("Spend or leave the AUD", "Australia is behind you. Any Australian cash is dead weight from here."),
        ],
        bags=[
            B("SL", "cabin", [
                P("Passport, phone, cards, daily sunglasses, AirPods, mini charger brick"),
                P("The baht", "All three bags are checked on this leg. Cash does not go in the hold."),
                P("Prescriptions and the liquids bag", "Never in the hold."),
            ]),
            B("BP", "cabin", [
                P("iPad Air, chargers, Larq"),
                P("Anything you want in the air", "Five and a half hours, no seat-back entertainment worth the name."),
            ]),
            B("CB", "checked", [
                P("Packed as normal", "It goes in the hold here — there is nothing in it you need for five hours, and the prepaid 40 kg covers it."),
            ]),
            B("L1", "checked", [P("Cubes 1, 2 and 3 near the top", "You open this case once, in Phuket, and you want the cubes to be the first thing you see.")]),
            B("L2", "checked", [P("Everything else"), P("The Perth surplus", "Whatever you bought and are keeping.")]),
            B("worn", "worn", [P("Apple Watch"), P("Trainers and a layer", "The plane is cold, Phuket is not.")]),
        ],
    ),
    dict(
        id="hkt-bkk",
        name="Phuket – Bangkok",
        dates="10 Jan",
        where="HKT → BKK",
        via="TG 206 · Thai Airways · 11:50",
        key=1,
        stored=1,
        note=(
            "The tightest leg of the trip. Thai Economy gives you ONE cabin piece at 7 kg, and "
            "both checked allowances are taken by the suitcases — so the cabin bag has to come "
            "down under 7 kg before you leave the Courtyard. Land 13:20, then straight to "
            "Smilelugg on B Floor: lift the three cubes out of the cases into the cabin bag, "
            "lock the cases, hand them over. Ref 14XIWBX4, paid, 10–23 Jan."
        ),
        do=[
            P("Hand over the MacBook Pro and iPad mini", "Early in the three days, not on the morning you leave."),
            P("Decant the suncream", "Fill the 100 ml bottles before the full-size goes into storage for a fortnight."),
            P("Weigh the cabin bag before you leave the room", "Under 7 kg. The only number that matters today."),
            P("Photograph the Smilelugg receipt", "Your taxi waits 45 minutes, so this is not a rush."),
        ],
        bags=[
            B("worn", "worn", [P("Apple Watch")]),
            B("SL", "cabin", [P("As always", "Passport, phone, cards, cash, sunglasses, prescriptions, liquids.")]),
            B("BP", "cabin", [P("Your personal item", "Thai allow a handbag under 1.5 kg alongside the one cabin piece. Keep it genuinely small today.")]),
            B("CB", "cabin", [
                P("Toiletries — both mini washbags and the decant bottles", "About 1.3 kg."),
                P("Full health kit", "About 0.5 kg."),
                P("iPad Air, chargers, power bank, shaver and cable", "About 1.7 kg."),
                P("One change of clothes", "Insurance only — you are back into the cases three hours later."),
                P("TARGET: under 7 kg", "Weigh it. Everything else waits in the cubes."),
            ]),
            B("L1", "checked", [
                P("CUBE 1 — clothing", "5 tees, 3 shorts, 2 nice shirts, 1 trousers, 5 boxers, 3 socks, 2 swim shorts. About 4 kg."),
                P("CUBE 2 — gym and footwear", "Gym top, shorts, socks, running shoes, sandals, sliders. About 2.5 kg. Shoes in a bin bag inside the cube."),
                P("CUBE 3 — kit", "Mini towel, dry bag, laundry and bin bags, goggles, daypack, locks. About 1.4 kg."),
                P("Larq bottle, loose", "Too awkward for a cube. Keep it near the top with them."),
            ]),
            B("L2", "checked", [
                P("Staying behind for 13 days", "MacBook Air and its kit, Sony over-ears, Switch, PS5 pad, 4-pair sunglasses case, the Perth clothing surplus, old trainers, hoodie, tracksuit, large washbag, full-size suncream, large towel, driving licence. About 9 kg between the two cases."),
            ],
        ),
        ],
    ),
    dict(
        id="bkk-usm",
        name="Bangkok – Koh Samui",
        dates="13 Jan",
        where="BKK → USM",
        via="PG 133 · Bangkok Airways",
        stored=1,
        note=(
            "Bangkok Airways allow only 5 kg in the cabin, but 20 kg checked is included — so "
            "the cabin bag goes in the hold on this one and you keep the backpack and sling. "
            "Leave Theatre Residence by 08:00: check-out is 12:00 but PG 133 does not wait."
        ),
        do=[
            P("Buy DEET before you leave Bangkok", "Stronger and cheaper here than anything you would have carried from home."),
            P("BOOK THE DONSAK FERRY", "Still outstanding. 17 Jan, the 06:00 sailing — it docks 07:30 and leaves real margin; the 07:00 leaves you 25 minutes."),
            P("Confirm the 500 Rai pick-up time", "Before you book the ferry, not after."),
            P("Warn Hansar about the 17th", "You leave before any normal breakfast."),
            P("Take a motion sickness tablet the night before the 17th", "1h30 of open water at 06:00. Easy to forget once you are on the beach."),
            P("Dry bag ready for Khao Sok", "Everything after Samui is boats — the Donsak ferry, then an open longtail onto the lake and back off it. Pack the dry bag once and leave it packed; there is no repack between Samui, Khao Sok and Krabi."),
        ],
        bags=[
            B("worn", "worn", [P("Apple Watch")]),
            B("SL", "cabin", [P("As always")]),
            B("BP", "cabin", [P("Day kit", "Dry bag, mini towel, daily sunglasses, suncream, Larq."), P("iPad and chargers", "The cabin bag is in the hold, so anything you want on the way travels here.")]),
            B("CB", "checked", [P("Packed as it is", "5 kg cabin is not worth fighting. It goes in the hold and comes back to you at Samui.")]),
            B("L1", "left", [P("At Smilelugg, Bangkok", "Collected 23 Jan.")]),
            B("L2", "left", [P("At Smilelugg, Bangkok", "Collected 23 Jan.")]),
        ],
    ),
    dict(
        id="kbv-bkk",
        name="Krabi – Bangkok",
        dates="23 Jan",
        where="KBV → BKK",
        via="TG 246 · Thai Airways · 12:45",
        stored=1,
        note=(
            "Check-out is 12:00 and the flight is at 12:45, so leave Ao Nang around 10:00. "
            "One checked bag included, which is the cabin bag — take the pressure off and put "
            "it in the hold, because you are collecting two suitcases at the other end anyway."
        ),
        do=[
            P("Repack the night of the 22nd", "Storage collection and a long-haul on the same day. Do not start this at breakfast."),
            P("Keep the Smilelugg ref to hand", "14XIWBX4. The counter is landside on B Floor, so you clear arrivals first."),
        ],
        bags=[
            B("worn", "worn", [P("Apple Watch")]),
            B("SL", "cabin", [P("As always")]),
            B("BP", "cabin", [P("iPad, chargers, Larq")]),
            B("CB", "checked", [P("In the hold", "One checked bag is included and you have a 4h45 connection to use.")]),
            B("L1", "left", [P("Collected at BKK", "Not on this flight — you pick it up at Smilelugg after you land.")]),
            B("L2", "left", [P("Collected at BKK")]),
        ],
    ),
    dict(
        id="bkk-lon",
        name="Bangkok – London",
        dates="23–24 Jan",
        where="BKK → DOH → LHR",
        via="QR 835 · QR 107 · Qatar Business",
        key=1,
        note=(
            "TG 246 lands 14:10, QR 835 leaves 18:55 — 4h45 to clear arrivals, collect both "
            "cases from Smilelugg on B Floor and re-check everything. Qatar give you 40 kg "
            "across any number of bags, so weight is not the problem; time is. Lands Heathrow "
            "06:35 on the 24th, in January, straight off a plane from 30°C."
        ),
        do=[
            P("Collect from Smilelugg first", "Ref 14XIWBX4. B Floor, landside, about 50 m past the ticket kiosk from the SA City Line entrance."),
            P("Pull the hoodie and tracksuit out before you re-check", "Heathrow at 06:35 in January. This is the whole reason they came."),
            P("Keep the shaver, foam and moisturiser in the cabin bag", "Thirteen hours to London and a 06:35 landing — you will want a shave in the Doha lounge."),
        ],
        bags=[
            B("SL", "cabin", [P("As always"), P("Any leftover baht", "Spend it airside or keep it for next time.")]),
            B("BP", "cabin", [
                P("Sony over-ears", "Back in your hands after 13 days in storage."),
                P("iPad Air, chargers, Larq"),
                P("Compression socks"),
            ]),
            B("CB", "cabin", [
                P("Switch, PS5 controller and HDMI", "Thirteen hours Bangkok to Doha to London. This is what they are for."),
                P("Shaver, shaving foam and moisturiser", "Do NOT let these go into the cases when you re-check."),
                P("Shaving foam into the liquids bag", "You clear security again at Bangkok and at Doha."),
                P("One change of clothes"),
            ]),
            B("L1", "checked", [P("Re-checked to London", "Collected from storage, repacked, straight back in the hold.")]),
            B("L2", "checked", [P("Re-checked to London", "Everything you are not using on the flight.")]),
            B("worn", "worn", [P("Apple Watch"), P("Hoodie and tracksuit bottoms", "Out of the case before you re-check, not after you land.")]),
        ],
    ),
]
