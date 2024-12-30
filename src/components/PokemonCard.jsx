import { useTransition, useContext } from "react";
import { PokeDispatchContext } from "./PokemonContext";
import Pokeball from "./Pokeball";

const PokemonCard = ({ name, species, id, sprites, checked }) => {
  const dispatch = useContext(PokeDispatchContext);

  const [isPending, startTransition] = useTransition();

  const checkHandler = () => {
    startTransition(() => {
      dispatch({ type: "TOGGLE_CHECKED", payload: name });
    });
  };
  let adjustedName = name.replaceAll("-", " ");
  if (adjustedName.toLowerCase().includes(" mega")) {
    adjustedName = "mega " + adjustedName.toLowerCase().replaceAll(" mega", "");
  }
  if (adjustedName.toLowerCase().includes(" alola")) {
    adjustedName = adjustedName.toLowerCase().replaceAll("alola", "(alola)");
  }
  if (adjustedName.toLowerCase().includes(" galar")) {
    adjustedName = adjustedName.toLowerCase().replaceAll("galar", "(galar)");
  }
  return (
    <div
      className="hover:-translate-y-3 transition-all relative cursor-pointer"
      onClick={checkHandler}
    >
      {species.name === name && (
        <div className="bg-orange-200 rounded-full px-3 flex mr-8 absolute">
          <span className="m-auto">{id}</span>
        </div>
      )}

      <div className="absolute right-0">
        <div className="bg-orange-200 h-[32px] w-[32px] rounded-full flex">
          <span
            className={
              checked || (isPending && !checked)
                ? "opacity-70 mx-auto transition-opacity"
                : "opacity-0 mx-auto transition-opacity"
            }
          >
            <Pokeball
              svgClasses={"w-8 h-8 opacity-80"}
              pathClasses={"fill-orange-400"}
            />
          </span>
        </div>
      </div>

      <div className="bg-white rounded-full p-8 mb-4 shadow-lg">
        <img src={sprites.front_default} />
      </div>
      <div className="-mt-8 shadow-md rounded-full overflow-hidden ">
        <div className="m-auto capitalize bg-orange-200 px-3 text-center">
          {adjustedName}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default PokemonCard;
