import assert from "assert";
import "mocha";
import { Resource, Character, System } from "../src/internal";
import { TestScheduler } from "rxjs/testing";
import "../src/gurps/register";
import { create } from "lodash";

const testScheduler = new TestScheduler((actual, expected) => {
    assert.deepStrictEqual(actual, expected)
});