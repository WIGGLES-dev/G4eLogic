import { State } from "rxdeep";
import { BehaviorSubject, combineLatest, fromEvent } from "rxjs";
import { filter, tap, debounce, withLatestFrom, buffer, share, debounceTime, publishBehavior, map, refCount } from "rxjs/operators";
import Hammer from "hammerjs";
const hammer = new Hammer(document.documentElement);
const unload$ = fromEvent<FocusNavigationEvent>(window, "onunload");
const touchstart$ = fromEvent<TouchEvent>(window, "touchstart");
const touchmove$ = fromEvent<TouchEvent>(window, "touchmove");
const touchend$ = fromEvent<TouchEvent>(window, "touchend");
const resize$ = fromEvent(window, "resize");
export const swipe$ = fromEvent<HammerInput>(hammer, "swipe");

export const longSwipeRight$ = swipe$.pipe(
    filter((e) => {
        const isSwipeRight = e.direction === Hammer.DIRECTION_RIGHT;
        const swipeMostOfScreen = e.distance > innerWidth * .7;
        return isSwipeRight && swipeMostOfScreen
    })
);
export const longSwipeLeft$ = swipe$.pipe(
    filter((e) => {
        const isSwipeLeft = e.direction === Hammer.DIRECTION_LEFT;
        const swipeMostOfScreen = e.distance > innerWidth * .7;
        return isSwipeLeft && swipeMostOfScreen
    })
);

export enum ScreenSize {
    S_SM = 640,
    S_MD = 768,
    S_LG = 1024,
    S_XL = 1280,
    S_2XL = 1536
}

function screenSize() {
    if (innerWidth <= ScreenSize.S_SM) {
        return ScreenSize.S_SM;
    } else if (innerWidth <= ScreenSize.S_MD) {
        return ScreenSize.S_MD;
    } else if (innerWidth <= ScreenSize.S_LG) {
        return ScreenSize.S_LG;
    } else if (innerWidth <= ScreenSize.S_XL) {
        return ScreenSize.S_XL;
    } else {
        return ScreenSize.S_2XL;
    }
}
export const screensize$ = resize$.pipe(debounceTime(70), map(screenSize), publishBehavior(screenSize()), refCount())