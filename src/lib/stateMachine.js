//@ts-check

import {
    createMachine,
} from 'xstate';

const machines = {};
/**
 *
 * @param {*} definition
 * @returns
 */
export function generateMachine (definition) {
    if (!machines[definition]) {
        console.groupCollapsed('creating new machine'); //eslint-disable-line no-console
        console.log(definition); //eslint-disable-line no-console
        machines[definition] = createMachine({
            predictableActionArguments: true,
            ...definition,
        });
        console.groupEnd(); //eslint-disable-line no-console

    }
    return machines[definition];
}
