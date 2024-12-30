import { useQuery, useQueries } from "@tanstack/react-query";
import { useReducer, useState } from "react";
import PokemonCard from "./PokemonCard";
import Pagination from "./Pagination";
import Header from "./Header";
import { PokeContext, PokeDispatchContext } from "./PokemonContext";

const initialPoke = {
  pokedex: [],
  storage: [],
  showChecked: true,
  search: false,
  pagination: {
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 32,
  },
};

const pokeReducer = (pokedata, action) => {
  switch (action.type) {
    case "LOAD_DEX": {
      const pokedex = action.payload;
      const local = JSON.parse(localStorage.getItem("pokedex"));

      if (!local || local.length < pokedex.length) {
        localStorage.setItem(
          "pokedex",
          JSON.stringify(
            pokedex.map((pokemon) => ({ name: pokemon.name, checked: false }))
          )
        );
        return {
          ...pokedata,
          pokedex: pokedex.map((pokemon) => ({
            ...pokemon,
            checked: false,
            show: true,
          })),
          pagination: {
            ...pokedata.pagination,
            totalPages: Math.ceil(
              pokedex.length / pokedata.pagination.itemsPerPage
            ),
          },
          storage: pokedex.map((pokemon) => ({
            name: pokemon.name,
            checked: false,
          })),
        };
      } else {
        const localToStateSync = pokedex.map((pokemon) => {
          if (local.filter((poke) => poke.name === pokemon.name).length > 0) {
            return {
              ...pokemon,
              checked: local.filter((poke) => poke.name === pokemon.name)[0]
                .checked,
              show: true,
            };
          }
        });
        return {
          ...pokedata,
          pokedex: localToStateSync,
          pagination: {
            ...pokedata.pagination,
            totalPages: Math.ceil(
              pokedex.length / pokedata.pagination.itemsPerPage
            ),
          },
          storage: local,
        };
      }
    }
    case "NAVIGATE_TO": {
      return {
        ...pokedata,
        pagination: {
          ...pokedata.pagination,
          currentPage: action.payload,
        },
      };
    }
    case "NAVIGATE_RELATIVE": {
      const { currentPage, totalPages } = pokedata.pagination;
      let newPage = 1;
      if (currentPage + action.payload < 1) {
        newPage = 1;
      } else if (currentPage + action.payload >= totalPages) {
        newPage = totalPages;
      } else {
        newPage = currentPage + action.payload;
      }
      return {
        ...pokedata,
        pagination: {
          ...pokedata.pagination,
          currentPage: newPage,
        },
      };
    }
    case "TOGGLE_CHECKED": {
      const pokedexClone = [...pokedata.pokedex];
      const index = pokedata.pokedex
        .map((poke) => poke.name)
        .indexOf(action.payload);
      pokedexClone[index] = {
        ...pokedexClone[index],
        checked: !pokedata.pokedex[index].checked,
      };
      localStorage.setItem(
        "pokedex",
        JSON.stringify(
          pokedexClone.map((pokemon) => ({
            name: pokemon.name,
            checked: pokemon.checked,
          }))
        )
      );

      let newTotalPages = 1;
      if (!search) {
        newTotalPages = pokedata.showChecked
          ? pokedata.pagination.totalPages
          : Math.ceil(
              pokedexClone.filter((pokemon) => !pokemon.checked).length /
                pokedata.pagination.itemsPerPage
            );
      } else {
        newTotalPages = pokedata.showChecked
          ? Math.ceil(
              pokedexClone.filter((pokemon) => pokemon.show).length /
                pokedata.pagination.itemsPerPage
            )
          : Math.ceil(
              pokedexClone.filter((pokemon) => !pokemon.checked && pokemon.show)
                .length / pokedata.pagination.itemsPerPage
            );
      }

      return {
        ...pokedata,
        pokedex: pokedexClone,
        storage: pokedexClone.map((pokemon) => ({
          name: pokemon.name,
          checked: pokemon.checked,
        })),
        pagination: {
          ...pokedata.pagination,
          currentPage:
            pokedata.pagination.currentPage > newTotalPages
              ? newTotalPages
              : pokedata.pagination.currentPage,
          totalPages: newTotalPages,
        },
      };
    }
    case "TOGGLE_VISIBILITY": {
      const newTotalPages = !pokedata.search
        ? Math.ceil(
            pokedata.pokedex.filter((pokemon) =>
              !pokedata.showChecked ? true : !pokemon.checked
            ).length / pokedata.pagination.itemsPerPage
          )
        : Math.ceil(
            pokedata.pokedex.filter((pokemon) =>
              !pokedata.showChecked
                ? pokemon.show
                : !pokemon.checked && pokemon.show
            ).length / pokedata.pagination.itemsPerPage
          );
      // console.log(pokedata.search);
      return {
        ...pokedata,
        showChecked: !pokedata.showChecked,
        pagination: {
          ...pokedata.pagination,
          totalPages: newTotalPages,
          currentPage:
            pokedata.pagination.currentPage > newTotalPages
              ? newTotalPages
              : pokedata.pagination.currentPage,
        },
      };
    }
    case "CLEAR_ALL": {
      localStorage.setItem(
        "pokedex",
        JSON.stringify(
          pokedata.storage.map((pokemon) => ({ ...pokemon, checked: false }))
        )
      );
      return {
        ...pokedata,
        pokedex: pokedata.pokedex.map((pokemon) => ({
          ...pokemon,
          checked: false,
        })),
        storage: pokedata.storage.map((pokemon) => ({
          ...pokemon,
          checked: false,
        })),
        pagination: {
          ...pokedata.pagination,
          totalPages: !pokedata.search
            ? Math.ceil(
                pokedata.pokedex.length / pokedata.pagination.itemsPerPage
              )
            : Math.ceil(
                pokedata.pokedex.filter((pokemon) => pokemon.show).length /
                  pokedata.pagination.itemsPerPage
              ),
        },
      };
    }
    case "SEARCH": {
      const searchResults = pokedata.pokedex.map((pokemon) => ({
        ...pokemon,
        show: pokemon.name.toLowerCase().includes(action.payload.toLowerCase()),
      }));

      let newTotalPages = pokedata.pagination.totalPages;
      if (search) {
        newTotalPages = pokedata.showChecked
          ? Math.ceil(
              searchResults.filter((pokemon) => pokemon.show).length /
                pokedata.pagination.itemsPerPage
            )
          : Math.ceil(
              searchResults.filter(
                (pokemon) => pokemon.show && !pokemon.checked
              ).length / pokedata.pagination.itemsPerPage
            );
      }

      return {
        ...pokedata,
        pokedex: searchResults,
        search: action.payload.trim() !== "",
        pagination: {
          ...pokedata.pagination,
          totalPages: newTotalPages,
          currentPage: 1,
        },
      };
    }
  }
};

