# -*- coding: utf-8 -*-
# The five bags, in the order they appear on the Bags tab.
# img    — product shot shown on the tile. Square, white background, 420px.
# airtag — an AirTag is attached to the bag itself. It is not a packable item,
#          so it shows as a line on the bag rather than something to tick off.

BAGS = [
 dict(id="L1", name="Suitcase 1", img="img/bag-L1.jpg", airtag=1),
 dict(id="L2", name="Suitcase 2", img="img/bag-L2.jpg", airtag=1),
 dict(id="CB", name="Cabin bag",  img="img/bag-CB.jpg", airtag=1),
 dict(id="BP", name="Backpack",   img="img/bag-BP.jpg", airtag=1),
 dict(id="SL", name="Sling",      img="img/bag-SL.jpg", airtag=1),
 # Not a bag. Things that travel on your body, so they never count against a
 # cabin allowance and never need finding at a bag drop.
 dict(id="WORN", name="Worn"),
]
