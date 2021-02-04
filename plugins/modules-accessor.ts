import { Plugin } from "@nuxt/types";
import { initialize } from "~/utils/modules";

const accessor: Plugin = ({ $fire, $fireModule, app, route, redirect }) => {
  initialize($fire, $fireModule, app, route, redirect);
};

export default accessor;
