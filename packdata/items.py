# -*- coding: utf-8 -*-
# Robbie — Australia & Thailand, 19 Nov 2026 – 24 Jan 2027
#
# bag:  L1/L2 large cases · CB cabin bag · BP backpack · SL sling
# fate: always   with you the whole way
#       store    parked in the Bangkok cases, 10–23 Jan
#       handover given away in Phuket, 7–10 Jan
#       buy      bought en route
I = []
def it(id, name, cat, bag, qty=1, g=0, fate="always", note="", crit=False, inbag=""):
    # inbag = the id of the container this lives inside (a washbag, the liquids
    # bag). The app nests it under that item instead of listing it loose.
    d = dict(id=id, name=name, cat=cat, bag=bag, qty=qty, g=g,
             fate=fate, note=note, crit=crit)
    if inbag:
        d["inbag"] = inbag
    I.append(d)

# ───────────────────────── DOCUMENTS & MONEY ─────────────────────────
it("passport","Passport","docs","SL",1,60,"always","",True)
it("eta-aus","Australian ETA","docs","SL",1,0,"always",
   "Approved before you fly — the airline checks it at Gatwick.",True)
it("licence","Driving licence","docs","SL",1,10,"store","",True)
it("insurance","Travel insurance — policy and 24hr number","docs","SL",1,10,"always",
   "Check the single-article limit before you fly. You are carrying roughly four thousand pounds of Apple hardware and most policies cap any one item at £300–500.",True)
it("cards","Bank cards — two providers","docs","SL",2,20,"always",
   "Tracker card in the wallet. Split across two bags so one loss isn't total.",True)
it("cash-thb","Cash — 25,000 THB","docs","SL",1,60,"always",
   "Ordered and paid, ref STM30429677 — GBP 598.23 at 41.7898. Half the original plan and still comfortable, because most of Thailand is already covered: Khao Sok is fully prepaid apart from the THB 340 park and pier fee, and in Bangkok and Samui the rooms are paid and your parents are picking up most of the rest. So this is really Phuket and Ao Nang money — food, longtails, taxis, beach days. Top up from an ATM in Bangkok if it runs low. Well under Thailand's declaration threshold (USD 20,000 equivalent), so nothing to declare. Split it — some in the sling, some in a case, some in the hotel safe. Do not carry the lot in one place for 67 days.",True)
it("cash-aud","Cash — 200 AUD","docs","SL",1,15,"always",
   "Ordered and paid, ref STM30429677 — GBP 109.07 at 1.8337. You said Australia is effectively cashless and you'd made that mistake before, so treat this as an emergency float, not spending money: a cab that won't take cards, a tip, Rottnest, a market stall at Fremantle. Keep a twenty on you and the rest in the case. It is dead weight after 7 Jan — spend it or give it away before you fly to Phuket.")

# ───────────────────────────── TECH ─────────────────────────────
it("phone","Phone","tech","SL",1,220,"always","",True)
it("watch","Apple Watch","tech","WORN",1,50,"always","")
it("airpods","AirPods Pro","tech","SL",1,60,"always","Your everyday set once the over-ears are parked.")
it("sony","Sony over-ear headphones","tech","SL",1,250,"store",
   "Earn their place over the 26 hours out. Into the stored case in Phuket, collected on the 23rd for the flight home.")
it("ipad-air","iPad Air","tech","CB",1,460,"always","Reading and films. Comes everywhere.")
it("mba","MacBook Air","tech","CB",1,1240,"store",
   "You work from Perth and stop in Thailand. Into the stored case in Phuket — it does not need to see Samui or the lake.",True)
it("dongle","USB-C dongle","tech","CB",1,40,"store","Stores with the Air.")
it("mouse","Mouse","tech","CB",1,80,"store","Seven weeks of work earns it. Stores with the Air.")
it("hdmi","HDMI cable","tech","CB",1,90,"store","General purpose — hotel TVs, the MacBook. Stores at Phuket.")
it("hdmi-switch","Nintendo Switch HDMI cable","tech","L1",1,80,"store","Travels with the Switch.")
it("ps5-pad","PS5 controller","tech","L1",1,280,"store",
   "For Remote Play. Qatar's Starlink should genuinely carry it — the bandwidth is there and satellite latency is usually workable. Worth testing on the Gatwick to Doha leg before you count on it for the 14 hours to Perth. Pairs natively with the iPad Air as the fallback.")
it("switch","Nintendo Switch","tech","L1",1,400,"store",
   "Stays in the stored cases 10–23 Jan, then into the cabin bag at Bangkok for the flight home.")
