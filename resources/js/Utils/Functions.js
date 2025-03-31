import { router } from "@inertiajs/react";
import _ from "lodash";

export const visit = (e = null, routeName, method = "GET", routeOptions = {}) => {
    if (_.isFunction(e?.preventDefault)) {
        e.preventDefault();
    }
    router.visit(route(routeName, routeOptions), { method: method });
};
