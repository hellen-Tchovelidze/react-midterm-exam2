import { useReducer, useState } from "react";

import "../Comment/com.css"

const initialValue ={
  count: 0,
}

function Reducer(state, action) {
switch (action.type) {
  case "INCREMENT":
    return {count: state.count + 1 }
    break;
    case "DISCREMENT":
      return {count: state.count - 1 }
      break;
  default:
    break;
}
}
function Count() {
  const [state, dispatch] = useReducer(Reducer, initialValue);

  return (
    <>
     <div className=" flex flex-col justify-between items-center h-[100px] bg-[#F5F6FA] rounded-[10px] w-[40px] couter">
     <button onClick={() => { dispatch({type:"INCREMENT"})}} className=" text-[#5357B6] cursor-pointer">+</button>
      <h1 className=" text-[#5357B6]">{state.count}</h1>
      <button onClick={() => {dispatch({type:"DISCREMENT"})}} className=" text-[#5357B6] cursor-pointer">-</button>
     </div>
    </>
  );
}

export default Count;