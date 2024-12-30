# Pokepal

A React Pokedex tracker that uses [PokeAPI](https://pokeapi.co/) to aid me in my quest to catch 'em all. This was done as a mini project to refresh myself on various React Hooks and to try out React Query.

## Features

- Stores captured data in local storage
- Search function
- Hide/show caught Pokemon

## Might add these things later

- Export/import data as CSV (to preserve data outside of local storage)
- Toggle Mega/other forms - this may be difficult due to PokeAPI's lack of logical categorisation for different forms
- Further filter out forms that you would never catch individually (again may be difficult due to above point)
- Make it look better on mobile

## Other notes

This app uses the order property from PokeAPI to order species. At the time of writing this gets a bit muddled from Gen 7 onwards, but I chose it because the property is supposed to group species (e.g. Alolan Raichu with Raichu) together which just makes more _sense_ to me.

## Credits

- [PokeAPI](https://pokeapi.co/)
- [Wonder Mail font](https://www.dafont.com/wonder-mail.font)
- [Pokemon logo generator](https://www.fontbolt.com/font/pokemon-font/)
