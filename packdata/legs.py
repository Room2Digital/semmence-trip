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
# allow     what the airline lets you take: checked and cabin. Shown on the
#           leg as two icons and a figure, nothing else — it is there to be
#           read at a glance against the weights the app works out.
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
    """ids lists the items.py ids this bag accounts for on this leg, which is
    how build.py proves nothing in the inventory has been forgotten.

    An entry can also be ("tees", 8), meaning 8 of the 12 T-shirts are in this
    bag. Weight is counted pro-rata. Without that, a bag carrying 8 of 12
    shirts was being charged for all 12, which overstated the cabin bag by
    more than two kilos."""
    d = dict(bag=bag, mode=mode, items=items, note=note)
    if ids:
        d["ids"] = ids
    return d


LEGS = [
    dict(
        id="lon-per",
        allow=dict(checked="40 kg", cabin="2 × 15 kg"),
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
                P("Passport"),
                P("Driving licence"),
                P("Bank cards x2", "Two providers, so one being blocked is not the end of it."),
                P("Cash — THB 25,000", "Ref STM30429677. Split it between here and a case — not 25,000 in one pocket."),
                P("Cash — AUD 200", "Emergency float. Australia is effectively cashless."),
                P("Phone"),
                P("AirPods Pro"),
                P("Power bank, small", "Cabin only, never checked."),
                P("Sunglasses"),
                P("Snacks"),
                P("Australian ETA"),
            ],
               ids=["passport","licence","cards","cash-thb","cash-aud","phone",
                    "airpods","brick-sm","sunglasses-daily","snacks","eta-aus"]),

            B("BP", "cabin", [
                P("Book", "The one thing that works with the seatbelt sign on and the tray table up."),
                P("Nintendo Switch", "With you until Bangkok, where it goes into the stored case and waits for the flight home."),
                P("iPad Air", "The main one, not the one being handed over in Phuket."),
                P("Sony over-ear headphones", "The flight you bought them for."),
                P("Fold-up 3-in-1 charger", "Watch, phone and AirPods from one plug."),
                P("Extendable USB-C cable"),
                P("Mouth tape"),
                P("Eye mask"),
                P("Earplugs"),
                P("Compression socks", "Worth it on a 26-hour door to door."),
                P("Larq bottle, empty", "Fill it after security."),
            ],
               ids=["book","switch","ipad-air","sony","compression","larq",
                    "cable-ext","mouthtape","eyemask","earplugs"]),

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
                P("Fold-up 3-in-1 charger"),
                P("Mouse"),
                P("USB-C dongle"),
                P("HDMI cable"),
                P("PS5 controller", "Remote play. Starlink will cover you."),
                P("Switch HDMI cable"),
                P("3 boxers"),
                P("3 white socks"),
                P("3 T-shirts"),
                P("1 shorts"),
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
                    "mba","mouse","dongle","hdmi","ps5-pad","hdmi-switch",
                    "plug-uk","charger-3in1","running","towel-sm"]),

            B("L1", "checked", [
                P("8 nice shirts"),
                P("12 T-shirts", "Minus the 3 already in the cabin bag."),
                P("6 shorts", "Minus the 1 in the cabin bag."),
                P("1 trousers"),
                P("8 boxers", "Minus the 3 in the cabin bag."),
                P("8 white socks", "Minus the 3 in the cabin bag."),
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
                    P("Toothpaste — full size", "The mini one is with you; this is the backup."),
                    P("Shaver cable", "Not USB-C at both ends, so nothing else will charge it. In the case, not on you."),
                    P("Mosquito spray", "Buy stronger DEET in Bangkok; this covers you until then."),
                    P("Eye cream"),
                    P("Nail clippers"),
                    P("5 decant bottles, 100 ml", "Filled in Phuket before the full-size goes into storage."),
                    P("Small medical pouch"),
                    P("Antihistamine"),
                    P("Antiseptic cream"),
                    P("Plasters and blister plasters", "Dragon Crest on 21 Jan — move these into the mini washbag in Phuket too."),
                    P("Rehydration sachets"),
                    P("Athlete's foot cream"),
                ]),
                P("MacBook Pro", "For the Phuket handover. In the case, not the cabin bag."),
                P("iPad mini", "Same handover."),
                P("Universal travel adapter with USB-C"),
                P("Travel keyboard — ProtoArc XK01"),
                P("Luggage scales", "What gets the cabin bag under 7 kg in Phuket."),
                P("4 packing cubes", "Pre-pack these: Cube 1 clothing, Cube 2 gym and footwear, Cube 3 kit."),
                P("Lockable daypack"),
                P("Thai notepad"),
                P("2 dirty laundry bags"),
                P("5 bin bags"),
                P("Small dry bag", "Still to buy."),
                P("Swimming goggles", "Still to buy."),
            ],
               ids=["washbag-lg","suncream","suncream-tr","deodorant-spare","toothpaste","cable-shaver",
                    "keyboard","decant","mozzie","eyecream","nail",
                    "medkit","antihistamine","antiseptic","plasters","rehydration","athletes",
                    "mbp","ipad-mini","adapter-universal","scales","cubes","daypack","notepad","laundry-bag","binbags","drybag","goggles"]),

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
        allow=dict(checked="40 kg", cabin="7 kg"),
        name="Perth – Phuket",
        dates="7 Jan",
        where="PER → HKT",
        via="JQ 71 · Jetstar · 07:25",
        key=1,
        note=(
            "Very early out of Scarborough. You have 40 kg of hold baggage prepaid across as "
            "many bags as you like, so all three go in the hold — both cases AND the cabin bag — "
            "and you walk on with the backpack and sling only. Jetstar's cabin allowance is two "
            "items, 7 kg combined, weighed at the gate."
        ),
        do=[
            P("Pack the night of the 5th", "Not the morning of the 7th. The flight is 07:25 and you are coming from Scarborough."),
            P("Pre-pack the three cubes", "Cube 1 clothing, Cube 2 gym and footwear, Cube 3 kit — all into the cabin bag now. It is in the hold today, and from Phuket it becomes your only bag, so packing it properly here is what makes that changeover quick."),
            P("Complete the Thailand Digital Arrival Card", "Online, within 3 days of landing in Phuket, so 4–6 Jan. Mandatory for every foreign national. Save the QR offline."),
            P("Return the hire car", "And take the licence off your to-carry list — you do not drive again."),
            P("Spend or leave the AUD", "Australia is behind you. Any Australian cash is dead weight from here."),
            P("Weigh the backpack and sling together", "Two items, 7 kg combined. You are at about 6 kg, so it is fine, but Jetstar do weigh at the gate."),
        ],
        bags=[
            B("SL", "cabin", [
                P("Passport"),
                P("Driving licence", "Into the stored case at Phuket — you are done driving."),
                P("Australian ETA"),
                P("Bank cards x2"),
                P("Cash — THB 25,000"),
                P("Cash — AUD 200", "Whatever is left. Spend it airside if you can."),
                P("Phone"),
                P("AirPods Pro"),
                P("Power bank, small", "Cabin only, never the hold."),
                P("Sunglasses"),
                P("Snacks"),
            ],
               ids=["passport","licence","eta-aus","cards","cash-thb","cash-aud","phone",
                    "airpods","brick-sm","sunglasses-daily","snacks"]),

            B("BP", "cabin", [
                P("Book", "The one thing that works with the seatbelt sign on and the tray table up."),
                P("Nintendo Switch", "Last flight it travels with you — into the stored case at Bangkok on the 10th."),
                P("iPad Air"),
                P("Sony over-ear headphones", "Wear them through the gate if the bag is close to 7 kg."),
                P("Extendable USB-C cable"),
                P("Prescription medication", "Never the hold."),
                P("Clear 1L liquids bag", "One security check today, at Perth.", inside=[
                    P("Mini toothpaste"),
                    P("Mini shaving foam"),
                    P("Aftershave atomiser"),
                    P("Roll-on deodorant"),
                    P("Hand sanitiser"),
                    P("Lip balm with SPF"),
                ]),
                P("Mouth tape"),
                P("Eye mask"),
                P("Earplugs"),
                P("Compression socks"),
                P("Larq bottle, empty"),
            ],
               ids=["book","switch","ipad-air","sony",
                    "cable-ext","prescriptions","liquids-bag","toothpaste-mini","shave-foam",
                    "aftershave","deodorant","sanitiser","lipbalm","mouthtape","eyemask",
                    "earplugs","compression","larq"]),

            B("CB", "checked", [
                P("CUBE 1 — clothing", "The clothes that come onward with you.", inside=[
                    P("T-shirts"),
                    P("Shorts"),
                    P("Nice shirts"),
                    P("Trousers"),
                    P("Boxers"),
                    P("White socks"),
                    P("Swim shorts"),
                ]),
                P("CUBE 2 — gym and footwear", "Shoes in a bin bag inside the cube.", inside=[
                    P("Gym tops"),
                    P("Gym shorts"),
                    P("Gym socks"),
                    P("Running shoes"),
                    P("Sandals"),
                    P("Sliders"),
                ]),
                P("CUBE 3 — kit", inside=[
                    P("Microfibre towel, mini"),
                    P("Small dry bag"),
                    P("Swimming goggles"),
                    P("Dirty laundry bags"),
                    P("Bin bags"),
                    P("Lockable daypack"),
                ]),
                P("Two mini washbags", inside=[
                    P("Travel facewash"),
                    P("Electric shaver"),
                    P("Electric toothbrush"),
                    P("Moisturiser"),
                    P("Paracetamol"),
                    P("Imodium"),
                    P("Ibuprofen"),
                ]),
                P("Luggage scales", "This is the bag that has to come under 7 kg at Phuket. Keep them with it."),
                P("60W USB-C mains supply", "In here rather than a suitcase — the cases go into storage on the 10th and this is the only charger that will do the iPad."),
                P("Fold-up 3-in-1 charger", "Same reason. Watch, phone and AirPods."),
                P("Mouse"),
                P("Universal travel adapter"),
                P("Qatar pyjamas"),
                P("Belt"),
                P("Hats"),
                P("Gym hat"),
                P("Windbreaker"),
                P("The packing cubes themselves"),
            ],
               ids=["tees","shorts","shirts-nice","trousers","boxers","socks-white","swim",
                    "gym-tops","gym-shorts","socks-gym","running","sandals","sliders",
                    "towel-sm","drybag","goggles","laundry-bag","binbags","daypack",
                    "washbag-mini","facewash","shaver","etoothbrush","moisturiser",
                    "paracetamol","imodium","ibuprofen",
                    "scales","plug-uk","charger-3in1","mouse","adapter-universal",
                    "pyjamas","belt","hats","hat-gym","windbreaker","cubes"]),

            B("L1", "checked", [
                P("Hoodie"),
                P("Tracksuit bottoms"),
                P("Old trainers"),
                P("Microfibre towel, large"),
                P("Sunglasses — 4 pairs in a travel case"),
                P("PS5 controller"),
                P("Switch HDMI cable"),
            ],
               ids=["hoodie","tracksuit","trainers-old","towel-lg","sunglasses",
                    "ps5-pad","hdmi-switch"]),

            B("L2", "checked", [
                P("MacBook Pro", "For the handover in Phuket."),
                P("iPad mini", "Same handover."),
                P("MacBook Air", "Legal in the hold — the battery is sealed in, so it only has to be fully off and packed so it cannot be crushed. Not sleeping: off."),
                P("Travel keyboard — ProtoArc XK01"),
                P("USB-C dongle"),
                P("HDMI cable"),
                P("Large fold-out washbag", inside=[
                    P("Suncream — full size"),
                    P("Travel suncream"),
                    P("Decant bottles, 100 ml", "Fill these in Phuket before this case goes into storage."),
                    P("Mosquito spray"),
                    P("Eye cream"),
                    P("Nail clippers"),
                    P("Roll-on deodorant — 2 spare"),
                    P("Toothpaste — full size"),
                    P("Shaver cable"),
                    P("Small medical pouch"),
                    P("Antihistamine"),
                    P("Antiseptic cream"),
                    P("Plasters and blister plasters"),
                    P("Rehydration sachets"),
                    P("Athlete's foot cream"),
                ]),
                P("Thai notepad"),
                P("The Perth surplus", "Whatever you bought and are keeping. This case has the room."),
            ],
               ids=["mbp","ipad-mini","mba","dongle","hdmi","keyboard",
                    "washbag-lg","suncream","suncream-tr","decant","mozzie",
                    "eyecream","nail","deodorant-spare","toothpaste","cable-shaver","medkit","antihistamine","antiseptic","plasters","rehydration","athletes","notepad"]),

            B("worn", "worn", [
                P("Apple Watch"),
                P("Nice trainers", "The bulkiest shoes, worn not packed."),
                P("T-shirt and shorts", "Perth in January at 05:00 is already warm, and Phuket certainly is."),
            ],
               ids=["watch","trainers-nice"]),
        ],
    ),
    dict(
        id="hkt-bkk",
        allow=dict(checked="2 × 23 kg", cabin="7 kg"),
        name="Phuket – Bangkok",
        dates="10 Jan",
        where="HKT → BKK",
        via="TG 206 · Thai Airways · 11:50",
        key=1,
        stored=1,
        note=(
            "Two checked bags and ONE cabin piece at 7 kg, and the cabin bag is 2.8 kg empty — so "
            "it flies light and everything it needs for the next thirteen days rides in Suitcase 1 "
            "as three cubes, at the top, ready to lift. Land 13:20, Smilelugg on B Floor: open "
            "Suitcase 1 only, three cubes out into the cabin bag, the Switch in, lock both cases, "
            "hand them over. Ref 14XIWBX4, paid, 10–23 Jan. Ten minutes if the cubes are where "
            "they should be."
        ),
        do=[
            P("Hand over the MacBook Pro and iPad mini", "Early in the three days, not on the morning you leave."),
            P("Fill the decant bottles", "From the full-size suncream, before that bottle goes into the case for a fortnight."),
            P("Pack the three cubes and put them at the TOP of Suitcase 1", "You are opening that case on a terminal floor with a taxi running. Nothing else in Suitcase 1 should need moving to reach them."),
            P("Put everything being stored into Suitcase 2", "So that case is never opened at Bangkok at all. One case, one zip, three cubes."),
            P("Weigh the cabin bag before you leave the Courtyard", "Under 7 kg with the scales that are in it. It should come out around 6."),
        ],
        bags=[
            B("SL", "cabin", [
                P("Passport"),
                P("Bank cards x2"),
                P("Cash — THB 25,000", "From here on this is the money."),
                P("Phone"),
                P("AirPods Pro"),
                P("Power bank, small", "A spare battery never goes in the hold."),
                P("Sunglasses"),
            ],
               ids=["passport","cards","cash-thb","phone","airpods","brick-sm","sunglasses-daily"]),

            B("BP", "cabin", [
                P("Book"),
                P("Nintendo Switch", "GOES INTO SUITCASE 2 AT SMILELUGG. It is the one thing travelling the wrong way today — out of your bag and into storage until the 23rd."),
                P("iPad Air"),
                P("Extendable USB-C cable"),
                P("Prescription medication"),
                P("Clear 1L liquids bag", "One security check, at Phuket.", inside=[
                    P("Mini toothpaste"),
                    P("Mini shaving foam"),
                    P("Aftershave atomiser"),
                    P("Roll-on deodorant"),
                    P("Hand sanitiser"),
                    P("Lip balm with SPF"),
                ]),
                P("Mouth tape"),
                P("Eye mask"),
                P("Earplugs"),
                P("Snacks"),
                P("Larq bottle, empty"),
                P("Old trainers", "They will not fit in the cabin case alongside everything else, and Dragon Crest on the 21st is a proper climb — not a running-shoe hike."),
            ],
               ids=["book","switch","trainers-old","ipad-air","cable-ext","prescriptions","liquids-bag",
                    "toothpaste-mini","shave-foam","aftershave","deodorant","sanitiser","lipbalm",
                    "mouthtape","eyemask","earplugs","snacks","larq"]),

            B("CB", "cabin", [
                P("TARGET: under 7 kg", "2.8 kg of that is the shell. What is listed here is about 2.8 kg, plus roughly 0.6 kg for the change of clothes below — call it 6.2 kg. The margin is real but small, so do not add to it."),
                P("One change of clothes", "2 boxers, 2 socks, 2 T-shirts, 1 shorts, taken out of Cube 1 and packed here. If a suitcase goes astray between Phuket and Bangkok you are not buying clothes on day one."),
                P("Two mini washbags", inside=[
                    P("Travel facewash"),
                    P("Electric shaver"),
                    P("Electric toothbrush"),
                    P("Moisturiser"),
                ]),
                P("The health kit", "Moved out of the large washbag in Phuket, because that one is about to be locked in a case for thirteen days.", inside=[
                    P("Small medical pouch"),
                    P("Paracetamol"),
                    P("Ibuprofen"),
                    P("Imodium"),
                    P("Antihistamine"),
                    P("Antiseptic cream"),
                    P("Plasters and blister plasters"),
                    P("Rehydration sachets"),
                    P("Athlete's foot cream"),
                ]),
                P("Decant bottles, filled"),
                P("Toothpaste — full size", "Out of the large washbag in Phuket. Thirteen days without the case."),
                P("Travel suncream"),
                P("Mosquito spray", "Khao Sok on the 17th. Buy stronger DEET in Bangkok."),
                P("60W USB-C mains supply"),
                P("Fold-up 3-in-1 charger"),
                P("Mouse"),
                P("Universal travel adapter"),
                P("Microfibre towel, mini"),
                P("Lockable daypack"),
                P("Compression socks"),
                P("Luggage scales", "The reason you can trust the number."),
                P("The empty packing cubes", "Only if they are not already holding the clothes. They fill up this afternoon."),
            ],
               ids=["washbag-mini","facewash","shaver","etoothbrush","moisturiser",
                    "medkit","paracetamol","ibuprofen","imodium","antihistamine",
                    "antiseptic","plasters","rehydration","athletes",
                    "decant","suncream-tr","toothpaste","mozzie",
                    "plug-uk","charger-3in1","mouse","adapter-universal",
                    "towel-sm","daypack","compression","scales","cubes"]),

            B("L1", "checked", [
                P("THE TRANSFER CASE", "The only one you open at Bangkok. Three cubes at the top, nothing on top of them."),
                P("CUBE 1 — clothing", "Lift into the cabin bag at Smilelugg. Every hotel from here has washing facilities, which is why this is as little as it is.", inside=[
                    P("Boxers", "5 of the 8 come onward; the change of clothes in the cabin bag is 2 more."),
                    P("White socks", "5 of the 8."),
                    P("T-shirts", "6 of the 12."),
                    P("Nice shirts", "2 of the 8. One is for Vertigo on the 11th; the other covers the good dinners at 500 Rai and Krabi."),
                    P("Shorts", "2 of the 6."),
                    P("Trousers", "Long trousers are required at Vertigo."),
                    P("Swim shorts", "Samui, Khao Sok, Krabi — all water."),
                    P("Belt"),
                    P("Qatar pyjamas"),
                ]),
                P("CUBE 2 — gym and footwear", "Lift into the cabin bag. Shoes in a bin bag inside the cube.", inside=[
                    P("Gym tops", "2 of the 3."),
                    P("Gym shorts"),
                    P("Gym socks", "2 of the 3."),
                    P("Running shoes", "The Dragon Crest hike on the 21st is a real climb."),
                    P("Sandals"),
                    P("Sliders"),
                    P("1 hat"),
                    P("Gym hat"),
                ]),
                P("CUBE 3 — kit", "Lift into the cabin bag.", inside=[
                    P("Travel keyboard — ProtoArc XK01", "Comes out here and lives in the backpack from Bangkok onwards."),
                    P("Small dry bag", "Khao Sok arrives by boat; the Krabi longtails soak everything."),
                    P("Swimming goggles"),
                    P("Dirty laundry bags"),
                    P("Bin bags"),
                ]),
            ],
               ids=[("boxers", 5), ("socks-white", 5), ("tees", 6), ("shirts-nice", 2),
                    ("shorts", 2), "trousers", "swim", "belt", "pyjamas",
                    ("gym-tops", 2), "gym-shorts", ("socks-gym", 2),
                    "running", "sandals", "sliders", ("hats", 1), "hat-gym",
                    "keyboard", "drybag", "goggles", "laundry-bag", "binbags"]),

            B("L2", "checked", [
                P("THE STORAGE CASE", "Never opened at Bangkok. Straight from the belt to Smilelugg."),
                P("MacBook Air"),
                P("USB-C dongle"),
                P("HDMI cable"),
                P("PS5 controller", "Back out on the 23rd for the thirteen hours home."),
                P("Switch HDMI cable"),
                P("Sony over-ear headphones", "Also back out on the 23rd."),
                P("Driving licence", "You are done driving."),
                P("Australian ETA", "Spent."),
                P("Cash — AUD 200", "Whatever is left. No use until you are home."),
                P("Hoodie"),
                P("Tracksuit bottoms"),
                P("Windbreaker"),
                P("Microfibre towel, large"),
                P("Sunglasses — 4 pairs in a travel case"),
                P("Thai notepad"),
                P("Large fold-out washbag", inside=[
                    P("Suncream — full size", "The decants are with you."),
                    P("Eye cream"),
                    P("Nail clippers"),
                    P("Roll-on deodorant — 2 spare"),
                    P("Shaver cable", "The shaver holds a charge for weeks."),
                ]),
                P("The clothing left behind", "3 boxers, 3 socks, 1 gym sock, 6 T-shirts, 6 nice shirts, 4 shorts, 1 gym top, 2 hats."),
            ],
               ids=["mba","dongle","hdmi","ps5-pad","hdmi-switch","sony","licence","eta-aus",
                    "cash-aud","hoodie","tracksuit","windbreaker","towel-lg","sunglasses","notepad",
                    "washbag-lg","suncream","eyecream","nail","deodorant-spare","cable-shaver",
                    ("boxers", 3), ("socks-white", 3), ("tees", 6), ("shirts-nice", 6),
                    ("shorts", 4), ("gym-tops", 1), ("socks-gym", 1), ("hats", 2)]),

            B("GONE", "left", [
                P("MacBook Pro", "Handed over in Phuket, 7–10 Jan."),
                P("iPad mini", "Same."),
            ], ids=["mbp","ipad-mini"]),

            B("worn", "worn", [
                P("Apple Watch"),
                P("Nice trainers", "Worn, as always — the heaviest thing you own."),
            ], ids=["watch","trainers-nice"]),
        ],
    ),
    dict(
        id="bkk-swap",
        name="Bangkok changeover",
        dates="10 Jan, 13:20",
        where="Suvarnabhumi → Smilelugg, B Floor",
        via="Landside · taxi waiting · about 10 minutes",
        key=1,
        stored=1,
        note=(
            "Not a flight — the ten minutes that the last three weeks of packing were for. You "
            "land 13:20, clear arrivals, collect all three bags. Smilelugg is on B Floor, the "
            "Airport Rail Link level, about 50 m past the ticket kiosk from the SA City Line "
            "entrance, and it is landside so you reach it before you meet your driver. The taxi "
            "waits 45 minutes, so there is no need to rush — but there is also nothing to think "
            "about if the cubes are where they should be."
        ),
        do=[
            P("1. Find a bench or a clear bit of floor", "Not the belt. Walk to Smilelugg first and do it there — you need both hands and somewhere to put a case down."),
            P("2. Open Suitcase 1 only", "Suitcase 2 does not get opened at all today."),
            P("3. Three cubes out, into the cabin bag", "Cube 1 clothing, Cube 2 gym and footwear, Cube 3 kit. They go straight in; nothing needs unpacking."),
            P("4. Nintendo Switch out of the backpack, into Suitcase 2", "The only thing going the other way. Do it now or you will be carrying it round Thailand for thirteen days."),
            P("5. Zip and lock both cases"),
            P("6. Hand over, photograph the receipt", "Ref 14XIWBX4, paid, 10–23 Jan. Check the collection time on the receipt matches your 23rd."),
            P("7. Check the cabin bag closes", "It has gone from about 6 kg to about 15.6 kg. Use the expander zip if it needs it — better now than on a hotel bed at 22:00."),
        ],
        bags=[
            B("CB", "with", [
                P("GAINS — the three cubes", "About 9.9 kg of clothes, footwear and kit, straight out of Suitcase 1.", inside=[
                    P("Cube 1 — clothing"),
                    P("Cube 2 — gym and footwear"),
                    P("Cube 3 — kit"),
                ]),
                P("ALREADY IN IT", "Washbag, health kit, decants, suncream, mosquito spray, chargers, mouse, adapter, towel, daypack, scales, one change of clothes."),
                P("RESULT: about 15.6 kg", "No weight limit applies to it again until the 23rd. This is your luggage now."),
            ],
               ids=["washbag-mini","facewash","shaver","etoothbrush","moisturiser",
                    "medkit","paracetamol","ibuprofen","imodium","antihistamine",
                    "antiseptic","plasters","rehydration","athletes",
                    "decant","suncream-tr","toothpaste","mozzie",
                    "plug-uk","charger-3in1","mouse","adapter-universal",
                    "towel-sm","daypack","compression","scales","cubes",
                    ("boxers", 5), ("socks-white", 5), ("tees", 6), ("shirts-nice", 2),
                    ("shorts", 2), "trousers", "swim", "belt", "pyjamas",
                    ("gym-tops", 2), "gym-shorts", ("socks-gym", 2),
                    "running", "sandals", "sliders", ("hats", 1), "hat-gym",
                    "drybag", "goggles", "laundry-bag", "binbags"]),

            B("BP", "with", [
                P("LOSES — the Nintendo Switch", "Into Suitcase 2."),
                P("GAINS — the travel keyboard", "Out of Cube 3. With the iPad and the mouse that is a working setup for the rest of the trip."),
                P("KEEPS", "Book, iPad, cable, prescriptions, liquids bag, sleep kit, snacks, Larq, old trainers."),
            ],
               ids=["book","keyboard","trainers-old","ipad-air","cable-ext","prescriptions","liquids-bag",
                    "toothpaste-mini","shave-foam","aftershave","deodorant","sanitiser","lipbalm",
                    "mouthtape","eyemask","earplugs","snacks","larq"]),

            B("SL", "with", [
                P("Unchanged", "Passport, cards, baht, phone, AirPods, power bank, sunglasses."),
            ],
               ids=["passport","cards","cash-thb","phone","airpods","brick-sm","sunglasses-daily"]),

            B("L1", "left", [
                P("Emptied of the three cubes, then locked and handed over"),
            ], ids=[]),

            B("L2", "left", [
                P("Handed over unopened, with the Switch added"),
            ],
               ids=["switch","mba","dongle","hdmi","ps5-pad","hdmi-switch","sony","licence",
                    "eta-aus","cash-aud","hoodie","tracksuit","windbreaker","towel-lg","sunglasses",
                    "notepad","washbag-lg","suncream","eyecream","nail","deodorant-spare",
                    "cable-shaver",
                    ("boxers", 3), ("socks-white", 3), ("tees", 6), ("shirts-nice", 6),
                    ("shorts", 4), ("gym-tops", 1), ("socks-gym", 1), ("hats", 2)]),

            B("GONE", "left", [
                P("MacBook Pro and iPad mini", "Handed over in Phuket."),
            ], ids=["mbp","ipad-mini"]),

            B("worn", "worn", [
                P("Apple Watch"),
                P("Nice trainers"),
            ], ids=["watch","trainers-nice"]),
        ],
    ),
    dict(
        id="bkk-usm",
        allow=dict(checked="20 kg", cabin="5 kg"),
        name="Bangkok – Koh Samui",
        dates="13 Jan",
        where="BKK → USM",
        via="PG 133 · Bangkok Airways · 11:25",
        stored=1,
        note=(
            "Bangkok Airways allow only 5 kg in the cabin but include 20 kg checked, so the cabin\n"
            "bag goes in the hold and you keep the backpack and sling. Nothing is repacked — the bag\n"
            "travels exactly as it came out of Suvarnabhumi. Leave Theatre Residence by 08:00:\n"
            "check-out is 12:00 but PG 133 does not wait."
        ),
        do=[
            P("Leave Theatre Residence by 08:00", "Check-out is noon, the flight is 11:25. The hotel is on the wrong side of the river for a late start."),
            P("If they weigh the backpack, the trainers go in the cabin bag", "Bangkok Airways allow 5 kg and the backpack and sling come to 4.97 with the old trainers in. Not a problem — the cabin bag is being checked anyway, so they go in there at the desk and you are at 4.2 kg. Worth knowing before you are asked, not after."),
            P("Buy DEET before you go", "Stronger and cheaper in Bangkok than anything you would have carried."),
            P("Nothing to repack", "The cabin bag goes in the hold as it is. This is the easy one."),
            P("Book the Lipa Noi taxi for the 17th", "Raja ferry departs 07:00, ref DFPV201439454, and Lipa Noi is 35 to 45 minutes from Bophut. Leave by 05:50. Ask Hansar reception to arrange it rather than hoping at 05:30."),
        ],
        bags=[
            B("SL", "cabin", [
                P("Passport"),
                P("Bank cards x2"),
                P("Cash — THB 25,000"),
                P("Phone"),
                P("AirPods Pro"),
                P("Power bank, small", "A spare battery never goes in the hold."),
                P("Sunglasses"),
            ],
               ids=["passport","cards","cash-thb","phone","airpods","brick-sm","sunglasses-daily"]),

            B("BP", "cabin", [
                P("Book"),
                P("iPad Air"),
                P("Extendable USB-C cable"),
                P("Prescription medication"),
                P("Clear 1L liquids bag", inside=[
                    P("Mini toothpaste"),
                    P("Mini shaving foam"),
                    P("Aftershave atomiser"),
                    P("Roll-on deodorant"),
                    P("Hand sanitiser"),
                    P("Lip balm with SPF"),
                ]),
                P("Mouth tape"),
                P("Eye mask"),
                P("Earplugs"),
                P("Snacks"),
                P("Larq bottle"),
                P("Travel keyboard — ProtoArc XK01"),
                P("Old trainers", "For Dragon Crest on the 21st. Here rather than the cabin bag to keep that case packable — but the cabin bag is checked on this leg, so they can move across at the desk if anyone weighs the backpack."),
            ],
               ids=["book","keyboard","trainers-old","ipad-air","cable-ext","prescriptions","liquids-bag",
                    "toothpaste-mini","shave-foam","aftershave","deodorant","sanitiser","lipbalm",
                    "mouthtape","eyemask","earplugs","snacks","larq"]),

            B("CB", "checked", [
                P("Everything else, packed as it is", "15.6 kg against a 20 kg allowance. It goes in the hold and comes back to you at Samui."),
                P("CLOTHES", "Every hotel in Thailand has washing facilities, so this is deliberately lean. Wash rather than carry.", inside=[
                    P("5 boxers"), P("5 white socks"), P("6 T-shirts"), P("2 nice shirts"),
                    P("2 shorts"), P("1 trousers"), P("2 swim shorts"), P("Belt"),
                    P("2 gym tops"), P("2 gym shorts"), P("2 gym socks"),
                    P("1 hat"), P("Gym hat"), P("Qatar pyjamas"),
                ]),
                P("FOOTWEAR", "Three pairs, plus the nice trainers on your feet.", inside=[
                    P("Running shoes"), P("Sandals"), P("Sliders"),
                ]),
                P("WASHBAG AND HEALTH KIT", inside=[
                    P("Travel facewash"), P("Electric shaver"), P("Electric toothbrush"),
                    P("Moisturiser"), P("Decant bottles"), P("Travel suncream"),
                    P("Toothpaste — full size"), P("Mosquito spray"),
                    P("Medical pouch and the full health kit"),
                ]),
                P("TECH", inside=[
                    P("60W USB-C mains supply"), P("Fold-up 3-in-1 charger"),
                    P("Mouse"), P("Universal travel adapter"),
                ]),
                P("KIT", inside=[
                    P("Microfibre towel, mini"), P("Dry bag"), P("Swimming goggles"),
                    P("Lockable daypack"), P("Laundry and bin bags"), P("Packing cubes"),
                    P("Compression socks"), P("Luggage scales"),
                ]),
            ],
               ids=["washbag-mini","facewash","shaver","etoothbrush","moisturiser",
                    "medkit","paracetamol","ibuprofen","imodium","antihistamine",
                    "antiseptic","plasters","rehydration","athletes",
                    "decant","suncream-tr","toothpaste","mozzie",
                    "plug-uk","charger-3in1","mouse","adapter-universal",
                    "towel-sm","daypack","compression","scales","cubes",
                    ("boxers", 5), ("socks-white", 5), ("tees", 6), ("shirts-nice", 2),
                    ("shorts", 2), "trousers", "swim", "belt", "pyjamas",
                    ("gym-tops", 2), "gym-shorts", ("socks-gym", 2),
                    "running", "sandals", "sliders", ("hats", 1), "hat-gym",
                    "drybag", "goggles", "laundry-bag", "binbags"]),

            B("L1", "left", [P("At Smilelugg, Bangkok", "Collected 23 Jan.")], ids=[]),
            B("L2", "left", [P("At Smilelugg, Bangkok", "Collected 23 Jan.")],
               ids=["switch","mba","dongle","hdmi","ps5-pad","hdmi-switch","sony","licence",
                    "eta-aus","cash-aud","hoodie","tracksuit","windbreaker","towel-lg","sunglasses",
                    "notepad","washbag-lg","suncream","eyecream","nail","deodorant-spare",
                    "cable-shaver",
                    ("boxers", 3), ("socks-white", 3), ("tees", 6), ("shirts-nice", 6),
                    ("shorts", 4), ("gym-tops", 1), ("socks-gym", 1), ("hats", 2)]),

            B("GONE", "left", [P("MacBook Pro and iPad mini", "Handed over in Phuket.")],
               ids=["mbp","ipad-mini"]),

            B("worn", "worn", [P("Apple Watch"), P("Nice trainers")],
               ids=["watch","trainers-nice"]),
        ],
    ),
    dict(
        id="kbv-bkk",
        allow=dict(checked="20 kg", cabin="7 kg"),
        name="Krabi – Bangkok",
        dates="23 Jan",
        where="KBV → BKK",
        via="TG 246 · Thai Airways · 12:45",
        stored=1,
        note=(
            "The same shape as the Samui flight: the cabin bag goes in the hold, you keep the\n"
            "backpack and sling. Check-out is 12:00 and the flight is 12:45, so leave Ao Nang about\n"
            "10:00. One checked bag is included and you are collecting two suitcases at the other\n"
            "end anyway, so there is no reason to carry it."
        ),
        do=[
            P("Repack the night of the 22nd", "Storage collection and a long-haul on the same day. Do not start this at breakfast."),
            P("Leave Ao Nang by 10:00", "Check-out 12:00, flight 12:45. The airport is 40 minutes."),
            P("Smilelugg ref to hand", "14XIWBX4. B Floor, landside, so you clear arrivals first. TG 246 lands 14:10 and QR 835 leaves 18:55 — 4h45 to collect, repack and re-check."),
        ],
        bags=[
            B("SL", "cabin", [
                P("Passport"),
                P("Bank cards x2"),
                P("Cash — THB 25,000"),
                P("Phone"),
                P("AirPods Pro"),
                P("Power bank, small", "A spare battery never goes in the hold."),
                P("Sunglasses"),
            ],
               ids=["passport","cards","cash-thb","phone","airpods","brick-sm","sunglasses-daily"]),

            B("BP", "cabin", [
                P("Book"),
                P("iPad Air"),
                P("Extendable USB-C cable"),
                P("Prescription medication"),
                P("Clear 1L liquids bag", inside=[
                    P("Mini toothpaste"),
                    P("Mini shaving foam"),
                    P("Aftershave atomiser"),
                    P("Roll-on deodorant"),
                    P("Hand sanitiser"),
                    P("Lip balm with SPF"),
                ]),
                P("Mouth tape"),
                P("Eye mask"),
                P("Earplugs"),
                P("Snacks"),
                P("Larq bottle"),
                P("Travel keyboard — ProtoArc XK01"),
                P("Old trainers", "For Dragon Crest on the 21st. Here rather than the cabin bag to keep that case packable — but the cabin bag is checked on this leg, so they can move across at the desk if anyone weighs the backpack."),
            ],
               ids=["book","keyboard","trainers-old","ipad-air","cable-ext","prescriptions","liquids-bag",
                    "toothpaste-mini","shave-foam","aftershave","deodorant","sanitiser","lipbalm",
                    "mouthtape","eyemask","earplugs","snacks","larq"]),

            B("CB", "checked", [
                P("Everything else, packed as it is", "15.6 kg against a 20 kg allowance. Last flight before you have the suitcases back."),
                P("CLOTHES", "Every hotel in Thailand has washing facilities, so this is deliberately lean. Wash rather than carry.", inside=[
                    P("5 boxers"), P("5 white socks"), P("6 T-shirts"), P("2 nice shirts"),
                    P("2 shorts"), P("1 trousers"), P("2 swim shorts"), P("Belt"),
                    P("2 gym tops"), P("2 gym shorts"), P("2 gym socks"),
                    P("1 hat"), P("Gym hat"), P("Qatar pyjamas"),
                ]),
                P("FOOTWEAR", "Three pairs, plus the nice trainers on your feet.", inside=[
                    P("Running shoes"), P("Sandals"), P("Sliders"),
                ]),
                P("WASHBAG AND HEALTH KIT", inside=[
                    P("Travel facewash"), P("Electric shaver"), P("Electric toothbrush"),
                    P("Moisturiser"), P("Decant bottles"), P("Travel suncream"),
                    P("Toothpaste — full size"), P("Mosquito spray"),
                    P("Medical pouch and the full health kit"),
                ]),
                P("TECH", inside=[
                    P("60W USB-C mains supply"), P("Fold-up 3-in-1 charger"),
                    P("Mouse"), P("Universal travel adapter"),
                ]),
                P("KIT", inside=[
                    P("Microfibre towel, mini"), P("Dry bag"), P("Swimming goggles"),
                    P("Lockable daypack"), P("Laundry and bin bags"), P("Packing cubes"),
                    P("Compression socks"), P("Luggage scales"),
                ]),
            ],
               ids=["washbag-mini","facewash","shaver","etoothbrush","moisturiser",
                    "medkit","paracetamol","ibuprofen","imodium","antihistamine",
                    "antiseptic","plasters","rehydration","athletes",
                    "decant","suncream-tr","toothpaste","mozzie",
                    "plug-uk","charger-3in1","mouse","adapter-universal",
                    "towel-sm","daypack","compression","scales","cubes",
                    ("boxers", 5), ("socks-white", 5), ("tees", 6), ("shirts-nice", 2),
                    ("shorts", 2), "trousers", "swim", "belt", "pyjamas",
                    ("gym-tops", 2), "gym-shorts", ("socks-gym", 2),
                    "running", "sandals", "sliders", ("hats", 1), "hat-gym",
                    "drybag", "goggles", "laundry-bag", "binbags"]),

            B("L1", "left", [P("At Smilelugg, Bangkok", "Collected 23 Jan.")], ids=[]),
            B("L2", "left", [P("At Smilelugg, Bangkok", "Collected 23 Jan.")],
               ids=["switch","mba","dongle","hdmi","ps5-pad","hdmi-switch","sony","licence",
                    "eta-aus","cash-aud","hoodie","tracksuit","windbreaker","towel-lg","sunglasses",
                    "notepad","washbag-lg","suncream","eyecream","nail","deodorant-spare",
                    "cable-shaver",
                    ("boxers", 3), ("socks-white", 3), ("tees", 6), ("shirts-nice", 6),
                    ("shorts", 4), ("gym-tops", 1), ("socks-gym", 1), ("hats", 2)]),

            B("GONE", "left", [P("MacBook Pro and iPad mini", "Handed over in Phuket.")],
               ids=["mbp","ipad-mini"]),

            B("worn", "worn", [P("Apple Watch"), P("Nice trainers")],
               ids=["watch","trainers-nice"]),
        ],
    ),
    dict(
        id="bkk-lon",
        allow=dict(checked="40 kg", cabin="2 × 15 kg"),
        name="Bangkok – London",
        dates="23–24 Jan",
        where="BKK → DOH → LHR",
        via="QR 835 · QR 107 · Qatar Business",
        key=1,
        note=(
            "TG 246 lands 14:10 and QR 835 leaves 18:55 — 4h45 to clear arrivals, collect both "
            "cases from Smilelugg on B Floor, put everything back together and re-check. Qatar "
            "give you 40 kg across any number of bags and two cabin pieces at 15 kg plus a "
            "personal item, so it is the roomiest leg of the trip and the only one where nothing "
            "has to be weighed. Lands Heathrow 06:35 on the 24th, in January, off a plane from 30°C."
        ),
        do=[
            P("Repack the night of the 22nd", "In Ao Nang, not at Suvarnabhumi. All you should be doing at the airport is opening two cases and moving a few things."),
            P("Collect from Smilelugg first", "Ref 14XIWBX4. B Floor, landside, about 50 m past the ticket kiosk from the SA City Line entrance — you reach it before you need to be anywhere."),
            P("Hoodie and tracksuit out of the case BEFORE you re-check", "Heathrow at 06:35 in January, straight off a plane from 30°C. If they go into the hold you land in shorts."),
            P("Shaver, shaving foam and moisturiser stay in the cabin bag", "Thirteen hours to London and a 06:35 landing. You will want a shave in the Doha lounge or before descent. Do NOT let them go into a case when you re-check."),
            P("Shaving foam into the liquids bag", "You clear security again at Bangkok and at Doha."),
            P("Spend the last of the baht airside", "It is no use to you at Heathrow."),
        ],
        bags=[
            B("SL", "cabin", [
                P("Passport"),
                P("Bank cards x2"),
                P("Cash — whatever baht is left"),
                P("Phone"),
                P("AirPods Pro"),
                P("Power bank, small"),
                P("Sunglasses"),
            ],
               ids=["passport","cards","cash-thb","phone","airpods","brick-sm","sunglasses-daily"]),

            B("BP", "cabin", [
                P("Book"),
                P("Nintendo Switch", "Out of storage. Thirteen hours Bangkok to Doha to London."),
                P("PS5 controller", "Remote play. Starlink will cover you."),
                P("Switch HDMI cable"),
                P("Sony over-ear headphones", "Out of storage after thirteen days. The flight you bought them for, again."),
                P("iPad Air"),
                P("Extendable USB-C cable"),
                P("Fold-up 3-in-1 charger"),
                P("Travel keyboard — ProtoArc XK01"),
                P("Prescription medication"),
                P("Clear 1L liquids bag", "Two security checks tonight — Bangkok and Doha.", inside=[
                    P("Mini toothpaste"),
                    P("Mini shaving foam"),
                    P("Aftershave atomiser"),
                    P("Roll-on deodorant"),
                    P("Hand sanitiser"),
                    P("Lip balm with SPF"),
                ]),
                P("Mouth tape"),
                P("Eye mask"),
                P("Earplugs"),
                P("Compression socks", "26 hours door to door, the other way."),
                P("Snacks"),
                P("Larq bottle, empty"),
            ],
               ids=["book","switch","ps5-pad","hdmi-switch","sony","ipad-air","cable-ext",
                    "charger-3in1","keyboard","prescriptions","liquids-bag","toothpaste-mini","shave-foam",
                    "aftershave","deodorant","sanitiser","lipbalm","mouthtape","eyemask","earplugs",
                    "compression","snacks","larq"]),

            B("CB", "cabin", [
                P("Hoodie", "Out of the case at Smilelugg. Heathrow is about 4°C at 06:35 in January."),
                P("Tracksuit bottoms", "Same. Change before descent, not after you land."),
                P("Two mini washbags", inside=[
                    P("Travel facewash"),
                    P("Electric shaver", "A shave in the Doha lounge is the difference between arriving and surviving."),
                    P("Electric toothbrush"),
                    P("Moisturiser", "Three sectors of dry cabin air."),
                ]),
                P("MacBook Air", "Out of storage. Cabin rather than hold now you are carrying it home."),
                P("60W USB-C mains supply"),
                P("Mouse"),
                P("One change of clothes", "2 boxers, 2 socks, 2 T-shirts. Twenty-six hours is long enough to want them."),
                P("Qatar pyjamas", "They are yours. You will be given another pair anyway."),
                P("Microfibre towel, mini"),
                P("The health kit"),
                P("Luggage scales"),
                P("Packing cubes"),
            ],
               ids=["hoodie","tracksuit","washbag-mini","facewash","shaver","etoothbrush",
                    "moisturiser","mba","plug-uk","mouse","pyjamas","towel-sm",
                    "medkit","paracetamol","ibuprofen","imodium","antihistamine",
                    "antiseptic","plasters","rehydration","athletes",
                    "scales","cubes"]),

            B("L1", "checked", [
                P("Re-checked to London", "Collected from storage, repacked, straight back in the hold. 40 kg across any number of bags, so nothing needs weighing."),
                P("All the clothing"),
                P("Running shoes"),
                P("Old trainers"),
                P("Sandals"),
                P("Sliders"),
                P("Windbreaker"),
                P("Microfibre towel, large"),
                P("Sunglasses — 4 pairs in a travel case"),
            ],
               ids=["tees","shirts-nice","shorts","trousers","boxers","socks-white","socks-gym",
                    "gym-tops","gym-shorts","swim","belt","hats","hat-gym",
                    "running","trainers-old","sandals","sliders","windbreaker","towel-lg",
                    "sunglasses"]),

            B("L2", "checked", [
                P("Re-checked to London"),
                P("Large fold-out washbag", inside=[
                    P("Suncream — full size"),
                    P("Travel suncream"),
                    P("Decant bottles"),
                    P("Mosquito spray"),
                    P("Eye cream"),
                    P("Nail clippers"),
                    P("Roll-on deodorant — 2 spare"),
                    P("Toothpaste — full size", "Back in the case. The mini one covers the flight."),
                    P("Shaver cable"),
                ]),
                P("USB-C dongle"),
                P("HDMI cable"),
                P("Universal travel adapter"),
                P("Driving licence"),
                P("Australian ETA"),
                P("Cash — AUD 200", "Whatever came home with it."),
                P("Thai notepad"),
                P("Lockable daypack"),
                P("Dry bag"),
                P("Swimming goggles"),
                P("Laundry and bin bags"),
            ],
               ids=["washbag-lg","suncream","suncream-tr","decant","mozzie","eyecream","nail",
                    "deodorant-spare","toothpaste","cable-shaver","dongle","hdmi","adapter-universal",
                    "licence","eta-aus","cash-aud","notepad","daypack","drybag","goggles",
                    "laundry-bag","binbags"]),

            B("GONE", "left", [
                P("MacBook Pro and iPad mini", "Handed over in Phuket on the way out."),
            ], ids=["mbp","ipad-mini"]),

            B("worn", "worn", [
                P("Apple Watch"),
                P("Nice trainers"),
            ], ids=["watch","trainers-nice"]),
        ],
    ),
]