it("plug-uk","60W USB-C mains supply","tech","CB",1,90,"always",
   "The one that charges the MacBook Air as well as everything else. The fold-up 3-in-1 will not.",True)
it("adapter-universal","Travel adapter with USB-C","tech","CB",1,180,"always",
   "UK Type G, Australia Type I, Thailand A/C. Check it is rated for the laptop charger, not just phones.",True)
it("charger-3in1","Fold-up 3-in-1 charger","tech","BP",1,180,"always",
   "Watch, phone and AirPods from one plug. The best single item in the sling.")
it("cable-ext","Extendable USB-C cable","tech","BP",1,70,"always","")
it("cable-shaver","Shaver cable","tech","L2",1,40,"always",
   "Not USB-C at both ends, so nothing else in the bag will charge it. The one cable with no substitute — pack it with the shaver, not loose.",True,inbag="washbag-lg")
it("brick-sm","Power bank — small","tech","SL",1,200,"always",
   "The only one you are taking — the large one is out. Cabin baggage only, never checked.",True)

# ─────────────────────────── SLEEP & FLIGHT ───────────────────────────
it("mouthtape","Mouth tape","flight","BP",1,20,"always","")
it("eyemask","Eye mask","flight","BP",1,30,"always","QR835 is an overnight and QR107 lands at 06:35.")
it("earplugs","Earplugs","flight","BP",1,10,"always","")
it("snacks","Snacks for travel days","flight","SL",1,150,"always","")

# ───────────────────────────── TOILETRIES ─────────────────────────────
it("washbag-lg","Fold-out washbag — large","toiletries","L2",1,260,"store",
   "Lives in the suitcase. Into storage from Phuket onwards.")
it("washbag-mini","Mini washbags","toiletries","CB",2,80,"always",
   "The hand-luggage pair. These are what you actually use on travel days and at the lake.",True)
it("liquids-bag","Clear 1L liquids bag","toiletries","CB",1,20,"always",
   "Re-cleared at Perth, Phuket, Bangkok and Krabi. Keep it reachable.",True)
it("decant","Decant bottles, 100 ml","toiletries","L2",5,150,"always",
   "Fill these in Phuket, before the full-size goes into storage. For the lake you really only need suncream and the basics — Hansar, Krabi La Playa and Theatre Residence all provide the rest.",True,inbag="washbag-lg")
it("suncream","Suncream — full size","toiletries","L2",1,200,"always",
   "Australian suncream is the best there is and cheap. Decant 100 ml for the onward leg.",True,inbag="washbag-lg")
it("suncream-tr","Travel suncream","toiletries","L2",1,80,"always","For the plane and the first day before you buy properly.",inbag="washbag-lg")
it("facewash","Travel facewash","toiletries","CB",1,90,"always","",inbag="washbag-mini")
it("moisturiser","Moisturiser","toiletries","CB",1,100,"always",
   "Cabin bag on both long-hauls. Three sectors of dry cabin air each way.",True,inbag="washbag-mini")
it("eyecream","Eye cream","toiletries","L2",1,40,"always","",inbag="washbag-lg")
it("sanitiser","Hand sanitiser","toiletries","CB",1,60,"always","",inbag="liquids-bag")
it("mozzie","Mosquito spray","toiletries","L2",1,120,"always",
   "Khao Sok is jungle on water and the lake is worst at dusk. Top up with stronger DEET in Thailand if yours is mild.",True,inbag="washbag-lg")
it("shaver","Electric shaver","toiletries","CB",1,220,"always",
   "Cabin bag on both long-hauls — you want a shave before landing in Perth and again before Heathrow. Lithium batteries belong in the cabin anyway, not the hold.",True,inbag="washbag-mini")
it("shave-foam","Mini shaving foam","toiletries","CB",1,100,"always",
   "Under 100 ml, so it lives in the clear liquids bag. Cabin bag on both long-hauls.",True,inbag="liquids-bag")
it("toothpaste-mini","Mini toothpaste","toiletries","CB",1,40,"always",
   "For the Gatwick night and the flight. Full size bought in Perth.",True,inbag="liquids-bag")
it("etoothbrush","Electric toothbrush","toiletries","CB",1,180,"always",
   "Toothpaste bought on arrival; Qatar give you a travel one for the flight. Check the charger — most are an inductive base with a fixed plug, which needs the travel adapter.",True,inbag="washbag-mini")
