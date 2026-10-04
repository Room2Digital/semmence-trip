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
    """ids lists the items.py ids this bag accounts for on this leg.
    build.py uses it to prove nothing in the inventory has been forgotten."""
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
                P("Travel keyboard — fold-up"),
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
                    "mba","mouse","keyboard","dongle","hdmi","ps5-pad","hdmi-switch",
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
                    P("Shaver cable", "Not USB-C at both ends, so nothing else will charge it. In the case, not on you."),
                    P("Mosquito spray", "Buy stronger DEET in Bangkok; this covers you until then."),
                    P("Eye cream"),
                    P("Nail clippers"),
                    P("5 decant bottles, 100 ml", "Filled in Phuket before the full-size goes into storage."),
                    P("Small medical pouch"),
                    P("Motion sickness tablets", "You need these for the 06:00 Donsak ferry on 17 Jan, and this case is in Bangkok storage from the 10th. Move them into the mini washbag in Phuket, before the cases go into storage."),
                    P("Antihistamine"),
                    P("Antiseptic cream"),
                    P("Plasters and blister plasters", "Dragon Crest on 21 Jan. Same storage problem as the motion sickness tablets."),
                    P("Rehydration sachets"),
                    P("Athlete's foot cream"),
                ]),
                P("MacBook Pro", "For the Phuket handover. In the case, not the cabin bag."),
                P("iPad mini", "Same handover."),
                P("Universal travel adapter with USB-C"),
                P("3 TSA padlocks"),
                P("Luggage scales", "What gets the cabin bag under 7 kg in Phuket."),
                P("4 packing cubes", "Pre-pack these: Cube 1 clothing, Cube 2 gym and footwear, Cube 3 kit."),
                P("Lockable daypack"),
                P("Thai notepad"),
                P("2 dirty laundry bags"),
                P("5 bin bags"),
                P("Small dry bag", "Still to buy."),
                P("Swimming goggles", "Still to buy."),
            ],
               ids=["washbag-lg","suncream","suncream-tr","deodorant-spare","cable-shaver",
                    "decant","mozzie","eyecream","nail",
                    "medkit","motion","antihistamine","antiseptic","plasters","rehydration","athletes",
                    "mbp","ipad-mini","adapter-universal",
                    "locks","scales","cubes","daypack","notepad","laundry-bag","binbags","drybag","goggles"]),

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
                    P("TSA padlocks"),
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
                P("Travel keyboard — fold-up", "With the iPad and the mouse this is a working setup from Bangkok onwards, which is the point of leaving the laptop behind."),
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
                    "towel-sm","drybag","goggles","laundry-bag","binbags","daypack","locks",
                    "washbag-mini","facewash","shaver","etoothbrush","moisturiser",
                    "paracetamol","imodium","ibuprofen",
                    "scales","plug-uk","charger-3in1","keyboard","mouse","adapter-universal",
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
                    P("Shaver cable"),
                    P("Small medical pouch"),
                    P("Motion sickness tablets", "Move these into the mini washbag at Phuket — you need them for the Donsak ferry on the 17th and this case will be in Bangkok."),
                    P("Antihistamine"),
                    P("Antiseptic cream"),
                    P("Plasters and blister plasters"),
                    P("Rehydration sachets"),
                    P("Athlete's foot cream"),
                ]),
                P("Thai notepad"),
                P("The Perth surplus", "Whatever you bought and are keeping. This case has the room."),
            ],
               ids=["mbp","ipad-mini","mba","dongle","hdmi",
                    "washbag-lg","suncream","suncream-tr","decant","mozzie",
                    "eyecream","nail","deodorant-spare","cable-shaver","medkit","motion",
                    "antihistamine","antiseptic","plasters","rehydration","athletes","notepad"]),

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
        allow=dict(checked="3 × 23 kg", cabin="7 kg"),
        name="Phuket – Bangkok",
        dates="10 Jan",
        where="HKT → BKK",
        via="TG 206 · Thai Airways · 11:50",
        key=1,
        stored=1,
        note=(
            "Check all three bags. The cabin bag goes in the hold with the suitcases, which means "
            "it can be packed properly for the thirteen days it is about to become your only "
            "luggage, rather than squeezed under a 7 kg cabin limit. You walk on with the backpack "
            "and sling. Land 13:20, collect all three, go to Smilelugg on B Floor, lock the two "
            "suitcases and hand them over — ref 14XIWBX4, paid, 10–23 Jan — and keep the cabin bag."
        ),
        do=[
            P("Buy the third checked bag", "Thai's included allowance is two pieces and you are checking three. Prepaid online it should be about what the second cost, £15. Do it before you get to the airport; at the desk it is several times that."),
            P("Hand over the MacBook Pro and iPad mini", "Early in the three days, not on the morning you leave. Erased and signed out before you flew."),
            P("Fill the decant bottles", "From the full-size suncream, before that bottle goes into the case for a fortnight."),
            P("Pack the cabin bag as your whole life for 13 days", "Bangkok, Samui, Khao Sok, Krabi. Hot, beach, one smart night, one hike. Nothing comes back out of the cases until the 23rd."),
            P("Use the expander", "That middle zip is what makes this fit. Open it before you start, not halfway through."),
            P("Photograph the Smilelugg receipt", "Your taxi waits 45 minutes, so there is no rush — but do it before you walk away."),
        ],
        bags=[
            B("SL", "cabin", [
                P("Passport"),
                P("Bank cards x2"),
                P("Cash — THB 25,000", "From here on this is the money."),
                P("Phone"),
                P("AirPods Pro"),
                P("Power bank, small", "Cabin only — it is a spare battery, and those never go in the hold."),
                P("Sunglasses"),
            ],
               ids=["passport","cards","cash-thb","phone","airpods","brick-sm","sunglasses-daily"]),

            B("BP", "cabin", [
                P("Book"),
                P("Nintendo Switch", "Last outing. It goes into the case at Smilelugg this afternoon."),
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
            ],
               ids=["book","switch","ipad-air","cable-ext","prescriptions","liquids-bag",
                    "toothpaste-mini","shave-foam","aftershave","deodorant","sanitiser","lipbalm",
                    "mouthtape","eyemask","earplugs","snacks","larq"]),

            B("CB", "checked", [
                P("CLOTHES — thirteen days", "Laundry is cheap and everywhere in Thailand, so this is enough.", inside=[
                    P("5 boxers", "Of the 8. The other 3 stay in the case."),
                    P("5 white socks", "Of the 8."),
                    P("2 gym socks", "Of the 3."),
                    P("8 T-shirts", "Of the 12."),
                    P("3 nice shirts", "Of the 8. Vertigo on the 11th needs one, and 500 Rai and Krabi have nice dinners."),
                    P("3 shorts", "Of the 6."),
                    P("1 trousers", "Long trousers are required at Vertigo."),
                    P("2 swim shorts", "Samui, Khao Sok, Krabi. All beach or lake."),
                    P("2 gym tops"),
                    P("2 gym shorts"),
                    P("Belt"),
                    P("3 hats"),
                    P("Gym hat"),
                    P("Qatar pyjamas"),
                ]),
                P("FOOTWEAR", inside=[
                    P("Running shoes", "The Dragon Crest hike on the 21st is a real climb."),
                    P("Old trainers"),
                    P("Sandals"),
                    P("Sliders"),
                ]),
                P("WASHBAG", inside=[
                    P("Travel facewash"),
                    P("Electric shaver"),
                    P("Electric toothbrush"),
                    P("Moisturiser"),
                    P("Decant bottles, filled"),
                    P("Travel suncream"),
                    P("Mosquito spray", "Khao Sok on the 17th. Buy stronger DEET in Bangkok."),
                ]),
                P("HEALTH KIT", "Moved out of the large washbag in Phuket.", inside=[
                    P("Small medical pouch"),
                    P("Paracetamol"),
                    P("Ibuprofen"),
                    P("Imodium"),
                    P("Motion sickness tablets", "The 06:00 Donsak ferry on the 17th."),
                    P("Antihistamine"),
                    P("Antiseptic cream"),
                    P("Plasters and blister plasters"),
                    P("Rehydration sachets"),
                    P("Athlete's foot cream"),
                ]),
                P("TECH", inside=[
                    P("60W USB-C mains supply"),
                    P("Fold-up 3-in-1 charger"),
                    P("Travel keyboard — fold-up"),
                    P("Mouse"),
                    P("Universal travel adapter"),
                ]),
                P("KIT", inside=[
                    P("Microfibre towel, mini"),
                    P("Small dry bag", "Khao Sok arrives by boat and the Krabi longtails soak everything."),
                    P("Swimming goggles"),
                    P("Lockable daypack"),
                    P("Dirty laundry bags"),
                    P("Bin bags"),
                    P("Packing cubes"),
                    P("Compression socks"),
                    P("Luggage scales"),
                    P("3 TSA padlocks", "Two go on the suitcases at Smilelugg."),
                ]),
            ],
               ids=["boxers","socks-white","socks-gym","tees","shirts-nice","shorts","trousers",
                    "swim","gym-tops","gym-shorts","belt","hats","hat-gym","pyjamas",
                    "running","trainers-old","sandals","sliders",
                    "washbag-mini","facewash","shaver","etoothbrush","moisturiser","decant",
                    "suncream-tr","mozzie",
                    "medkit","paracetamol","ibuprofen","imodium","motion","antihistamine",
                    "antiseptic","plasters","rehydration","athletes",
                    "plug-uk","charger-3in1","keyboard","mouse","adapter-universal",
                    "towel-sm","drybag","goggles","daypack","laundry-bag","binbags","cubes",
                    "compression","scales","locks"]),

            B("L1", "checked", [
                P("Into storage for 13 days", "Locked at Smilelugg and not opened until the 23rd."),
                P("Hoodie"),
                P("Tracksuit bottoms"),
                P("Windbreaker"),
                P("Microfibre towel, large"),
                P("Sunglasses — 4 pairs in a travel case"),
                P("The clothing you left behind", "3 boxers, 3 socks, 1 gym sock, 4 T-shirts, 5 nice shirts, 3 shorts."),
            ],
               ids=["hoodie","tracksuit","windbreaker","towel-lg","sunglasses"]),

            B("L2", "checked", [
                P("Into storage for 13 days"),
                P("MacBook Air"),
                P("USB-C dongle"),
                P("HDMI cable"),
                P("PS5 controller", "Back out on the 23rd for the thirteen hours home."),
                P("Switch HDMI cable"),
                P("Sony over-ear headphones", "Also back out on the 23rd."),
                P("Driving licence", "You are done driving."),
                P("Australian ETA", "Spent."),
                P("Cash — AUD 200", "Whatever is left. No use until you are back."),
                P("Thai notepad"),
                P("Large fold-out washbag", inside=[
                    P("Suncream — full size", "The decants are with you."),
                    P("Eye cream"),
                    P("Nail clippers"),
                    P("Roll-on deodorant — 2 spare"),
                    P("Shaver cable", "The shaver holds a charge for weeks."),
                ]),
            ],
               ids=["mba","dongle","hdmi","ps5-pad","hdmi-switch","sony","licence","eta-aus",
                    "cash-aud","notepad","washbag-lg","suncream","eyecream","nail",
                    "deodorant-spare","cable-shaver"]),

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
        id="bkk-usm",
        allow=dict(checked="20 kg", cabin="5 kg"),
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
        allow=dict(checked="20 kg", cabin="7 kg"),
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
        allow=dict(checked="40 kg", cabin="2 × 15 kg"),
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
