import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ─────────────────────────────────────────────────────────
// STORAGE HELPERS
// ─────────────────────────────────────────────────────────

const db = {
  async get(key) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; }
    catch { return null; }
  },
  async set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
  async del(key) {
    try { localStorage.removeItem(key); } catch {}
  },
};

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────

const VENUES = [
  // ── PIE & TART TRAIL ──────────────────────────────────────
  { id:1,  name:"The Three Little Pigs Cafe",         village:"Gisborne",      trail:"pie",    type:"Specialty Cafe",   blurb:"Caramelised Onion, Goats Cheese & Pumpkin Tart.",                               hours:"See visitmacedonranges.com" },
  { id:2,  name:"The Gisborne Collective",            village:"Gisborne",      trail:"pie",    type:"Specialty Cafe",   blurb:"Raspberry Nutella Calzone.",                                                    hours:"See visitmacedonranges.com" },
  { id:3,  name:"Sheppards Choice",                   village:"Gisborne",      trail:"pie",    type:"Bakery",           blurb:"Country Chicken Pie.",                                                          hours:"See visitmacedonranges.com" },
  { id:4,  name:"Gisborne Ice Cream Co",              village:"Gisborne",      trail:"pie",    type:"Specialty Cafe",   blurb:"Blueberry Pie Ice Cream.",                                                      hours:"See visitmacedonranges.com" },
  { id:5,  name:"Baringo Food and Wine Co",           village:"Newham",        trail:"pie",    type:"Restaurant",       blurb:"The Stationmaster's Apple Pie.",                                                hours:"See visitmacedonranges.com" },
  { id:6,  name:"Hesket Estate",                      village:"Hesket",        trail:"pie",    type:"Winery/Cafe",      blurb:"Ganache Chocolate Tart.",                                                       hours:"See visitmacedonranges.com" },
  { id:7,  name:"Angie's Cafe",                       village:"Kyneton",       trail:"pie",    type:"Specialty Cafe",   blurb:"Pumpkin & Feta Tart.",                                                          hours:"See visitmacedonranges.com" },
  { id:8,  name:"Campaspe Mill Distillery",           village:"Kyneton",       trail:"pie",    type:"Distillery",       blurb:"Chicken Pot Pie.",                                                              hours:"See visitmacedonranges.com" },
  { id:9,  name:"Country Cob Bakery",                 village:"Kyneton",       trail:"pie",    type:"Bakery",           blurb:"Creamy Mushroom & Truffle Pie.",                                                hours:"See visitmacedonranges.com" },
  { id:10, name:"Dough Si Dough Sourdough Bakery",    village:"Kyneton",       trail:"pie",    type:"Bakery",           blurb:"Chunky Lamb Pie.",                                                              hours:"See visitmacedonranges.com" },
  { id:11, name:"fed Foodstore and Catering",         village:"Kyneton",       trail:"pie",    type:"Specialty Cafe",   blurb:"Salted Caramel Pear Tarte Tatin.",                                              hours:"See visitmacedonranges.com" },
  { id:12, name:"Grist Artisan Bakers",               village:"Kyneton",       trail:"pie",    type:"Bakery",           blurb:"Country Style Custard Tart.",                                                   hours:"See visitmacedonranges.com" },
  { id:13, name:"Kyneton Ridge Estate",               village:"Kyneton",       trail:"pie",    type:"Winery/Cafe",      blurb:"Strawberry Shortbread Tart.",                                                   hours:"See visitmacedonranges.com" },
  { id:14, name:"Kyneton RSL",                        village:"Kyneton",       trail:"pie",    type:"Pub/Restaurant",   blurb:"The Kyneton Comfort Pie — Chicken, Leek & Bacon.",                              hours:"See visitmacedonranges.com" },
  { id:15, name:"Monsieur Pierre",                    village:"Kyneton",       trail:"pie",    type:"Restaurant",       blurb:"Roast Carrot, Ricotta & Thyme Tart.",                                           hours:"See visitmacedonranges.com" },
  { id:16, name:"Piper St Food Co",                   village:"Kyneton",       trail:"pie",    type:"Specialty Cafe",   blurb:"Plum & Spiced Apple Pie.",                                                      hours:"See visitmacedonranges.com" },
  { id:17, name:"PRATO",                              village:"Kyneton",       trail:"pie",    type:"Restaurant",       blurb:"Traditional Galaktoboureko Greek Custard Pie.",                                  hours:"See visitmacedonranges.com" },
  { id:18, name:"Shamrock Hotel Kyneton",             village:"Kyneton",       trail:"pie",    type:"Pub/Restaurant",   blurb:"Slow Braised Beef, Vegetable & Guinness Pie.",                                  hours:"See visitmacedonranges.com" },
  { id:19, name:"Sisko Chocolate",                    village:"Kyneton",       trail:"pie",    type:"Specialty Cafe",   blurb:"Golden Orchard Chocolate Tart.",                                                hours:"See visitmacedonranges.com" },
  { id:20, name:"The Albion Hotel",                   village:"Kyneton",       trail:"pie",    type:"Pub/Restaurant",   blurb:"12 Hour Braised Beef, Mushroom & Guinness Pie.",                                hours:"See visitmacedonranges.com" },
  { id:21, name:"The Kyneton Hotel",                  village:"Kyneton",       trail:"pie",    type:"Pub/Restaurant",   blurb:"Seasonal Pot Pie.",                                                             hours:"See visitmacedonranges.com" },
  { id:22, name:"Elsie's at The Lancefield Lodge",    village:"Lancefield",    trail:"pie",    type:"Lodge Restaurant", blurb:"Cook-A-Doodle-Shroom.",                                                         hours:"See visitmacedonranges.com" },
  { id:23, name:"Glen Erin at Lancefield",            village:"Lancefield",    trail:"pie",    type:"Restaurant",       blurb:"Beef Cheek & Green Peppercorn Pie.",                                            hours:"See visitmacedonranges.com" },
  { id:24, name:"Lancefield Bakery",                  village:"Lancefield",    trail:"pie",    type:"Bakery",           blurb:"Chunky Guinness Pie.",                                                          hours:"See visitmacedonranges.com" },
  { id:25, name:"Lost Watering Hole",                 village:"Lancefield",    trail:"pie",    type:"Pub/Restaurant",   blurb:"Hungarian Goulash Pot Pie.",                                                    hours:"See visitmacedonranges.com" },
  { id:26, name:"Lyons Will Estate",                  village:"Lancefield",    trail:"pie",    type:"Winery",           blurb:"Apple Sage & Mustard Pork Pie.",                                                hours:"See visitmacedonranges.com" },
  { id:27, name:"The Lancefield Hotel",               village:"Lancefield",    trail:"pie",    type:"Pub",              blurb:"Stew & Brew Pie.",                                                              hours:"See visitmacedonranges.com" },
  { id:28, name:"Gogo's Cafe & Bar",                  village:"Malmsbury",     trail:"pie",    type:"Specialty Cafe",   blurb:"Gogo's Citrus Tart.",                                                           hours:"See visitmacedonranges.com" },
  { id:29, name:"Macedon Village Hotel",              village:"Macedon",       trail:"pie",    type:"Village Pub",      blurb:"Beef & Guinness Pie.",                                                          hours:"See visitmacedonranges.com" },
  { id:30, name:"Malmsbury Bakery",                   village:"Malmsbury",     trail:"pie",    type:"Bakery",           blurb:"Mini Fruit Pie.",                                                               hours:"See visitmacedonranges.com" },
  { id:31, name:"Mount Macedon Trading Post",         village:"Mount Macedon", trail:"pie",    type:"Specialty Cafe",   blurb:"Lamb, Rosemary and Vegetable Pie.",                                             hours:"See visitmacedonranges.com" },
  { id:32, name:"Big Tree Distillery",                village:"Mount Macedon", trail:"pie",    type:"Distillery",       blurb:"Big Tree Blueberry Thrill Gin Lattice Pie.",                                    hours:"See visitmacedonranges.com" },
  { id:33, name:"Hanging Rock Wines",                 village:"Newham",        trail:"pie",    type:"Winery/Cafe",      blurb:"Hanging Rock Estate-Grown Beef Pie.",                                           hours:"See visitmacedonranges.com" },
  { id:34, name:"Hunter-Gatherer Winery",             village:"Kyneton",       trail:"pie",    type:"Urban Winery/Bar", blurb:"American Cherry Pie.",                                                          hours:"See visitmacedonranges.com" },
  { id:35, name:"Dromkeen Gallery & Tearoom",         village:"Riddells Creek", trail:"pie",   type:"Specialty Cafe",   blurb:"Vanilla Strawberry Custard Tart.",                                              hours:"See visitmacedonranges.com" },
  { id:36, name:"The Riddells Creek Hotel",           village:"Riddells Creek", trail:"pie",   type:"Pub",              blurb:"Lamb Shank Pot Pie.",                                                           hours:"See visitmacedonranges.com" },
  { id:37, name:"Mount Monument Winery",              village:"Macedon",       trail:"pie",    type:"Winery",           blurb:"Beef & Dark Ale Pie.",                                                          hours:"See visitmacedonranges.com" },
  { id:38, name:"Red Poppy Estate",                   village:"Romsey",        trail:"pie",    type:"Vineyard",         blurb:"Organic Beef & Whisky Pie.",                                                    hours:"See visitmacedonranges.com" },
  { id:39, name:"The 1860",                           village:"Romsey",        trail:"pie",    type:"Pub/Restaurant",   blurb:"Blumas Curry Lamb Pie.",                                                        hours:"See visitmacedonranges.com" },
  { id:40, name:"Verdure Bistro",                     village:"Romsey",        trail:"pie",    type:"Restaurant",       blurb:"Beef & Burgundy Pie.",                                                          hours:"See visitmacedonranges.com" },
  { id:41, name:"Hanging Rock Cafe",                  village:"Newham",        trail:"pie",    type:"Garden Cafe",      blurb:"Banoffee Pie.",                                                                 hours:"See visitmacedonranges.com" },
  { id:42, name:"Mount Macedon Winery",               village:"Mount Macedon", trail:"pie",    type:"Winery",           blurb:"Slow Braised Duck Pie, Cavolo de Nero & Forest Mushroom.",                      hours:"See visitmacedonranges.com" },
  { id:43, name:"UUMM Restaurant",                    village:"Romsey",        trail:"pie",    type:"Restaurant",       blurb:"Roasted Fig & Pistachio Frangipane Tart.",                                      hours:"See visitmacedonranges.com" },
  { id:44, name:"Bourkies Bakehouse",                 village:"Woodend",       trail:"pie",    type:"Bakery",           blurb:"Classic Beef Steak Pie.",                                                       hours:"See visitmacedonranges.com" },
  { id:45, name:"Cafe Maya",                          village:"Woodend",       trail:"pie",    type:"Restaurant",       blurb:"Butter Chicken Pie.",                                                           hours:"See visitmacedonranges.com" },
  { id:46, name:"Holgate Brewhouse",                  village:"Woodend",       trail:"pie",    type:"Brewery/Hotel",    blurb:"Holgate Lamb Shank Pie & Mash.",                                                hours:"See visitmacedonranges.com" },
  { id:47, name:"Mountainview Garlic",                village:"Woodend",       trail:"pie",    type:"Specialty Cafe",   blurb:"Jam Tart.",                                                                     hours:"See visitmacedonranges.com" },
  { id:48, name:"Paysanne cafe",                      village:"Woodend",       trail:"pie",    type:"Specialty Cafe",   blurb:"Beef Bourguignon Pie.",                                                         hours:"See visitmacedonranges.com" },
  { id:49, name:"The Victoria Hotel Woodend",         village:"Woodend",       trail:"pie",    type:"Pub/Restaurant",   blurb:"Our Famous Victoria Pie.",                                                      hours:"See visitmacedonranges.com" },
  { id:50, name:"Woodend Ice Cream Co",               village:"Woodend",       trail:"pie",    type:"Specialty Cafe",   blurb:"Cherry-Ricotta Pie Ice Cream.",                                                 hours:"See visitmacedonranges.com" },
  { id:51, name:"Woodend Cellar and Bar",             village:"Woodend",       trail:"pie",    type:"Urban Winery/Bar", blurb:"Key Lime Pie Cocktail.",                                                        hours:"See visitmacedonranges.com" },
  // ── TIPPLE TRAIL ──────────────────────────────────────────
  { id:52, name:"Paramoor Winery",                    village:"Romsey",        trail:"tipple", type:"Winery",           blurb:"Paramoor's 2024 Malbec.",                                                       hours:"See visitmacedonranges.com" },
  { id:53, name:"Wombat Forest Vineyard",             village:"Woodend",       trail:"tipple", type:"Vineyard",         blurb:"Aperol Spritz & Savoury Board.",                                                hours:"See visitmacedonranges.com" },
  { id:54, name:"The Gisborne Collective",            village:"Gisborne",      trail:"tipple", type:"Specialty Cafe",   blurb:"Cloud Distillery Pink Gin & Tonic.",                                            hours:"See visitmacedonranges.com" },
  { id:55, name:"Baringo Food and Wine Co",           village:"Newham",        trail:"tipple", type:"Restaurant",       blurb:"The Publican's Selection UK Ale.",                                              hours:"See visitmacedonranges.com" },
  { id:56, name:"Hesket Estate",                      village:"Hesket",        trail:"tipple", type:"Winery/Cafe",      blurb:"Hesket Estate Pinot Noir & Local Produce Platter.",                             hours:"See visitmacedonranges.com" },
  { id:57, name:"Botanik Bar",                        village:"Kyneton",       trail:"tipple", type:"Urban Winery/Bar", blurb:"The Balkan Shuffle.",                                                           hours:"See visitmacedonranges.com" },
  { id:58, name:"Campaspe Mill Distillery",           village:"Kyneton",       trail:"tipple", type:"Distillery",       blurb:"Gin Fizz.",                                                                     hours:"See visitmacedonranges.com" },
  { id:59, name:"Donkey Kyneton",                     village:"Kyneton",       trail:"tipple", type:"Urban Winery/Bar", blurb:"Spicy Hazelnut Martini.",                                                       hours:"See visitmacedonranges.com" },
  { id:60, name:"Kyneton Ridge Estate",               village:"Kyneton",       trail:"tipple", type:"Winery/Cafe",      blurb:"Skipping Rabbit Pinot Noir & Cheese Plate Pairing.",                            hours:"See visitmacedonranges.com" },
  { id:61, name:"Kyneton RSL",                        village:"Kyneton",       trail:"tipple", type:"Pub/Restaurant",   blurb:"Rosy Martini.",                                                                 hours:"See visitmacedonranges.com" },
  { id:62, name:"PRATO",                              village:"Kyneton",       trail:"tipple", type:"Restaurant",       blurb:"Little Miss Sunshine Mocktail.",                                                hours:"See visitmacedonranges.com" },
  { id:63, name:"Shamrock Hotel Kyneton",             village:"Kyneton",       trail:"tipple", type:"Pub/Restaurant",   blurb:"Pint of Guinness.",                                                             hours:"See visitmacedonranges.com" },
  { id:64, name:"The Albion Hotel",                   village:"Kyneton",       trail:"tipple", type:"Pub/Restaurant",   blurb:"Forbidden Sour Cocktail.",                                                      hours:"See visitmacedonranges.com" },
  { id:65, name:"The Kyneton Hotel",                  village:"Kyneton",       trail:"tipple", type:"Pub/Restaurant",   blurb:"Warm Spiced Apple Cider.",                                                      hours:"See visitmacedonranges.com" },
  { id:66, name:"Cleveland Estate",                   village:"Kyneton",       trail:"tipple", type:"Winery",           blurb:"Cleveland's Maple Bourbon Smash.",                                              hours:"See visitmacedonranges.com" },
  { id:67, name:"Double Oaks Estate",                 village:"Kyneton",       trail:"tipple", type:"Winery",           blurb:"Estate Grown Chardonnay.",                                                      hours:"See visitmacedonranges.com" },
  { id:68, name:"Elsie's at The Lancefield Lodge",    village:"Lancefield",    trail:"tipple", type:"Lodge Restaurant", blurb:"Naturally Native.",                                                             hours:"See visitmacedonranges.com" },
  { id:69, name:"Glen Erin at Lancefield",            village:"Lancefield",    trail:"tipple", type:"Restaurant",       blurb:"Marmalade Spritz.",                                                             hours:"See visitmacedonranges.com" },
  { id:70, name:"Lost Watering Hole",                 village:"Lancefield",    trail:"tipple", type:"Pub/Restaurant",   blurb:"Apfelpunsch.",                                                                  hours:"See visitmacedonranges.com" },
  { id:71, name:"Lyons Will Estate",                  village:"Lancefield",    trail:"tipple", type:"Winery",           blurb:"Lyons Will Estate's Newly-Released Riesling.",                                  hours:"See visitmacedonranges.com" },
  { id:72, name:"The Lancefield Hotel",               village:"Lancefield",    trail:"tipple", type:"Pub",              blurb:"The Clairdie.",                                                                 hours:"See visitmacedonranges.com" },
  { id:73, name:"Macedon Village Hotel",              village:"Macedon",       trail:"tipple", type:"Village Pub",      blurb:"Hot Buttered Rum.",                                                             hours:"See visitmacedonranges.com" },
  { id:74, name:"Mount Macedon Trading Post",         village:"Mount Macedon", trail:"tipple", type:"Specialty Cafe",   blurb:"Rock & Ranges Festivus Beer.",                                                  hours:"See visitmacedonranges.com" },
  { id:75, name:"Mount Tawrang Vineyard",             village:"Malmsbury",     trail:"tipple", type:"Vineyard",         blurb:"Estate Grown Prosecco.",                                                        hours:"See visitmacedonranges.com" },
  { id:76, name:"Big Tree Distillery",                village:"Mount Macedon", trail:"tipple", type:"Distillery",       blurb:"Tomorrow's Problem — Big Tree Autumnal Day Cocktail.",                          hours:"See visitmacedonranges.com" },
  { id:77, name:"Hanging Rock Winery",                village:"Newham",        trail:"tipple", type:"Winery",           blurb:"Hanging Rock Lemon Tinto.",                                                     hours:"See visitmacedonranges.com" },
  { id:78, name:"Hunter-Gatherer Winery",             village:"Kyneton",       trail:"tipple", type:"Urban Winery/Bar", blurb:"Hunter Gatherer Winery Sparkling Shiraz.",                                      hours:"See visitmacedonranges.com" },
  { id:79, name:"The Riddells Creek Hotel",           village:"Riddells Creek", trail:"tipple", type:"Pub",             blurb:"Espresso Martini.",                                                             hours:"See visitmacedonranges.com" },
  { id:80, name:"Mount Monument Winery",              village:"Macedon",       trail:"tipple", type:"Winery",           blurb:"Pumpkin Whiskey Smash.",                                                        hours:"See visitmacedonranges.com" },
  { id:81, name:"Red Poppy Estate",                   village:"Romsey",        trail:"tipple", type:"Vineyard",         blurb:"Red Poppy Estate Sparkling Shiraz.",                                            hours:"See visitmacedonranges.com" },
  { id:82, name:"The 1860",                           village:"Romsey",        trail:"tipple", type:"Pub/Restaurant",   blurb:"Classic Campbell.",                                                             hours:"See visitmacedonranges.com" },
  { id:83, name:"600 Above",                          village:"Romsey",        trail:"tipple", type:"Winery",           blurb:"Blackberry Smash.",                                                             hours:"See visitmacedonranges.com" },
  { id:84, name:"Holgate Brewhouse",                  village:"Woodend",       trail:"tipple", type:"Brewery/Hotel",    blurb:"Holgate Irish Nitro Stout.",                                                    hours:"See visitmacedonranges.com" },
  { id:85, name:"The Victoria Hotel Woodend",         village:"Woodend",       trail:"tipple", type:"Pub/Restaurant",   blurb:"Lemon & Passionfruit Meringue Pie Cocktail.",                                   hours:"See visitmacedonranges.com" },
  { id:86, name:"Woodend Cellar and Bar",             village:"Woodend",       trail:"tipple", type:"Urban Winery/Bar", blurb:"Pinio Wines First Release Wine Flight.",                                        hours:"See visitmacedonranges.com" },
  { id:87, name:"Mount Macedon Winery",               village:"Mount Macedon", trail:"tipple", type:"Winery",           blurb:"Bottle of Estate Wine 2023 & Charcuterie/Cheese Takeaway Pack for Two.",        hours:"See visitmacedonranges.com" },
  { id:88, name:"UUMM Restaurant",                    village:"Romsey",        trail:"tipple", type:"Restaurant",       blurb:"UUMM Wine & Charcuterie & Cheese Takeaway Box For Two.",                        hours:"See visitmacedonranges.com" },
  // ── GARDEN TRAIL (Mount Macedon) ──────────────────────────
  { id:89, name:"Forest Glade Gardens",               village:"Mount Macedon", trail:"garden", type:"Private Garden",   blurb:"Open all 7 days. Azaleas, maples, ancient elms — stunning autumn colour.",       hours:"Daily 10am–5pm" },
  { id:90, name:"Duneira Estate",                     village:"Mount Macedon", trail:"garden", type:"Historic Estate",  blurb:"One of Victoria's finest cool-climate gardens. Open Tuesday to Sunday.",          hours:"Tue–Sun 10am–5pm" },
  { id:91, name:"Viewfield",                          village:"Mount Macedon", trail:"garden", type:"Private Garden",   blurb:"Spectacular private garden open Weekends & Public Holidays only.",               hours:"Weekends & Public Holidays" },
];

