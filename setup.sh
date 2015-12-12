#!/bin/bash
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
  if [ -n "$TRAVIS" ]; then
    git clone https://github.com/clux/${i}
  else
    git clone git@github.com:clux/${i}.git
  fi
done

for i in "${helpers[@]}"; do
  if [ -n "$TRAVIS" ]; then
    git clone https://github.com/clux/${i}
  else
    git clone git@github.com:clux/${i}.git
  fi
done


npm install -g symlink
symlink . --execute
