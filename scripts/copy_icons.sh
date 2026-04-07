#!/bin/bash
# Script to systematically import AI-generated high-end visuals.

echo "Creating directories..."
mkdir -p public/assets/brand

echo "Copying Project Brand Icons..."
cp ~/.gemini/antigravity/brain/a2aa68ed-f8d5-40d1-83e7-60b68574adbe/aura_studio_icon_1775529491311.png public/assets/brand/aura_studio.png
cp ~/.gemini/antigravity/brain/a2aa68ed-f8d5-40d1-83e7-60b68574adbe/kshem_icon_1775529510310.png public/assets/brand/kshem.png
cp ~/.gemini/antigravity/brain/a2aa68ed-f8d5-40d1-83e7-60b68574adbe/harmony_bloom_icon_1775529527266.png public/assets/brand/harmony.png
cp ~/.gemini/antigravity/brain/a2aa68ed-f8d5-40d1-83e7-60b68574adbe/neev_icon_1775529560243.png public/assets/brand/neev.png
cp ~/.gemini/antigravity/brain/a2aa68ed-f8d5-40d1-83e7-60b68574adbe/aura_arena_icon_1775529578870.png public/assets/brand/arena.png

echo "Copying PWA & Favicon App Logos..."
cp ~/.gemini/antigravity/brain/a2aa68ed-f8d5-40d1-83e7-60b68574adbe/amit_brand_logo_1775529800464.png public/icon-192.png
cp ~/.gemini/antigravity/brain/a2aa68ed-f8d5-40d1-83e7-60b68574adbe/amit_brand_logo_1775529800464.png public/icon-512.png
cp ~/.gemini/antigravity/brain/a2aa68ed-f8d5-40d1-83e7-60b68574adbe/amit_brand_logo_1775529800464.png public/apple-touch-icon.png

echo "Successfully placed all icons!"
