import { useContext } from "react";
import { PokeContext, PokeDispatchContext } from "./PokemonContext";

const Pagination = () => {
  const dispatch = useContext(PokeDispatchContext);
  const pokeState = useContext(PokeContext);

  const { currentPage, totalPages } = pokeState.pagination;

  return (
    <div className="text-4xl flex mb-16 mt-auto">
      <div className="bg-white px-4 rounded-full flex mx-auto gap-8">
        <button
          onClick={() => {
            dispatch({ type: "NAVIGATE_TO", payload: 1 });
          }}
        >
          {"<<"}
        </button>
        <button
          onClick={() => {
            dispatch({ type: "NAVIGATE_RELATIVE", payload: -1 });
          }}
        >
          {"<"}
        </button>

        {currentPage - 4 > 0 && currentPage > totalPages - 1 && (
          <button
            onClick={() => {
              dispatch({ type: "NAVIGATE_RELATIVE", payload: -4 });
            }}
          >
            {currentPage - 4}
          </button>
        )}
        {currentPage - 3 > 0 && currentPage > totalPages - 2 && (
          <button
            onClick={() => {
              dispatch({ type: "NAVIGATE_RELATIVE", payload: -3 });
            }}
          >
            {currentPage - 3}
          </button>
        )}
        {currentPage - 2 > 0 && (
          <button
            onClick={() => {
              dispatch({ type: "NAVIGATE_RELATIVE", payload: -2 });
            }}
          >
            {currentPage - 2}
          </button>
        )}
        {currentPage - 1 > 0 && (
          <button
            onClick={() => {
              dispatch({ type: "NAVIGATE_RELATIVE", payload: -1 });
            }}
          >
            {currentPage - 1}
          </button>
        )}
        <span className="text-blue-500">{currentPage}</span>
        {currentPage + 1 < totalPages + 1 && (
          <button
            onClick={() => {
              dispatch({ type: "NAVIGATE_RELATIVE", payload: 1 });
            }}
          >
            {currentPage + 1}
          </button>
        )}
        {currentPage + 2 < totalPages + 1 && (
          <button
            onClick={() => {
              dispatch({ type: "NAVIGATE_RELATIVE", payload: 2 });
            }}
          >
            {currentPage + 2}
          </button>
        )}
        {currentPage + 3 < totalPages + 1 && currentPage < 3 && (
          <button
            onClick={() => {
              dispatch({ type: "NAVIGATE_RELATIVE", payload: 3 });
            }}
          >
            {currentPage + 3}
          </button>
        )}
        {currentPage + 4 < totalPages + 1 && currentPage < 2 && (
          <button
            onClick={() => {
              dispatch({ type: "NAVIGATE_RELATIVE", payload: 4 });
            }}
          >
            {currentPage + 4}
          </button>
        )}

        <button
          onClick={() => {
            dispatch({ type: "NAVIGATE_RELATIVE", payload: 1 });
          }}
        >
          {">"}
        </button>
        <button
          onClick={() => {
            dispatch({
              type: "NAVIGATE_TO",
              payload: totalPages,
            });
          }}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