const TRAILS = {
  pie:    { label:"Pie & Tart Trail", color:"#C85A15", light:"#E07030", bg:"rgba(200,90,21,0.15)",  emoji:"🥧" },
  tipple: { label:"Tipple Trail",     color:"#8B1A2F", light:"#C44060", bg:"rgba(139,26,47,0.15)",  emoji:"🍷" },
  garden: { label:"Garden Trail",     color:"#3A6B2F", light:"#5DA050", bg:"rgba(58,107,47,0.15)",  emoji:"🌿" },
};

const VILLAGES = ["All Villages","Gisborne","Hesket","Kyneton","Lancefield","Macedon","Malmsbury","Mount Macedon","Newham","Riddells Creek","Romsey","Woodend"];

const STOP_MINS = { "Bakery":25,"Specialty Cafe":30,"Pub":45,"Pub/Restaurant":60,"Restaurant":75,"Winery":50,"Winery/Cidery":50,"Urban Winery/Bar":45,"Vineyard":50,"Estate Winery":60,"Cellar Door":45,"Brewery":50,"Brewery/Hotel":60,"Boutique Hotel":40,"Lodge Restaurant":60,"Garden Cafe":35,"Village Pub":45,"Artisan Bakery":25,"Winery/Cafe":45,"Historic Estate":60,"Private Garden":45,"Public Garden":30,"Village Trail":40,"Nature Reserve":40,"Greek Restaurant":60,"Distillery":45 };
const dur = v => STOP_MINS[v.type] || 40;

