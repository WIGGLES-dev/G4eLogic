import Input from "@components/Form/Input.svelte";
import Select from "@components/Form/Select/Select.svelte";
import { Skill } from "@internal";
import { max } from "lodash";
import { Observable } from "rxjs";

export type Resolvable<T> = {
    [P in keyof T]: T[P] | Resolver<any, T[P]> | Resolvable<T[P]>
}
export class Resolver<C extends any[] = any[], R = any> {
    resolver: (...args: C) => R
    constructor(resolver: (...args: C) => R) {
        this.resolver = resolver;
    }
    resolve(...args: C): R {
        try {
            console.log(args);
            return this.resolver(...args)
        } catch (err) {
            console.log(err);
        }
    }
    static deepResolve<T, C extends any[]>(target: Resolvable<T>, context: C, maxDepth = 10, currentDepth = 0): T {
        const clone = {} as T
        if (currentDepth > maxDepth) return target as T
        if (target == undefined || typeof target === 'string' || typeof target === 'number') return target as T
        Object.entries(target).forEach(([key, value]) => {
            if (value instanceof Resolver) {
                clone[key] = value.resolve(...context)
            } else if (typeof value === 'object') {
                clone[key] = Resolver.deepResolve(value, context, maxDepth, currentDepth + 1);
            } else {
                clone[key] = value
            }
        });
        return clone
    }
}
export const reference = {
    header: 'ref',
    component: Input,
    props: {
        type: 'text',
        width: '3rem',
        value: new Resolver((skill: Skill) => skill.forward('reference')),
    }
}
export const points = {
    header: 'pts',
    component: Input,
    props: {
        type: 'number',
        width: '2.5rem',
        value: new Resolver((skill: Skill) => skill.forward<number>('points'))
    }
}
export const difficulty = {
    header: 'diff.',
    component: Select,
    props: {
        options: ['E', 'A', 'H', 'VH', 'WC'],
        value: new Resolver((skill: Skill) => skill.forward<string>('difficulty'))
    }
}
export const signature = {
    header: 'sig.',
    label: new Resolver((skill: Skill) => skill.forward<string>('signature'))
}
export const mod = {
    component: Input,
    props: {
        type: 'number',
        width: '2.5rem',
        value: new Resolver((skill: Skill) => skill.forward<number>('mod'))
    }
}
export const rsl = {
    label: new Resolver((skill: Skill) => skill.relativeLevel$)
}
export const level = {
    label: new Resolver((skill: Skill) => skill.level$)
}
export const name = {
    width: '100%',
    component: Input,
    props: {
        type: 'text',
        value: new Resolver((skill: Skill) => skill.forward<string>('name'))
    }
}