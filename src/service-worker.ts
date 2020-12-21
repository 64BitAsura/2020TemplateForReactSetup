import { precacheAndRoute } from 'workbox-precaching';

declare const self: any;

// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);
