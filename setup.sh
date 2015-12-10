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
  if [ -z "$TRAVIS" ]; then
    git clone https://github.com/${i}
  else
    git clone git@github.com:${i}.git
  fi
  npm install
done

for i in "${helpers[@]}"; do
  if [ -z "$TRAVIS" ]; then
    git clone https://github.com/${i}
  else
    git clone git@github.com:${i}.git
  fi
  npm install
done


#npm install -g symlink
#symlink . --execute