it("deodorant","Roll-on deodorant","toiletries","CB",1,100,"always",
   "The one you are using. Roll-on is not a liquid for cabin purposes and does not leak at altitude.",True,inbag="liquids-bag")
it("deodorant-spare","Roll-on deodorant — 2 spare","toiletries","L2",2,200,"always",
   "In the large washbag. 67 days is more than one stick.",False,inbag="washbag-lg")
it("aftershave","Aftershave atomiser","toiletries","CB",1,60,"always",
   "One small atomiser covers all 67 days and clears cabin liquids without a thought.",inbag="liquids-bag")
it("lipbalm","Lip balm with SPF","toiletries","CB",1,15,"always",
   "Six hours cycling at Rottnest, a lot of beach, and three long-haul sectors of dry cabin air.",inbag="liquids-bag")
it("nail","Nail clippers","toiletries","L2",1,40,"always","Fine in checked. Cabin rules on clippers vary by airport.",inbag="washbag-lg")

# ────────────────────────────── HEALTH ──────────────────────────────
it("medkit","Small medical pouch","health","L2",1,60,"always","",inbag="washbag-lg")
it("imodium","Imodium","health","CB",1,20,"always",
   "The 06:00 ferry on the 17th, then 2h15 by road to the lake. You cannot buy this at 5am on a pier.",True,inbag="washbag-mini")
it("motion","Motion sickness tablets","health","L2",1,20,"always",
   "Samui to Donsak is 1h30 of open water. Take one before boarding, not when you feel it.",True,inbag="washbag-lg")
it("paracetamol","Paracetamol","health","CB",1,40,"always","",inbag="washbag-mini")
it("ibuprofen","Ibuprofen","health","CB",1,40,"always","",inbag="washbag-mini")
it("antihistamine","Antihistamine","health","L2",1,20,"always","Bites, heat rash, unfamiliar food.",inbag="washbag-lg")
it("antiseptic","Antiseptic cream","health","L2",1,40,"always",
   "Coral and scooter scrapes infect fast in the tropics.",True,inbag="washbag-lg")
it("plasters","Plasters + blister plasters","health","L2",1,50,"always",
   "Blister plasters specifically — new sandals and a lot of walking.",True,inbag="washbag-lg")
it("rehydration","Rehydration sachets","health","L2",6,60,"always","Heat, beer and stomach trouble. Tiny and cheap.",inbag="washbag-lg")
it("athletes","Athlete's foot cream","health","L2",1,50,"always","Humidity, flip-flops, wet bathrooms.",inbag="washbag-lg")
it("prescriptions","Prescription medication","health","CB",1,100,"always",
   "Enough for 67 days plus buffer, in original packaging, in hand luggage.",True)

# ─────────────────────── HANDOVER — leaves in Phuket ───────────────────────
it("mbp","MacBook Pro — for handover","tech","L2",1,1600,"handover",
   "Given away in Phuket, 7–10 Jan. Sign out of your Apple ID and erase it BEFORE you fly — doing that over hotel wifi with a deadline is miserable. Remove it from Find My or it stays activation-locked and useless to them.",True)
it("ipad-mini","iPad mini — for handover","tech","L2",1,300,"handover",
   "Same: signed out, erased and removed from Find My before you fly.",True)

# ─────────────────────────────── KIT ───────────────────────────────
it("larq","Larq bottle, 1L","kit","BP",1,500,"always",
   "Self-cleaning, so it earns itself in Thailand. Empty through security, fill after.",True)
it("towel-lg","Microfibre towel — large","kit","L1",1,300,"store","Beach days in Perth. Stores at Phuket.")
it("towel-sm","Microfibre towel — mini","kit","CB",1,120,"always",
   "The one that matters onward — ferries, the lake, Krabi longtails.",True)
it("drybag","Dry bag, small — TO BUY","kit","BP",1,120,"buy",
   "Not owned yet. Khao Sok arrives by boat, the ferry deck is wet and Krabi longtails soak everything. Phone, wallet and the Switch while you're on the water.",True)
it("cubes","Packing cubes","kit","CB",4,0,"always",
   "Weigh nothing worth counting. They are what makes the Phuket changeover quick rather than an afternoon.",True)
it("sunglasses","Sunglasses — 4 pairs in a travel case","kit","L1",4,400,"store",
   "The travel case lives in the suitcase. Include the cheap pairs here — these are the ones for the water and the longtails.",True)
