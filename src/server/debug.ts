import { Application } from "express";

function getRoutesOfLayer(path: string, layer: any): string[] {
    if (layer.method) {
        return [layer.method.toUpperCase() + ' ' + path];
    }
    else if (layer.route) {
        return getRoutesOfLayer(path + split(layer.route.path), layer.route.stack[0]);
    }
    else if (layer.name === 'router' && layer.handle.stack) {
        let routes: string[] = [];

        layer.handle.stack.forEach(function(stackItem: any) {
            routes = routes.concat(getRoutesOfLayer(path + split(layer.regexp), stackItem));
        });

        return routes;
    }

    return [];
}
function split (thing: any): string {
    if (typeof thing === 'string') {
        return thing;
    } else if (thing.fast_slash) {
        return '';
    } else {
        var match = thing.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
        return match
            ? match[1].replace(/\\(.)/g, '$1')
            : '<complex:' + thing.toString() + '>';
    }
}

const getRoutes = (app: Application): string[] => {
    let routes: string[] = [];

    app._router.stack.forEach(function(layer: any) {
        routes = routes.concat(getRoutesOfLayer('', layer));
    });

    return routes;
}

export { getRoutes };