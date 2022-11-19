//@ts-check

import React from 'react';
import { States } from './machine-forms/States';
import { MachineName } from './machine-forms/MachineName';

// https://xstate.js.org/docs/guides/models.html#createmodel


/**
 *
 * @returns
 */
export default function Writer() {

    return (
        <form
            autoComplete="off"
            onSubmit={(event)=> {
                console.log(event)
            }}
        >
            <fieldset>
                <legend>
                    Machine description
                </legend>
                <MachineName />
                <button type="button">
                    Define states &gt;
                </button>
            </fieldset>
            <fieldset>
                <legend>
                    Machine states
                </legend>
                <States />
                <button type="button">
                    Define methods &gt;
                </button>
            </fieldset>
        </form>
    );
}