// Village coordinates (approximate centres)
const VILLAGE_COORDS = {
  "Gisborne":       [-37.490, 144.593],
  "Kyneton":        [-37.244, 144.453],
  "Woodend":        [-37.357, 144.528],
  "Macedon":        [-37.417, 144.562],
  "Mount Macedon":  [-37.398, 144.573],
  "Lancefield":     [-37.278, 144.729],
  "Romsey":         [-37.352, 144.744],
  "Malmsbury":      [-37.186, 144.381],
  "Riddells Creek": [-37.462, 144.672],
  "Newham":         [-37.348, 144.536],
  "Hesket":         [-37.325, 144.613],
};

const venueCoords = v => {
  const base = VILLAGE_COORDS[v.village] || [-37.38, 144.55];
  const angle = ((v.id * 137.508) % 360) * Math.PI / 180;
  const r = 0.002 + (v.id % 5) * 0.0006;
  return [base[0] + Math.cos(angle) * r, base[1] + Math.sin(angle) * r];
};

const haversine = (a, b) => {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(b[0] - a[0]), dLon = toRad(b[1] - a[1]);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const driveMin = (a, b) => Math.max(3, Math.round(haversine(venueCoords(a), venueCoords(b)) / 50 * 60) + 2);

const optimizeRoute = ids => {
  if (ids.length <= 2) return [...ids];
  const result = [ids[0]];
  const remaining = new Set(ids.slice(1));
  while (remaining.size > 0) {
    const last = VENUES.find(v => v.id === result[result.length - 1]);
    let best = null, bestD = Infinity;
    for (const id of remaining) {
      const v = VENUES.find(x => x.id === id);
      const d = haversine(venueCoords(last), venueCoords(v));
      if (d < bestD) { bestD = d; best = id; }
    }
    result.push(best);
    remaining.delete(best);
  }
  return result;
};

// ─────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#130A04;--bg2:#1C0F07;--card:#22120A;--card2:#2A180C;
  --accent:#C85A15;--accent2:#E07030;
  --gold:#C8901A;--gold2:#EDAB30;
  --cream:#EDD8B5;--cream2:#F8EFE0;
  --muted:rgba(237,216,181,.45);
  --border:rgba(200,144,26,.18);--border2:rgba(200,144,26,.38);
  --rd:12px;--rd2:20px;
  --ff:'DM Sans',system-ui,sans-serif;
  --fs:'Playfair Display',Georgia,serif;
  --mw:1080px;
}
html,body{background:var(--bg);color:var(--cream);font-family:var(--ff);min-height:100vh;overflow-x:hidden}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:var(--bg2)}
::-webkit-scrollbar-thumb{background:var(--accent);border-radius:4px}
/* SHELL */
.shell{width:100%;max-width:var(--mw);margin:0 auto;padding-left:20px;padding-right:20px}
/* LEAVES */
.leaves{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0}
@keyframes lf{0%{transform:translateY(-60px) rotate(0deg) translateX(0);opacity:.8}30%{transform:translateY(30vh) rotate(120deg) translateX(25px);opacity:.7}60%{transform:translateY(65vh) rotate(260deg) translateX(-18px);opacity:.6}100%{transform:translateY(108vh) rotate(430deg) translateX(10px);opacity:0}}
.leaf{position:absolute;top:-60px;animation:lf linear infinite;pointer-events:none}
/* NAV */
.nav{position:sticky;top:0;z-index:90;height:54px;padding:0 16px;background:rgba(19,10,4,.94);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:2px;overflow-x:auto;scrollbar-width:none}
.nav::-webkit-scrollbar{display:none}
.nav-inner{display:flex;align-items:center;gap:2px;width:100%;max-width:var(--mw);margin:0 auto}
.nav-brand{font-family:var(--fs);font-style:italic;font-size:12px;color:var(--gold2);white-space:nowrap;margin-right:8px;flex-shrink:0;padding-right:8px;border-right:1px solid var(--border)}
.nav-tab{padding:5px 10px;border-radius:100px;border:none;font-size:11px;font-weight:500;font-family:var(--ff);cursor:pointer;white-space:nowrap;flex-shrink:0;background:transparent;color:var(--muted);transition:all .18s}
.nav-tab:hover{color:var(--cream);background:rgba(255,255,255,.06)}
.nav-tab.on{background:var(--accent);color:#fff;font-weight:600}
.nav-right{margin-left:auto;flex-shrink:0;padding-left:8px;border-left:1px solid var(--border);display:flex;align-items:center}
.avatar{width:27px;height:27px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--gold));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;cursor:pointer;flex-shrink:0}
/* HERO */
.hero{position:relative;min-height:min(80vh,640px);display:flex;flex-direction:column;justify-content:flex-end;padding:40px 20px 32px;overflow:hidden;background:radial-gradient(ellipse 60% 50% at 25% 60%,rgba(200,90,21,.28) 0%,transparent 65%),radial-gradient(ellipse 50% 40% at 75% 25%,rgba(139,26,47,.22) 0%,transparent 60%),var(--bg)}
.hero::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 1px 1px,rgba(200,144,26,.07) 1px,transparent 0);background-size:28px 28px;pointer-events:none}
.hero-inner{position:relative;width:100%;max-width:var(--mw);margin:0 auto}
.hero-eye{font-size:10px;letter-spacing:.35em;text-transform:uppercase;color:var(--gold2);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.hero-eye::after{content:'';height:1px;flex:1;max-width:80px;background:var(--gold2);opacity:.4}
.hero-h{font-family:var(--fs);font-weight:900;font-size:clamp(52px,13vw,100px);line-height:.88;color:var(--cream2);margin-bottom:10px}
.hero-h em{color:var(--accent2);font-style:italic;display:block}
.hero-p{font-size:14px;color:var(--muted);max-width:440px;line-height:1.65;margin-bottom:22px}
.hero-badges{display:flex;gap:7px;flex-wrap:wrap}
.hbadge{padding:6px 11px;border-radius:100px;font-size:10px;font-weight:600;letter-spacing:.04em;display:flex;align-items:center;gap:5px;border:1px solid}
.hb-pie{background:rgba(200,90,21,.2);border-color:rgba(200,90,21,.5);color:var(--accent2)}
.hb-tipple{background:rgba(139,26,47,.2);border-color:rgba(139,26,47,.5);color:#D06080}
.hb-garden{background:rgba(58,107,47,.2);border-color:rgba(58,107,47,.5);color:#7AC470}
/* INPUTS */
.inp-lbl{font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:5px;display:block}
.inp{width:100%;background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:var(--rd);padding:12px 14px;color:var(--cream);font-size:14px;font-family:var(--ff);outline:none;transition:border-color .2s}
.inp:focus{border-color:var(--border2)}
.inp::placeholder{color:var(--muted)}
.divider{text-align:center;font-size:11px;color:var(--muted);margin:14px 0;position:relative}
.divider::before,.divider::after{content:'';position:absolute;top:50%;height:1px;width:38%;background:var(--border)}
.divider::before{left:0}.divider::after{right:0}
/* SECTIONS */
.sec-head{padding:20px 20px 0}
.sec-title{font-family:var(--fs);font-size:26px;font-weight:700;color:var(--cream2);line-height:1.1}
.sec-sub{font-size:12px;color:var(--muted);margin-top:3px}
/* PROGRESS */
.prog-wrap{padding:12px 20px;display:flex;flex-direction:column;gap:8px}
.prog-row{background:var(--card);border:1px solid var(--border);border-radius:var(--rd);padding:11px 13px}
.prog-bg{height:5px;background:rgba(255,255,255,.1);border-radius:10px;overflow:hidden;margin-top:6px}
.prog-fill{height:100%;border-radius:10px;transition:width .5s cubic-bezier(.4,0,.2,1)}
/* CHIPS */
.chips{padding:9px 20px 0;display:flex;gap:5px;overflow-x:auto;scrollbar-width:none}
.chips::-webkit-scrollbar{display:none}
.chip{padding:5px 11px;border-radius:100px;font-size:11px;font-weight:500;white-space:nowrap;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all .18s;flex-shrink:0;font-family:var(--ff)}
.chip:hover{color:var(--cream);border-color:var(--border2)}
.chip.on-all{background:rgba(200,144,26,.2);border-color:var(--gold);color:var(--gold2)}
.chip.on-pie{background:rgba(200,90,21,.25);border-color:var(--accent);color:var(--accent2)}
.chip.on-tipple{background:rgba(139,26,47,.25);border-color:#8B1A2F;color:#D06080}
.chip.on-garden{background:rgba(58,107,47,.25);border-color:#3A6B2F;color:#7AC470}
/* STAMP GRID */
.sgrid{padding:4px 20px 20px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.sc{aspect-ratio:1;border-radius:var(--rd);border:2px dashed rgba(255,255,255,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;text-align:center;cursor:pointer;transition:all .18s;position:relative;overflow:hidden;background:var(--card)}
.sc:hover{border-color:var(--accent);transform:scale(1.03)}
.sc.sp{border-style:solid}
.sc.sp.pie{border-color:rgba(200,90,21,.7);background:rgba(200,90,21,.1)}
.sc.sp.tipple{border-color:rgba(139,26,47,.7);background:rgba(139,26,47,.1)}
.sc.sp.garden{border-color:rgba(58,107,47,.7);background:rgba(58,107,47,.1)}
.sc-photo{width:100%;height:100%;object-fit:cover;position:absolute;inset:0;border-radius:calc(var(--rd) - 2px);opacity:.55}
.sc-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;background:linear-gradient(to bottom,transparent 20%,rgba(0,0,0,.75) 100%);padding:5px;border-radius:calc(var(--rd) - 2px)}
.sc-name{font-size:8px;font-weight:600;color:#fff;line-height:1.2;text-align:center}
.sc-em{font-size:20px;margin-bottom:3px;opacity:.28}
.sc-en{font-size:8px;color:var(--muted);line-height:1.2}
.sc-seal{position:absolute;bottom:3px;right:3px;font-size:16px;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6))}
/* VENUE LIST */
.vlist{padding:10px 20px 24px;display:flex;flex-direction:column;gap:8px}
.vc{background:var(--card);border:1px solid var(--border);border-radius:var(--rd);padding:12px 13px;cursor:pointer;transition:all .18s;display:flex;gap:10px;align-items:flex-start}
.vc:hover{border-color:var(--border2);background:var(--card2)}
.vc.sp-pie{border-color:rgba(200,90,21,.45)}
.vc.sp-tipple{border-color:rgba(139,26,47,.45)}
.vc.sp-garden{border-color:rgba(58,107,47,.45)}
.vdot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:4px}
.vi{flex:1;min-width:0}
.vn{font-weight:600;font-size:13px;margin-bottom:1px}
.vm{font-size:10px;color:var(--muted);margin-bottom:3px}
.vb{font-size:12px;line-height:1.5;color:rgba(237,216,181,.65)}
.vh{font-size:10px;color:var(--muted);margin-top:4px}
.vstamp{flex-shrink:0;font-size:17px}
/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:200;display:flex;align-items:flex-end;backdrop-filter:blur(6px)}
.modal-sheet{width:100%;background:var(--card2);border-radius:24px 24px 0 0;padding:18px 20px calc(44px + env(safe-area-inset-bottom,0px));border:1px solid var(--border);border-bottom:none;max-height:92dvh;overflow-y:auto}
.mhandle{width:36px;height:4px;background:rgba(255,255,255,.18);border-radius:10px;margin:0 auto 16px}
.uzone{border:2px dashed var(--border2);border-radius:var(--rd2);padding:36px 20px;text-align:center;cursor:pointer;transition:all .2s}
.uzone:hover{border-color:var(--accent);background:rgba(200,90,21,.06)}
.preview{width:100%;height:180px;object-fit:cover;border-radius:var(--rd);margin-bottom:11px}
textarea.note{width:100%;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:var(--rd);padding:9px 11px;color:var(--cream);font-size:13px;font-family:var(--ff);resize:none;height:62px;outline:none;transition:border-color .2s}
textarea.note:focus{border-color:var(--border2)}
/* BUTTONS */
.btn{border:none;border-radius:100px;cursor:pointer;font-family:var(--ff);font-weight:600;transition:all .18s}
.btn-p{background:var(--accent);color:#fff;padding:13px 24px;font-size:14px;width:100%}
.btn-p:hover{background:var(--accent2);transform:translateY(-1px)}
.btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none}
.btn-s{background:transparent;color:var(--muted);border:1px solid var(--border);padding:10px 18px;font-size:12px}
.btn-s:hover{color:var(--cream);border-color:var(--border2)}
.btn-xs{background:transparent;color:var(--muted);border:1px solid var(--border);padding:5px 11px;font-size:11px;border-radius:100px;cursor:pointer;font-family:var(--ff);font-weight:500;transition:all .18s}
.btn-xs:hover{color:var(--cream);border-color:var(--border2)}
/* PLANNER */
.itin-card{background:var(--card);border:1px solid var(--border);border-radius:var(--rd);padding:10px 11px;display:flex;align-items:center;gap:8px}
.itin-rm{width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.07);border:none;color:var(--muted);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .18s}
.itin-rm:hover{background:rgba(200,90,21,.3);color:var(--accent2)}
.add-card{background:var(--card);border:1px solid var(--border);border-radius:var(--rd);padding:9px 11px;display:flex;align-items:center;gap:8px;cursor:pointer;transition:all .18s}
.add-card:hover{border-color:var(--border2);background:var(--card2)}
/* SPONSOR */
.sponsor-card{background:linear-gradient(135deg,rgba(22,12,5,1) 0%,rgba(34,18,10,1) 100%);border:1px solid rgba(5,150,105,.25);border-radius:20px;padding:18px;position:relative;overflow:hidden;display:block;text-decoration:none;color:inherit;transition:border-color .2s}
.sponsor-card:hover{border-color:rgba(5,150,105,.5)}
.sponsor-card::before{content:'';position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(5,150,105,.08) 0%,transparent 70%)}
.leaflet-control-attribution{background:rgba(19,10,4,.8)!important;color:var(--muted)!important;font-size:9px!important}
.leaflet-control-attribution a{color:var(--muted)!important}
/* USER MODAL */
.user-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(8px)}
.user-modal{background:var(--card2);border:1px solid var(--border);border-radius:var(--rd2);padding:22px;width:100%;max-width:380px}
/* TOAST */
@keyframes tIn{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--card2);border:1px solid var(--border2);border-radius:100px;padding:9px 18px;font-size:12px;font-weight:500;color:var(--cream2);z-index:300;white-space:nowrap;animation:tIn .22s ease forwards;box-shadow:0 8px 32px rgba(0,0,0,.6)}
/* STAMP FLASH */
@keyframes flashOut{0%{opacity:1;transform:scale(1)}40%{opacity:1;transform:scale(1.05)}100%{opacity:0;transform:scale(.9)}}
.flash{position:fixed;inset:0;z-index:250;pointer-events:none;display:flex;align-items:center;justify-content:center;animation:flashOut .65s ease forwards}
.flash-inner{background:rgba(200,90,21,.15);border:2px solid var(--accent);border-radius:var(--rd2);padding:26px 38px;display:flex;flex-direction:column;align-items:center;gap:7px;backdrop-filter:blur(4px)}
/* LOADING */
.loading-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px}
@keyframes spin{to{transform:rotate(360deg)}}
.spinner{width:30px;height:30px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}
/* HOME GRID */
.lp-stat{display:flex;align-items:stretch;border-bottom:1px solid var(--border);background:var(--bg2)}
.lp-stat-inner{display:flex;align-items:stretch;width:100%;max-width:var(--mw);margin:0 auto}
.lp-stat-item{flex:1;text-align:center;padding:12px 6px}
.lp-stat-n{font-family:var(--fs);font-size:22px;font-weight:700;color:var(--cream2);line-height:1}
.lp-stat-l{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-top:3px}
.lp-stat-div{width:1px;background:var(--border);flex-shrink:0}
.trail-card{border-radius:18px;padding:18px 18px 16px;margin-bottom:9px;cursor:pointer;transition:transform .18s,opacity .18s;-webkit-tap-highlight-color:transparent}
.trail-card:hover{transform:translateY(-2px)}
.trail-card:active{transform:scale(.98);opacity:.9}
.trail-card-pie{background:linear-gradient(145deg,rgba(200,90,21,.22) 0%,rgba(200,90,21,.07) 100%);border:1px solid rgba(200,90,21,.32)}
.trail-card-tipple{background:linear-gradient(145deg,rgba(139,26,47,.22) 0%,rgba(139,26,47,.07) 100%);border:1px solid rgba(139,26,47,.32)}
.trail-card-garden{background:linear-gradient(145deg,rgba(58,107,47,.22) 0%,rgba(58,107,47,.07) 100%);border:1px solid rgba(58,107,47,.32)}
.prize-card{background:linear-gradient(145deg,rgba(200,144,26,.16) 0%,rgba(200,90,21,.1) 100%);border:1px solid rgba(200,144,26,.32);border-radius:20px;padding:18px}
.stamp-step{display:flex;align-items:flex-start;gap:11px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.06)}
.stamp-step:last-child{border-bottom:none;padding-bottom:0}
.stamp-num{width:22px;height:22px;border-radius:50%;background:rgba(200,144,26,.18);border:1px solid rgba(200,144,26,.45);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:var(--gold2);flex-shrink:0;margin-top:1px}
.event-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.event-cell{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:11px 12px}
.village-pill{padding:5px 12px;border-radius:100px;background:rgba(200,144,26,.1);border:1px solid rgba(200,144,26,.2);font-size:11px;color:var(--gold);font-weight:500}
.info-hub{background:var(--card2);border:1px solid var(--border);border-radius:16px;padding:16px}
.lp-eyebrow{font-size:9px;letter-spacing:.32em;text-transform:uppercase;color:var(--muted);margin-bottom:11px}
.home-top{display:block}.trails-row{display:block}.footer-row{display:block}
/* ─── DESKTOP ─── */
@media(min-width:768px){
  .nav{padding:0 32px;height:58px;gap:4px}
  .nav-brand{font-size:13px;margin-right:14px;padding-right:14px}
  .nav-tab{padding:7px 16px;font-size:12px}
  .hero{min-height:min(65vh,560px);padding:80px 48px 56px}
  .hero-h{font-size:clamp(72px,9vw,120px)}
  .hero-p{font-size:15px;max-width:500px}
  .sec-head{padding:32px 20px 0}
  .sgrid{grid-template-columns:repeat(5,1fr);gap:10px}
  .vlist{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .prog-wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  .chips{flex-wrap:wrap}
  .modal-bg{align-items:center;justify-content:center;padding:24px}
  .modal-sheet{max-width:480px;border-radius:24px;border-bottom:1px solid var(--border);max-height:85vh}
  .lp-stat-n{font-size:28px}
  .lp-stat-item{padding:18px 10px}
  .home-top{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}
  .trails-row{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  .trails-row .trail-card{margin-bottom:0}
  .event-grid{grid-template-columns:repeat(4,1fr);gap:8px}
  .footer-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
  .sc-name{font-size:9px}.sc-en{font-size:9px}
}
@media(min-width:1200px){
  .sgrid{grid-template-columns:repeat(7,1fr)}
  .vlist{grid-template-columns:1fr 1fr 1fr}
  .hero-h{font-size:110px}
}
/* PLANNER MAP + LAYOUT */
.planner-map{border-radius:var(--rd);border:1px solid var(--border);overflow:hidden;height:320px;background:var(--card)}
.planner-layout{display:flex;flex-direction:column;gap:16px}
.planner-tl-wrap{display:flex;flex-direction:column;gap:0}
.tl-stop{display:flex;gap:11px;align-items:stretch}
.tl-rail{width:28px;display:flex;flex-direction:column;align-items:center;flex-shrink:0;position:relative}
.tl-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;z-index:1}
.tl-connector{width:2px;flex:1;min-height:8px}
.tl-drive-seg{display:flex;gap:11px;align-items:center;padding:2px 0}
.tl-drive-rail{width:28px;display:flex;justify-content:center;flex-shrink:0}
.tl-drive-pip{width:0;height:22px;border-left:2px dashed var(--border)}
.tl-drive-label{font-size:10px;color:var(--muted);white-space:nowrap}
.suggest-grid{display:grid;grid-template-columns:1fr;gap:6px}
.empty-planner{text-align:center;padding:44px 20px;border:2px dashed var(--border);border-radius:var(--rd2);margin-top:16px}
.leaflet-container{font-family:var(--ff);background:var(--card)!important}
.leaflet-control-zoom a{background:var(--card2)!important;color:var(--cream)!important;border-color:var(--border)!important}
.leaflet-popup-content-wrapper{background:var(--card2)!important;color:var(--cream)!important;border:1px solid var(--border);border-radius:var(--rd)!important;box-shadow:0 4px 20px rgba(0,0,0,.5)!important}
.leaflet-popup-tip{background:var(--card2)!important}
.leaflet-popup-close-button{color:var(--muted)!important}
@media(min-width:768px){
  .planner-layout{display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start}
  .planner-map{height:100%;min-height:420px;position:sticky;top:70px}
  .suggest-grid{grid-template-columns:1fr 1fr}
}
@media(min-width:1200px){
  .suggest-grid{grid-template-columns:1fr 1fr 1fr}
}
`;

// ─────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────

function Leaves() {
  const e = ["🍂","🍁","🍃","🍂","🍁","🍃","🍂"];
  return (
    <div className="leaves">
      {[...Array(9)].map((_,i) => (
        <span key={i} className="leaf" style={{
          left:`${5+i*11}%`,
          animationDuration:`${9+(i*2.9)%7}s`,
          animationDelay:`${(i*1.7)%9}s`,
          fontSize:`${13+(i*4)%12}px`,
          opacity:.4+(i%3)*.12,
        }}>{e[i%e.length]}</span>
      ))}
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2300); return () => clearTimeout(t); }, []);
  return <div className="toast">{msg}</div>;
}

function Flash({ venue }) {
  const t = TRAILS[venue.trail];
  return (
    <div className="flash">
      <div className="flash-inner">
        <div style={{ fontSize:46 }}>{t.emoji}</div>
        <div style={{ fontFamily:"var(--fs)", fontSize:19, fontWeight:700, color:"var(--cream2)" }}>Stamped!</div>
        <div style={{ fontSize:12, color:"var(--muted)" }}>{venue.name}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LOGIN SHEET (bottom sheet on mobile, centered modal on desktop)
// ─────────────────────────────────────────────────────────

function LoginSheet({ onLogin, onClose, busy }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const ok = name.trim() && email.includes("@");

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="mhandle" />
        <div style={{ fontFamily:"var(--fs)", fontSize:21, fontWeight:700, color:"var(--cream2)", marginBottom:5 }}>Your Digital Passport</div>
        <div style={{ fontSize:12, color:"var(--muted)", marginBottom:20, lineHeight:1.75 }}>
          One stamp per venue. Collect four stamps across the Pie & Tart or Tipple Trail to enter the <span style={{ color:"var(--gold2)", fontWeight:500 }}>Ultimate Prize Draw</span>.
        </div>
        <div style={{ marginBottom:11 }}>
          <label className="inp-lbl">Your Name</label>
          <input className="inp" placeholder="First and last name" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom:8 }}>
          <label className="inp-lbl">Email Address</label>
          <input className="inp" type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ok && onLogin(name.trim(), email.trim().toLowerCase())} />
        </div>
        <div style={{ fontSize:11, color:"var(--muted)", marginBottom:20, lineHeight:1.6 }}>
          Your progress saves to this email — return on any device to pick up where you left off.
        </div>
        <button className="btn btn-p" disabled={!ok || busy}
          onClick={() => onLogin(name.trim(), email.trim().toLowerCase())}>
          {busy ? "Loading…" : "Open My Passport"}
        </button>
        <button className="btn btn-s" onClick={onClose} style={{ width:"100%", marginTop:8 }}>Maybe later</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// USER MENU MODAL
// ─────────────────────────────────────────────────────────

function UserModal({ user, total, onLogout, onClose }) {
  const init = (user.name.trim()[0] || "?").toUpperCase();
  return (
    <div className="user-modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="user-modal">
        <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:18 }}>
          <div style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,var(--accent),var(--gold))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, fontWeight:700, color:"#fff" }}>{init}</div>
          <div>
            <div style={{ fontWeight:600, fontSize:15 }}>{user.name}</div>
            <div style={{ fontSize:11, color:"var(--muted)" }}>{user.email}</div>
          </div>
        </div>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--rd)", padding:"11px 13px", marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:12, color:"var(--muted)" }}>Stamps collected</div>
          <div style={{ fontSize:22, fontWeight:700, color:"var(--gold2)" }}>{total}</div>
        </div>
        <div style={{ fontSize:11, color:"var(--muted)", lineHeight:1.6, marginBottom:18 }}>
          Your passport is saved to this email. Sign in with the same email on any device to restore your stamps.
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-s" onClick={onClose} style={{ flex:1 }}>Close</button>
          <button className="btn btn-s" onClick={onLogout} style={{ flex:1, color:"#E06060", borderColor:"rgba(220,60,60,.3)" }}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// SUBMIT MODAL
// ─────────────────────────────────────────────────────────

function SubmitModal({ user, stamps, onSubmit, onClose }) {
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const total = Object.keys(stamps).length;

  const doSubmit = () => {
    const ref = "MRAF-" + Date.now().toString(36).toUpperCase().slice(-6);
    onSubmit({ ref, phone: phone.trim() || null });
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="mhandle" />
        <div style={{ fontFamily: "var(--fs)", fontSize: 21, fontWeight: 700, color: "var(--cream2)", marginBottom: 5 }}>Enter the Prize Draw</div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18, lineHeight: 1.75 }}>
          You've collected <span style={{ color: "var(--gold2)", fontWeight: 600 }}>{total} stamps</span> — submit your entry to go in the draw for the Ultimate Prize.
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--rd)", padding: "12px 13px", marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 2 }}>Name</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8, marginBottom: 2 }}>Email</div>
          <div style={{ fontSize: 14 }}>{user.email}</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="inp-lbl">Phone (optional)</label>
          <input className="inp" type="tel" placeholder="0400 000 000" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 18, cursor: "pointer" }}>
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 3, accentColor: "var(--accent)" }} />
          <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            I confirm my details are correct and agree to the <span style={{ color: "var(--gold2)" }}>festival terms and conditions</span>. One entry per person.
          </span>
        </label>
        <button className="btn btn-p" disabled={!agree} onClick={doSubmit} style={{ background: agree ? "#3A6B2F" : undefined }}>
          Submit My Entry
        </button>
        <button className="btn btn-s" onClick={onClose} style={{ width: "100%", marginTop: 8 }}>Cancel</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────────────────

function AppNav({ page, setPage, total, user, onAvatar }) {
  const init = user?.name?.trim()[0]?.toUpperCase();
  const tabs = [
    { id:"home",     lbl:"Festival",  pub:true  },
    { id:"venues",   lbl:"Venues",    pub:true  },
    { id:"passport", lbl: total > 0 ? `Passport · ${total}` : "Passport", pub:false },
    { id:"planner",  lbl:"Planner",   pub:false },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-brand">Autumn Festival</div>
        {tabs.map(t => (
          <button key={t.id} className={`nav-tab ${page===t.id?"on":""}`} onClick={() => setPage(t.id, t.pub)}>{t.lbl}</button>
        ))}
        <div className="nav-right">
          {init
            ? <div className="avatar" onClick={onAvatar} title={user.name}>{init}</div>
            : <button className="nav-tab" onClick={onAvatar} style={{ color:"var(--gold2)", borderColor:"rgba(200,144,26,.3)", border:"1px solid", borderRadius:100, padding:"4px 10px" }}>Sign in</button>
          }
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────

function Home({ user, stamps, setPage, onPassport, submitted, onSubmit }) {
  const total = Object.keys(stamps).length;
  const first = user ? user.name.split(" ")[0] : null;

  const trailStats = Object.entries(TRAILS).map(([k, t]) => {
    const vs = VENUES.filter(v => v.trail === k);
    const visited = vs.filter(v => stamps[v.id]).length;
    return { key:k, ...t, count:vs.length, visited };
  });

  const trailDesc = {
    pie:    "51 venues across nine villages. Sweet, savoury, or both — one stamp per purchase.",
    tipple: "37 venues pouring signature cocktails, wines, and craft beers. Stamp your passport with every drink.",
    garden: "Three of Mount Macedon's finest private gardens. Free shuttle from Centennial Park on weekends.",
  };

  return (
    <div style={{ paddingBottom:60 }}>
      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eye">Macedon Ranges · April 1–30, 2026</div>
          <div style={{ fontSize:10, letterSpacing:".22em", textTransform:"uppercase", color:"var(--accent2)", marginBottom:8, fontWeight:500 }}>Australia's Biggest</div>
          <h1 className="hero-h">Pie &amp; Tart<em>Trail</em></h1>
          <p className="hero-p">A month-long celebration across nine villages. Collect your digital Food & Drink Passport and enter the Ultimate Prize Draw.</p>
          <div className="hero-badges">
            <div className="hbadge hb-pie">Pie & Tart Trail</div>
            <div className="hbadge hb-tipple">Tipple Trail</div>
            <div className="hbadge hb-garden">Garden Trail</div>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div className="lp-stat">
        <div className="lp-stat-inner">
          {[["91","Venues"],["3","Trails"],["9","Villages"],["30","Days"]].map(([n,l],i,a) => (
            <React.Fragment key={l}>
              <div className="lp-stat-item">
                <div className="lp-stat-n">{n}</div>
                <div className="lp-stat-l">{l}</div>
              </div>
              {i < a.length-1 && <div className="lp-stat-div" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="shell" style={{ paddingTop:24 }}>

        {/* PASSPORT CTA + PRIZE DRAW — side by side on desktop */}
        <div className="home-top" style={{ marginBottom:28 }}>
          <div style={{ background:"linear-gradient(145deg,rgba(200,90,21,.18) 0%,rgba(139,26,47,.14) 100%)", border:"1px solid rgba(200,90,21,.32)", borderRadius:22, padding:"18px 18px 16px" }}>
            <div style={{ fontSize:9, letterSpacing:".32em", textTransform:"uppercase", color:"var(--gold2)", marginBottom:8 }}>Food & Drink Passport</div>
            <div style={{ fontFamily:"var(--fs)", fontSize:20, fontWeight:700, color:"var(--cream2)", lineHeight:1.1, marginBottom:9 }}>
              {total > 0 && first ? `${first}'s Passport` : "Your Digital Passport"}
            </div>
            {total > 0 ? (
              <>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:14, lineHeight:1.7 }}>
                  You've collected <span style={{ color:"var(--gold2)", fontWeight:600 }}>{total} stamp{total!==1?"s":""}</span>.
                  {" "}{total >= 4
                    ? submitted
                      ? <span style={{ color:"rgba(122,196,112,.9)" }}>Entry submitted! Ref: {submitted.ref}</span>
                      : <span style={{ color:"rgba(122,196,112,.9)" }}>You're eligible — submit your entry below!</span>
                    : `Collect ${4-total} more to enter the Ultimate Prize Draw.`}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:16 }}>
                  {trailStats.filter(t => t.visited > 0).map(t => (
                    <div key={t.key} style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ fontSize:13, flexShrink:0 }}>{t.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ height:4, background:"rgba(255,255,255,.08)", borderRadius:10, overflow:"hidden" }}>
                          <div style={{ height:"100%", background:t.color, borderRadius:10, width:`${(t.visited/t.count)*100}%`, transition:"width .5s cubic-bezier(.4,0,.2,1)" }} />
                        </div>
                      </div>
                      <div style={{ fontSize:10, color:"var(--muted)", flexShrink:0, minWidth:32, textAlign:"right" }}>{t.visited}/{t.count}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ fontSize:12, color:"var(--muted)", marginBottom:16, lineHeight:1.75 }}>
                Visit any Pie & Tart or Tipple Trail venue, make a purchase, and snap a photo to collect your stamp. Four stamps enters you in the <span style={{ color:"var(--gold2)" }}>Ultimate Prize Draw</span>.
              </div>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn btn-p" onClick={onPassport} style={{ flex: 1 }}>
                {total > 0 ? `View Passport · ${total} stamp${total!==1?"s":""}` : "Open My Passport"}
              </button>
              {total >= 4 && !submitted && (
                <button className="btn btn-p" onClick={onSubmit} style={{ flex: 1, background: "#3A6B2F" }}>
                  Submit Entry
                </button>
              )}
            </div>
          </div>

          <div className="prize-card">
            <div style={{ fontSize:9, letterSpacing:".32em", textTransform:"uppercase", color:"var(--gold)", marginBottom:9 }}>Ultimate Prize Draw</div>
            <div style={{ fontFamily:"var(--fs)", fontSize:18, fontWeight:700, color:"var(--cream2)", marginBottom:14, lineHeight:1.15 }}>Collect four stamps.<br />Enter the draw.</div>
            {[
              ["1", "Make a purchase at any Pie & Tart or Tipple Trail venue"],
              ["2", "Take a photo at the venue to claim your digital stamp"],
              ["3", "Repeat at three more venues — four stamps total"],
              ["4", "Hit 'Submit Entry' when you have four stamps to enter the draw"],
            ].map(([n, l]) => (
              <div key={n} className="stamp-step">
                <div className="stamp-num">{n}</div>
                <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.55 }}>{l}</div>
              </div>
            ))}
            <div style={{ marginTop:13, padding:"11px 13px", background:"rgba(200,144,26,.1)", border:"1px solid rgba(200,144,26,.22)", borderRadius:11 }}>
              <div style={{ fontSize:11, color:"var(--muted)", lineHeight:1.65 }}>
                Submit through this app or drop your hardcopy passport at Community Bank Lancefield/Romsey or Woodend Visitor Centre by <span style={{ color:"var(--cream)" }}>4pm, 30 April 2026</span>.
              </div>
            </div>
          </div>
        </div>

        {/* TRAILS — 3-col on desktop */}
        <div className="lp-eyebrow">Explore the Trails</div>
        <div className="trails-row" style={{ marginBottom:28 }}>
          {trailStats.map(t => (
            <div key={t.key} className={`trail-card trail-card-${t.key}`} onClick={() => setPage("venues")}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:22 }}>{t.emoji}</div>
                <div style={{ fontSize:10, color:t.light, background:t.bg, border:`1px solid ${t.color}44`, borderRadius:100, padding:"3px 10px", fontWeight:500 }}>
                  {t.count} venues
                </div>
              </div>
              <div style={{ fontFamily:"var(--fs)", fontSize:17, fontWeight:700, color:"var(--cream2)", marginBottom:5, lineHeight:1.1 }}>{t.label}</div>
              <div style={{ fontSize:11, color:"var(--muted)", lineHeight:1.65 }}>{trailDesc[t.key]}</div>
              {t.visited > 0 && (
                <div style={{ marginTop:9, fontSize:10, color:t.light, fontWeight:500, display:"flex", alignItems:"center", gap:5 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:t.color }} />
                  {t.visited} visited
                </div>
              )}
            </div>
          ))}
        </div>

        {/* WHAT'S ON */}
        <div className="lp-eyebrow">What's On in April</div>
        <div className="event-grid" style={{ marginBottom:28 }}>
          {[
            ["Foodie Feasts",       "Special menus at venues across all nine villages"],
            ["Open Gardens",        "Private properties opening their gates this month"],
            ["Artisan Workshops",   "Learn from local makers, growers, and producers"],
            ["Farmers Markets",     "Fresh regional produce every week"],
            ["Art Exhibitions",     "Local galleries open throughout April"],
            ["Edgy Veg Awards",     "Celebrating the region's best seasonal produce"],
            ["Kids Activities",     "Family-friendly events all month long"],
            ["Guided Walks",        "Explore the autumn landscape with local experts"],
          ].map(([title, desc]) => (
            <div key={title} className="event-cell">
              <div style={{ fontWeight:600, fontSize:12, color:"var(--cream2)", marginBottom:3 }}>{title}</div>
              <div style={{ fontSize:10, color:"var(--muted)", lineHeight:1.5 }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* VILLAGES */}
        <div className="lp-eyebrow">Across Nine Villages</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:28 }}>
          {["Kyneton","Gisborne","Woodend","Macedon","Mount Macedon","Lancefield","Romsey","Malmsbury","Riddells Creek"].map(v => (
            <div key={v} className="village-pill">{v}</div>
          ))}
        </div>

        {/* SPONSOR + INFO HUB — side by side on desktop */}
        <div className="footer-row" style={{ marginBottom:8 }}>
          <a href="https://sondersites.com" target="_blank" rel="noopener noreferrer" className="sponsor-card">
            <div style={{ fontSize: 9, letterSpacing: ".28em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Official Digital Partner</div>
            <div style={{ marginBottom: 12 }}>
              <img src="https://www.sondersites.com/images/brand/SONDER.png" alt="Sonder Sites" style={{ height: 22, filter: "brightness(0) invert(1)" }} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }} />
              <div style={{ display: "none", fontFamily: "var(--fs)", fontSize: 18, fontWeight: 700, color: "var(--cream2)" }}>Sonder Sites</div>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.75, marginBottom: 10 }}>
              Shopify Plus agency for $1M–$20M brands. Expert ecommerce, deep system integrations &amp; custom SaaS.
            </p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}>
              {["Richmond", "Kyneton", "New York"].map(loc => (
                <span key={loc} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 100, background: "rgba(5,150,105,.12)", border: "1px solid rgba(5,150,105,.28)", color: "#059669", letterSpacing: ".04em" }}>{loc}</span>
              ))}
            </div>
            <div style={{ paddingTop: 12, borderTop: "1px solid rgba(5,150,105,.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>Want something like this?</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>sondersites.com &#8594;</div>
            </div>
          </a>

          <div className="info-hub">
            <div style={{ fontWeight:600, fontSize:13, color:"var(--cream2)", marginBottom:7 }}>Festival Information Hub</div>
            <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.85 }}>
              Woodend Visitor Information Centre<br />
              High Street, Woodend · Open 7 days, 10am–4pm<br />
              <a href="tel:1800244711" style={{ color: "var(--gold)", textDecoration: "none" }}>1800 244 711</a>
              <span style={{ color: "rgba(237,216,181,.3)", margin: "0 6px" }}>·</span>
              <a href="https://visitmacedonranges.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(237,216,181,.5)", textDecoration: "none" }}>visitmacedonranges.com</a>
            </div>
            <div style={{ marginTop:12, paddingTop:11, borderTop:"1px solid var(--border)", fontSize:10, color:"rgba(237,216,181,.28)", lineHeight:1.65 }}>
              We acknowledge the Dja Dja Wurrung, Taungurung and Wurundjeri Woi-wurrung Peoples as the Traditional Owners and Custodians of this land and waterways.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// STAMP MODAL
