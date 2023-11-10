import { render } from "@testing-library/react";
import Board from "./Board";

describe (Board, () => {

   it ("should have 19 rows and 19 columns", () => {
      const { getByText } = render(<Board/>);
      
   });

})