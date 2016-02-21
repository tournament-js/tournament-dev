#!/bin/bash
set -e
GH=$([ -z "$TRAVIS" ] && echo "git@github.com:" || echo "https://github.com/")

modules=(
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
  # helpers
  #autonomy
  #interlude
  #subset
  operators
  smell
  sulfur
)

for i in "${modules[@]}"; do
  git clone ${GH}clux/${i}.git
done

npm install -g symlink
symlink . --execute