// ─────────────────────────────────────────────────────────

function StampModal({ venue, existing, onClose, onStamp, onRemove }) {
  const [photo, setPhoto] = useState(existing?.photo || null);
  const [note,  setNote]  = useState(existing?.note  || "");
  const [isNew, setIsNew] = useState(!existing);
  const ref = useRef();
  const t = TRAILS[venue.trail];

  const handleFile = e => {
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => { setPhoto(ev.target.result); setIsNew(true); };
    r.readAsDataURL(f);
  };

  const stamp = () => { if(!photo) return; onStamp(venue.id, { photo, note, ts:Date.now() }); onClose(); };

  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="mhandle" />
        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:14 }}>
          <div style={{ width:40, height:40, borderRadius:10, flexShrink:0, background:t.bg, border:`1px solid ${t.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19 }}>{t.emoji}</div>
          <div>
            <div style={{ fontWeight:600, fontSize:13 }}>{venue.name}</div>
            <div style={{ fontSize:10, color:"var(--muted)" }}>{venue.village} · {venue.type}</div>
          </div>
        </div>
        <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6, marginBottom:14, background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--rd)", padding:"10px 12px" }}>
          {venue.blurb}
        </div>

        {existing && !isNew ? (
          <>
            <img src={existing.photo} alt="" style={{ width:"100%", height:200, objectFit:"cover", borderRadius:"var(--rd)", marginBottom:10 }} />
            {existing.note && <div style={{ background:"rgba(255,255,255,.05)", border:"1px solid var(--border)", borderRadius:"var(--rd)", padding:"8px 10px", marginBottom:10, fontSize:12, color:"var(--muted)", fontStyle:"italic" }}>"{existing.note}"</div>}
            <div style={{ fontSize:10, color:"var(--muted)", marginBottom:13, textAlign:"center" }}>
              Stamped {new Date(existing.ts).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"})}
            </div>
            <div style={{ display:"flex", gap:7 }}>
              <button className="btn btn-s" onClick={() => { setPhoto(null); setIsNew(true); }} style={{ flex:1 }}>Re-stamp</button>
              <button className="btn btn-s" onClick={() => { onRemove(venue.id); onClose(); }} style={{ flex:1, color:"#E06060", borderColor:"rgba(220,60,60,.3)" }}>Remove</button>
              <button className="btn btn-p" onClick={onClose} style={{ flex:2, background:"var(--card)", color:"var(--cream)" }}>Close</button>
            </div>
          </>
        ) : !photo ? (
          <>
            <div className="uzone" onClick={() => ref.current?.click()}>
              <input ref={ref} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={handleFile} />
              <div style={{ fontSize:40, marginBottom:9 }}>📷</div>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:5, color:"var(--cream2)" }}>Take a Photo to Stamp</div>
              <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6 }}>Snap a photo at the venue to collect your stamp and prove you were there.</div>
            </div>
            <button className="btn btn-s" onClick={onClose} style={{ width:"100%", marginTop:11 }}>Cancel</button>
          </>
        ) : (
          <>
            <img src={photo} alt="" className="preview" />
            <textarea className="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about your visit (optional)..." />
            <div style={{ display:"flex", gap:7, marginBottom:7, marginTop:9 }}>
              <button className="btn btn-s" onClick={() => setPhoto(null)} style={{ flex:1 }}>Retake</button>
              <button className="btn btn-p" onClick={stamp} style={{ flex:2 }}>{t.emoji} Stamp It!</button>
            </div>
            <button className="btn btn-s" onClick={onClose} style={{ width:"100%", fontSize:11 }}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PASSPORT
// ─────────────────────────────────────────────────────────

function Passport({ stamps, setModal, submitted, onSubmit }) {
  const [tf, setTf] = useState("all");
  const total = Object.keys(stamps).length;
  const display = tf==="all" ? VENUES : VENUES.filter(v => v.trail===tf);
  return (
    <div className="shell" style={{ paddingBottom:48 }}>
      <div style={{ paddingTop:24 }}>
        <div className="sec-title">My Passport</div>
        <div className="sec-sub">{total} of {VENUES.length} venues visited</div>
      </div>
      {total >= 4 && !submitted && (
        <div style={{ marginTop: 14, background: "linear-gradient(145deg,rgba(58,107,47,.2) 0%,rgba(58,107,47,.08) 100%)", border: "1px solid rgba(58,107,47,.4)", borderRadius: "var(--rd)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--cream2)", marginBottom: 2 }}>You're eligible for the Prize Draw!</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>You have {total} stamps — submit your entry now.</div>
          </div>
          <button className="btn btn-p" onClick={onSubmit} style={{ background: "#3A6B2F", padding: "10px 20px", width: "auto" }}>Submit Entry</button>
        </div>
      )}
      {submitted && (
        <div style={{ marginTop: 14, background: "linear-gradient(145deg,rgba(58,107,47,.15) 0%,rgba(58,107,47,.05) 100%)", border: "1px solid rgba(58,107,47,.3)", borderRadius: "var(--rd)", padding: "14px 16px" }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "rgba(122,196,112,.9)", marginBottom: 2 }}>Entry Submitted</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>Reference: {submitted.ref} · Submitted {new Date(submitted.ts).toLocaleDateString("en-AU", { day: "numeric", month: "long" })}</div>
        </div>
      )}
      <div className="prog-wrap" style={{ paddingLeft:0, paddingRight:0 }}>
        {Object.entries(TRAILS).map(([k,t]) => {
          const vs = VENUES.filter(v => v.trail===k);
          const n = vs.filter(v => stamps[v.id]).length;
          return (
            <div key={k} className="prog-row">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:500 }}>{t.emoji} {t.label}</div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{n}/{vs.length}</div>
              </div>
              <div className="prog-bg"><div className="prog-fill" style={{ width:`${(n/vs.length)*100}%`, background:t.color }} /></div>
            </div>
          );
        })}
      </div>
      <div className="chips" style={{ paddingLeft:0, paddingRight:0 }}>
        {[["all","All Trails","on-all"],...Object.entries(TRAILS).map(([k,t])=>[k,`${t.emoji} ${t.label}`,`on-${k}`])].map(([k,lbl,cls]) => (
          <button key={k} className={`chip ${tf===k?cls:""}`} onClick={() => setTf(k)}>{lbl}</button>
        ))}
      </div>
      <div className="sgrid" style={{ paddingLeft:0, paddingRight:0, marginTop:11 }}>
        {display.map(v => {
          const s = stamps[v.id];
          const t = TRAILS[v.trail];
          const sh = v.name.length>22 ? v.name.slice(0,20)+"…" : v.name;
          return (
            <div key={v.id} className={`sc ${s?`sp ${v.trail}`:""}`} onClick={() => setModal(v)}>
              {s?.photo && <img src={s.photo} alt="" className="sc-photo" />}
              {s ? (
                <div className="sc-ov">
                  <div style={{ fontSize:16 }}>{t.emoji}</div>
                  <div className="sc-name">{sh}</div>
                </div>
              ) : (
                <><div className="sc-em">{t.emoji}</div><div className="sc-en">{sh}</div></>
              )}
              {s && <div className="sc-seal">✅</div>}
            </div>
          );
        })}
      </div>
      {total===0 && <div style={{ textAlign:"center", padding:"10px 0", color:"var(--muted)", fontSize:11, lineHeight:1.6 }}>Visit venues and take photos to collect stamps.<br />Fill your passport to enter the Ultimate Prize Draw.</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// VENUES
// ─────────────────────────────────────────────────────────

function Venues({ stamps, setModal }) {
  const [tf, setTf] = useState("all");
  const [vf, setVf] = useState("All Villages");
  const list = VENUES.filter(v => (tf==="all"||v.trail===tf) && (vf==="All Villages"||v.village===vf));
  return (
    <div className="shell" style={{ paddingBottom:48 }}>
      <div style={{ paddingTop:24 }}>
        <div className="sec-title">Venues</div>
        <div className="sec-sub">{list.length} venues · Tap any to stamp your passport</div>
      </div>
      <div className="chips" style={{ paddingLeft:0, paddingRight:0 }}>
        <button className={`chip ${tf==="all"?"on-all":""}`} onClick={() => setTf("all")}>All</button>
        {Object.entries(TRAILS).map(([k,t]) => (
          <button key={k} className={`chip ${tf===k?`on-${k}`:""}`} onClick={() => setTf(k)}>{t.emoji} {t.label}</button>
        ))}
      </div>
      <div className="chips" style={{ paddingLeft:0, paddingRight:0, paddingTop:4 }}>
        {VILLAGES.map(v => (
          <button key={v} className={`chip ${vf===v?"on-all":""}`} onClick={() => setVf(v)}>{v}</button>
        ))}
      </div>
      <div className="vlist" style={{ paddingLeft:0, paddingRight:0 }}>
        {list.map(v => {
          const s = stamps[v.id]; const t = TRAILS[v.trail];
          return (
            <div key={v.id} className={`vc ${s?`sp-${v.trail}`:""}`} onClick={() => setModal(v)}>
              <div className="vdot" style={{ background:t.color }} />
              <div className="vi">
                <div className="vn">{v.name}</div>
                <div className="vm">{v.village} · {v.type} · {t.emoji} {t.label}</div>
                <div className="vb">{v.blurb}</div>
              </div>
              <div className="vstamp">{s?"✅":"📷"}</div>
            </div>
          );
        })}
        {list.length===0 && <div style={{ textAlign:"center", padding:"40px 0", color:"var(--muted)", fontSize:12, gridColumn:"1/-1" }}>No venues match this filter.</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// PLANNER MAP
// ─────────────────────────────────────────────────────────

function PlannerMap({ venues }) {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    const map = L.map(ref.current, {
      center: [-37.35, 144.56],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", { maxZoom: 17 }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(ref.current);
    return () => { ro.disconnect(); map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const coords = venues.map(v => venueCoords(v));

    venues.forEach((v, i) => {
      const c = coords[i];
      const t = TRAILS[v.trail];
      L.marker(c, {
        icon: L.divIcon({
          className: "",
          html: `<div style="width:26px;height:26px;border-radius:50%;background:${t.color};border:2px solid rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.5);font-family:system-ui">${i + 1}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
      })
        .bindPopup(`<div style="font-size:13px"><b>${v.name}</b><br><span style="opacity:.6">${v.village} · ${v.type}</span></div>`)
        .addTo(layer);
    });

    if (coords.length > 1) {
      L.polyline(coords, { color: "#C85A15", weight: 2.5, opacity: .75, dashArray: "7,5" }).addTo(layer);
    }

    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [35, 35], maxZoom: 13 });
    } else {
      map.setView([-37.35, 144.56], 11);
    }
  }, [venues]);

  return <div ref={ref} style={{ width: "100%", height: "100%", minHeight: 300 }} />;
}

