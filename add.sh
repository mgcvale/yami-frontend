#!/bin/bash

API="https://api.mgcvale.dev/food"
AUTH="458a0e52-15d1-4ac6-b747-9bd2b65eb006"
RID=5

post() {
  NAME="$1"
  DESC="$2"

  echo "Enviando: $NAME"

  curl -s -X POST "$API" \
    -H "Authorization: Bearer $AUTH" \
    -H "Content-Type: multipart/form-data" \
    -F "name=$NAME" \
    -F "description=$DESC" \
    -F "restaurantId=$RID"

  echo -e "\n---\n"
}

post "Soda Italiana" \
"Consultar sabores disponíveis"

post "Virgin Pink" \
"Suco de limão, groselha e água com gás"

post "Fit Pra Caraleo" \
"Infusão de gengibre com limão e tônica zero"

post "Careta" \
"Infusão de framboesa, tônica e espuma de gengibre"

