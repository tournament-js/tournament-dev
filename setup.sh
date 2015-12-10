#!/bin/bash
gh=$([ -z "$TRAVIS" ] && echo git@github.com: || echo https://github.com/)

core=(
  duel
  duel-names
  ffa
  ffa-tb
  group
  groupstage
  groupstage-tb
  groupstage-tb-duel
  masters
  roundrobin
  tiebreaker
  tournament
  tourney
)

helpers=(
  autonomy
  interlude
  operators
  smell
  subset
  sulfur
)

for i in "${core[@]}"; do
  git clone ${gh}${i}.git
  npm install
done

for i in "${helpers[@]}"; do
  git clone ${gh}${i}.git
  npm install
done


#npm install -g symlink
#symlink . --execute