it("sunglasses-daily","Sunglasses","kit","SL",1,120,"always","")
it("locks","TSA padlocks","kit","CB",3,150,"always",
   "Three bags go in the Jetstar hold and two sit in storage for 13 days.",True)
it("scales","Luggage scales","kit","CB",1,100,"always",
   "You have a live 7 kg problem on TG206. Pays for itself once.",True)
it("laundry-bag","Dirty laundry bags","kit","CB",2,110,"always",
   "Two, so dirty and damp stay apart from clean. Thai laundry charges by the kilo and bagged is faster to drop off.")
it("binbags","Bin bags","kit","CB",5,60,"always",
   "Wet swimwear, sandy shoes, the shirt you sweated through on the ferry. Weigh nothing and solve a problem every few days.")
it("goggles","Swimming goggles","kit","CB",1,80,"buy",
   "Worth having — the Sebel and the office both have gyms, and there is a lot of sea between Scarborough, Samui and Krabi.")
it("apps","Phone apps page","docs","SL",1,0,"always",
   "Airlines, TripIt, Avios, Amex, Monzo, Booking.com, Grab, Uber, Uber Eats, Ticketmaster. Add WhatsApp — the Bangkok driver contacts you on it — plus Line, which is how Thai businesses actually communicate, and GetYourGuide for the Rottnest ferry booking.")
it("notepad","Thai notepad","kit","L2",1,90,"always","")
it("daypack","Lockable daypack","kit","CB",1,320,"always",
   "Rottnest, the ferries and Bangkok. Lockable zips and a slash-resistant strap.",True)

# ───────────────────────────── FOOTWEAR ─────────────────────────────
it("trainers-nice","Nice trainers","footwear","CB",1,780,"always",
   "Your smart-casual pair. Fine at Vertigo and Blue Elephant — long trousers are the part they actually care about.")
it("trainers-old","Old trainers","footwear","L1",1,750,"store",
   "The pair you don't mind ruining. Perth beaches and anything messy.")
it("running","Running shoes","footwear","CB",1,720,"always","Gym the whole trip, so these travel onward.")
it("sandals","Sandals","footwear","CB",1,400,"always",
   "The ones you can walk miles in and get wet — Khao Sok, the piers, Krabi.",True)
it("sliders","Sliders","footwear","CB",1,280,"always","Beach, pool, hotel bathrooms.")

# ───────────────────────────── CLOTHING ─────────────────────────────
it("shirts-nice","Nice shirts","clothing","CB",8,1600,"always","Dinners, Christmas, Bangkok, and sun cover that still reads as clothing.")
it("tees","T-shirts","clothing","CB",12,1800,"always","")
it("shorts","Shorts","clothing","CB",6,1200,"always","")
it("trousers","Trousers","clothing","CB",1,450,"always",
   "For the two or three nights out — Vertigo, Blue Elephant, Christmas dinner. Elephant pants bought in Thailand cover the temples; shorts cover everything else.",True)
it("swim","Swim shorts","clothing","CB",2,200,"always","Two, so one is always dry.",True)
it("boxers","Boxers","clothing","CB",8,270,"always","")
it("socks-white","White socks","clothing","CB",8,320,"always","")
it("socks-gym","Gym socks","clothing","CB",3,120,"always","")
it("compression","Compression socks","clothing","BP",1,90,"always",
   "For the long-haul. Worth it on a 26-hour door-to-door and again on the way back.",True)
it("gym-tops","Gym tops","clothing","CB",3,300,"always","")
it("gym-shorts","Gym shorts","clothing","CB",2,300,"always","")
it("belt","Belt","clothing","CB",1,150,"always","")
it("hoodie","Hoodie","clothing","L1",1,520,"store",
   "Suitcase, not worn. Note the consequence: the cases sit in Bangkok storage 10–23 Jan, so you have no warm layer for the 06:00 Donsak ferry or nights on the lake. You collect it on the 23rd in time for the flight home.",True)
it("windbreaker","Windbreaker","clothing","CB",1,280,"always",
   "Packs to nothing. The one thing between you and a British 06:35 landing on 24 January.",True)
it("tracksuit","Tracksuit bottoms","clothing","L1",1,420,"store",
   "Suitcase. Back in your hands on the 23rd for the flight home.")
it("pyjamas","Qatar pyjamas","clothing","CB",1,250,"always",
   "They don't take them back, so you have them from 19 Nov. Covers sleepwear for the rest of the trip.")
it("hats","Hats","clothing","CB",3,300,"always","")
it("hat-gym","Gym hat","clothing","CB",1,100,"always","")
