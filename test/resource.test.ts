import assert from "assert";
import "mocha";
import { Resource, Character, Crud, Registry } from "../src/internal";
import { TestScheduler } from "rxjs/testing";
import "../src/gurps/registerAll";
import { create } from "lodash";

const testScheduler = new TestScheduler((actual, expected) => {
    assert.deepStrictEqual(actual, expected)
});

describe('Resource', function () {
    let resource: Resource;
    let embed: Resource
    let nestedEmbed: Resource;

    describe('creating a resource', function () {
        it('should exist', async function () {
            const created = await Crud.create({ type: 'character' });
            resource = created.pop();
            assert(resource.exists === true);
        });
    });
    describe('embedding a resource', function () {
        it('should exist', async function () {
            const created = await resource.embed({ type: 'skill' });
            embed = created.pop();
            assert(
                embed.exists &&
                embed.getMetadata().parent.id === resource.id &&
                resource.getMetadata().children.skill[embed.id].id === embed.id
            )
        });
    });
    describe('nesting embeds', function () {
        it('should return the nested embed', async function () {
            const created = await embed.embed({ type: 'skill' });
            nestedEmbed = created.pop();
            assert(
                nestedEmbed.exists &&
                nestedEmbed.getMetadata().parent.id === embed.id &&
                embed.getMetadata().children.skill[nestedEmbed.id].id === nestedEmbed.id
            );
        })
    })
    describe('selecting all children', function () {
        it('should return the embed', function (done) {
            resource.selectAllChildren().subscribe(children => {
                assert(children.length === 1 && children[0].id === embed.id);
                done();
            });
        });
    });
    describe('selecting all descendants', function () {
        it('should return the entire chain', function (done) {
            resource.selectDescendants('skill').subscribe(descendants => {
                console.log(embed, nestedEmbed, descendants);
                assert(
                    descendants.length === 2
                );
                done();
            });
        });
    });
});