// ─────────────────────────────────────────────────────────
// PLANNER
// ─────────────────────────────────────────────────────────

function Planner({ stamps, itin, setItin, saveItin }) {
  const [selV,    setSelV]    = useState("All Villages");
  const [start,   setStart]   = useState("10:00");
  const [copied,  setCopied]  = useState(false);
  const [showAll, setShowAll] = useState(false);

  const avail = VENUES.filter(v => !itin.includes(v.id));
  const filtered = avail.filter(v => selV === "All Villages" || v.village === selV);

  const add  = id => { const n = [...itin, id]; setItin(n); saveItin(n); };
  const rm   = id => { const n = itin.filter(x => x !== id); setItin(n); saveItin(n); };
  const up   = i  => { if (i === 0) return; const n = [...itin]; [n[i-1], n[i]] = [n[i], n[i-1]]; setItin(n); saveItin(n); };
  const down = i  => { if (i === itin.length-1) return; const n = [...itin]; [n[i], n[i+1]] = [n[i+1], n[i]]; setItin(n); saveItin(n); };
  const clear = () => { setItin([]); saveItin([]); };
  const optimize = () => { const o = optimizeRoute(itin); setItin(o); saveItin(o); };

  const itinVenues = itin.map(id => VENUES.find(v => v.id === id)).filter(Boolean);

  // Build schedule with real drive times
  const schedule = (() => {
    const [h, m] = start.split(":").map(Number);
    let mins = h * 60 + m;
    return itinVenues.map((v, i) => {
      const aH = String(Math.floor(mins / 60) % 24).padStart(2, "0");
      const aM = String(mins % 60).padStart(2, "0");
      const d = dur(v);
      const drive = i < itinVenues.length - 1 ? driveMin(v, itinVenues[i + 1]) : 0;
      mins += d + drive;
      return { ...v, arrival: `${aH}:${aM}`, dur: d, drive };
    });
  })();

  const totalMins = schedule.reduce((a, s) => a + s.dur + s.drive, 0);
  const [startH, startM] = start.split(":").map(Number);
  const endMins = startH * 60 + startM + totalMins;
  const endStr = `${String(Math.floor(endMins / 60) % 24).padStart(2, "0")}:${String(endMins % 60).padStart(2, "0")}`;
  const uniqueVillages = [...new Set(itinVenues.map(v => v.village))];

  // Suggested next: closest venues to last stop
  const suggested = (() => {
    if (itinVenues.length === 0) return [];
    const last = itinVenues[itinVenues.length - 1];
    return avail
      .map(v => ({ ...v, dist: haversine(venueCoords(last), venueCoords(v)) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6);
  })();

  const share = () => {
    const lines = [`Macedon Ranges Autumn Festival\nMy Trip · ${new Date().toLocaleDateString("en-AU")}\n`];
    schedule.forEach((v, i) => {
      lines.push(`${i + 1}. ${v.arrival} – ${v.name} (${v.village}) ~${v.dur} min`);
      if (v.drive > 0) lines.push(`   Drive: ${v.drive} min`);
    });
    lines.push(`\nFinish ~${endStr} · ${(totalMins / 60).toFixed(1)} hrs total`);
    lines.push(`Villages: ${uniqueVillages.join(", ")}`);
    lines.push("\nvisitmacedonranges.com/autumn-festival");
    const txt = lines.join("\n");
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); });
  };

  return (
    <div className="shell" style={{ paddingBottom: 48 }}>
      <div style={{ paddingTop: 24 }}>
        <div className="sec-title">Trip Planner</div>
        <div className="sec-sub">Build your day — we'll map the route and estimate drive times</div>
      </div>

      {itinVenues.length === 0 ? (
        <div className="empty-planner">
          <div style={{ fontSize: 48, marginBottom: 12, opacity: .25 }}>&#x1F5FA;&#xFE0F;</div>
          <div style={{ fontFamily: "var(--fs)", fontSize: 18, fontWeight: 700, color: "var(--cream2)", marginBottom: 6 }}>Start Planning Your Trip</div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.7, maxWidth: 340, margin: "0 auto" }}>
            Add venues below to build your itinerary. We'll calculate drive times between stops and map your route across the Macedon Ranges.
          </div>
        </div>
      ) : (
        <>
          {/* Summary pills */}
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", paddingTop: 14, marginBottom: 14, alignItems: "center" }}>
            {[
              `${itinVenues.length} stop${itinVenues.length !== 1 ? "s" : ""}`,
              `~${(totalMins / 60).toFixed(1)} hours`,
              `${uniqueVillages.length} village${uniqueVillages.length !== 1 ? "s" : ""}`,
            ].map(lbl => (
              <div key={lbl} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 100, padding: "6px 14px", fontSize: 11, color: "var(--cream2)", fontWeight: 500 }}>{lbl}</div>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {itin.length >= 3 && <button className="btn-xs" onClick={optimize}>Optimize Route</button>}
              <button className="btn-xs" onClick={share}>{copied ? "Copied!" : "Share"}</button>
            </div>
          </div>

          {/* Map + Timeline */}
          <div className="planner-layout">
            <div className="planner-map">
              <PlannerMap venues={itinVenues} />
            </div>

            <div>
              {/* Start time */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" }}>Depart</div>
                <input type="time" value={start} onChange={e => setStart(e.target.value)} style={{ background: "rgba(255,255,255,.07)", border: "1px solid var(--border2)", borderRadius: 7, padding: "5px 9px", color: "var(--cream2)", fontSize: 14, fontWeight: 600, fontFamily: "var(--ff)", outline: "none" }} />
                <div style={{ fontSize: 10, color: "var(--muted)" }}>finish ~{endStr}</div>
              </div>

              {/* Visual timeline */}
              <div className="planner-tl-wrap">
                {schedule.map((v, i) => {
                  const t = TRAILS[v.trail];
                  const gi = itin.indexOf(v.id);
                  return (
                    <React.Fragment key={v.id}>
                      <div className="tl-stop">
                        <div className="tl-rail">
                          <div className="tl-dot" style={{ background: t.color, border: `2px solid ${t.light}` }} />
                          {i < schedule.length - 1 && <div className="tl-connector" style={{ background: t.color + "44" }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: 8, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                            <div style={{ fontSize: 11, color: t.light, fontWeight: 700, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{v.arrival}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.name}</div>
                          </div>
                          <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 5 }}>
                            {v.village} · {v.type} · ~{v.dur} min{stamps[v.id] ? " · Visited" : ""}
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button className="itin-rm" onClick={() => up(gi)} title="Move up">&#8593;</button>
                            <button className="itin-rm" onClick={() => down(gi)} title="Move down">&#8595;</button>
                            <button className="itin-rm" onClick={() => rm(v.id)} title="Remove">&#215;</button>
                          </div>
                        </div>
                      </div>
                      {v.drive > 0 && (
                        <div className="tl-drive-seg">
                          <div className="tl-drive-rail"><div className="tl-drive-pip" /></div>
                          <div className="tl-drive-label">{v.drive} min drive</div>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
                <button className="btn-xs" onClick={clear} style={{ color: "rgba(220,80,80,.8)", borderColor: "rgba(220,80,80,.3)" }}>Clear All</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Suggested Next */}
      {suggested.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div className="lp-eyebrow">Suggested Next — Nearest to Your Last Stop</div>
          <div className="suggest-grid">
            {suggested.map(v => {
              const t = TRAILS[v.trail];
              return (
                <div key={v.id} className="add-card" onClick={() => add(v.id)}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: t.color + "22", border: `1px solid ${t.color}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{t.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{v.name}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)" }}>{v.village} · ~{v.dist.toFixed(1)} km</div>
                  </div>
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--muted)", flexShrink: 0 }}>+</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Venues */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="lp-eyebrow" style={{ marginBottom: 0 }}>All Venues</div>
          {itinVenues.length > 0 && (
            <button className="btn-xs" onClick={() => setShowAll(!showAll)}>{showAll ? "Collapse" : `Show All (${avail.length})`}</button>
          )}
        </div>
        {(itinVenues.length === 0 || showAll) && (
          <>
            <div className="chips" style={{ paddingLeft: 0, paddingRight: 0 }}>
              {VILLAGES.map(v => <button key={v} className={`chip ${selV === v ? "on-all" : ""}`} onClick={() => setSelV(v)}>{v}</button>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingTop: 11 }}>
              {filtered.map(v => {
                const t = TRAILS[v.trail];
                return (
                  <div key={v.id} className="add-card" onClick={() => add(v.id)}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: t.color + "22", border: `1px solid ${t.color}45`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{t.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: "var(--muted)" }}>{v.village} · {v.type} · ~{dur(v)} min{stamps[v.id] ? " · Visited" : ""}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--muted)", flexShrink: 0 }}>+</div>
                  </div>
                );
              })}
              {filtered.length === 0 && <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 11, padding: "16px 0" }}>All venues in this village are in your itinerary.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────

export default function App() {
  const [user,       setUser]       = useState(null);
  const [stamps,     setStamps]     = useState({});
  const [itin,       setItin]       = useState([]);
  const [page,       setPage]       = useState("home");
  const [modal,      setModal]      = useState(null);
  const [userMenu,   setUserMenu]   = useState(false);
  const [loginSheet, setLoginSheet] = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [busy,       setBusy]       = useState(false);
  const [toast,      setToast]      = useState(null);
  const [flash,      setFlash]      = useState(null);
  const [submitted,  setSubmitted]  = useState(null);
  const [submitModal,setSubmitModal]= useState(false);

  useEffect(() => {
    db.get("mraf_user").then(u => {
      if (u?.email) {
        setUser(u);
        Promise.all([
          db.get(`mraf_stamps:${u.email}`),
          db.get(`mraf_itin:${u.email}`),
          db.get(`mraf_submitted:${u.email}`),
        ]).then(([s, it, sub]) => {
          if (s)   setStamps(s);
          if (it)  setItin(it);
          if (sub) setSubmitted(sub);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const titles = {
      home: "Macedon Ranges Autumn Festival · Pie & Tart Trail",
      venues: "Venues · Macedon Ranges Autumn Festival",
      passport: "My Passport · Macedon Ranges Autumn Festival",
      planner: "Trip Planner · Macedon Ranges Autumn Festival",
    };
    document.title = titles[page] || titles.home;
  }, [page]);

  useEffect(() => {
    const onEsc = e => {
      if (e.key === "Escape") {
        if (submitModal) setSubmitModal(false);
        else if (modal) setModal(null);
        else if (loginSheet) setLoginSheet(false);
        else if (userMenu) setUserMenu(false);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [submitModal, modal, loginSheet, userMenu]);

  const login = async (name, email) => {
    setBusy(true);
    const u = { name, email };
    await db.set("mraf_user", u);
    const [s, it, sub] = await Promise.all([db.get(`mraf_stamps:${email}`), db.get(`mraf_itin:${email}`), db.get(`mraf_submitted:${email}`)]);
    if (s)   setStamps(s);
    if (it)  setItin(it);
    if (sub) setSubmitted(sub);
    setUser(u);
    setBusy(false);
    setLoginSheet(false);
    setPage("passport");
  };

  const logout = async () => {
    await db.del("mraf_user");
    setUser(null); setStamps({}); setItin([]); setSubmitted(null);
    setUserMenu(false); setPage("home");
  };

  const navigate = (p, isPublic) => {
    if (!isPublic && !user) { setLoginSheet(true); return; }
    setPage(p);
  };

  const addStamp = async (id, data) => {
    const next = { ...stamps, [id]: data };
    setStamps(next);
    const v = VENUES.find(x => x.id === id);
    setFlash(v);
    setTimeout(() => setFlash(null), 700);
    setToast(`${TRAILS[v.trail].emoji} ${v.name} stamped!`);
    if (user) await db.set(`mraf_stamps:${user.email}`, next);
  };

  const rmStamp = async id => {
    const next = { ...stamps }; delete next[id];
    setStamps(next);
    if (user) await db.set(`mraf_stamps:${user.email}`, next);
  };

  const saveItin = async it => {
    if (user) await db.set(`mraf_itin:${user.email}`, it);
  };

  const handleSubmit = async data => {
    const entry = { ...data, name: user.name, email: user.email, stamps: Object.keys(stamps).length, ts: Date.now() };
    await db.set(`mraf_submitted:${user.email}`, entry);
    setSubmitted(entry);
    setSubmitModal(false);
    setToast("Entry submitted — you're in the draw!");
  };

  const total = Object.keys(stamps).length;

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="loading-wrap">
          <div className="spinner" />
          <div style={{ fontSize:12, color:"var(--muted)" }}>Loading your passport…</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <Leaves />
      <div style={{ position:"relative", zIndex:1 }}>
        <AppNav
          page={page}
          setPage={navigate}
          total={total}
          user={user}
          onAvatar={user ? () => setUserMenu(true) : () => setLoginSheet(true)}
        />
        {page==="home"     && <Home user={user} stamps={stamps} setPage={setPage} onPassport={() => user ? setPage("passport") : setLoginSheet(true)} submitted={submitted} onSubmit={() => user ? setSubmitModal(true) : setLoginSheet(true)} />}
        {page==="passport" && <Passport stamps={stamps} setModal={setModal} submitted={submitted} onSubmit={() => setSubmitModal(true)} />}
        {page==="venues"   && <Venues stamps={stamps} setModal={v => user ? setModal(v) : setLoginSheet(true)} />}
        {page==="planner"  && <Planner stamps={stamps} itin={itin} setItin={setItin} saveItin={saveItin} />}
      </div>

      {loginSheet && <LoginSheet onLogin={login} onClose={() => setLoginSheet(false)} busy={busy} />}
      {submitModal && <SubmitModal user={user} stamps={stamps} onSubmit={handleSubmit} onClose={() => setSubmitModal(false)} />}
      {modal && <StampModal venue={modal} existing={stamps[modal.id]} onClose={() => setModal(null)} onStamp={addStamp} onRemove={rmStamp} />}
      {userMenu && <UserModal user={user} total={total} onLogout={logout} onClose={() => setUserMenu(false)} />}
      {flash && <Flash venue={flash} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
