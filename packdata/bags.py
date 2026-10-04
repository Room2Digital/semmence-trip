# -*- coding: utf-8 -*-
# The five bags, plus Worn.
#
# img    — product shot shown on the tile. Square, white background, 420px.
# airtag — an AirTag is attached to the bag itself. It is not a packable item,
#          so it shows as a line on the bag rather than something to tick off.
# empty  — the bag's own weight in grams, counted into every leg total. An
#          airline weighs the bag, not just what is in it, and 13 kg of empty
#          luggage is not a rounding error.
#          Sources: Stubble & Co list the Hybrid 20L at 1.2 kg and the
#          crossbody sling at about 0.3 kg; Rock's hardshell 8-wheel cases are
#          about 4.2 kg large and 3.3 kg medium, with cabin sizes near 2.8 kg.
#          Weigh them yourself before you fly and correct these.

BAGS = [
 dict(id="L1", name="Suitcase 1", img="img/bag-L1.jpg", airtag=1, empty=4200),
 dict(id="L2", name="Suitcase 2", img="img/bag-L2.jpg", airtag=1, empty=4200),
 dict(id="CB", name="Cabin bag",  img="img/bag-CB.jpg", airtag=1, empty=2800),
 dict(id="BP", name="Backpack",   img="img/bag-BP.jpg", airtag=1, empty=1200),
 dict(id="SL", name="Sling",      img="img/bag-SL.jpg", airtag=1, empty=300),
 # Not a bag. Things that travel on your body, so they never count against a
 # cabin allowance and never need finding at a bag drop.
 dict(id="WORN", name="Worn", empty=0),
]
