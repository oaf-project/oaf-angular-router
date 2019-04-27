[![Build Status](https://travis-ci.org/oaf-project/oaf-angular-router.svg?branch=master)](https://travis-ci.org/oaf-project/oaf-angular-router)
[![Known Vulnerabilities](https://snyk.io/test/github/oaf-project/oaf-angular-router/badge.svg?targetFile=package.json)](https://snyk.io/test/github/oaf-project/oaf-angular-router?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/oaf-project/oaf-angular-router.svg)](https://greenkeeper.io/)
[![npm](https://img.shields.io/npm/v/oaf-angular-router.svg)](https://www.npmjs.com/package/oaf-angular-router)

[![dependencies Status](https://david-dm.org/oaf-project/oaf-angular-router/status.svg)](https://david-dm.org/oaf-project/oaf-angular-router)
[![devDependencies Status](https://david-dm.org/oaf-project/oaf-angular-router/dev-status.svg)](https://david-dm.org/oaf-project/oaf-angular-router?type=dev)
[![peerDependencies Status](https://david-dm.org/oaf-project/oaf-angular-router/peer-status.svg)](https://david-dm.org/oaf-project/oaf-angular-router?type=peer)


# Oaf Angular Router
An accessible wrapper for [Angular's Router](https://angular.io/guide/router).

Documentation at https://oaf-project.github.io/oaf-angular-router/

## Features

* Reset scroll and focus after page navigation
* Set the page title after navigation
* Announce navigation to users of screen readers
* Hash fragment support

In lieu of more details, see [Oaf React Router](https://github.com/oaf-project/oaf-react-router/blob/master/README.md#features) for now. The features are basically the same, with the caveat that Oaf Angular Router doesn't currently support focus and scroll restoration after POP navigation.

## Installation

```sh
# yarn
yarn add oaf-angular-router

# npm
npm install oaf-angular-router
```

## Basic Usage

`app.module.ts`:

```diff
- import { Router } from '@angular/router';
+ import { Event, Router, NavigationEnd } from '@angular/router';
+ import { wrapRouter } from "oaf-angular-router";

export class AppModule {
  constructor(router: Router) {
+    // HACK instanceof doesn't work across require() boundary
+    const isNavigationEndEvent = (event: Event) => event instanceof NavigationEnd;
+    wrapRouter(router, isNavigationEndEvent);
  }
}
```

## Advanced Usage

```typescript
const settings = {
  announcementsDivId: "announcements",
  primaryFocusTarget: "main h1, [role=main] h1",
  // This assumes you're setting the document title via some other means.
  // If you're not, you should return a unique and descriptive page title for each page
  // from this function and set `setPageTitle` to true.
  documentTitle: (location: Navigation) => new Promise(resolve => setTimeout(() => resolve(document.title))),
  // BYO localization
  navigationMessage: (title: string, location: Navigation): string => `Navigated to ${title}.`,
  shouldHandleAction: (previousLocation: Navigation, nextLocation: Navigation) => true,
  announcePageNavigation: true,
  setPageTitle: false,
};

wrapRouter(router, isNavigationEndEvent, settings);
```

### A note on focus outlines
You may see focus outlines around your `h1` elements (or elsewhere, per `primaryFocusTarget`) when using Oaf Angular Router.

You might be tempted to remove these focus outlines with something like the following:
```css
[tabindex="-1"]:focus {
  outline: 0 !important;
}
```

Don't do this! Focus outlines are important for accessibility. See for example:

* https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-visible.html
* https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/F78
* http://www.outlinenone.com/

Note that [Bootstrap 4 unfortunately removes these focus outlines](https://github.com/twbs/bootstrap/issues/28425). If you use Bootstrap, you can restore them with [Oaf Bootstrap 4](https://github.com/oaf-project/oaf-bootstrap-4).

All that said, if you absolutely _must_ remove focus outlines (stubborn client, stubborn boss, stubborn designer, whatever), consider using the [`:focus-visible` polyfill](https://github.com/WICG/focus-visible) so focus outlines are only hidden from mouse users, _not_ keyboard users.

## See also
* [Oaf Routing](https://github.com/oaf-project/oaf-routing)
* [Oaf Side Effects](https://github.com/oaf-project/oaf-side-effects)
