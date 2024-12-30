import logo from "../assets/logo.png";
import { useContext, useState } from "react";
import { PokeContext, PokeDispatchContext } from "./PokemonContext";
const Header = () => {
  const dispatch = useContext(PokeDispatchContext);
  const pokeState = useContext(PokeContext);
  const [input, setInput] = useState("");

  const clearHandler = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const searchHandler = (e) => {
    setInput(e.target.value);
    dispatch({ type: "SEARCH", payload: e.target.value });
  };

  const resetHandler = () => {
    setInput("");
    dispatch({ type: "SEARCH", payload: "" });
  };
  return (
    <header className="bg-white flex flex-col md:flex-row py-4 px-9 justify-between items-center">
      <img src={logo} className="h-10 md:mb-0 mb-8" />
      <div className="flex flex-col lg:flex-row gap-4">
        <div>
          <input
            type="text"
            id="search"
            className="border-black border-2 px-2 sm:w-[250px] w-[calc(100%-77px)] border-e-0"
            onChange={searchHandler}
            value={input}
          />
          <button
            className="rounded rounded-s-none border-black border-2 px-4 hover:border-red-800 hover:text-red-800"
            onClick={resetHandler}
          >
            Reset
          </button>
        </div>
        <div className="flex max-[400px]:flex-col gap-4 justify-center">
          <button
            className="rounded border-black border-2 px-4 hover:border-red-800 hover:text-red-800 min-w-[150px]"
            onClick={() => {
              dispatch({ type: "TOGGLE_VISIBILITY" });
            }}
          >
            {pokeState.showChecked ? "Hide" : "Show"} Caught
          </button>
          <button
            className="rounded border-black border-2 px-4 hover:border-red-800 hover:text-red-800"
            onClick={clearHandler}
          >
            Clear All Caught
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