const Main = () => {
  const [loadingChecker, setLoading] = useState(0);
  const [pokeState, dispatch] = useReducer(pokeReducer, initialPoke);
  const { pokedex, showChecked, pagination, search } = pokeState;

  const {
    isLoading,
    error,
    data: initialDex,
  } = useQuery({
    queryKey: ["pokedex"],
    queryFn: () =>
      fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0").then(
        (res) => res.json()
      ),
  });

  const pokedexData = useQueries({
    queries: initialDex
      ? initialDex.results.map((pokemon) => {
          return {
            queryKey: ["pokemon", pokemon.name],
            queryFn: () =>
              fetch("https://pokeapi.co/api/v2/pokemon/" + pokemon.name).then(
                (res) => res.json()
              ),
          };
        })
      : [],
  });

  if (isLoading) return <div className="m-auto h-full">Loading...</div>;

  if (error) return "Error: " + error.message;

  const checker = pokedexData.some((result) => result.isLoading);

  if (pokedexData && !checker && loadingChecker < 1) {
    setLoading((prevState) => prevState + 1);
    const pokemonData = pokedexData
      .map((pokemon) => pokemon.data)
      .filter(
        (pokemon) =>
          !(
            pokemon.order === -1 ||
            pokemon.name.toLowerCase().includes("totem") ||
            pokemon.name.toLowerCase().includes("gmax") ||
            pokemon.name.toLowerCase().includes("eternamax") ||
            pokemon.name.toLowerCase().includes("starter") ||
            pokemon.name.toLowerCase().includes("gulping") ||
            pokemon.name.toLowerCase().includes("gorging") ||
            pokemon.name.toLowerCase().includes("zygarde-10") ||
            (pokemon.name.toLowerCase().includes("pikachu") &&
              pokemon.name !== pokemon.species.name)
          )
      )
      .sort((a, b) => a.order - b.order);

    dispatch({ type: "LOAD_DEX", payload: pokemonData });
  }

  // console.log(pokeState);

  return (
    <PokeContext.Provider value={pokeState}>
      <PokeDispatchContext.Provider value={dispatch}>
        <Header />
        <main className="container m-auto px-4 min-h-[calc(100vh-137px)] flex flex-col">
          {checker && (
            <div className="m-auto mt-16 text-5xl text-center">Loading...</div>
          )}
          <div className="grid xl:grid-cols-8 lg:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-8 my-16">
            {showChecked
              ? search
                ? pokedex
                    .filter((pokemon) => pokemon.show)
                    .slice(
                      (pagination.currentPage - 1) * pagination.itemsPerPage,
                      pagination.currentPage * pagination.itemsPerPage
                    )
                    .map((pokemon) => (
                      <PokemonCard key={pokemon.name} {...pokemon} />
                    ))
                : pokedex
                    .slice(
                      (pagination.currentPage - 1) * pagination.itemsPerPage,
                      pagination.currentPage * pagination.itemsPerPage
                    )
                    .map((pokemon) => (
                      <PokemonCard key={pokemon.name} {...pokemon} />
                    ))
              : search
              ? pokedex
                  .filter((pokemon) => pokemon.show)
                  .filter((pokemon) => {
                    return !pokemon.checked;
                  })
                  .slice(
                    (pagination.currentPage - 1) * pagination.itemsPerPage,
                    pagination.currentPage * pagination.itemsPerPage
                  )
                  .map((pokemon) => (
                    <PokemonCard key={pokemon.name} {...pokemon} />
                  ))
              : pokedex
                  .filter((pokemon) => {
                    return !pokemon.checked;
                  })
                  .slice(
                    (pagination.currentPage - 1) * pagination.itemsPerPage,
                    pagination.currentPage * pagination.itemsPerPage
                  )
                  .map((pokemon) => (
                    <PokemonCard key={pokemon.name} {...pokemon} />
                  ))}
          </div>
          <Pagination />
        </main>
        <footer className="bg-white text-center py-4">
          Made by{" "}
          <a
            href="https://github.com/pangoline"
            target="_blank"
            className="hover:underline"
          >
            pan🍳
          </a>{" "}
          |{" "}
          <a
            href="https://github.com/pangoline/pokepal"
            target="_blank"
            className="hover:underline"
          >
            repo
          </a>
        </footer>
      </PokeDispatchContext.Provider>
    </PokeContext.Provider>
  );
};
export default Main;
