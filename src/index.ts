import { Event, Navigation, Router } from "@angular/router";
import {
  createOafRouter,
  defaultSettings as oafRoutingDefaultSettings,
  RouterSettings,
} from "oaf-routing";

// tslint:disable: no-expression-statement
// tslint:disable: no-if-statement
// tslint:disable: object-literal-sort-keys

export { RouterSettings } from "oaf-routing";

export const defaultSettings: RouterSettings<Navigation> = {
  ...oafRoutingDefaultSettings,
  // TODO support pop page state restoration.
  restorePageStateOnPop: false,
  // We're not restoring page state ourselves so leave this enabled.
  disableAutoScrollRestoration: false,
};

export const wrapRouter = (
  router: Router,
  // HACK instanceof doesn't work across require() boundary
  isNavigationEndEvent: (event: Event) => boolean,
  settingsOverrides?: Partial<RouterSettings<Navigation>>,
): (() => void) => {
  const settings: RouterSettings<Navigation> = {
    ...defaultSettings,
    ...settingsOverrides,
  };

  const oafRouter = createOafRouter<Navigation>(settings, navigation => {
    const fragment = (navigation.finalUrl || navigation.extractedUrl).fragment;
    return fragment !== null ? `#${fragment}` : "";
  });

  const subscription = router.events.subscribe(event => {
    if (isNavigationEndEvent(event)) {
      const navigation = router.getCurrentNavigation();
      if (navigation !== null) {
        if (navigation.previousNavigation === null) {
          oafRouter.handleFirstPageLoad(navigation);
        } else {
          oafRouter.handleLocationChanged(
            navigation.previousNavigation,
            navigation,
            undefined,
            undefined,
          );
        }
      }
    }
  });

  return () => {
    oafRouter.resetAutoScrollRestoration();
    subscription.unsubscribe();
  };
};
