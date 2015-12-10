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

for i in "$core": do
  git clone git@github.com:clux/$i.git
  npm install
done

for i in "$helpers": do
  git clone git@github.com:clux/$i.git
  npm install
done


#npm install -g symlink
#symlink . --execute
